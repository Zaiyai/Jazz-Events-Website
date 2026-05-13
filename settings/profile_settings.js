const userName = document.getElementsByClassName('user-name');
const userEmail = document.getElementById('user-email');
const userProfilePicture = document.getElementById('user-profile-picture');
const userBio = document.getElementById('user-bio');
const profileImg = document.getElementById('profile-img');
const uploadProfileBtn = document.getElementById('upload-profile-btn');
const profileFileInput = document.getElementById('profile-file-input');

let currentUser = null;

// Handle upload button click
uploadProfileBtn.addEventListener('click', () => {
    profileFileInput.click();
});

// Handle file selection
profileFileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit.');
        return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        alert('Only image files (JPEG, PNG, GIF, WebP) are allowed.');
        return;
    }

    // Show loading state
    uploadProfileBtn.disabled = true;
    uploadProfileBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Uploading...';

    try {
        const formData = new FormData();
        formData.append('profile_picture', file);
        formData.append('email', COOKIES.getCookie('email'));

        const response = await fetch('../scripts/upload_profile.php', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Upload failed');

        const data = await response.json();

        if (data.status === 'success') {
            // Update the image on the page
            profileImg.src = '../' + data.profile_picture;
            
            // Show success message
            showToast('Profile picture updated successfully!', 'success');

            // Refresh user data
            currentUser = await DB.getUser();
            updateProfileDisplay();
        } else {
            showToast(data.message || 'Upload failed', 'error');
        }
    } catch (error) {
        console.error('Upload error:', error);
        showToast('An error occurred during upload.', 'error');
    } finally {
        // Reset button state
        uploadProfileBtn.disabled = false;
        uploadProfileBtn.innerHTML = '<i class="fa-solid fa-camera"></i> Change Photo';
        
        // Clear file input
        profileFileInput.value = '';
    }
});

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        font-weight: 500;
        animation: slideIn 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
    #upload-profile-btn:hover {
        background: #c9a227 !important;
    }
    #upload-profile-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;
document.head.appendChild(style);

function updateProfileDisplay() {
    if (currentUser) {
        for (let i = 0; i < userName.length; i++) {
            userName[i].textContent = currentUser.name || 'N/A';
        }
        userEmail.textContent = currentUser.email || 'N/A';
        if (currentUser.profile_picture) {
            profileImg.src = '../' + currentUser.profile_picture;
        }
        userBio.textContent = currentUser.bio || 'N/A';
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    currentUser = await DB.getUser();
    updateProfileDisplay();
});

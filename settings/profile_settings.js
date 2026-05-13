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

function showToast(msg,type){
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'page-toast' + (type ? ' ' + type : '');
  requestAnimationFrame(() => requestAnimationFrame ( () => el.classList.add('show')));
  clearTimeout(el._t); 
  el._t=setTimeout(() => el.classList.remove('show'), 3800);
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
    .editable-input {
        padding: 8px 12px;
        border: 2px solid #d4af37;
        border-radius: 4px;
        font-size: 1rem;
        font-family: inherit;
        min-width: 200px;
    }
    .editable-textarea {
        padding: 8px 12px;
        border: 2px solid #d4af37;
        border-radius: 4px;
        font-size: 1rem;
        font-family: inherit;
        width: 100%;
        min-height: 80px;
        resize: vertical;
    }
`;
document.head.appendChild(style);

// Handle edit button clicks
function setupEditButtons() {
    const editButtons = document.querySelectorAll('.settings-edit-btn');
    
    editButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get the row container
            const row = button.closest('.settings-info-row') || button.closest('.settings-bio-row');
            if (!row) return;
            
            // Find the value element (user-name, user-email, user-profile-picture, user-bio)
            let valueElement = row.querySelector('[id^="user-"], [class*="user-"]');
            
            // Special case for user-name (it's a class)
            if (!valueElement) {
                valueElement = row.querySelector('.user-name');
            }
            
            if (!valueElement) return;
            
            // Get the field name from id or class
            let fieldName = valueElement.id || Array.from(valueElement.classList).find(c => c.startsWith('user-'));
            fieldName = fieldName.replace('user-', '');
            
            if (fieldName === 'name') {
                fieldName = 'name';
            }
            
            const currentValue = valueElement.textContent;
            
            // Check if already editing
            if (valueElement.querySelector('input, textarea')) {
                return;
            }
            
            // Create input element
            let input;
            if (fieldName === 'bio') {
                input = document.createElement('textarea');
                input.className = 'editable-textarea';
                input.value = currentValue;
            } else {
                input = document.createElement('input');
                input.type = fieldName === 'email' ? 'email' : 'text';
                input.className = 'editable-input';
                input.value = currentValue;
            }
            
            // Replace element with input
            valueElement.textContent = '';
            valueElement.appendChild(input);
            input.focus();
            input.select();
            
            // Handle save on blur or Enter
            const saveEdit = async () => {
                const newValue = input.value.trim();
                
                if (newValue === currentValue) {
                    // No changes, revert
                    valueElement.textContent = currentValue;
                    return;
                }
                
                if (!newValue) {
                    showToast('Value cannot be empty', 'error');
                    input.focus();
                    return;
                }
                
                // Prepare update data
                const updateData = {
                    email: COOKIES.getCookie('email'),
                    [fieldName]: newValue
                };
                
                try {
                    const response = await fetch('../scripts/user.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updateData)
                    });
                    
                    if (!response.ok) throw new Error('Update failed');
                    
                    const data = await response.json();
                    
                    if (data.status === 'success') {
                        // Update display
                        valueElement.textContent = newValue;
                        
                        // Update currentUser
                        currentUser[fieldName] = newValue;
                        
                        showToast(`${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} updated successfully!`, 'success');
                        setTimeout(() => {
                            window.location.reload();
                        }, 750);
                    } else {
                        valueElement.textContent = currentValue;
                        showToast(data.message || 'Update failed', 'error');
                    }
                } catch (error) {
                    console.error('Update error:', error);
                    valueElement.textContent = currentValue;
                    showToast('An error occurred during update.', 'error');
                }
            };
            
            const cancelEdit = () => {
                valueElement.textContent = currentValue;
            };
            
            input.addEventListener('blur', saveEdit);
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    saveEdit();
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    cancelEdit();
                }
            });
        });
    });
}

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
    setupEditButtons();
});

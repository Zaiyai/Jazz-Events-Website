(function() {
    async function updateSettingsLeftBox() {
        const container = document.getElementById('settings-profile-avatar');
        const nameDisplay = document.querySelector('.settings-user-name');
        
        if (!container && !nameDisplay) return;

        try {
            const user = await DB.getUser();
            if (user) {
                // Update Name
                if (nameDisplay) {
                    nameDisplay.textContent = user.name || 'N/A';
                }

                // Update Avatar
                if (container) {
                    if (user.profile_picture) {
                        container.innerHTML = `<img src="../${user.profile_picture}" alt="Profile" class="settings-profile-image" id="profile-img">`;
                    } else {
                        const words = (user.name || '').trim().split(/\s+/);
                        const initials = words.map(w => w[0]).join('').toUpperCase().substring(0, 2) || '?';
                        container.innerHTML = `<div class="settings-profile-initials">${initials}</div>`;
                    }
                }
            }
        } catch (error) {
            console.error('Error updating settings left box:', error);
        }
    }

    document.addEventListener('DOMContentLoaded', updateSettingsLeftBox);
    
    // Export for use in other scripts if needed
    window.updateSettingsLeftBox = updateSettingsLeftBox;
})();

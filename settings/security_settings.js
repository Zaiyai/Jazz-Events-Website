document.addEventListener('DOMContentLoaded', () => {
    const confirmBtn = document.getElementById('confirm-password-btn');
    const currentPass = document.getElementById('current-password');
    const newPass = document.getElementById('new-password');
    const confirmPass = document.getElementById('confirm-password');

    function validatePasswordComplex(pass) {
        if (pass.length < 8) return "Must be at least 8 characters.";
        if (!/[A-Z]/.test(pass)) return "Must contain at least one uppercase letter.";
        if (!/[a-z]/.test(pass)) return "Must contain at least one lowercase letter.";
        if (!/[0-9]/.test(pass)) return "Must contain at least one number.";
        if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(pass)) return "Must contain at least one special character.";
        return "";
    }

    if (confirmBtn) {
        confirmBtn.addEventListener('click', async () => {
            const currentVal = currentPass.value;
            const newVal = newPass.value;
            const confirmVal = confirmPass.value;

            // Simple validations
            if (!currentVal || !newVal || !confirmVal) {
                showToast('Please fill in all password fields.');
                return;
            }

            if (newVal !== confirmVal) {
                showToast('New passwords do not match.');
                return;
            }

            const complexityError = validatePasswordComplex(newVal);
            if (complexityError) {
                showToast(complexityError);
                return;
            }

            try {
                confirmBtn.disabled = true;
                confirmBtn.textContent = 'Updating...';

                const result = await DB.changePassword(currentVal, newVal);

                if (result.status === 'success') {
                    showToast('Password updated successfully!');
                    currentPass.value = '';
                    newPass.value = '';
                    confirmPass.value = '';
                } else {
                    showToast(result.message || 'Failed to update password.');
                }
            } catch (error) {
                console.error('Password update error:', error);
                showToast('An error occurred. Please try again.');
            } finally {
                confirmBtn.disabled = false;
                confirmBtn.textContent = 'Confirm Changes';
            }
        });
    }

    function showToast(message) {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.textContent = message;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        } else {
            alert(message);
        }
    }

    // Password Toggle Logic
    const toggleButtons = document.querySelectorAll('.password-toggle-btn');
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.previousElementSibling;
            const icon = btn.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
});

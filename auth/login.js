document.addEventListener('DOMContentLoaded', function () {

    const form = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');

    const username = document.getElementById('username');
    const password = document.getElementById('password');

    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');

    function showError(input, errorEl, message) {
        errorEl.textContent = message;
        errorEl.classList.remove('d-none');
        input.classList.add('is-invalid');
    }

    function clearError(input, errorEl) {
        errorEl.textContent = '';
        errorEl.classList.add('d-none');
        input.classList.remove('is-invalid');
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        let isValid = true;

        clearError(username, usernameError);
        clearError(password, passwordError);

        // Username validation
        if (username.value.trim() === '') {
            showError(username, usernameError, 'Username is required');
            isValid = false;
        } else if (username.value.length < 4) {
            showError(username, usernameError, 'Username must be at least 4 characters');
            isValid = false;
        }

        // Password validation
        if (password.value.trim() === '') {
            showError(password, passwordError, 'Password is required');
            isValid = false;
        } else if (password.value.length < 6) {
            showError(password, passwordError, 'Password must be at least 6 characters');
            isValid = false;
        }

        if (!isValid) return;

        // Loading state
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Logging in...';
        
        setTimeout(() => {
            window.location.href = '../dashboard/users/users.html';
        }, 800);
    });

});

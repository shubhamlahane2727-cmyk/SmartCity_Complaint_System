function toggleAuth(type) {
    const loginBtn = document.querySelector('.auth-toggle button:nth-child(1)');
    const registerBtn = document.querySelector('.auth-toggle button:nth-child(2)');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const headerTitle = document.querySelector('.auth-header h2');

    // Safety check (prevents errors if element not found)
    if (!loginBtn || !registerBtn || !loginForm || !registerForm || !headerTitle) {
        console.error("ToggleAuth Error: Elements not found ❌");
        return;
    }

    if (type === 'login') {
        loginBtn.classList.add('active');
        registerBtn.classList.remove('active');

        loginForm.style.display = 'block';
        registerForm.style.display = 'none';

        headerTitle.textContent = 'Welcome Back';
    } else {
        registerBtn.classList.add('active');
        loginBtn.classList.remove('active');

        registerForm.style.display = 'block';
        loginForm.style.display = 'none';

        headerTitle.textContent = 'Create an Account';
    }
}
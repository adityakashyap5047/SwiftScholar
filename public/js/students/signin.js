document.getElementById('togglePassword').addEventListener('click', function (event) {
    event.preventDefault();
    console.log("button was clicked");
    const passwordField = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
    eyeIcon.classList.toggle('fa-eye');
    eyeIcon.classList.toggle('fa-eye-slash');
});
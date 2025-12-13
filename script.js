// Section Navigation
const navButtons = document.querySelectorAll('.nav-button');
const sections = document.querySelectorAll('.section-content');

navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const target =

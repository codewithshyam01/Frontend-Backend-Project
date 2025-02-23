const svg = document.querySelector('svg');
    svg.addEventListener('click', () => {
        svg.querySelector('path').style.animation = 'none'; // Reset animation
        svg.querySelector('path').offsetHeight; // Trigger reflow
        svg.querySelector('path').style.animation = 'draw 10s ease-in-out forwards'; // Restart animation
    });
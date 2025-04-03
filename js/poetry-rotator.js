document.addEventListener('DOMContentLoaded', function () {
    const poetryLines = document.querySelectorAll('.poetry-line');
    let currentIndex = 0;
    const rotationInterval = 5000; // 5 seconds
    const progressBar = document.createElement('div');
    progressBar.className = 'poetry-progress';
    document.querySelector('.poetry-rotator').appendChild(progressBar);

    let progressInterval;
    let isHovered = false;
    let currentProgress = 0;
    const updateFrequency = 50; // Update every 50ms for smoother animation
    const progressIncrement = 100 / (rotationInterval / updateFrequency); // Calculate increment for smooth progress

    function updateProgress() {
        if (isHovered) return; // Stop progress if hovered

        currentProgress += progressIncrement;
        // Scale from center, expanding both ways
        progressBar.style.transform = `translateX(-50%) scaleX(${currentProgress / 100})`;

        if (currentProgress >= 100) {
            clearInterval(progressInterval);
            rotatePoetry();
        }
    }

    function rotatePoetry() {
        // Reset progress
        currentProgress = 0;
        progressBar.style.transform = 'translateX(-50%) scaleX(0)';

        // Remove active class from current line
        poetryLines[currentIndex].classList.remove('active');

        // Move to next line
        currentIndex = (currentIndex + 1) % poetryLines.length;

        // Add active class to new line
        poetryLines[currentIndex].classList.add('active');

        // Start progress interval
        clearInterval(progressInterval);
        progressInterval = setInterval(updateProgress, updateFrequency);
    }

    // Add hover event listeners
    const rotator = document.querySelector('.poetry-rotator');
    rotator.addEventListener('mouseenter', () => {
        isHovered = true;
        clearInterval(progressInterval);
    });

    rotator.addEventListener('mouseleave', () => {
        isHovered = false;
        // Resume progress from where it was paused
        progressInterval = setInterval(updateProgress, updateFrequency);
    });

    // Start the rotation
    rotatePoetry(); // Initial call
}); 
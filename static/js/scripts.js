// static/js/scripts.js

document.addEventListener('DOMContentLoaded', () => {
    const bgVideo = document.getElementById('bg-video');
    const playPauseBtn = document.getElementById('play-pause-btn');

    if (bgVideo) {
        // Initially pause the video
        bgVideo.pause();

        // Function to fade in video
        function fadeInVideo(duration) {
            bgVideo.style.opacity = 0;
            bgVideo.play();

            let opacity = 0;
            const interval = 50; // milliseconds
            const increment = interval / duration;

            const fadeInInterval = setInterval(() => {
                opacity += increment;
                if (opacity >= 1) {
                    opacity = 1;
                    clearInterval(fadeInInterval);
                }
                bgVideo.style.opacity = opacity;
            }, interval);
        }

        // Function to fade out video
        function fadeOutVideo(duration) {
            let opacity = 1;
            const interval = 50; // milliseconds
            const decrement = interval / duration;

            const fadeOutInterval = setInterval(() => {
                opacity -= decrement;
                if (opacity <= 0) {
                    opacity = 0;
                    bgVideo.pause();
                    clearInterval(fadeOutInterval);
                }
                bgVideo.style.opacity = opacity;
            }, interval);
        }

        // Initialize video with fade-in
        fadeInVideo(2000); // 2 seconds fade-in

        // Play/Pause Button Functionality
        playPauseBtn.addEventListener('click', () => {
            if (bgVideo.paused) {
                fadeInVideo(1000); // 1 second fade-in
                playPauseBtn.innerHTML = '❚❚'; // Pause icon
            } else {
                fadeOutVideo(1000); // 1 second fade-out
                playPauseBtn.innerHTML = '►'; // Play icon
            }
        });
    }

    /* AJAX Form Submission */
    const contactForm = document.getElementById('contact-form');
    const formResponse = document.getElementById('form-response');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission

            // Collect form data
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            // Simple validation
            if (name === '' || email === '' || message === '') {
                formResponse.innerHTML = '<div class="alert alert-danger">All fields are required.</div>';
                return;
            }

            // Send data to Flask backend via AJAX
            fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, message })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    formResponse.innerHTML = '<div class="alert alert-success">Your message has been sent successfully!</div>';
                    contactForm.reset();
                } else {
                    formResponse.innerHTML = '<div class="alert alert-danger">There was an error sending your message. Please try again later.</div>';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                formResponse.innerHTML = '<div class="alert alert-danger">There was an error sending your message. Please try again later.</div>';
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    var greetings = [
        "Welcome!",   // English
        "欢迎!",      // Chinese
        "ようこそ!",  // Japanese
        "Willkommen!",// German
        "Welkom!",    // Dutch
        "환영합니다!",  // Korean
        "Bienvenue!", // French
        "Bienvenido!",// Spanish
        "Benvenuto!", // Italian
        "Selamat datang!", // Malay
        "வரவேற்பு!"   // Tamil
    ];

    var displayElement = document.getElementById("display");
    if (!displayElement) {
        console.error("Display element not found");
        return;
    }

    let index = 0;
    let forward = true;
    let langIndex = 0; // Index for language array

    // Function to add or remove characters
    function typeWriter() {
        if (forward) {
            if (index < greetings[langIndex].length) {
                displayElement.innerHTML = greetings[langIndex].slice(0, index + 1) + '<span class="cursor"></span>';
                index++;
                setTimeout(typeWriter, 500); // Delay for forward typing
            } else {
                // Once we reach the end, switch to backward typing and keep cursor
                displayElement.innerHTML = greetings[langIndex] + '<span class="cursor"></span>';
                forward = false;
                index--;
                setTimeout(typeWriter, 200); // Short delay before starting to delete
            }
        } else {
            if (index > 0) {
                displayElement.innerHTML = greetings[langIndex].slice(0, index) + '<span class="cursor"></span>';
                index--;
                setTimeout(typeWriter, 200); // Faster delay for backspacing
            } else {
                // Once we reach the beginning, reset and move to the next language
                displayElement.innerHTML = '<span class="cursor"></span>';
                langIndex = (langIndex + 1) % greetings.length; // Move to next language or loop back to the start
                forward = true; // Switch direction to forward again
                setTimeout(typeWriter, 500); // Pause before starting next language
                return;
            }
        }
    }

    typeWriter(); // Start the typewriter effect
});

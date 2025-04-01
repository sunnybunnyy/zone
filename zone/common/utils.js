import * as document from "document";

export function swapScreen(newScreen) {
    // Hide all screens first
    const screens = ["home-screen", "run-screen", "settings-screen", "summary-screen"];
    screens.forEach(screenId => {
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.style.display = "none";
        }
    });

    // Show the requested screen
    if (newScreen) {
        newScreen.style.display = "inline";
    }
}
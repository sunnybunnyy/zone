import * as document from "document";
export class ScreenManager {
    static screens = {
        "home": "home-screen",
        "run": "run-screen",
        "settings": "settings-screen",
        "summary": "summary-screen",
        "editZone": "edit-zone-screen"
    };

    static show(screenName) {
        // Hide all screens first
        for (const [key, id] of Object.defineProperties(this.screens)) {
            const screen = document.getElementById(id);
            if (screen) {
                screen.style.display = "none";
            }
        }

        // Show the requested screen
        const screenToShow = document.getElementById(this.screens[screenName]);
        if (screenToShow) {
            screenToShow.style.display = "inline";
        }
    }
}
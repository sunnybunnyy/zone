import * as document from "document";
import { ScreenManager } from "../../common/utils";

export default class RunMode {
    constructor(state) {
        this.state = state;
        this.onWorkoutEnd = null;

        this.el = document.getElementById("run-screen");
        this.el.style.touchEvents = "enabled";

        ScreenManager.setupSwipeBack(this.el, () => {
            if (confirm("End workout and go back?")) {
                ScreenManager.show("home");
            }
        });
        this.hrDisplay = document.getElementById("hr-value");
        this.zoneDisplay = document.getElementById("zone-label");
        this.warningDisplay = document.getElementById("warning");

        const endBtn = document.getElementById("end-workout-btn");
        if (endBtn) {
            endBtn.onclick = () => this.onWorkoutEnd && this.onWorkoutEnd();
        }

        this.setupSwipeGestures();
    }

    setupSwipeGestures() {
        let touchStartX = 0;

        this.el.onmousedown = (evt) => {
            touchStartX = evt.screenX;
        };

        this.el.onmouseup = (evt) => {
            const touchEndX = evt.screenX;
            const deltaX = touchEndX - touchStartX;

            // Swipe right to go back to home
            if (deltaX > 50) {
                ScreenManager.slideBack();
            }
        };
    }

    updateHR(hr) {
        if (this.hrDisplay) {
            this.hrDisplay.text = hr;
        }
    }

    showOutOfZoneWarning() {
        if (this.warningDisplay) {
            this.warningDisplay.style.display = "inline";
        }
    }

    clearWarning() {
        if (this.warningDisplay) {
            this.warningDisplay.style.display = "none";
        }
    }

    show() {
        if (this.zoneDisplay && this.state.currentZone !== null) {
            const zone = this.state.zones[this.state.currentZone];
            this.zoneDisplay.text = `Zone ${this.state.currentZone + 1}: ${zone.label}`;
        }
        this.clearWarning();
        ScreenManager.show("run");
    }
}
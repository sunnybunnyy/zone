import * as document from "document";
import { swapScreen } from "../../common/utils";

export default class RunMode {
    constructor(state) {
        this.state = state;
        this.onWorkoutEnd = null;

        this.el = document.getElementById("run-screen");
        this.hrDisplay = document.getElementById("hr-value");
        this.zoneDisplay = document.getElementById("zone-label");
        this.warningDisplay = document.getElementById("warning");

        const endBtn = document.getElementById("end-workout-btn");
        if (endBtn) {
            endBtn.onclick = () => this.onWorkoutEnd && this.onWorkoutEnd();
        }
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
        swapScreen(this.el);
    }
}
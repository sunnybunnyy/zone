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
        console.log(`Zone display element: ${this.zoneDisplay ? "FOUND" : "MISSING"}`);
        const warningImg = document.getElementById("warning");
        let warningText = document.getElementById("warning-text");
        this.warningDisplay = [warningImg, warningText];

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

            // Update colour based on zone compliance
            if (this.state.currentZone !== null) {
                const zone = this.state.zones[this.state.currentZone];
                if (hr < zone.min || hr > zone.max) {
                    this.hrDisplay.style.fill = '#ff5555'; // Red when out of zone
                    this.showOutOfZoneWarning();
                } else {
                    this.hrDisplay.style.fill = '#00ff00'; // Green when in zone
                    this.clearWarning();
                }
            }
        }
    }

    showOutOfZoneWarning() {
        if (this.warningDisplay) {
            this.warningDisplay.forEach(el => {
                el.style.display = "inline";
            });
        }
    }

    clearWarning() {
        if (this.warningDisplay) {
            this.warningDisplay.forEach(el => {
                el.style.display = "none";
            });
        }
    }

    show() {
        console.log(`Showing run screen with zone: ${this.state.currentZone}`);
        if (this.state.currentZone !== null) {
            const zone = this.state.zones[this.state.currentZone];
            console.log(`Zone data:`, zone);
            
            if (this.zoneDisplay) {
                console.log(`Displaying zone: ${this.state.currentZone + 1}: ${zone.label}`);
                this.zoneDisplay.text = `Zone ${this.state.currentZone + 1}: ${zone.label}`;
            } else {
                console.log("zoneDisplay element not found");
            }

        } else {
            console.log("No zone selected");
        }
        
        // Displays target range
        // if (this.rangeDisplay) {
        //      this.rangeDisplay.text = `Target: ${zone.min}-${zone.max} bpm`;
        // }
        this.clearWarning();
        ScreenManager.show("run");
        
    }
}
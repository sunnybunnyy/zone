import * as document from "document";
import { ScreenManager } from "../../common/utils";
import EditZone from "./edit-zone";

export default class Home {
    constructor(state) {
        this.state = state;
        this.onZoneSelected = null; // For starting workout
        this.onSettingsSelected = null;
        this.onEditZone = null; // For editing zone ranges
        this.editZone = new EditZone(state);

        this.el = document.getElementById("home-screen");
        this.bg = document.getElementById("home-bg");
        this.el.style.touchEvents = "enabled";
        this.bg.addEventListener("click", (evt) => {
            this.turnGreen();
        });
        
        this.zoneLabels = [];
        this.zoneRanges = [];
        this.zoneEditButtons = [];

        // Create zone list items
        for (let i = 0; i < 5; i++) {
            const zoneEl = document.getElementById(`zone-${i + 1}`);
            if (zoneEl) {
                // Main zone click starts workout
                zoneEl.onclick = (evt) => {
                    // Check if we clicked on the range text (for editing)
                    if (evt.target && evt.target.id && evt.target.id.includes("range")) {
                        this.handleEditZone(i);
                    } else {
                        this.handleZoneSelect(i);
                    }
                };
                
                this.zoneLabels.push(document.getElementById(`zone-${i + 1}-label`));
                this.zoneRanges.push(document.getElementById(`zone-${i + 1}-range`));
            }
        }


        // Edit zone callback
        this.editZone.onSave = () => {
            this.update();
            ScreenManager.show("summary");
        };

        // Settings button
        const settingsBtn = document.getElementById("settings-btn");
        if (settingsBtn) {
            settingsBtn.onclick = () => this.onSettingsSelected && this.onSettingsSelected();
        }

        this.update();
    }

    
    turnGreen() {
        this.bg.style.fill = "green";
    }

    setupSwipeGestures() {
        let touchStartX = 0;

        this.el.onmousedown = (evt) => {
            touchStartX = evt.screenX;
        };

        this.el.onmouseup = (evt) => {
            const touchEndX = evt.screenX;
            const deltaX = touchEndX - touchStartX;

            // Swipe right to go back (but home is root screen, so maybe disable or handle differently)
            if (deltaX > 50) {
                // On home screen, maybe do nothing or provide alternative action
            }
        };
    }

    handleZoneSelect(zoneIndex) {
        this.onZoneSelected && this.onZoneSelected(zoneIndex);
    }

    handleEditZone(zoneIndex) {
        this.editZone.show(zoneIndex);
    }

    update() {
        this.state.zones.forEach((zone, i) => {
            if (this.zoneLabels[i]) {
                this.zoneLabels[i].text = `Zone ${i + 1}: ${zone.label}`;
            }
            if (this.zoneRanges[i]) {
                this.zoneRanges[i].text = `${zone.min}-${zone.max} bpm`;
            }
        });
    }
    /*
    handleZoneSelect(zoneIndex) {
        this.onZoneSelected && this.onZoneSelected(zoneIndex);
    }
    */
    show() {
        ScreenManager.show("home");
    }
}
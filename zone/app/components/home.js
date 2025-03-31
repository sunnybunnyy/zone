import * as document from "document";
import { swapScreen } from "../../common/utils";

export default class Home {
    constructor(state) {
        this.state = state;
        this.onZoneSelected = null;
        this.onSettingsSelected = null;

        this.el = document.getElementById("home-screen");
        this.zoneElements = [];

        // Create zone list items
        for (let i = 0; i < 5; i++) {
            const zoneEl = document.getElementById(`zone-${i + 1}`);
            if (zoneEl) {
                zoneEl.onclick = () => this.handleZoneSelect(i);
                this.zoneElements.push(zoneEl);
            }
        }

        // Settings button
        const settingsBtn = document.getElementById("settings-btn");
        if (settingsBtn) {
            settingsBtn.onclick = () => this.onSettingsSelected && this.onSettingsSelected();
        }

        this.update();
    }

    update() {
        this.state.zones.forEach((zone, i) => {
            const zoneEl = this.zoneElements[i];
            if (zoneEl) {
                zoneEl.getElementById("label").text = `${i + 1}: ${zone.label}`;
                zoneEl.getElementById("range").text = `${zone.min} - ${zone.max} bpm`;
            }
        });
    }

    handleZoneSelect(zoneIndex) {
        this.onZoneSelected && this.onZoneSelected(zoneIndex);
    }

    show() {
        this.update();
        swapScreen(this.el);
    }
}
import * as document from "document";
import { swapScreen } from "../../common/utils";
import EditZone from "./edit-zone";

export default class Home {
    constructor(state) {
        this.state = state;
        this.onZoneSelected = null;
        this.onSettingsSelected = null;
        this.editZone = new EditZone(state);

        this.el = document.getElementById("home-screen");
        this.zoneLabels = [];
        this.zoneRanges = [];

        // Create zone list items
        for (let i = 0; i < 5; i++) {
            const zoneEl = document.getElementById(`zone-${i + 1}`);
            if (zoneEl) {
                zoneEl.onclick = () => this.handleZoneSelect(i);
                this.zoneLabels.push(document.getElementById(`zone-${i + 1}-label`));
                this.zoneRanges.push(document.getElementById(`zone-${i + 1}-range`));
            }
        }

        // Edit zone callback
        this.editZone.onSave = () => {
            this.update();
            swapScreen(this.el);
        };

        // Settings button
        const settingsBtn = document.getElementById("settings-btn");
        if (settingsBtn) {
            settingsBtn.onclick = () => this.onSettingsSelected && this.onSettingsSelected();
        }

        this.update();
    }

    handleZoneSelect(zoneIndex) {
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

    handleZoneSelect(zoneIndex) {
        this.onZoneSelected && this.onZoneSelected(zoneIndex);
    }

    show() {
        this.update();
        swapScreen(this.el);
    }
}
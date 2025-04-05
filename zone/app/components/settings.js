import * as document from "document";
import { ScreenManager } from "../../common/utils";

export default class Settings {
    constructor(state) {
        this.state = state;
        this.onSave = null;
        this.onCancel = null;

        this.el = document.getElementById("settings-screen");
        this.el.style.touchEvents = "enabled";

        ScreenManager.setupSwipeBack(this.el, () => {
            ScreenManager.show("home");
        });
        // Initialize zone editors
        this.zoneEditors = [];
        for (let i = 0; i < 5; i++) {
            this.zoneEditors.push({
                label: document.getElementById(`edit-zone-${i + 1}-label`),
                min: document.getElementById(`edit-zone-${i + 1}-min`),
                max: document.getElementById(`edit-zone-${i + 1}-max`)
            });
        }

        // Buttons
        const saveBtn = document.getElementById("save-btn");
        if (saveBtn) {
            saveBtn.onclick = () => this.handleSave();
        }

        const cancelBtn = document.getElementById("cancel-btn");
        if (cancelBtn) {
            cancelBtn.onclick = () => this.onCancel && this.onCancel();
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
                ScreenManager.slideBack();s
            }
        };
    }

    handleSave() {
        const updatedZones = [];
        for (let i = 0; i < 5; i++) {
            updatedZones.push({
                label: this.zoneEditors[i].label.value || `Zone ${i + 1}`,
                min: parseInt(this.zoneEditors[i].min.value) || 0,
                max: parseInt(this.zoneEditors[i].max.value) || 0
            });
        }
        this.onSave && this.onSave(updatedZones);
    }

    show() {
        // Populate editors with current values
        this.state.zones.forEach((zone, i) => {
            if (i < this.zoneEditors.length) {
                this.zoneEditors[i].label.value = zone.label;
                this.zoneEditors[i].min.value = zone.min.toString();
                this.zoneEditors[i].max.value = zone.max.toString();
            }
        });
        ScreenManager.show("settings");
    }
}
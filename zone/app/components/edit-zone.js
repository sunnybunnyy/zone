import * as document from "document";
import { ScreenManager } from "../../common/utils";

export default class EditZone {
    constructor(state) {
        this.state = state;
        this.onSave = null;
        this.currentZoneIndex = 0;

        this.el = document.getElementById("edit-zone-screen");
        this.minValueEl = document.getElementById("min-value");
        this.maxValueEl = document.getElementById("max-value");
        this.zoneLabelEl = document.getElementById("current-zone-label");

        // Button handlers
        document.getElementById("min-up-btn").on = () => this.adjustMin(1);
        document.getElementById("min-down-btn").onclick = () => this.adjustMin(-1);
        document.getElementById("max-up-btn").onclick = () => this.adjustMax(1);
        document.getElementById("max-down-btn").onclick = () => this.adjustMax(-1);
        document.getElementById("save-zone-btn").onclick = () => this.save();
    
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
    
    show(zoneIndex) {
        this.currentZoneIndex = zoneIndex;
        const zone = this.state.zones[zoneIndex];

        this.zoneLabelEl.text = `Zone ${zoneIndex + 1}`;
        this.minValueEl.text = zone.min;
        this.maxValueEl.text = zone.max;

        ScreenManager.show("editZone");
    }

    adjustMin(change) {
        const newValue = parseInt(this.minValueEl.text) + change;
        const maxValue = parseInt(this.maxValueEl.text);

        // Validate (min must be >= 30, < max)
        if (newValue >= 30 && newValue < maxValue) {
            this.minValueEl.text = newValue;
        }
    }

    adjustMax(change) {
        const newValue = parseInt(this.maxValueEl.text) + change;
        const minValue = parseInt(this.minValueEl.text);

        // Validate (max must be > min, <= 220)
        if (newValue > minValue && newValue <= 220) {
            this.maxValueEl.text = newValue;
        }
    }

    save() {
        this.state.zones[this.currentZoneIndex].min = parseInt(this.minValueEl.text);
        this.state.zone[this.currentZoneIndex].max = parseInt(this.maxValueEl.text);

        if (this.onSave) {
            this.onSave();
        }
    }
}
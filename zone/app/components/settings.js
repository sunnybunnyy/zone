import * as document from "document";
import { ScreenManager } from "../../common/utils";

export default class Settings {
    constructor(state) {
        this.state = state;
        this.onSave = null;
        this.onCancel = null;

        this.el = document.getElementById("settings-screen");
        this.el.style.touchEvents = "enabled";

        this.leftTumbler = document.getElementById('tumbler-left');
        this.rightTumbler = document.getElementById('tumbler-right');
        this.selectedZoneIndex = 0;

        // Buttons
        this.saveBtn = document.getElementById('save-btn');
        if (this.saveBtn) {
            this.saveBtn.onclick = () => {
                // Get the selected values from tumblers
                const leftIndex = parseInt(this.leftTumbler.value);
                const rightIndex = parseInt(this.rightTumbler.value);
            
                const leftItem = this.leftTumbler.getElementById(`left-item${leftIndex}`);
                const rightItem = this.rightTumbler.getElementById(`right-item${rightIndex}`);
                
                console.log('leftItem:', leftItem);
                console.log('right item:', rightItem);
                
                if (leftItem && rightItem) {
                    try {
                        // Get the text values directly from the text elements
                        // This approaches the DOM structure differently
                        const leftValueElement = leftItem.getElementById('value').getElementById('text');
                        const rightValueElement = rightItem.getElementById('value').getElementById('text');
                        
                        if (leftValueElement && rightValueElement) {
                            const leftValue = parseInt(leftValueElement.text);
                            const rightValue = parseInt(rightValueElement.text);
                            
                            console.log('Left value:', leftValue);
                            console.log('Right value:', rightValue);
                            
                            // Update the zone range in state
                            this.state.zones[this.selectedZoneIndex].min = Math.min(leftValue, rightValue);
                            this.state.zones[this.selectedZoneIndex].max = Math.max(leftValue, rightValue);
                            
                            // Call save callback
                            this.onSave && this.onSave();
                        } else {
                            console.log('Could not find value text elements');
                        }
                    } catch (e) {
                        console.log('Error accessing elements:', e);
                    }
                }
            };
        }
        
        const cancelBtn = document.getElementById("cancel-btn");
        if (cancelBtn) {
            cancelBtn.onclick = () => this.onCancel && this.onCancel();
        }
        

        // Initialize zone editors
        this.zoneEditors = [];
        for (let i = 0; i < 5; i++) {
            this.zoneEditors.push({
                label: document.getElementById(`edit-zone-${i + 1}-label`),
                min: document.getElementById(`edit-zone-${i + 1}-min`),
                max: document.getElementById(`edit-zone-${i + 1}-max`)
            });
        }

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

    show(zoneIndex) {
        this.selectedZoneIndex = zoneIndex;
        const zone = this.state.zones[zoneIndex];

        // Set tumbler initial values
        this.setTumblerValue(this.leftTumbler, zone.min);
        this.setTumblerValue(this.rightTumbler, zone.max);

        ScreenManager.show('settings');
    }

    setTumblerValue(tumbler, value) {
        // Find and select the item with the matching value
        const prefix = tumbler === this.leftTumbler ? 'left-item' : 'right-item';

        // Find and select the item with the matching value
        for (let i = 0; i <= 100; i++) {
            const item = tumbler.getElementById(`${prefix}${i}`);
            if (item) {
                const valueText = item.getElementById('value').getElementById('text');
                if (valueText && parseInt(valueText.text) === value) {
                    tumbler.value = i;
                    break;
                }
            }
        }
    }
}

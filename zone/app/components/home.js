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

        // Track selection mode
        this.selectionMode = false;
        this.selectedZoneIndex = null;

        this.el = document.getElementById("home-screen");
        this.bg = document.getElementById("home-bg");
        this.el.style.touchEvents = "enabled";
        
        this.zoneLabels = [];
        this.zoneRanges = [];
        this.zoneBgs = [];

        // Create zone list items
        for (let i = 0; i < 5; i++) {
            const zoneEl = document.getElementById(`zone-${i + 1}`);
            if (zoneEl) {
                const zoneBg = document.getElementById(`zone-${i + 1}-bg`);
                const zoneCircle1Bg = document.getElementById(`zone-${i + 1}-circle1-bg`);
                const zoneCircle2Bg = document.getElementById(`zone-${i + 1}-circle2-bg`);
                this.zoneBgs.push([zoneBg, zoneCircle1Bg, zoneCircle2Bg]);
                
                // Store the current index in a closure-safe way
                const index = i;
                
                // Entire zone click goes to settings or selects zone
                zoneEl.onclick = (evt) => {
                    console.log(`Zone ${index + 1} clicked, selectionMode: ${this.selectionMode}`);
                    if (this.selectionMode) {
                        // In selection mode, select this zone for workout
                        this.selectZone(index);
                    } else {
                        // Normal mode - go to settings for this zone
                        this.onSettingsSelected && this.onSettingsSelected(index);
                    }
                };
                
                this.zoneLabels.push(document.getElementById(`zone-${i + 1}-label`));
                this.zoneRanges.push(document.getElementById(`zone-${i + 1}-range`));
            }
        }

        // Edit zone callback
        this.editZone.onSave = () => {
            this.update();
            ScreenManager.show("home");
        };

        // Settings button
        const settingsBtn = document.getElementById("settings-btn");
        if (settingsBtn) {
            settingsBtn.onclick = () => {
                // Toggle selection mode
                this.selectionMode = !this.selectionMode;
                console.log(`Selection mode: ${this.selectionMode}`);
                
                // Update button text
                const textEl = settingsBtn.getElementById("text");
                if (textEl) {
                    textEl.text = this.selectionMode ? "Cancel" : "Setup";
                }
                
                // Reset selection when exiting selection mode
                if (!this.selectionMode) {
                    this.clearZoneSelection();
                }
            };
        }
        
        // Start button
        const startBtn = document.getElementById("start-btn");
        if (startBtn) {
            startBtn.onclick = () => {
                if (this.selectionMode && this.selectedZoneIndex !== null) {
                    // Start workout with selected zone
                    this.handleZoneSelect(this.selectedZoneIndex);
                    this.selectionMode = false;
                    
                    // Reset button text
                    const settingsBtn = document.getElementById("settings-btn");
                    if (settingsBtn) {
                        const textEl = settingsBtn.getElementById("text");
                        if (textEl) {
                            textEl.text = "Setup";
                        }
                    }
                }
            };
        }
        this.setupZoneClicks();
        this.update();
    }

    selectZone(zoneIndex) {
        console.log(`Selecting zone: ${zoneIndex + 1}`);
        
        // Clear any previous selection visually
        this.zoneBgs.forEach((bg, index) => {
            if (index !== zoneIndex) { // Only clear other zones
                bg.forEach(el => {
                    if (el) {
                        el.style.fill = '#222222'; // Default bakcground colour
                    }
                });
            }
        });
        
        // Highlight the selected zone
        const zoneBg = this.zoneBgs[zoneIndex];
        zoneBg.forEach(el => {
            if (el) {
                el.style.fill = "#0066cc"; // Bright blue highlight
                this.selectedZoneIndex = zoneIndex;
            }
        });
        
    }
    
    clearZoneSelection() {
        console.log("Clearing zone selection");
        // Reset all zone backgrounds
        this.zoneBgs.forEach(bg => {
            bg.forEach(el => {
                if (el) {
                    el.style.fill = "#222222"; // Default background color
                }
            });
        });
        this.selectedZoneIndex = null;
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
        console.log(`Zone selected: ${zoneIndex}`);
        this.state.currentZone = zoneIndex;
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
    
    show() {
        // Reset selection mode when showing home screen
        const settingsBtn = document.getElementById("settings-btn");
        if (settingsBtn) {
            const textEl = settingsBtn.getElementById("text");
            if (textEl) {
                textEl.text = "Setup";
            }
        }
        this.selectionMode = false;
        this.clearZoneSelection();
        
        ScreenManager.show("home");
    }

    setupZoneClicks() {
        // We need to add click handlers to each individual element in the zone
        // because SVG event bubbling might not work as expected
        for (let i = 0; i < 5; i++) {
            const index = i; // Capture the current index
            const zoneNumber = i + 1;
            
            // Add click handlers to each element in the zone
            const elements = [
                document.getElementById(`zone-${zoneNumber}`),
                document.getElementById(`zone-${zoneNumber}-bg`),
                document.getElementById(`zone-${zoneNumber}-label`),
                document.getElementById(`zone-${zoneNumber}-range`)
            ];
            
            // Add circles to the list of clickable elements
            const leftCircle = document.getElementById(`zone-${zoneNumber}-circle-left`);
            const rightCircle = document.getElementById(`zone-${zoneNumber}-circle-right`);
            if (leftCircle) elements.push(leftCircle);
            if (rightCircle) elements.push(rightCircle);
            
            // Add click handlers to each element
            elements.forEach(el => {
                if (el) {
                    el.onclick = (evt) => {
                        console.log(`Zone ${index + 1} element clicked, selectionMode: ${this.selectionMode}`);
                        if (this.selectionMode) {
                            // In selection mode, select this zone for workout
                            this.selectZone(index);
                        } else {
                            // Normal mode - go to settings for this zone
                            this.onSettingsSelected && this.onSettingsSelected(index);
                        }
                    };
                }
            });
        }
    }
}
import * as document from "document";
import { ScreenManager } from "../../common/utils";

export default class Summary {
    constructor(state) {
        this.state = state;
        this.onDone = null;

        this.el = document.getElementById("summary-screen");
        console.log("Summary screen element found:", this.el ? "YES" : "NO");

        const doneBtn = document.getElementById("done-btn");
        if (doneBtn) {
            doneBtn.onclick = () => this.onDone && this.onDone();
        }
    }

    calculateZoneTimes() {
        const zoneTimes = [0, 0, 0, 0, 0];
        
        // Check for valid workout data
        if (!this.state.workoutStart || !this.state.workoutEnd || !this.state.hrData || this.state.hrData.length === 0) {
            console.log("Warning: Missing workout data");
            console.log(`workoutStart: ${this.state.workoutStart}`);
            console.log(`workoutEnd: ${this.state.workoutEnd}`);
            console.log(`hrData length: ${this.state.hrData ? this.state.hrData.length : 'undefined'}`);
            return zoneTimes;
        }
        
        let lastTime = this.state.workoutStart;

        this.state.hrData.forEach(dataPoint => {
            const timeDiff = dataPoint.timestamp - lastTime;

            // Find which zone this HR belongs to
            for (let i = 0; i < this.state.zones.length; i++) {
                const zone = this.state.zones[i];
                if(dataPoint.hr >= zone.min && dataPoint.hr <= zone.max) {
                    zoneTimes[i] += timeDiff;
                    break;
                }
            }

            lastTime = dataPoint.timestamp;
        });

        return zoneTimes;
    }

    formatTime(ms) {
        if (!ms || ms <= 0) {
            return "0m 0s";
        }
        const mins = Math.floor(ms / 60000);
        const secs = Math.floor((ms % 60000) / 1000);
        return `${mins}m ${secs}s`;
    }

    show() {
        console.log("Summary.show() called");
        
        // First make sure any old data is cleared
        this.clearDisplayValues();
        
        // Then calculate new values
        const zoneTimes = this.calculateZoneTimes();
        const totalTime = this.state.workoutEnd - this.state.workoutStart;
        
        console.log(`Total workout time: ${totalTime}ms`);
        console.log(`Zone times: ${JSON.stringify(zoneTimes)}`);
        
        // Make screen visible
        ScreenManager.show("summary");
        
        // Apply values after a short delay to ensure screen is fully visible
        setTimeout(() => {
            this.applyCalculatedValues(zoneTimes, totalTime);
        }, 200);
    }
    
    clearDisplayValues() {
        // Set all value fields to empty or zero
        for (let i = 1; i <= 5; i++) {
            const labelEl = document.getElementById(`summary-zone${i}-label`);
            const valueEl = document.getElementById(`summary-zone${i}-value`);
            
            if (labelEl) labelEl.text = `Zone ${i}:`;
            if (valueEl) valueEl.text = "0%";
        }
        
        const totalTimeEl = document.getElementById("total-time-value");
        if (totalTimeEl) totalTimeEl.text = "0m 0s";
    }
    
    applyCalculatedValues(zoneTimes, totalTime) {
        console.log("Applying calculated values to summary screen");
        
        if (!totalTime || totalTime <= 0) {
            console.log("Warning: Invalid total time:", totalTime);
            return;
        }
        
        // Update zone percentages
        for (let i = 0; i < 5; i++) {
            const percent = Math.round((zoneTimes[i] / totalTime) * 100) || 0;
            const valueEl = document.getElementById(`summary-zone${i + 1}-value`);
            
            if (valueEl) {
                valueEl.text = `${percent}%`;
                console.log(`Set Zone ${i+1} value to: ${percent}%`);
                
                // Force an update of the element by toggling its style
                const oldStyle = valueEl.style.display;
                valueEl.style.display = "none";
                setTimeout(() => {
                    valueEl.style.display = oldStyle || "inline";
                }, 10);
            }
        }

        // Update total time
        const timeText = this.formatTime(totalTime);
        const totalTimeEl = document.getElementById("total-time-value");
        if (totalTimeEl) {
            totalTimeEl.text = timeText;
            console.log(`Set total time to: ${timeText}`);
            
            // Force update
            const oldStyle = totalTimeEl.style.display;
            totalTimeEl.style.display = "none";
            setTimeout(() => {
                totalTimeEl.style.display = oldStyle || "inline";
            }, 10);
        }
    }
}
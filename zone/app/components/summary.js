import * as document from "document";
import { ScreenManager } from "../../common/utils";

export default class Summary {
    constructor(state) {
        this.state = state;
        this.onDone = null;

        this.el = document.getElementById("summary-screen");

        const doneBtn = document.getElementById("done-btn");
        if (doneBtn) {
            doneBtn.onclick = () => this.onDone && this.onDone();
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
    }e

    calculateZoneTimes() {
        const zoneTimes = [0, 0, 0, 0, 0];
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

    show() {
        const zoneTimes = this.calculateZoneTimes();
        const totalTime = this.state.workoutEnd - this.state.workoutStart;

        // Update UI with summary data
        for (let i = 0; i < 5; i++) {
            const percent = Math.round((zoneTimes[i] / totalTime) * 100);
            const zoneEl = document.getElementById(`summary-zone-${i + 1}`);
            if (zoneEl) {
                zoneEl.getElementById("label").text = this.state.zones[i].label;
                zoneEl.getElementById("time").text = `${percent}%`;
            }
        }

        // Total time
        const mins = Math.floor(totalTime / 60000);
        const secs = Math.floor((totalTime % 60000) / 1000);
        document.getElementById("total-time").text = `${mins}m ${secs}s`;

        ScreenManager.show("settings");
    }
}
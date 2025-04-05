// utils.js
import { vibration } from "haptics";
import * as document from "document";

export class ScreenManager {
    static show(screenName) {
        const allScreens = document.getElementsByClassName('screen');
        for (let i = 0; i < allScreens.length; i++) {
            allScreens[i].style.display = "none";
        }
        const screen = document.getElementById(`${screenName}-screen`);
        if (screen) screen.style.display = "inline";
    }
    
    static setupSwipeBack(element, callback) {
        let startX = 0;
        const SWIPE_THRESHOLD = 60; // pixels
        
        element.onmousedown = (evt) => {
            startX = evt.screenX;
        };
        
        element.onmouseup = (evt) => {
            const diff = evt.screenX - startX;
            if (diff > SWIPE_THRESHOLD) {
                vibration.start("nudge");
                callback();
            }
        };
    }
}
import * as messaging from "messaging";
import { me as appbit } from "appbit";
import { display } from "display";
import { HeartRateSensor } from "heart-rate";
import { vibration } from "haptics";
import * as document from "document";
import * as fs from "fs";
import { ScreenManager } from "../common/utils";

// Import screens
import Home from "./components/home";
import RunMode from "./components/run-mode";
import Settings from "./components/settings";
import Summary from "./components/summary";
import EditZone from "./components/edit-zone";

let tumblerLeft = document.getElementById("tumbler-left");
let tumblerRight = document.getElementById("tumbler-right");

tumblerLeft.addEventListener("select", (evt) => {
  let selectedIndex = parseInt(tumblerLeft.value);
  let selectedItem = tumblerLeft.getElementById(`left-item${selectedIndex}`);
  let selectedValue = selectedItem.getElementById("text").text;
  console.log(`HOUR: index: ${selectedIndex} :: value: ${selectedValue}`);
});

tumblerRight.addEventListener("select", (evt) => {
  let selectedIndex = tumblerRight.value;
  let selectedItem = tumblerRight.getElementById(`right-item${selectedIndex}`);
  let selectedValue = selectedItem.getElementById("text").text;
  console.log(`MINS: index: ${selectedIndex} :: value: ${selectedValue}`);
});

// App state
let state = {
    zones: loadZones(),
    currentZone: null,
    hrData: [],
    workoutStart: null,
    workoutEnd: null
};

// Initialize screens
const homeScreen = new Home(state);
const runScreen = new RunMode(state);
const settingsScreen = new Settings(state);
const summaryScreen = new Summary(state);
const editZoneScreen = new EditZone(state);

// Show home screen initially
ScreenManager.show("home");

// Navigation handlers
homeScreen.onZoneSelected = (zone) => {
    console.log(`Setting current zone to: ${zone}`);
    state.currentZone = zone;
    console.log(`Zone info: ${JSON.stringify(state.zones[zone])}`);
    runScreen.show(); // Updates the zone display
    startWorkout();
};

homeScreen.onEditZone = (zoneIndex) => {
    editZoneScreen.show(zoneIndex);
};

homeScreen.onSettingsSelected = (zoneIndex) => {
    settingsScreen.show(zoneIndex);
    // ScreenManager.show("settings");
};

runScreen.onWorkoutEnd = () => {
    endWorkout();
    ScreenManager.show("summary");
};

settingsScreen.onSave = () => {
    homeScreen.update();
    // state.zones = updatedZones;
    // saveZones(updatedZones);
    ScreenManager.show("home");
};

settingsScreen.onCancel = () => {
    homeScreen.show();
};

summaryScreen.onDone = () => {
    homeScreen.show();
};

// Heart rate monitoring
let hrm;
function startWorkout() {
    state.workoutStart = new Date();
    state.hrData = [];

    if (HeartRateSensor) {
        hrm = new HeartRateSensor();
        hrm.addEventListener("reading", () => {
            const hr = hrm.heartRate;
            state.hrData.push({
                hr,
                timestamp: new Date()
            });

            // Check zone boundaries
            if (state.currentZone) {
                const zone = state.zones[state.currentZone];
                if (hr < zone.min || hr > zone.max) {
                    // Out of zone, alert user
                    vibration.start("nudge-max");
                    runScreen.showOutOfZoneWarning();
                } else {
                    runScreen.clearWarning();
                }
            }

            runScreen.updateHR(hr);
        });
        hrm.start();
    }
}

function endWorkout() {
    state.workoutEnd = new Date();
    if (hrm) {
        hrm.stop();
    }
}

// Zone persistence
function loadZones() {
    try {
        return JSON.parse(fs.readFileSync("zones.json", "json"));
    } catch (e) {
        // Default zones if none saved
        return [
            { label: "Zone 1", min: 131, max: 147 },
            { label: "Zone 2", min: 147, max: 164 },
            { label: "Zone 3", min: 173, max: 182 },
            { label: "Zone 4", min: 186, max: 191 },
            { label: "Zone 5", min: 191, max: 200 }
        ];
    }
}

function saveZones(zones) {
    fs.writeFileSync("zones.json", zones, "json");
}
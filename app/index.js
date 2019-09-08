import document from "document";
import { HeartRateSensor } from "heart-rate";
import { peerSocket } from "messaging";

const body = document.getElementById("body");
const hrmData = document.getElementById("hrm-data");

// State to calculate heart rate average.
function movingAverage(size) {
  let sum = 0;
  let values = [];

  return function(nextNum) {
    sum += nextNum;
    values.push(nextNum);

    if (values.length <= size) {
      return sum / values.length;
    }

    sum -= values.shift();

    return sum / size;
  };
}

const SAD_THRESHOLD = 1;

const hrm = new HeartRateSensor({ frequency: 1 });
const movingAverageCalculator = movingAverage(30);
console.log(movingAverageCalculator);
let averageBPM = 0;

hrm.addEventListener("reading", () => {
  let currentBPM = hrm.heartRate ? hrm.heartRate : 0;
  hrmData.text = currentBPM;
  averageBPM = movingAverageCalculator(currentBPM);
  console.log(averageBPM, "VERSUS", currentBPM);
  if (currentBPM > averageBPM + SAD_THRESHOLD) {
    console.log("SOMETHING HAPPENED");
    triggerAlert();
  }
});

function triggerAlert() {
  if (peerSocket.readyState === peerSocket.OPEN) {
    console.log("TRIGGERING ALERT");
    peerSocket.send("trigger");
  }
}

hrm.start();

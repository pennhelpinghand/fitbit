import { me } from "companion";
import { peerSocket } from "messaging";

me.wakeInterval = 3000000;

console.log("HELLO");

peerSocket.onmessage = event => {
  const data = event.data;
  console.log("TRIGGERED");
  if (data === "trigger") {
    console.log("calling alert");
    fetch("https://f1b86f3f.ngrok.io/trigger_alert", {
      method: "GET"
    })
      .then(() => console.log("triggered"))
      .catch(err => {
        console.error(err);
      });
  }
};

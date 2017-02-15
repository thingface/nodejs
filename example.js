var thingface = require("./");

var sensorInterval;

thingface.onConnectionState(function(newState){
    // 1 - connected
    // 0 - disconnected
    var stateText = newState === 1 ? "connected" : "disconnected";
    console.log("connection state changed to "+stateText);

    if (newState === 1) {
        sensorInterval = setInterval(sendSensorEvery5Seconds, 5000);
    }
    if (newState === 0) {
        clearInterval(sensorInterval);
    }
});

thingface.connect("mydevice", "secret-key", "my-app.thingface.io");

thingface.onCommand(function(sender, commandName, commandArgs){
    console.log("received command from "+sender);
    console.log(commandName);
    console.log(commandArgs);
});

function sendSensorEvery5Seconds(){
    thingface.sendSensorValue("s1", 0.11);
}
//thingface.sendSensorValue("s1", 0.11);
//thingface.disconnect();

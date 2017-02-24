var thingface = require("./");

var sensorInterval;

function sendSensorEvery5Seconds(){
    var sensorValue = Math.random() * 100;
    thingface.sendSensorValue("s1", sensorValue);
}

function commandHandler(senderType, senderId, commandName, commandArgs){
    console.log(`received command ${commandName} from ${senderId}`);
}

thingface.onConnectionState(function(newState){
    // 1 - connected
    // 0 - disconnected
    var stateText = newState === 1 ? "connected" : "disconnected";
    console.log("connection state changed to "+stateText);

    if (newState === 1) {
        thingface.onCommand(commandHandler);
        sensorInterval = setInterval(sendSensorEvery5Seconds, 5000);
    }

    if (newState === 0) {
        clearInterval(sensorInterval);
    }
});

thingface.connect("mydevice", "secret-key", "my-app.thingface.io");

//thingface.sendSensorValue("s1", 0.11);
//thingface.disconnect();

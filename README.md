# NPM package for thingface platform
The thingface client library for NodeJS

## Installation

```sh
npm install thingface --save
```

## Code Example

A few lines of code and you're ready to control or monitor your device.

```js
var thingface = require('thingface');

function commandHandler(sender, commandName, commandArgs){
    if(commandName === "say"){
        console.log(commandArgs[0]);
    }
}

thingface.onConnectionState(function(newState){
    if(newState === 1){
        thingface.onCommand(commandHandler);
        thingface.sendSensorValue("temp", 35.6);
    }
})

thingface.connect('mydevice', 'mydevicesecret', 'my-app.thingface.io');

```

## API Reference
Have a look to simple api.

### thingface.connect(deviceId, deviceSecretKey, host)
connect to the thingface device gateway specified by the given host name with current device ID and device secret key.
- **deviceId** - device ID
- **deviceSecretKey** - secret key for that device
- **host** - device gateway hostname

### thingface.disconnect()
disconnect from thingface device gateway

### thingface.isConnected()
returns *true* if this client is connected, otherwise it returns *false*

### thingface.onConnectionState(eventHandlerFn)
connection state event handling
- **eventHandlerFn** - a function to handle connection state event

### thingface.onCommand(commandHandler[, sender])
subscribe for commands from sender
- **commandHandler** - a function to handle commands
- **sender (optional)** - sender id (username or device ID), if sender is not provided device will receive commands from every user or device

### thingface.sendSensorValue(sensorId, sensorValue)
send sensor value to thingface gateway
- sensorId - sensor ID from the device
- sensorValue - current sensor value (double)

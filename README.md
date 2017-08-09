# The thingface client library for NodeJS
NPM Package for Thingface Platform

## Installation

```sh
npm install thingface --save
```

## Code Example

A few lines of code and you're ready to control or monitor your device.

```js
var thingface = require('thingface');

function commandHandler(senderType, senderId, commandName, commandArgs){
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

thingface.connect('mydeviceid', 'mydevicesecretkey');

```

## API Reference
API is very simple. Have a look to api reference.

### thingface.connect(deviceId, deviceSecretKey, host, port, enableSsl)
connect to the thingface device gateway specified by the given host name with current device ID and device secret key.
- `deviceId` - device ID
- `deviceSecretKey` - secret key for that device
- `host` (optional) - device gateway hostname (default **personal.thingface.io**)
- `port` (optional) - device gateway port (default **8883** for SSL connection, **1883** for no SSL connection)
- `enableSsl` (optional) - enable SSL connection (default **true**)

### thingface.disconnect()
disconnect from thingface device gateway

### thingface.isConnected()
returns *true* if this client is connected, otherwise it returns *false*. Use it everytime when you need to check if device is connected or not.

### thingface.onConnectionState(eventHandlerFn)
connection state event handling
- `eventHandlerFn` - a function to handle connection state event

### thingface.onCommand(commandHandler[, senderType][, senderId])
subscribe for commands from sender
- `commandHandler` - a function to handle commands
- `senderType` (optional) - sender type ('u' - user command, 'd' - device command), if sender type is not provided device will receive commands from every user or device
- `senderId` (optional) - sender ID (username or device ID), if sender ID is not provided device will receive commands from every user or device

### thingface.sendSensorValue(sensorId, sensorValue)
send sensor value to thingface gateway
- `sensorId` - sensor ID from the device
- `sensorValue` - current sensor value (as double type)

## More Information
- [https://github.com/thingface](https://github.com/thingface)
- [https://thingface.io](https://thingface.io/)

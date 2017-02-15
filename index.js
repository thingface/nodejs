var mqtt = require("mqtt");
var utils = require("./utils");

var _deviceId;
var _secretKey;
var _host = "personal.thingface.io";
var _port = 8883;
var _client;
var _onErrorUserCallback;
var _onConnectionStateCallback;
var _onCommandCallback;

//
// Mqtt Event Handlers
//
function _connectHandler(){
    "use strict";
    if (_onConnectionStateCallback) {
        _onConnectionStateCallback(1);
    }
}

function _disconnectHandler(){
    "use strict";
    if (_onConnectionStateCallback) {
        _onConnectionStateCallback(0);
    }
}

function _messageHandler(topic, message){
    "use strict";
    if (/^tf\/c/.test(topic)) {
        // message is command
        var payload = utils.bufferToJson(message);
        var match = /tf\/c\/([a-zA-Z0-9]+)\/([a-zA-Z0-9]+)/.exec(topic);
        var sender = match[1];
        if (_onCommandCallback) {
            _onCommandCallback(sender, payload.c, payload.a);
        }
    }
}

function _onErrorHandler(error){
    "use strict";
    if (_onErrorUserCallback) {
        _onErrorUserCallback(error);
    }
}

//
// Public Functions
//
function connect(deviceId, secretKey, host, port){
    "use strict";

    if (!deviceId) {
        throw new Exception("A device ID is required.");
    }
    _deviceId = deviceId;

    if (!secretKey) {
        throw new Exception("A secret key is required.");
    }
    _secretKey = secretKey;

    if (host) {
        _host = host;
    }

    if(port && port > 0){
        _port = port;
    }

    var options = {
        port: _port,
        username: _deviceId,
        password: _secretKey,
        clientId: _deviceId,
        clean: true,
        rejectUnauthorized: false
    };

    console.log(`connecting to ${_host} at port ${_port}`);

    _client  = mqtt.connect('mqtts://'+_host, options);
    _client.on('error', _onErrorHandler);
    _client.on('connect', _connectHandler);
    _client.on('disconnect', _disconnectHandler);
    _client.on('message', _messageHandler);
}

function disconnect(){
    "use strict";

    if (_client && _client.connected) {
        _client.end();
        _client = undefined;
    }
}

function isConnected(){
    "use strict";

    if (_client) {
        return _client.connected;
    }

    return false;
}

function sendSensorValue(sensorId, sensorValue) {
    "use strict";

    if (!_client) {
        return;
    }

    var message = utils.jsonToBuffer({v:sensorValue});
    // topic tf/d/{deviceId}/{sensorId}
    _client.publish("tf/d/" + _deviceId + "/" + sensorId, message);
}

function onCommand(callback, sender) {
    "use strict";

    if (!callback) {
        throw new Error("Command callback is required");
    }

    if(!_client){
        throw new Error("Client is disconnected");
    }

    if (sender) {
        _client.subscribe('tf/c/' + sender + '/' + _deviceId);
    } else {
        _client.subscribe('tf/c/+/' + _deviceId);
    }
    _onCommandCallback = callback;
}

function onError(callback){
    "use strict";
    _onErrorUserCallback = callback;
}

function onConnectionState(callback){
    "use strict";
    if(callback){
        _onConnectionStateCallback = callback;
    }
}

module.exports = {
    connect: connect,
    disconnect: disconnect,
    isConnected: isConnected,
    onError: onError,
    onConnectionState: onConnectionState,
    sendSensorValue: sendSensorValue,
    onCommand: onCommand
};

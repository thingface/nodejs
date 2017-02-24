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
    if (/^[du]{1}\/c/.test(topic)) {
        // message is command
        var payload = utils.bufferToJson(message);
        var match = /([du]{1})\/c\/([a-zA-Z0-9]+)\/([a-zA-Z0-9]+)/.exec(topic);
        var senderType = match[1];
        var senderId = match[2];
        if (_onCommandCallback) {
            _onCommandCallback(senderType, senderId, payload.c, payload.a);
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

    if(typeof deviceId !== "string"){
        throw new Exception("A device ID must be a string.");
    }
    _deviceId = deviceId;

    if (!secretKey) {
        throw new Exception("A secret key is required.");
    }

    if(typeof secretKey !== "string"){
        throw new Exception("A device secret key must be a string.");
    }
    _secretKey = secretKey;

    if(host && typeof host === "string"){
        _host = host;
    }

    if(port && typeof port === "number" && port > 0 && port < 65535){
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

    //console.log(`connecting to ${_host} at port ${_port}`);

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

    if(!_client){
        throw new Error("client is disconnected");
    }

    if (typeof sensorId !== "string") {
        throw new Error("sensor ID must be a string");
    }

    if (sensorId.length > 25) {
        throw new Error("sensor ID is too long");
    }

    if (typeof sensorValue !== "number") {
        throw new Error("sensor value must be a number");
    }

    var message = utils.jsonToBuffer({v:sensorValue});
    _client.publish("d/d/" + _deviceId + "/" + sensorId, message);
}

function onCommand(callback, senderType, senderId) {
    "use strict";

    if (!callback) {
        throw new Error("command callback is required");
    }

    if (typeof callback !== "function") {
        throw new Error("callback must be a function");
    }

    if(!_client){
        throw new Error("Client is disconnected");
    }

    var _senderType = "+";
    var _senderId = "+";

    if (typeof senderType === "string" && /^[ud]{1}/.test(senderType)) {
        _senderType = senderType;
    }

    if (typeof senderId === "string" && senderId.length <= 30) {
        _senderId = senderId;
    }

    var topicFilter = _senderType + '/c/' + _senderId + '/' + _deviceId;
    _client.subscribe(topicFilter);
    _onCommandCallback = callback;
}

function onError(callback){
    "use strict";
    if (typeof callback !== "function") {
        throw new Error("callback must be a function");
    }
    _onErrorUserCallback = callback;
}

function onConnectionState(callback){
    "use strict";
    if (typeof callback !== "function") {
        throw new Error("callback must be a function");
    }
    _onConnectionStateCallback = callback;
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

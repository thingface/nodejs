var Buffer = require('buffer').Buffer;

function jsonToBuffer(obj){
    if(!obj) {
        return new Buffer();
    }
    var str = JSON.stringify(obj);
    return new Buffer(str, "utf8");
}

function bufferToJson(buffer){
    if (!buffer) {
        return null;
    }
    var str = buffer.toString();
    var json = JSON.parse(str);
    return json;
}

module.exports = {
    jsonToBuffer: jsonToBuffer,
    bufferToJson: bufferToJson
};

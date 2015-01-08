var tessel = require('tessel');
var thermocouplelib = require('thermocouple-max31855');
var Keen = require('keen.io');
//var config = require('./config.json');
var config = {
  projectId: "",
  writeKey: "",
  readKey: ""
}

var sensor = thermocouplelib.use(tessel.port['A'], { "poll": 5000 });
var keen = Keen.configure(config);
var readings = [];

var uid = "coffee Congo Kivu Bukavu-Beni attempt 2" + new Date().toISOString();

sensor.on('measurement', function (data) {
  console.log("measure");
  readings.unshift({
    data: data,
    keen: { timestamp: new Date().toISOString() },
    uid: uid,
    collection: uid,
    startWeight: 8.0,
  });

  if (readings.length > 2) {
    sendData(readings.slice(0,2));
    readings = readings.slice(2, readings.length);
  }
})

function sendData(readings) {
  var packet = {};
  packet[uid] = readings;
  console.log(readings[0].data);

  keen.addEvents(packet, function (err, resp) {
    console.log('sendData', err, resp)
  });
}

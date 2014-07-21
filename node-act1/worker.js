var redis = require('redis')
  , config = require('./config')
  , mailer = require('nodemailer')
;

var pubSubClient = redis.createClient(config.port, config.host)
  , client = redis.createClient(config.port, config.host);

if (!config.googleApiKey || config.googleApiKey.length == 0) {
  throw new Error('Specify your google API key in the GOOGLEAPIKEY environment variable');
}
if (!config.googleApiUser || config.googleApiUser.length == 0) {
  throw new Error('Specify your google API user in the GOOGLEAPIUSER environment variable');
}



function handleMessage(channel, message) {
  console.log('Received a message: ', message);
  var payload = JSON.parse(message);
  acquireLock(payload, lockCallback);
}

function acquireLock(payload, callback) {
  var lockIdentifier = "lock." + payload.identifier;
  console.log("Trying to obtain lock %s", lockIdentifier);
  
  client.setnx(lockIdentifier, "Worker " + process.pid, function (err, res) {
    if (err) {
      console.log("Error acquiring lock for %s", lockIdentifier);
      // dataForCallback?
      return callback(err, dataForCallback(false));
    }
    var data = {
      "acquired": res,
      "lockIdentifier": lockIdentifier,
      "payload": payload };
    return callback(data);
  });
}

function lockCallback(data) {
  if (data.acquired == true) {
    console.log('I got the lock!');
    console.log('I win! Sending notification: %s', JSON.stringify(data));
    sendMessage(data);
  } else {
    console.log('No lock for me :(');
  }
}

function sendMessage(payload) {
  console.log("Sending email notification...");
  var smtpTransport = mailer.createTransport(
    {
      service: "Gmail",
      auth: { user: config.googleApiUser, pass: config.googleApiKey },
    });
  var mailOptions = {
    from: config.googleApiUser,
    to: config.googleApiUser,
    subject: "Notification from node.js",
    text: "You are hereby notified!",
    html: "<b>You are hereby notified</b>",
  };
  smtpTransport.sendMail(mailOptions, function (err, res) {
    if (err) {
      console.log("Error sending mail:", err);
    } else {
      console.log("Message sent");
    }
    smtpTransport.close();
  });
}

pubSubClient.subscribe('notifications');
pubSubClient.on('message', handleMessage);

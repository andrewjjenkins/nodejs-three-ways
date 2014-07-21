var redis = require('redis')
  , config = require('./config')
;

var pubSubClient = redis.createClient(config.port, config.host);

pubSubClient.subscribe('notifications');
pubSubClient.on('message', function(channel, message) {
  console.log('Received a message: ', message);
});

var redis = require('redis');

var pubSubClient = redis.createClient('6379', 'localhost');

pubSubClient.subscribe('notifications');
pubSubClient.on('message', function(channel, message) {
  console.log('Received a message: ', message);
});

Markers = new Meteor.Collection('markers');

if (Meteor.isClient) {
  Meteor.subscribe("markers");

  Template.markerlist.markers = function () {
    return Markers.find({});
  }

  Template.hello.greeting = function () {
    return "Welcome to mapit.";
  };

  Template.hello.events({
    'click input': function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });
}

if (Meteor.isServer) {
  if (Markers.find().count() == 0) {
    console.log("No markers found in collection - inserting one");
    Markers.insert({"coords" : [49.25044, -123.137]});
  }

  Meteor.publish("markers", function () {
    return Markers.find();
  });
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

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

  Template.map.rendered = function () {
    L.Icon.Default.imagePath = 'packages/leaflet/images';

    window.map = L.map('map', {
      doubleClickZoom: false,
      zoomControl: false
    }).setView([45.52854352208366,-122.66302943229674], 13);

    window.map.on('dblclick', function(event, object) {
        // We're storing the marker coordinates in an extensibel JSON
        // data structure, to leave room to add more info later
        console.log("inserting marker: " + [ event.latlng.lat, event.latlng.lng ]);
        Markers.insert({"coords": [event.latlng.lat,event.latlng.lng]});
    });

    L.tileLayer.provider('Thunderforest.Outdoors').addTo(map);

    var markers = Markers.find();

    markers.observe({
      added: function(marker) {
        L.marker(marker.coords).addTo(map);
      }
    });
  };
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

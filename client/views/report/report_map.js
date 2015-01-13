mapEngine = null;
reportMap = null;

var style = [
    {
        "featureType": "administrative",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#444444"
            }
        ]
    },
    {
        "featureType": "administrative.province",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "administrative.neighborhood",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f2f2f2"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 45
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#46bcec"
            },
            {
                "visibility": "on"
            }
        ]
    }
];

Template.report_map.rendered = function () {
  var tmpl = this;

// Initiate the Google Map
  VazcoMaps.init({'libraries' : 'places'}, function() {
    mapEngine = VazcoMaps.gMaps();
    reportMap = new mapEngine({
        div: '#map-canvas',
        lat: 3.12816,
        lng: 101.76223,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoom: 10,
        minZoom : 8,
        maxZoom : 17,
        mapTypeControl: true,
		    mapTypeControlOptions: {
		    	style : google.maps.MapTypeControlStyle.DROPDOWN_MENU,
		        position: google.maps.ControlPosition.TOP_RIGHT
		    },
		    zoomControl: true,
        zoomControlOptions: {
          style: google.maps.ZoomControlStyle.SMALL,
          position: google.maps.ControlPosition.TOP_RIGHT
        },
		    scrollwheel: false,
		    streetViewControl: false,
		    panControl: false,
		    styles: style
    });
    
//     Bind the autocomplete function to the location input
    var input = $(".incident-location");
    var locationAutocomplete = new google.maps.places.Autocomplete(input[0], {
      componentRestrictions: {country: "my"}
    });
    var infowindow = new google.maps.InfoWindow({});
    google.maps.event.addListener(locationAutocomplete, 'place_changed', function(e) {
      var place = locationAutocomplete.getPlace();
      if (!place.geometry) {
        return;
      }
      reportMap.removeMarkers();
      mapEngine.geocode({
        address: input.val(),
        callback: function(results, status) {
          if (status == 'OK') {
            var latlng = results[0].geometry.location;
            var trimAddress = results[0].formatted_address.replace(/,/g, '<br>');
            var marker = reportMap.addMarker({
              lat: latlng.lat(),
              lng: latlng.lng(),
              draggable: true,
              animation: google.maps.Animation.DROP,
              dragend: function() {
                var point = this.getPosition();
                mapEngine.geocode({location: point, callback: function(results) {
                  input.val(results[0].formatted_address);
                  trimAddress = results[0].formatted_address.replace(/,/g, '<br>');
                  Session.set('trimmedAddress', trimAddress);
                  Session.set('fullAddress', results[0].formatted_address);
                  Session.set('autoAddressAccepted', false);
                  Session.set('manualAddress', false);
                  reportMap.setCenter(results[0].geometry.location.lat(), results[0].geometry.location.lng());
                }});
              }
            });
            input.val(results[0].formatted_address);
            Session.set('fullAddress', results[0].formatted_address);
            Session.set('trimmedAddress', trimAddress);
            Session.set('incidentCoordinate', { lat: latlng.lat(), lng: latlng.lng() });
            reportMap.setCenter(latlng.lat(), latlng.lng());
            reportMap.setZoom(15);
          } else {
            console.log(status);
          }
        }
      });
    });
  });
}


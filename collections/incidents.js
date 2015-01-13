incidentSchemaObject = {
  location: {
    type: Object
  },
  "location.address": {
    type: String
  },
  "location.coordinate": {
    type: Object
  },
  "location.coordinate.lat": {
    type: Number,
    decimal: true
  },
  "location.coordinate.lng": {
    type: Number,
    decimal: true
  }, 
  "location.googleMapAddress": {
    type: String
  },
  incidentDateTime: {
    type: Number
  },
  type: {
    type: String,
    label: "Type of Crime",
    allowedValues: ['theft', 'robbery', 'rape', 'murder'],
    autoform: {
      options: [
        {label: "Theft", value: "theft"},
        {label: "Robbery", value: "robbery"},
        {label: "Rape", value: "rape"},
        {label: "Murder", value: "murder"}
      ]
    }
  },
  description: {
    type: String,
    label: "Some Description",
    max: 1000
  },
  isAnonymous: {
    type: Boolean,
    optional: true,
    label: "I want to stay anonymous"
  },
  images: {
    type: Object
  },  
  "images.url": {
    type: [String]
  },
  createdAt: {
    type: Date,
    optional: true,
    autoform: {
      omit: true
    }
  },
  modifyAt: {
    type: Date,
    optional: true,
    autoform: {
      omit: true
    }
  },
  submittedBy: {
    type: String,
    optional: true,
    autoform: {
      omit: true
    }
  }
};

Incidents = new Mongo.Collection("incidents");
IncidentsSchema = new SimpleSchema(incidentSchemaObject);
Incidents.attachSchema(IncidentsSchema);

Incidents.deny({
  update: function(userId, incident, fieldNames) {
    return false;
  }
});

Incidents.allow({
  update: function(userId, doc){
  	return false;
  },
  remove: function(userId, doc){
  	return false;
  }
});

// -------------------------------------------------------------------------------- //
// ---------------------------- Submit Incident ----------------------------------- //
// -------------------------------------------------------------------------------- //

submitIncident = function (incident) {
  defaultProperties = {
    createdAt: new Date(),
    modifyAt: new Date(),
    submittedBy: "Eden Hazard"
  };

  incident = _.extend(defaultProperties, incident);

  // -------------------------------- Insert ------------------------------- //

  incident._id = Incidents.insert(incident);

  // --------------------- Server-Side Async Callbacks --------------------- //

  if (Meteor.isServer) {
    // use defer to avoid holding up client
    Meteor.defer(function () {
      
    });
  }

  return incident;
};

Meteor.methods({
  'submitIncident': function (incident) {
    // required properties:
    // address
    // coordinates
    // incident datetime
    // incident type
    // descriptions

    // optional properties
    // image URLs
    // anonymous    
    return submitIncident(incident);
  }
})



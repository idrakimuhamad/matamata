Template.report_tools.helpers({
  addressAccepted: function () {
    return Session.get('trimmedAddress') && Session.get('autoAddressAccepted');
  },
  trimmedAddress: function () {
    return Session.get('trimmedAddress');
  },
  fullAddress: function () {
    return Session.get('fullAddress');
  },
  editingAddress: function () {
    return Session.get('editAddress');
  },
  anon: function () {
    return Session.get('stayAnon');
  }
});

Template.report_tools.events({
  'keydown .incident-location': function (e) {
    if (e.which == 13) {
      e.preventDefault();
    }
  },
  'click .autocomplete-edit': function (e) {
    e.preventDefault();
    Session.set('editAddress', true);
  },
  'click .manual-cancel': function (e) {
    e.preventDefault();
    Session.set('editAddress', false);
    Session.set('manualAddress', false);
  },
  'click .manual-accept': function (e) {
    e.preventDefault();
    Session.set('editAddress', false);
    Session.set('manualAddress', true);
    
    var trimmedAddress = $('.manual-address').val().replace(/\n/g, '<br>');
    Session.set('trimmedAddress', trimmedAddress);
  },
  'change .anonymous': function (e, t) {
    Session.set('stayAnon', $('.anonymous').is(':checked'));
  }
});

Template.incidentDateandTime.rendered = function () {
  $('.datepicker').pickadate({
    max: true,
    formatSubmit: 'yyyy-mm-dd',
    hiddenName: true
  });
  $('.timepicker').pickatime({
    formatSubmit: 'HH:i',
    hiddenName: true
  });
};

AutoForm.hooks({
  submitIncidentForm: {
    before: {
      submitIncident: function(doc, template) {
        template.$('button[type=submit]').addClass('loading');
        var incident = doc;
        
        incident.images = {};
        incident.images.url = ['https://d13yacurqjgara.cloudfront.net/users/647135/screenshots/1872671/drbl.jpg'];
        incident.location = {
          address: Session.get('trimmedAddress'),
          coordinate: Session.get('incidentCoordinate'),
          googleMapAddress: Session.get('fullAddress')
        };
        
        incident.incidentDateTime = moment($('[name=incident-date]').val() + ' ' + $('[name=incident-time]').val()).valueOf();
        // ------------------------------ Checks ------------------------------ //

//         if (!Meteor.user()) {
//           flashMessage(i18n.t('you_must_be_logged_in'), 'error');
//           return false;
//         }

        // ------------------------------ Callbacks ------------------------------ //

        // run all post submit client callbacks on properties object successively
//         post = postSubmitClientCallbacks.reduce(function(result, currentFunction) {
//             return currentFunction(result);
//         }, post);

        return incident;
      }
    },

    onSuccess: function(operation, incident, template) {      
      template.$('button[type=submit]').removeClass('loading');      
      Session.set('trimmedAddress', null);
      Session.set('editAddress', null);
      Session.set('autoAddressAccepted', false);    
      Session.set('manualAddress', false);
      // trackEvent("new post", {'postId': post._id});
//       if (post.status === STATUS_PENDING) {
//         flashMessage(i18n.t('thanks_your_post_is_awaiting_approval'), 'success');
//       }
    },

    onError: function(operation, error, template) {
      template.$('button[type=submit]').removeClass('loading');
      alert('Error! ' + error);
      console.log(error);
      // flashMessage(error.message.split('|')[0], 'error'); // workaround because error.details returns undefined
      // clearSeenMessages();
      // $(e.target).removeClass('disabled');
//       if (error.error == 603) {
//         var dupePostId = error.reason.split('|')[1];
//         Router.go('/posts/'+dupePostId);
//       }
    }

  }
});
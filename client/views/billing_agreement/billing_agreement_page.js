Template.billing_agreement_page.rendered = function () {
    if (Session.get('agreementStatus')) {
      var current = location.href + '#execute-agreement';
      location.href = current;
    }
}

Template.billing_agreement_page.helpers({
  generateTokenResults: function () {
    if (Session.get('generateTokenResults')) {
      var results = EJSON.stringify(Session.get('generateTokenResults'), { indent: true, canonical: true });
      return results;
    }
  },
  createPlanResults: function () {
    if (Session.get('createPlanResults')) {
      var results = EJSON.stringify(Session.get('createPlanResults'), { indent: true, canonical: true });
      return results;
    }
  },
  updatePlanResults: function () {
    if (Session.get('updatePlanResults')) {
      var results = EJSON.stringify(Session.get('updatePlanResults'), { indent: true, canonical: true });
      return results;
    }
  },
  createAgreementResults: function () {
    if (Session.get('createAgreementResults')) {
      var results = EJSON.stringify(Session.get('createAgreementResults'), { indent: true, canonical: true });
      return results;
    }
  },
  redirectReady: function () {
    return Session.get('redirectURL');
  },
  redirectURL: function () {
    return Session.get('redirectURL');
  },
  executeAgreementResults: function () {
    if (Session.get('executeAgreementResults')) {
      var results = EJSON.stringify(Session.get('executeAgreementResults'), { indent: true, canonical: true });
      return results;
    }
  },
});

Template.billing_agreement_page.events({
  'click .generate-token .generate': function (e) {
    e.preventDefault();

    $(e.target).text('Generating...');

    Meteor.call('generateAccessToken', function (error, result) {
      if (!error) {
        Session.set('generateTokenResults', result.data);
        Session.set('accessToken', result.data.access_token);
      } else {
        Session.set('generateTokenResults', error.reason);
      }
      $(e.target).text('Done...');
    });
  },
  'click .create-plan .create': function (e) {
    e.preventDefault();

    $(e.target).text('Creating...');

    Meteor.call('createPlan', siteURL, function (error, result) {
      if (!error) {
        Session.set('createPlanResults', result.data);
        Session.set('planID', result.data .id);
      } else {
        Session.set('createPlanResults', error.reason);
      }
      $(e.target).text('Done...');
    });
  },
  'click .update-plan .update': function (e) {
    e.preventDefault();

    $(e.target).text('Updating...');

    Meteor.call('updatePlan', Session.get('planID'), function (error, result) {
      if (!error) {
        if (result.statusCode === 200) {
          Session.set('updatePlanResults', result.statusCode);
        }
      } else {
        Session.set('updatePlanResults', error.reason);
      }
      $(e.target).text('Done...');
    });
  },
  'click .create-agreement .create': function (e) {
    e.preventDefault();

    $(e.target).text('Creating...');

    Meteor.call('createAgreement', Session.get('planID'), function (error, result) {
      if (!error) {
        Session.set('createAgreementResults', result.data);
        Session.set('redirectURL', result.data.links[0].href);
      } else {
        Session.set('createAgreementResults', error.reason);
      }
      $(e.target).text('Done...');
    });
  },
  'click .redirect-url': function (e) {
    // e.preventDefault();
    // window.open($(e.target).attr('href'), '_blank').focus();
  },
  'click .execute-agreement .execute': function (e) {
    e.preventDefault();

    $(e.target).text('Executing...');

    Meteor.call('executeAgreement', Session.get('agreementToken'), function (error, result) {
      if (!error) {
        Session.set('executeAgreementResults', result.data);
      } else {
        Session.set('executeAgreementResults', error.reason);
      }
      $(e.target).text('Done...');
    });
  },
});

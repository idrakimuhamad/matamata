AppController = RouteController.extend({
  layoutTemplate: 'app_layout',

  action: function () {
    this.render();
  }
});

RestController = RouteController.extend({
  layoutTemplate: 'rest_layout',

  action: function () {
    this.render();
  }
});

Router.route('/explore', {
  name: 'explore',
  template: 'explore_page',
  controller: 'AppController'
});

Router.route('/report', {
  name: 'report',
  template: 'report_page',
  controller: 'AppController',
  onBeforeAction: function () {
    Session.set('trimmedAddress', null);
    Session.set('editAddress', null);
    Session.set('autoAddressAccepted', false);    
    Session.set('manualAddress', false);
    this.next();
  }
});

Router.route('/restapi', {
  name: 'restAPI',
  template: 'rest_main_page',
  controller: 'RestController'
});

Router.route('/restapi/payment', {
  name: 'payments',
  template: 'payment_page',
  controller: 'RestController'
});

Router.route('/restapi/billing_agreement', {
  name: 'billing',
  template: 'billing_agreement_page',
  controller: 'RestController',
  onBeforeAction: function () {
    var query = this.params.query;
    Session.set('generateTokenResults', null);
    Session.set('createPlanResults', null);
    Session.set('updatePlanResults', null);
    Session.set('createAgreementResults', null);
    Session.set('redirectURL', null);
    Session.set('agreementStatus', query.success ? query.success : null);
    Session.set('agreementToken', query.token ? query.token : null);
    Session.set('accessToken', query.access ? query.access : null);
    
    this.next();
  }
});

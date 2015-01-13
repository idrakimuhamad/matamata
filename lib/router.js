AppController = RouteController.extend({
  layoutTemplate: 'app_layout',

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

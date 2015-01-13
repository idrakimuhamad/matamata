Template.button_submit.helpers({
  notLoading: function () {
    console.log($('form button[type=submit]').is('.loading'));
    return !$('form button[type=submit]').is('.loading');
  }
});
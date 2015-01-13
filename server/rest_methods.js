Meteor.methods({
  generateAccessToken: function () {
    var credential = getCredential();

    var result = HTTP.call("POST", "https://api.sandbox.paypal.com/v1/oauth2/token", {
      headers : {
        "Accept" : "application/json",
        "Accept-Language " : "en_US",
        "content-type" : "application/x-www-form-urlencoded",
      },
      content: "grant_type=client_credentials",
      auth: credential
    });
    
    AccessToken.remove({});
    AccessToken.insert({
      token: result.data.access_token,
      expire: result.data.expires_in
    });
    
    return result;
  },
  createPlan: function (siteURL) {
    var credential = 'Bearer ' + getAccessToken();
    var jsonData = '{"name":"T-Shirt of the Month Club Plan","description":"Template creation.","type":"fixed","payment_definitions":[{"name":"Regular Payments","type":"REGULAR","frequency":"MONTH","frequency_interval":"2","amount":{"value":"100","currency":"USD"},"cycles":"12","charge_models":[{"type":"SHIPPING","amount":{"value":"10","currency":"USD"}},{"type":"TAX","amount":{"value":"12","currency":"USD"}}]}],"merchant_preferences":{"setup_fee":{"value":"1","currency":"USD"},"return_url":"' + siteURL + '?success=true&access='+getAccessToken()+'","cancel_url":"' + siteURL + '?success=false&access='+getAccessToken()+'","auto_bill_amount":"YES","initial_fail_amount_action":"CONTINUE","max_fail_attempts":"0"}}';

    jsonData = EJSON.parse(jsonData);
    this.unblock();

    return HTTP.call("POST", "https://api.sandbox.paypal.com/v1/payments/billing-plans", {
      headers : {
        "Content-Type" : "application/json",
        "authorization" : credential
      },
      data: jsonData
    });
  },
  updatePlan: function (planID) {
    var credential = 'Bearer ' + getAccessToken();
    var jsonData = '[{"path":"/","value":{"state":"ACTIVE"},"op":"replace"}]';

    jsonData = EJSON.parse(jsonData);
    this.unblock();

    return HTTP.call("PATCH", "https://api.sandbox.paypal.com/v1/payments/billing-plans/" + planID, {
      headers : {
        "Content-Type" : "application/json",
        "authorization" : credential
      },
      data: jsonData
    });
  },
  createAgreement: function (planID) {
    var credential = 'Bearer ' + getAccessToken();
    var jsonData = '{"name":"T-Shirt of the Month Club Agreement","description":"Agreement for T-Shirt of the Month Club Plan","start_date":"2015-02-19T00:37:04Z","plan":{"id":"' + planID + '"},"payer":{"payment_method":"paypal"},"shipping_address":{"line1":"111 First Street","city":"Saratoga","state":"CA","postal_code":"95070","country_code":"US"}}';

    jsonData = EJSON.parse(jsonData);
    this.unblock();

    return HTTP.call("POST", "https://api.sandbox.paypal.com/v1/payments/billing-agreements", {
      headers : {
        "Content-Type" : "application/json",
        "authorization" : credential
      },
      data: jsonData
    });
  },
  executeAgreement: function (agreementToken) {
    var credential = 'Bearer ' + getAccessToken();
    var jsonData = '{}';

    jsonData = EJSON.parse(jsonData);
    this.unblock();

    return HTTP.call("POST", "https://api.sandbox.paypal.com/v1/payments/billing-agreements/" + agreementToken + "/agreement-execute", {
      headers : {
        "Content-Type" : "application/json",
        "authorization" : credential
      },
      data: jsonData
    });
  },
});
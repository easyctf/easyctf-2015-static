// Generated by CoffeeScript 1.10.0
(function() {
  this.forgot_password = function() {
    var disable;
    disable = "#forgot_password_form input, #forgot_password_form .btn";
    $(disable).attr("disabled", "disabled");
    return api_call("POST", "/api/password_recovery/forgot", {
      "email": $("#email").val()
    }).done(function(result) {
      if (result["success"] === 1) {
        return display_message("#forgot_msg", "success", result.message, function() {
          return location.href = "/login";
        });
      } else {
        $(disable).removeAttr("disabled");
        return display_message("#forgot_msg", "danger", result.message);
      }
    });
  };

  this.reset_password = function() {
    var disable;
    disable = "#reset_password_form input, #reset_password_form .btn";
    $(disable).attr("disabled", "disabled");
    return api_call("POST", "/api/password_recovery/reset", {
      "code": $("#code").val(),
      "password": $("#password").val(),
      "confirm": $("#confirm").val()
    }).done(function(result) {
      if (result["success"] === 1) {
        return display_message("#reset_msg", "success", result.message, function() {
          return location.href = "/login";
        });
      } else {
        $(disable).removeAttr("disabled");
        return display_message("#reset_msg", "danger", result.message);
      }
    });
  };

  $(function() {
    return $("#code").val(location.hash.replace("#", ""));
  });

}).call(this);
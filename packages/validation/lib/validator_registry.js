ET.validatorRegistry = {
  required: {
    isValid: function(value) {
      if (value) {
        return true;
      } else {
        return false;
      }
    },
    message: "This field cannot be blank"
  },
  email: {
    isValid: function(value) {
      if (value && value.match(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)) {
        return true;
      } else {
        return false;
      }
    },
    message: "A valid email is required"
  }
};
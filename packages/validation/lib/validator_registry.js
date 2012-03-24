ET.validatorRegistry = Ember.Object.create({

  byKey: function(key, options) {

    var validator = this.get('validators')[key];
    if (!validator) {
      console.error("There is no validator registered under the key '" + key + "'. Double check the name in the validator registry.");
    }

    if(options) {
      return validator.create(options);
    } else {
      return validator;
    }
  },


  validators: {
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
    },

    maxLength: Ember.Object.extend({
      max: null,
      constraintString: null,
      init: function() {
        var max, constraintString;
        this._super();
        max = this.get('max');
        if(max == null) {
          constraintString = this.get('constraintString');
          if(constraintString) {
            this.set('max', Number(constraintString));
          } else {
            console.error("You must supply a 'max' value for the maxLength validator");
          }
        }
      },

      isValid: function(value) {
        return String(value).length <= his.get('max');
      },
      message: function() {
        return "Cannot be longer than " + this.get('max') + " characters";
      }
    }),

    minLength: Ember.Object.extend({
      min: null,
      constraintString: null,
      init: function() {
        var min, constraintString;
        this._super();
        min = this.get('min');
        if(min == null) {
          constraintString = this.get('constraintString');
          if(constraintString) {
            this.set('min', Number(constraintString));
          } else {
            console.error("You must supply a 'min' value for the minLength validator");
          }
        }
      },

      isValid: function(value) {
        return String(value).length >= this.get('min');
      },
      message: function() {
        return "Cannot be less than " + this.get('min') + " characters";
      }
    }),

    numberRange: Ember.Object.extend({
      min: null,
      max: null,
      constraintString: null,
      init: function() {
        var min, constraintString, range;
        this._super();
        min = this.get('min');
        max = this.get('max');
        if(min == null && max == null) {
          constraintString = this.get('constraintString');
          if(constraintString) {
            range = constraintString.split("..");
            if(range.length != 2) {
              console.error("Range validators must be supplied with a min and a max in the format '1..100'")
            }
            this.set('min', Number(range[0]));
            this.set('max', Number(range[1]));
          } else {
            console.error("You must supply a 'min' value for the minLength validator");
          }
        }
      },

      isValid: function(value) {
        if(isNaN(value)) {
          return false;
        }
        return value >= this.get('min') && value <= this.get('max');
      },
      message: function() {
        return "Must be a number between " + this.get('min') + " and " + this.get('max');
      }
    }),

  }

});

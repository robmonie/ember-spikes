/**
* Holds a registry of validators available keyed by validator name.
* Validators can be added or retrieved from the registry.
*
*/
ET.validatorRegistry = Ember.Object.create({

  validators: {},

  /**
  * Retrives an instance of a validator by key. Validators that require options will be returned as a new instance based on those
  * options. Validators that have no state will be returned as a singleton instance and shared.
  */
  byKey: function(key, options) {

    var validator = this.get('validators')[key];
    if (!validator) {
      console.error("There is no validator registered under the key '" + key + "'. Double check the name in the validator registry.");
    }

    if(options) {
      if(!validator.create) {
        console.error("Validators that support options must extend Ember.Object so that an instance can be initialised for each use.")
      }
      return validator.create(options);
    } else {
      return validator;
    }
  },

  /**
  * Add a validator by key. A validator must conform to the following interface:
  *
  * isValid(value): return true if valid, false if not
  * message: string or function that returns a string which is the message to display on validation failure
  *
  * Validators that require state in order to operate (Ie. maxLength), should be instances of Em.Object and provide
  * a format for parsing when declared inline using the format validatorKey(contraints). See maxLength, numberRange or other
  * validators for an example.
  *
  */
  addValidator: function(key, validator) {
    var validators = this.get('validators');
    if(validators[key]) {
      console.error('A validator already exists for the key ' + key);
    } else {
      validators[key] = validator;
    }
  }
});



ET.validatorRegistry.addValidator('required', {
  isValid: function(value) {
    if (value) {
      return true;
    } else {
      return false;
    }
  },
  message: "This field cannot be blank"
});

/**
* Validates that a value looks like an email address.
*/
ET.validatorRegistry.addValidator('email', {
    isValid: function(value) {
      if (value && value.match(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)) {
        return true;
      } else {
        return false;
      }
    },
    message: "A valid email is required"
  }
);

/**
* Validates the max length of a string.
* If creating directly, instantiate with:
* @property max
*
* If creating declaratively, the format is:
* maxLength(x)
*
*/
ET.validatorRegistry.addValidator('maxLength', Ember.Object.extend({
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
    return String(value).length <= this.get('max');
  },
  message: function() {
    return "Cannot be longer than " + this.get('max') + " characters";
  }
}));


/**
* Validates the min length of a string.
* If creating directly, instantiate with:
* @property min
*
* If creating declaratively, the format is:
* minLength(x)
*
*/
ET.validatorRegistry.addValidator('minLength', Ember.Object.extend({
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
}));

/**
* Validates that a value falls within a number range.
* If creating directly, instantiate with:
* @property min
* @property max
*
* If creating declaratively, the format is:
* numberRange(x..y)
*
*/
ET.validatorRegistry.addValidator('numberRange', Ember.Object.extend({
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
}));

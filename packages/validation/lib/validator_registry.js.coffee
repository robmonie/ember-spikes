ET.validatorRegistry =

  required:
    isValid: (value) ->
      if value then true else false
    message: "This field cannot be blank"

  email:
    isValid: (value) ->
      if value && value.match(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/) then true else false
    message: "A valid email is required"

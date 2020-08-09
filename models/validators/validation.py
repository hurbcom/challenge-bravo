from datetime import datetime


class Validator(object):
    def validate_type(self, element, desired_type):
        if desired_type == "int":
            return type(element) == int
        if desired_type == "string":
            return type(element) == str
        if desired_type == "datetime":
            return isinstance(element, datetime)
        if desired_type == "float":
            return type(element) == float
        if type(desired_type) == list:
            return (element in desired_type)
        raise ValueError("Invalid value for desired type")

    def validateTypes(self, element, fields):
        for field in fields:
            if field in element:
                if not self.validate_type(element[field], fields[field]):
                    return False
            return True

    def validate(self, element, fields, required_fields, optional_fields):
        if not self.validateTypes(element, fields):
            raise ValueError("Invalid type of field")

        element_fields  = set(element.keys())
        required_fields = set(required_fields)
        optional_fields = set(optional_fields)


        if len(required_fields - element_fields) > 0:
            raise ValueError("Required field missing")

        if len(element_fields - (required_fields | optional_fields)) > 0:
            raise ValueError("Invalid field in element")
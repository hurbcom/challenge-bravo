import restifyErrors from 'restify-errors';
import validator from 'validator';

function parameterValidationFilter(model, req, res, next) {
	return function(req, res, next) {
		let parsedParameters = {};
		let error = validate(model.query, req.query, parsedParameters);

		req.parsedParameters = parsedParameters;
		return next(error);
	}
}

function validate(model, actual, parsedParameters) {
	for (let key in model) {
		let actualValue = actual[key];
		if (model[key].isRequired && actualValue === undefined) {
			return new restifyErrors.BadRequestError(`Parameter '${key}' is required`);
		}

		for (let rule in model[key]) {
			if (validator[rule]) {
				let ruleOptions = model[key][rule];
				let isRuleValid = validator[rule](actualValue, ruleOptions);
				if (!isRuleValid) return new restifyErrors.BadRequestError(`Parameter '${key}' is invalid`);
			}
		}

		let parsedValue = actualValue;
		if(model[key].type) {
			parsedValue = parseParameter(model[key].type, actualValue);
		}
		parsedParameters[key] = parsedValue;
	}
}

function parseParameter(typeStr, value) {
	let type = typeStr.toLowerCase();
	if (!validator.isIn(type, ['number', 'int', 'bool', 'date', 'string'])) throw new Error (`Unsupported type '${type}'`);

	switch(type){
		case 'number':
			return Number(value);
		case 'int':
			return parseInt(value);
		case 'bool':
			return value === 'true';
		case 'date':
			return new Date(value);
		case 'string': default:
			return value;
	}
}

export default parameterValidationFilter;
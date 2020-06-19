import restifyErrors from 'restify-errors';
import validator from 'validator';

/**
 * This filter validates the request's parameters based on the provided model.
 * It must be chained BEFORE the actual handler of the request.
 * It automatically parses the parameters to the appropriate type, and updates 
 * the requests, adding the parsed parameters (and body) so it can be used in the
 * next handlers in the chain.
 * When a required parameter is not present or when a parameter does not pass all validation
 * rules described in the model, an restifyErrors.BadRequestError is launched.
 * 
 * @param {*} model the validation model describing the request parameters
 * @param {*} req the request
 * @param {*} res the response
 * @param {*} next the next handler in the chain
 */

function parameterValidationFilter(model, req, res, next) {
	return function(req, res, next) {
		let parsedParameters = {};
		let parsedBody = {};
		let error;
		if (model.params)
			error = validate(model.params, req.params, parsedParameters);
		if (!error && model.body)
			error = validate(model.body, req.body, parsedBody);

		req.parsedParams = parsedParameters;
		req.parsedBody = parsedBody;
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
			try {
				parsedValue = parseParameter(model[key].type, actualValue);
			} catch(e) {
				return new restifyErrors.BadRequestError(`Value of parameter '${key}' is invalid`, e);
			}
		}
		parsedParameters[key] = parsedValue;
	}
}

function parseParameter(typeStr, value) {
	let type = typeStr.toLowerCase();
	if (!validator.isIn(type, ['number', 'int', 'bool', 'date', 'string'])) throw new Error (`Unsupported type '${type}'`);

	let result;
	switch(type){
		case 'number':
			result = Number(value);
		case 'int':
			result = parseInt(value);
			if (isNaN(result)) throw new Error('Unable to convert to int');
		case 'bool':
			result = value === 'true';
		case 'date':
			result = new Date(value);
		case 'string': default:
			result = value;
	}

	return result;
}

export default parameterValidationFilter;
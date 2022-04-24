const ValidationError = require('./validationError');

class PropertyRequiredError extends ValidationError {
	constructor(property) {
		super(property + ' required');
		this.property = property;
	}
}

module.exports = PropertyRequiredError;

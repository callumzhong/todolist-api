// 由建構子定義 name
class BaseError extends Error {
	constructor(message) {
		super(message);
		this.name = this.constructor.name;
	}
}
class ValidationError extends BaseError {}

module.exports = ValidationError;

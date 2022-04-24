const HEADERS = require('../constants/headers');
const PropertyRequiredError = require('../exception/propertyRequiredError');
const ValidationError = require('../exception/validationError');

const ErrorHandler = ({ res, error }) => {
	if (error instanceof PropertyRequiredError) {
		res.writeHead(422, HEADERS);
		res.write(
			JSON.stringify({
				status: 'ERROR',
				message: `property: ${error.message}`,
			}),
		);
		res.end();
		return;
	}
	if (error instanceof SyntaxError) {
		res.writeHead(400, HEADERS);
		res.write(
			JSON.stringify({
				status: 'ERROR',
				message: 'syntax: JSON parse error',
			}),
		);
		res.end();
		return;
	}

	if (error instanceof ValidationError) {
		res.writeHead(400, HEADERS);
		res.write(
			JSON.stringify({
				status: 'ERROR',
				message: 'error: ' + error.message,
			}),
		);
		res.end();
		return;
	}
	// 程式設計以外的錯誤 (無法預知 bug)
	res.writeHead(400, HEADERS);
	res.write(
		JSON.stringify({
			status: 'ERROR',
			message: `alert: ${error.message}`,
		}),
	);
	res.end();
	return;
};

module.exports = ErrorHandler;

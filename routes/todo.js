const { default: HEADERS } = require('../constants/headers');
const PropertyRequiredError = require('../exception/propertyRequiredError');
const ValidationError = require('../exception/validationError');
const ErrorHandler = require('../helpers/errorHandler');
const response = require('../helpers/response');
const uuid = require('uuid');

const validatorBody = (body) => {
	const title = JSON.parse(body)?.title ?? false;
	if (!title) {
		throw new PropertyRequiredError('title');
	}
	if (title.trim().length === 0) {
		throw new ValidationError('title 不能是空白');
	}
	return title;
};

const searchDataIndex = ({ req, data: todos }) => {
	const id = req.url.split('/').pop();
	const idx = todos.findIndex((todo) => todo.id === id);
	if (idx === -1) {
		throw new ValidationError('查無此 ID 待辦事項');
	}
	return idx;
};

const todoRoute = ({ req, res, data: todos }) => {
	let body = '';
	req.on('data', (chunk) => {
		body += chunk;
	});
	if (req.method === 'OPTIONS') {
		res.writeHead(200, HEADERS);
		res.end();
	}
	if (req.url === '/todos' && req.method === 'GET') {
		response.success({
			res,
			status: 200,
			data: todos,
		});
		return;
	}
	if (req.url.startsWith('/todos/') && req.method === 'GET') {
		try {
			response.success({
				res,
				status: 200,
				data: todos[searchDataIndex({ req, data: todos })],
			});
		} catch (error) {
			ErrorHandler({ res, error });
		}
		return;
	}
	if (req.url === '/todos' && req.method === 'POST') {
		req.on('end', () => {
			try {
				const todo = {
					id: uuid.v4(),
					title: validatorBody(body),
				};
				todos.push(todo);
				response.success({
					res,
					data: todos,
					status: 201,
				});
			} catch (error) {
				ErrorHandler({ res, error });
			}
		});
		return;
	}
	if (req.url.startsWith('/todos/') && req.method === 'PATCH') {
		req.on('end', () => {
			try {
				const todo =
					todos[
						searchDataIndex({
							req,
							data: todos,
						})
					];
				const title = validatorBody(body);
				todo.title = title;
				response.success({
					res,
					status: 200,
					data: todos,
				});
			} catch (error) {
				ErrorHandler({ res, error });
			}
		});
		return;
	}
	if (req.url === '/todos' && req.method === 'DELETE') {
		todos.length = 0;
		response.success({
			res,
			data: todos,
			status: 200,
		});
		return;
	}
	if (req.url.startsWith('/todos/') && req.method === 'DELETE') {
		try {
			const idx = searchDataIndex({
				req,
				data: todos,
			});
			todos.splice(idx, 1);
			response.success({
				res,
				data: todos,
				status: 200,
			});
		} catch (error) {
			ErrorHandler({ res, error });
		}
		return;
	}
};

module.exports = todoRoute;

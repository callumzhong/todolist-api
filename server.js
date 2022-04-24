const http = require('http');
const response = require('./helpers/response');
const todoRoute = require('./routes/todo');
const PORT = 3005;
const todos = [];
const listener = (req, res) => {
	const isNotFound = todoRoute({ req, res, data: todos });
	if (isNotFound) {
		response.error({ res, status: 404, message: '查無此網站路由' });
	}
};
const server = http.createServer(listener);
server.listen(PORT, () => {
	console.log(`server listening on ${PORT}`);
});

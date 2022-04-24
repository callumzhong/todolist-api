const http = require('http');
const todoRoute = require('./routes/todo');
const PORT = 3005;
const todos = [];
const listener = (req, res) => {
	todoRoute({ req, res, data: todos });
};
const server = http.createServer(listener);
server.listen(PORT, () => {
	console.log(`server listening on ${PORT}`);
});

import jsonServer from 'json-server';
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser); // <-- this is the fix!

server.use(router);

server.listen(5000, () => {
  console.log('JSON Server running at 5000');
});

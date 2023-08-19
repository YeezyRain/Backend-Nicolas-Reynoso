const app = require("./app.js")

const httpServer = require("http").createServer(app)

const socketIo = require("./socket")

const io = socketIo(httpServer);
const { port } = require("./config/app.config");

app.locals.io = io;

httpServer.listen(port, () => {
  console.log(`server running at port ${port}`);
});
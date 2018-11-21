require("dotenv").config();
const args = process.argv.slice(2);
const repository = require("./repository");
const mqServer = require("./mq-server");
const socketsServer = require("./sockets-server");

switch (args[0]) {
  case "mq":
    repository.connect(() => {
      mqServer.startMqConsumer("issues", message => {
        repository.importData(message);
      });
    });
    break;

  case "sockets":
    repository.connect(() => {
      socketsServer.startTcpServer(3000, message => {
        repository.importData(message);
      });
    });
    break;
}

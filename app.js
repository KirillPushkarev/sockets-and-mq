require("dotenv").config();
console.log(process.env.MY_SQL_HOST);

const args = process.argv.slice(2);
const net = require("net");
const crypto = require("crypto");
const NodeRSA = require("node-rsa");
const repository = require("./repository");
const importData = repository.importData;
const consumer = require("./consumer");

const rsaKey = new NodeRSA();
rsaKey.generateKeyPair();
const publicKey = rsaKey.exportKey("public");
let symmKey = null;

switch (args[0]) {
  case "mq":
    repository.connect(() => {
      consumer.start(message => {
        importData(JSON.parse(message.content.toString()));
      });
    });
    break;

  case "sockets":
    repository.connect(() => {
      const server = net
        .createServer(socket => {
          console.log("Client connected");
          const message = {
            type: "PUBLIC_KEY",
            payload: publicKey
          };
          socket.write(new Buffer(JSON.stringify(message)));
          console.log("Sent public key: " + publicKey);

          socket.on("data", data => {
            const message = JSON.parse(data.toString());

            switch (message.type) {
              case "SYMM_KEY":
                console.log("Received symmetric encryption key: " + message.payload);
                symmKey = rsaKey.decrypt(new Buffer(message.payload));
                break;
              case "DATA":
                const decipher = crypto.createDecipher("aes192", symmKey);
                let decryptedData = decipher.update(message.payload, "hex", "utf8");
                decryptedData += decipher.final("utf8");
                console.log("Received data for import: " + decryptedData.toString());
                repository.importData(JSON.parse(decryptedData.toString()));
                break;
            }
          });

          socket.on("error", err => {
            console.log(err.message);
          });
        })
        .listen(3000);
    });
    break;
}

const net = require("net");
const crypto = require("crypto");
const NodeRSA = require("node-rsa");

function start(port, processMessage) {
  const rsaKey = new NodeRSA();
  rsaKey.generateKeyPair();
  const publicKey = rsaKey.exportKey("public");
  let symmKey = null;

  return net
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
            processMessage(JSON.parse(decryptedData.toString()));
            break;
        }
      });

      socket.on("error", err => {
        console.log(err.message);
      });
    })
    .listen(port);
}

module.exports.startTcpServer = start;

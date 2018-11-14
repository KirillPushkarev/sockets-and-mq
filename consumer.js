var amqp = require("amqplib/callback_api");

var amqpConn = null;
function start(processMessage) {
  amqp.connect(
    process.env.CLOUDAMQP_URL + "?heartbeat=60",
    function(err, conn) {
      if (err) {
        console.error("[AMQP]", err.message);
        return;
      }
      console.log("[AMQP] connected");
      amqpConn = conn;
      startConsumer(processMessage);
    }
  );
}

function startConsumer(processMessage) {
  amqpConn.createChannel(function(err, ch) {
    if (err) {
      console.error("[AMQP] error", err);
      amqpConn.close();
      return;
    }
    console.log("[AMQP] consumer channel created");

    ch.assertQueue("issues", { durable: true }, function(err, ok) {
      ch.consume(
        "issues",
        function(message) {
          processMessage(message);
          ch.ack(message);
          console.log("Message consumed: " + message.content.toString());
        },
        { noAck: false }
      );
    });
  });
}

module.exports.start = start;

const amqp = require("amqplib/callback_api");

let amqpConnection = null;
function start(queue, processMessage) {
  amqp.connect(
    process.env.CLOUDAMQP_URL + "?heartbeat=60",
    function(err, conn) {
      if (err) {
        console.error("[AMQP]", err.message);
        return;
      }
      console.log("[AMQP] connected");
      amqpConnection = conn;
      startConsumer(queue, processMessage);
    }
  );
}

function startConsumer(queue, processMessage) {
  amqpConnection.createChannel(function(err, channel) {
    if (err) {
      console.error("[AMQP] error", err);
      amqpConnection.close();
      return;
    }
    console.log("[AMQP] consumer channel created");

    channel.assertQueue(queue, { durable: true }, function(err, ok) {
      channel.consume(
        queue,
        function(message) {
          processMessage(JSON.parse(message.content.toString()));
          channel.ack(message);
          console.log("Message consumed: " + message.content.toString());
        },
        { noAck: false }
      );
    });
  });
}

module.exports.startMqConsumer = start;

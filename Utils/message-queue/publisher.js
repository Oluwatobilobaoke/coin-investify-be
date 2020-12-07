const amqplib = require('amqplib/callback_api');
const debug = require('debug')('coin-investify:MessageQueue');

const publishMessage = (data) => {
  // Create connection to AMQP server
  amqplib.connect(process.env.COIN_INVESTIFY_RABBITMQ_AMPQ, (err, connection) => {
    if (err) {
      debug(err.stack);
      return process.exit(1);
    }

    // Create channel
    connection.createChannel((connectionErr, channel) => {
      if (connectionErr) {
        debug(err.stack);
        return process.exit(1);
      }

      // Ensure queue for messages
      channel.assertQueue(process.env.COIN_INVESTIFY_RABBITMQ_QUEUE, {
        // Ensure that the queue is not deleted when server restarts
        durable: true,
      }, queueAssertErr => {
        if (queueAssertErr) {
          debug(err.stack);
          return process.exit(1);
        }

        // Create a function to send objects to the queue
        // Javascript object is converted to JSON and then into a Buffer
        const sender = (content) => {

          /**
           * return from this can be stored in a variable called sent
           * and can be used for logging
           * e.g
           * if (sent) logger(`message published at ${Date.now()}`);
           */
          channel.sendToQueue(process.env.COIN_INVESTIFY_RABBITMQ_QUEUE,
            Buffer.from(JSON.stringify(content)), {
              // Store queued elements on disk
              persistent: true,
              contentType: 'application/json',
            },
          );
        };
        const sendNext = () => {
          sender(data);
        };
        sendNext();
        return true;
      });
      return true;
    });
    return true;
  });
};

module.exports.publishMessage = publishMessage;

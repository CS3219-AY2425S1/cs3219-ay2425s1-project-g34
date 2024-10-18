const amqp = require('amqplib');

let waitingUsers = []; 

async function findMatch(user, channel, msg) {
    const { difficulty, topic, language, username } = user;

    const matchIndex = waitingUsers.findIndex((waitingUser) =>
        waitingUser.difficulty === difficulty &&
        waitingUser.topic === topic &&
        waitingUser.language === language
    );

    if (matchIndex !== -1) {
        const matchedUser = waitingUsers[matchIndex];
        console.log(`Matched users: ${username} and ${matchedUser.username}`);
        
        // Remove matched users from waiting list
        waitingUsers.splice(matchIndex, 1);

        // Send match notification back to both users
        const matchNotification = JSON.stringify({
            status: 'matched',
            matchedWith: matchedUser.username
        });
        channel.sendToQueue(msg.properties.replyTo, Buffer.from(matchNotification), {
            correlationId: msg.properties.correlationId
        });

        return true;
    }

    // No match found, add user to waiting list
    waitingUsers.push(user);
    console.log(`User ${user.username} added to waiting list.`);

    setTimeout(() => {
        const userIndex = waitingUsers.findIndex(waitingUser => waitingUser.username === username);
        if (userIndex !== -1) {
            waitingUsers.splice(userIndex, 1);
            console.log(`Time's up! User ${username} removed from the waiting list`);

            // Notify the frontend that the time is up
            const timeoutNotification = JSON.stringify({
                status: 'timeout',
                message: `No match found for ${username} within the time limit.`
            });
            channel.sendToQueue(msg.properties.replyTo, Buffer.from(timeoutNotification), {
                correlationId: msg.properties.correlationId
            });
        }
    }, 30000);

    return false; // Return false if no match was found
}

async function startConsumer() {
    try {
        const connection = await amqp.connect('amqp://rabbitmq:5672');
        const channel = await connection.createChannel();
        const queue = 'matching-queue';

        await channel.assertQueue(queue, { durable: true });
        console.log('Waiting for messages in %s. To exit press CTRL+C', queue);

        channel.consume(queue, (msg) => {
            if (msg !== null) {
                const matchData = JSON.parse(msg.content.toString());
                findMatch(matchData, channel, msg);
                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error('Error in consumer:', error);
    }
}

module.exports = startConsumer;

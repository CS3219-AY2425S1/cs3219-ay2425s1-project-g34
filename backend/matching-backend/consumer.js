const amqp = require('amqplib');

let waitingUsers = []; 

async function findMatch(user, notifyMatch) {
    const { difficulty, topic, language } = user;

    // Log queue status before attempting to find a match
    console.log(`Queue before match attempt: ${waitingUsers.length} users waiting`);


    const matchIndex = waitingUsers.findIndex((waitingUser) =>
        waitingUser.difficulty === difficulty &&
        waitingUser.topic === topic &&
        waitingUser.language === language
    );

    if (matchIndex !== -1) {
        // Found a match
        const matchedUser = waitingUsers[matchIndex];
        console.log(`Matched users: ${user.username} and ${matchedUser.username}`);
        
        // Clear the timeout for the current user if it exists
        if (user.timeoutId) {
            clearTimeout(user.timeoutId);
        }

        // Clear the timeout for the matched user if it exists
        if (matchedUser.timeoutId) {
            clearTimeout(matchedUser.timeoutId);
        }

        // Remove matched users from waiting list
        waitingUsers.splice(matchIndex, 1);
        notifyMatch(user, matchedUser);

        // Log queue status after the match is found
        console.log(`Queue after match: ${waitingUsers.length} users waiting`);

        return true;
    }

    // No match found, add user to waiting list
    user.timeoutId = setTimeout(() => {
        const userIndex = waitingUsers.findIndex(waitingUser => waitingUser.username === user.username);
        if (userIndex !== -1) {
            waitingUsers.splice(userIndex, 1);
            console.log(`Time's up! User ${user.username} removed from the waiting list`);

            // Log queue status after timeout
            console.log(`Queue after removing user due to timeout: ${waitingUsers.length} users waiting`);
        }
    }, 30000);
    
    waitingUsers.push(user);
    console.log(`User ${user.username} added to waiting list.`);

    // Log queue status after adding the user
    console.log(`Queue after adding user: ${waitingUsers.length} users waiting`);


    return false; // Return false if no match was found
}

async function startConsumer(channel, notifyMatch) {
    try {
        const connection = await amqp.connect('amqp://rabbitmq:5672');
        const channel = await connection.createChannel();
        const queue = 'matching-queue';
        const cancelQueue = 'cancel-queue';

        await channel.assertQueue(queue, { durable: true });
        await channel.assertQueue(cancelQueue, { durable: true });

        console.log('Waiting for messages in %s. To exit press CTRL+C', queue);

        // Consumer for matching queue
        channel.consume(queue, (msg) => {
            if (msg !== null) {
                const matchData = JSON.parse(msg.content.toString());
                findMatch(matchData, notifyMatch);
                channel.ack(msg);
            }
        });

        // Consumer for cancel queue
        channel.consume(cancelQueue, (msg) => {
            if (msg !== null) {
            const cancelData = JSON.parse(msg.content.toString());
            const { username } = cancelData;
            cancelUser(username);
            channel.ack(msg);
            }
        });

    } catch (error) {
        console.error('Error in consumer:', error);
    }
}

function cancelUser(username) {
    const userIndex = waitingUsers.findIndex(user => user.username === username);
    if (userIndex !== -1) {
        waitingUsers.splice(userIndex, 1); // Remove the user from the queue
        console.log(`User ${username} cancelled and removed from waiting list`);
    } else {
        console.log(`User ${username} not found in waiting list`);
    }
}

module.exports = startConsumer;

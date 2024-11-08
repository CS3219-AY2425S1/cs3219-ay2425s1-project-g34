require('dotenv').config();

const { OpenAI } = require('openai');
const { addContinueVote } = require('./sessionManager');
const { addUserToRoom, removeUserFromRoom, getRoomUserCount, cleanupRoom } = require('./roomManager');

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Make sure your OpenAI key is set
});

function handleSocketEvents(io) {
    const disconnectTimeouts = new Map(); // Store timeout references for each user
    const chatHistories = new Map(); // Temporary in-memory storage for chat histories per room
    const botChatHistories = new Map();

    io.on('connection', (socket) => {
        console.log('Socket.IO client connected');

        // Store the username when the user is added
        socket.on('add-user', (username) => {
            console.log(`${username} joined`);
            socket.username = username;

             // Clear any existing disconnect timeout for this user if they reconnect quickly
            if (disconnectTimeouts.has(username)) {
                clearTimeout(disconnectTimeouts.get(username));
                disconnectTimeouts.delete(username);
            }
        });

        // Join a specific room and store roomId on socket instance
        socket.on('join-room', (roomId) => {
            socket.roomId = roomId;
            socket.join(roomId);
            addUserToRoom(roomId, socket.username);
            console.log(socket.username + ' joined room: ' + roomId);

            // Initialize chat history for this room if not already initialized
            if (!chatHistories.has(roomId)) {
                chatHistories.set(roomId, []);
            }

            if (!botChatHistories.has(roomId)) {
                botChatHistories.set(roomId, []);
            }

            // Send existing chat history to the new user
            socket.emit('chat-history', chatHistories.get(roomId));
            
            // Check if both users have joined
            if (getRoomUserCount(roomId) === 2) {
                io.to(roomId).emit('start-timer');
            }
        });
        
        // Handle chat messages
        socket.on('chat-message', (messageContent) => {
            const roomId = socket.roomId;
            const username = socket.username;

            if (!roomId || !username) return;

            const message = {
                username: username,
                content: messageContent
            };

            // Save message in chat history
            chatHistories.get(roomId).push(message);

            // Broadcast message to other users in the room
            io.to(roomId).emit('chat-message', message);
        });

        // Handle chatbot messages
        socket.on('bot-chat-message', async (messageContent) => {

            const roomId = socket.roomId;
            const username = socket.username;

            if (!roomId || !username) return;

            const userMessage = {
                username: username,
                content: String(messageContent),
            };

            // Call OpenAI API to get the chatbot's response
            try {
                const response = await openai.chat.completions.create({
                    model: 'gpt-3.5-turbo', // Or use whichever model you prefer, e.g., gpt-3.5-turbo
                    messages: [
                        { role: 'system', content: 'You are a helpful assistant.' },
                        { role: 'user', content: messageContent },
                    ],
                });

                const botMessage = {
                    username: 'Chatbot',
                    content: response.choices[0].message.content, // Response from OpenAI
                };

                botChatHistories.get(roomId).push(botMessage.content);
                botChatHistories.get(roomId).push(userMessage);
                // Broadcast the bot's message to other users in the room
                io.to(roomId).emit('bot-chat-message', botMessage);

            } catch (error) {
                console.error('Error fetching OpenAI response:', error);
                const errorMessage = {
                    username: 'Bot (SocketHandler)',
                    content: 'Sorry, I encountered an error while processing your message.',
                };
                io.to(roomId).emit('bot-chat-message', errorMessage);
            }

        });
        
        // Handle disconnection with grace period
        socket.on('disconnect', () => {
            console.log('Socket.IO client disconnected');
            if (socket.username && socket.roomId) {
                // Start grace period for reconnection
                const timeoutId = setTimeout(() => {
                    console.log(`${socket.username} left room ${socket.roomId} permanently`);
                    socket.to(socket.roomId).emit('user-left'); // Emit only to the specific room

                    // Remove user from room and check if room is empty
                    const roomIsEmpty = removeUserFromRoom(socket.roomId, socket.username);
                    disconnectTimeouts.delete(socket.username);

                    // If room is empty, clean up the room
                    if (roomIsEmpty) {
                        cleanupRoom(socket.roomId);
                        chatHistories.delete(socket.roomId);
                        botChatHistories.delete(socket.roomId);
                    }
                    
                }, 10000); // 10 seconds grace period
    
                disconnectTimeouts.set(socket.username, timeoutId);
            }
        });

        // Clear grace period timeout if user reconnects
        socket.on('reconnect', () => {
            const timeoutId = disconnectTimeouts.get(socket.username);
            if (timeoutId) clearTimeout(timeoutId);
        });

        // Listen for continue-session from client
        socket.on('continue-session', (roomId) => {
            addContinueVote(roomId, socket.username, io);
        });
    });
}

module.exports = handleSocketEvents;

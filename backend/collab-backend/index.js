require('dotenv').config();
const { OpenAI } = require('openai');

const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const WebSocket = require('ws');
const setupWSConnection = require('y-websocket/bin/utils').setupWSConnection;
const handleSocketEvents = require('./socketHandlers');

const app = express();
app.use(cors());
app.use(express.json());

// Port configurations
const socketIoPort = 8200;
const yjsPort = 8201;

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is set in .env
});

// Example: Defining a POST route at /chat
app.post('/chat', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',  // Adjust model name if necessary
            messages: [{ role: 'user', content: message }],
        });

        const chatbotReply = response.choices[0].message.content;
        res.json({ reply: chatbotReply });

    } catch (error) {
        console.error('OpenAI API Error:', error);  // Log the error details

        // Respond with a more detailed error message if needed
        res.status(500).json({
            error: 'An error occurred while processing your request',
            details: error.message  // Include error details for more insight
        });
    }
});

// Server setup for Socket.IO on port 8200
const ioServer = createServer(app);
const io = new Server(ioServer, {
    path: "/socket.io",
    cors: { origin: 'http://localhost:3000' },
});

handleSocketEvents(io);

ioServer.listen(socketIoPort, () => {
    console.log(`Socket.IO server listening at http://localhost:${socketIoPort}`);
});

// Server setup for y-websocket on port 8201
const yjsServer = createServer(app);
const wss = new WebSocket.Server({ noServer: true });

yjsServer.on('upgrade', (request, socket, head) => {
    if (request.url.startsWith('/yjs')) {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
});

wss.on('connection', (ws, req) => {
    console.log("WebSocket client connected for y-websocket");
    setupWSConnection(ws, req);
});

yjsServer.listen(yjsPort, () => {
    console.log(`y-websocket server listening at http://localhost:${yjsPort}`);
});
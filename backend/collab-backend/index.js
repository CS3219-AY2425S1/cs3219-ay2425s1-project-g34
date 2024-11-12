const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createServer } = require('http');
const { Server } = require('socket.io');
const WebSocket = require('ws');
const setupWSConnection = require('y-websocket/bin/utils').setupWSConnection;
const handleSocketEvents = require('./socketHandlers');

dotenv.config();

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Port configurations
const { SOCKET_IO_PORT, YJS_PORT } = process.env;

// Server setup for Socket.IO
const ioServer = createServer(app);
const io = new Server(ioServer, {
    path: "/socket.io",
    cors: { origin: 'http://localhost:3000' },
});

handleSocketEvents(io);

ioServer.listen(SOCKET_IO_PORT, () => {
    console.log(`Socket.IO server listening at http://localhost:${SOCKET_IO_PORT}`);
});

// Server setup for y-websocket
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

yjsServer.listen(YJS_PORT, () => {
    console.log(`y-websocket server listening at http://localhost:${YJS_PORT}`);
});
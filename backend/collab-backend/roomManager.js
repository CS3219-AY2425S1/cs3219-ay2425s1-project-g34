const roomUsers = new Map();

function addUserToRoom(roomId, username) {
    if (!roomUsers.has(roomId)) {
        roomUsers.set(roomId, new Set());
    }
    roomUsers.get(roomId).add(username);
}

function removeUserFromRoom(roomId, username) {
    const room = roomUsers.get(roomId);
    if (room) {
        room.delete(username);

        // Cleanup if no users are left in the room
        if (room.size === 0) {
            roomUsers.delete(roomId);
            return true; // Indicates room is empty
        }
    }
    return false;
}

function getRoomUserCount(roomId) {
    const room = roomUsers.get(roomId);
    return room ? room.size : 0;
}

function cleanupRoom(roomId) {
    roomUsers.delete(roomId);
}

module.exports = {
    addUserToRoom,
    removeUserFromRoom,
    getRoomUserCount,
    cleanupRoom
};

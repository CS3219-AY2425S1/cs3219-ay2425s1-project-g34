const continueSessionVotes = new Map();

function addContinueVote(roomId, username, io) {
    if (!continueSessionVotes.has(roomId)) {
        continueSessionVotes.set(roomId, new Set());
    }

    // Add the user's vote
    continueSessionVotes.get(roomId).add(username);

    // Check if both users have voted to continue
    if (continueSessionVotes.get(roomId).size === 2) {
        io.to(roomId).emit('start-timer'); // Emit event to start the timer
        continueSessionVotes.delete(roomId); // Reset for future sessions
    }
}

function resetContinueVotes(roomId) {
    continueSessionVotes.delete(roomId); // Clean up when session ends
}

module.exports = {
    addContinueVote,
    resetContinueVotes,
};

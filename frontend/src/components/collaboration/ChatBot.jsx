import React, { useState, useEffect, useRef } from "react";

const ChatBot = ({ socket, username, messages}) => {
    const [message, setMessage] = useState("");
    const chatEndRef = useRef(null);

    // Scroll to the bottom of the chat on new messages or replies
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        const messageContent = String(message).trim(); // Convert message to string and trim whitespace
    
        if (messageContent) {
            // Send message to the server
            socket.emit("bot-chat-message", messageContent);
            console.log("message from the chatbot.jsx: " + messageContent);
            setMessage("");
    
            // Make API call to backend to get chatbot response
            try {
                const response = await fetch("http://localhost:8200/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message: messageContent }), // Always send string
                });
    
            } catch (error) {
                console.error("Error getting response from chatbot:", error);
            }
        }
    };
    

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "30vh" }}>
            <div style={{ flex: 1, overflowY: "auto", padding: "10px", display: "flex", flexDirection: "column" }}>
                {/* Display user and chatbot messages */}
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        style={{
                            alignSelf: msg.username === username ? "flex-end" : "flex-start",
                            wordWrap: "break-word",
                            whiteSpace: "pre-wrap",
                            textAlign: "left",
                            marginBottom: "8px",
                            padding: "10px",
                            borderRadius: "8px",
                            backgroundColor: msg.username === username ? "#DCF8C6" : "#f1f1f1",
                            maxWidth: "80%",
                            color: msg.username === username ? "#000" : "#333",
                        }}
                    >
                        <strong>{msg.username}: </strong>{msg.content}
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>
            <div style={{ borderRadius: "10px", boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)", display: "flex", padding: "10px" }}>
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    style={{ flex: 1, padding: "10px", fontSize: "14px", borderRadius: "10px", border: "1px solid #ddd" }}
                />
                <button onClick={sendMessage} style={{ marginLeft: "10px", padding: "10px" }}>Send</button>
            </div>
        </div>
    );
};

export default ChatBot;

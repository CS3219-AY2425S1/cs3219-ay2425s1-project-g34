import React, { useState, useEffect, useRef } from "react";

const ChatBox = ({ socket, username, messages}) => {
    const [message, setMessage] = useState("");
    const chatEndRef = useRef(null);

    // Scroll to the bottom of the chat on new messages
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        if (message.trim()) {
            // Send message to the server
            socket.emit("chat-message", message);
            setMessage("");
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
                <button onClick={sendMessage} style={{ marginLeft: "10px", marginTop: "0px", alignItems: "center", padding: "10px" }}>Send</button>
            </div>
        </div>
    );
};

export default ChatBox;

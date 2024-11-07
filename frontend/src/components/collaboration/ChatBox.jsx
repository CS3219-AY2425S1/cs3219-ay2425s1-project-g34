import React, { useState, useEffect, useRef } from "react";

const ChatBox = ({ socket, roomId, username }) => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const chatEndRef = useRef(null);

    // Scroll to the bottom of the chat on new messages
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Listen for incoming messages from the server
    useEffect(() => {
        if (!socket) return;
        
        socket.on("chat-message", (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        socket.on("chat-history", (history) => {
            setMessages(history);
        });

        return () => {
            socket.off("chat-message");
            socket.off("chat-history");
        };
    }, [socket]);

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
        <div style={{ display: "flex", flexDirection: "column", height: "100%", borderLeft: "1px solid #ddd"}}>
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
            <div style={{ display: "flex", padding: "10px" }}>
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

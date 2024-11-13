import React, { useRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import io from 'socket.io-client';

import CodeEditor from "../components/collaboration/CodeEditor";
import CollabNavBar from "../components/navbar/CollabNavbar";
import Output from "../components/collaboration/Output";
import QuestionContainer from "../components/collaboration/QuestionContainer";
import QuitConfirmationPopup from "../components/collaboration/QuitConfirmationPopup";
import SubmitPopup from "../components/collaboration/SubmitPopup";
import PartnerQuitPopup from "../components/collaboration/PartnerQuitPopup";
import TimeUpPopup from "../components/collaboration/TimeUpPopup";
import historyService from "../services/history-service";
import ChatBox from "../components/collaboration/ChatBox";
import CustomTabPanel from "../components/collaboration/CustomTabPanel";
import { a11yProps } from "../components/collaboration/CustomTabPanel";
import useAuth from "../hooks/useAuth";


const yjsWsUrl = "ws://localhost:8201/yjs";  // y-websocket now on port 8201
const socketIoUrl = "http://localhost:8200";  // Socket.IO remains on port 8200

const Collab = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { username, userId, cookies } = useAuth();

    const ydoc = useRef(new Y.Doc()).current;
    const editorRef = useRef(null);
    const socketRef = useRef(null);
    const providerRef = useRef(null);
    const intervalRef = useRef(null);
    const attemptStatus = useRef('attempted');

    const peerConnectionRef = useRef(null); // Reference for the peer connection
    const localStreamRef = useRef(null); // Reference for the local media stream
    const remoteAudioRef = useRef(new Audio()); // Audio element to play remote audio
    const [isMicOn, setIsMicOn] = useState(false); // Track the mic status
    const [isMuted, setIsMuted] = useState(false); // Track the remote audio status

    const [countdown, setCountdown] = useState(180); // set to 3 min default timer
    const [timeOver, setTimeOver] = useState(false);

    const [showSubmitPopup, setShowSubmitPopup] = useState(false);
    const [showQuitPopup, setShowQuitPopup] = useState(false);
    const [showPartnerQuitPopup, setShowPartnerQuitPopup] = useState(false);

    const [isSoloSession, setIsSoloSession] = useState(false);
    const [showSnackbar, setShowSnackbar] = useState(false);

    const [tabValue, setTabValue] = useState(0);

    const [messages, setMessages] = useState([]);

    // Ensure location state exists, else redirect to home
    useEffect(() => {
        if (!location.state) {
            navigate("/home");
            return;
        }

        const { roomId } = location.state;

        // Setup socket.io connection
        socketRef.current = io(socketIoUrl);

        // Emit events on connection
        socketRef.current.emit("add-user", username?.toString());
        socketRef.current.emit("join-room", roomId);

        const getMicPermission = async () => {
            try {
                const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                localStreamRef.current = localStream;
                console.log("Microphone permission granted, localStreamRef populated.");
            } catch (error) {
                console.error("Error getting microphone permission:", error);
            }
        };
    
        getMicPermission();

        // Listen for 'start-timer' event to start countdown (used for both new session and continue session)
        socketRef.current.on('start-timer', () => {
            setCountdown(180); // Reset to your desired starting time
            setTimeOver(false);
            startCountdown();
        });

        // Listen for user-left event for the specific room
        socketRef.current.on("user-left", () => {
            setShowPartnerQuitPopup(true);
        });
        
        // Listen for incoming messages and update `messages` state
        socketRef.current.on("chat-message", (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        socketRef.current.on("chat-history", (history) => {
            setMessages(history);
        });

        socketRef.current.on("voice-offer", async ({ offer }) => {
            await handleVoiceOffer(offer);
        });

        socketRef.current.on("voice-answer", async ({ answer }) => {
            if (peerConnectionRef.current) {
                await peerConnectionRef.current.setRemoteDescription(answer);
            }
        });

        socketRef.current.on("voice-candidate", async ({ candidate }) => {
            if (peerConnectionRef.current && candidate) {
                await peerConnectionRef.current.addIceCandidate(candidate);
            }
        });

        // Clean up on component unmount
        return () => {
            if (socketRef.current) {
                socketRef.current.emit("user-left", roomId);
                socketRef.current.disconnect();
            }
            endVoiceChat();
        };
    }, [username, location.state, navigate]);

    // Cleanup function
    useEffect(() => {
        return () => {
            if (providerRef.current) {
                providerRef.current.destroy();
            }
        };
    }, []);

    const startCountdown = () => {
        
        setShowSnackbar(true);

        // Clear any existing interval to avoid multiple intervals running at once
        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            setCountdown((prevCountdown) => {
                if (prevCountdown <= 1) {
                    clearInterval(intervalRef.current);
                    setTimeOver(true);
                }
                return prevCountdown - 1;
            });
        }, 1000);
    };

    // Initialize editor and Yjs 
    const handleEditorDidMount = (editor) => {
        editorRef.current = editor;
        editorRef.current.setValue("");

        const monacoText = ydoc.getText("monaco");
        monacoText.delete(0, monacoText.length);

        providerRef.current = new WebsocketProvider(yjsWsUrl, location.state.roomId, ydoc);
        new MonacoBinding(monacoText, editorRef.current.getModel(), new Set([editorRef.current]));

        providerRef.current.on('status', (event) => {
            console.log(event.status); // logs "connected" or "disconnected"
        });
    };

    const [prevHeight, setPrevHeight] = useState(window.innerHeight);
    useEffect(() => {
        // Debounce function to reduce frequency of layout updates
        const debounce = (func, delay) => {
            let timeout;
            return (...args) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => func(...args), delay);
            };
        };

        const handleResize = debounce(() => {
            const currentHeight = window.innerHeight;
            if (editorRef.current && currentHeight !== prevHeight) {
                editorRef.current.layout();
                setPrevHeight(currentHeight);
            }
        }, 100); // Adjust delay as necessary

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [prevHeight]);

    if (!location.state) { return null; }

    const { question, language, matchedUser, roomId, datetime } = location.state;
    const partnerUsername = matchedUser.user1 === username ? matchedUser.user2 : matchedUser.user1;

    const handleQuit = () => setShowQuitPopup(true);

    const handleQuitConfirm = () => {
        historyService.updateUserHistory(userId, cookies.token, {
            roomId,
            question: question._id,
            user: userId,
            partner: partnerUsername,
            status: attemptStatus.current,
            datetime: datetime,
            solution: editorRef.current.getValue(),
        });
        setShowPartnerQuitPopup(false);
        socketRef.current.emit("user-left", location.state.roomId);
        providerRef.current?.destroy();
        navigate("/home");
    };

    const handleQuitCancel = () => setShowQuitPopup(false);

    const handleSubmit = () => setShowSubmitPopup(true);

    const handleSubmitConfirm = () => {
        console.log("Submit code");
        attemptStatus.current = "submitted";
        handleQuitConfirm(); // invoke quit function
    };

    const handleSubmitCancel = () => setShowSubmitPopup(false);

    const handleContinueSession = () => {
        socketRef.current.emit("continue-session", roomId);
    };

    const handleContinueSessionAlone = () => {
        setCountdown(180); // Reset to your desired starting time
        setTimeOver(false);
        startCountdown();
        setIsSoloSession(true);
    }

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setShowSnackbar(false);
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        if (newValue === 1 && !peerConnectionRef.current) {
            initializePeerConnection();
        }
    };

    const initializePeerConnection = async () => {
        try {
            if (peerConnectionRef.current) return;

            const peerConnection = new RTCPeerConnection();
            peerConnectionRef.current = peerConnection;

            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach((track) => peerConnectionRef.current.addTrack(track, localStreamRef.current));
            }

            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    socketRef.current.emit("voice-candidate", {
                        roomId: location.state.roomId,
                        candidate: event.candidate,
                    });
                }
            };

            peerConnection.ontrack = (event) => {
                remoteAudioRef.current.srcObject = event.streams[0];
                remoteAudioRef.current.play();
            };

            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);

            socketRef.current.emit("voice-offer", { roomId: location.state.roomId, offer });
            if (localStreamRef.current) {
                localStreamRef.current.getAudioTracks().forEach((track) => (track.enabled = false)); // Start with mic off
            }
        } catch (error) {
            console.error("Error starting voice chat:", error);
        }
    };

    const handleVoiceOffer = async (offer) => {
        try {
            const peerConnection = new RTCPeerConnection();
            peerConnectionRef.current = peerConnection;

            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach((track) => peerConnectionRef.current.addTrack(track, localStreamRef.current));
            }

            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    socketRef.current.emit("voice-candidate", {
                        roomId: location.state.roomId,
                        candidate: event.candidate,
                    });
                }
            };

            peerConnection.ontrack = (event) => {
                remoteAudioRef.current.srcObject = event.streams[0];
                remoteAudioRef.current.play();
            };

            await peerConnection.setRemoteDescription(offer);
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            socketRef.current.emit("voice-answer", { roomId: location.state.roomId, answer });
            if (localStreamRef.current) {
                localStreamRef.current.getAudioTracks().forEach((track) => (track.enabled = false)); // Start with mic off
            }
        } catch (error) {
            console.error("Error starting voice chat:", error);
        }
    };

    const toggleMic = async () => {
        if (isMicOn) {
            micOff();
        } else {
            micOn();
        }
    };

    const micOn = async () => {
        if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach((track) => (track.enabled = true));
        }
        setIsMicOn(true);
    };

    const micOff = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach((track) => (track.enabled = false));
        }
        setIsMicOn(false);
    };

    const endVoiceChat = () => {
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => track.stop());
            localStreamRef.current = null;
        }
        setIsMicOn(false);
    };

    const toggleMute = () => {
        if (remoteAudioRef.current) {
            remoteAudioRef.current.muted = !remoteAudioRef.current.muted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
            <CollabNavBar 
                partnerUsername={partnerUsername} 
                countdown={formatTime(countdown)} 
                handleSubmit={handleSubmit}
                handleQuit={handleQuit}
            />
            <div style={{ display: "grid", gridTemplateColumns: "2fr 3fr", height: "calc(100vh - 75px)", padding: "10px" }}>
                <QuestionContainer question={question} />

                <div style={{ display: "grid", gridTemplateRows: "3fr 2fr", marginLeft: "10px", rowGap: "10px", overflow: "auto" }}>
                    <CodeEditor language={language} onMount={handleEditorDidMount} />

                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ backgroundColor: '#1C1678', borderRadius: '10px 10px 0 0' }}>
                            <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
                                <Tab 
                                    label="Output" 
                                    {...a11yProps(0)} 
                                    sx={{ 
                                        color: 'white', 
                                        fontWeight: 'bold', 
                                        fontFamily: 'Poppins' ,
                                        '&:hover': {
                                            color: 'white',
                                            backgroundColor: '#7bc9ff',
                                            borderRadius: '10px 0 0 0',
                                        },
                                        '&.Mui-selected': { 
                                            color: 'white',
                                            backgroundColor: '#7bc9ff',
                                            borderRadius: '10px 0 0 0',
                                            fontWeight: 'bolder', 
                                        }
                                    }} 
                                />
                                <Tab 
                                    label="ChatBox" 
                                    {...a11yProps(1)} 
                                    sx={{ 
                                        color: 'white', 
                                        fontWeight: 'bold', 
                                        fontFamily: 'Poppins' ,
                                        '&:hover': {
                                            color: 'white',
                                            backgroundColor: '#7bc9ff',
                                        },
                                        '&.Mui-selected': { 
                                            color: 'white',
                                            backgroundColor: '#7bc9ff',
                                            fontWeight: 'bolder', 
                                        }
                                    }} 
                                />
                                
                            </Tabs>
                        </Box>
                        <CustomTabPanel value={tabValue} index={0}>
                            <Output editorRef={editorRef} language={language} />
                        </CustomTabPanel>
                        <CustomTabPanel value={tabValue} index={1}>
                            <ChatBox 
                                socket={socketRef.current} 
                                username={username}  
                                messages={messages} 
                                toggleMic={toggleMic}
                                isMicOn={isMicOn}
                                toggleMute={toggleMute}
                                isMuted={isMuted}
                            />
                        </CustomTabPanel>
                    </Box>
                </div>

                {/* Conditionally render popups */}
                {showSubmitPopup && (
                    <SubmitPopup
                        confirmQuit={handleSubmitConfirm}
                        cancelQuit={handleSubmitCancel}
                    />
                )}
                {showQuitPopup && (
                    <QuitConfirmationPopup 
                        confirmQuit={handleQuitConfirm} 
                        cancelQuit={handleQuitCancel} 
                    />
                )}
                {!isSoloSession && showPartnerQuitPopup && countdown > 0 && (
                    <PartnerQuitPopup 
                        confirmQuit={handleQuitConfirm} 
                        cancelQuit={() => setShowPartnerQuitPopup(false)} 
                    />
                )}
                {timeOver && (
                    <TimeUpPopup 
                        continueSession={handleContinueSession}
                        quitSession={handleQuitConfirm}
                        continueAlone={handleContinueSessionAlone}
                        isSoloSession={isSoloSession}/>
                )}
            </div>
            
            <Snackbar
                open={showSnackbar}
                onClose={handleCloseSnackbar}
                message="You're session starts now! Happy Coding!"
                autoHideDuration={3000} // Auto-hide after 3 seconds
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                className="custom-snackbar"
            />
        </div>
    );
};

export default Collab;
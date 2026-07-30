import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import io from "socket.io-client";
import Navbar from "../components/Navbar";
import api from "../api/api";
import { SOCKET_BASE_URL } from "../utils/constants";

const socket = io(SOCKET_BASE_URL, {
  autoConnect: false
});

const Chat = ({ currentUserId }) => {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isSocketReady, setIsSocketReady] = useState(socket.connected);
  const roomId =
    currentUserId && id
      ? [String(currentUserId), String(id)].sort().join("_")
      : "";

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    socket.auth = { token };
    const handleConnect = () => {
      setIsSocketReady(true);
    };

    const handleDisconnect = () => {
      setIsSocketReady(false);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.connect();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await api.get(`/messages/${currentUserId}/${id}`);
        setMessages(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log(error);
      }
    };

    if (currentUserId && id) {
      fetchMessages();
    }
  }, [currentUserId, id]);

  useEffect(() => {
    if (!roomId) return;
    if (!isSocketReady) return;
    socket.emit("join_conversation", { roomId });
  }, [isSocketReady, roomId]);

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      if (
        (String(data.sender) === String(id) && String(data.receiver) === String(currentUserId)) ||
        (String(data.sender) === String(currentUserId) && String(data.receiver) === String(id))
      ) {
        setMessages((prev) => [...prev, data]);
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [currentUserId, id]);

  const sendMessage = async () => {
    if (!text.trim() || !roomId) return;

    const msg = {
      receiver: id,
      text: text.trim()
    };

    try {
      const { data } = await api.post("/messages", msg);
      socket.emit("send_message", { roomId, message: data });
      setMessages((prev) => [...prev, data]);
      setText("");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send message");
    }
  };

  return (
    <div>
      <Navbar />

      <section className="py-5" style={{ background: "rgba(255,255,255,0.42)", minHeight: "calc(100vh - 88px)" }}>
        <div className="container">
          <div className="card border-0 shadow-sm overflow-hidden">
            <div
              className="d-flex align-items-center justify-content-between px-4 py-3"
              style={{
                background: "linear-gradient(135deg, #1f2937, #111827)",
                color: "#fff"
              }}
            >
              <div>
                <div className="section-eyebrow text-warning mb-1">Live Conversation</div>
                <h4 className="mb-0 fw-bold">SkillSwap Chat</h4>
              </div>

              <div className="d-flex align-items-center gap-2">
                <Link
                  to={`/video/${id}`}
                  className="btn btn-warning btn-sm fw-semibold"
                >
                  Video Call
                </Link>

                <div
                  className="px-3 py-2 rounded-pill"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  Real-time
                </div>
              </div>
            </div>

            <div
              className="p-4"
              style={{
                height: "500px",
                overflowY: "auto",
                background:
                  "linear-gradient(180deg, rgba(29,78,216,0.03), rgba(245,158,11,0.04))"
              }}
            >
              {messages.length === 0 ? (
                <div className="h-100 d-flex align-items-center justify-content-center">
                  <div className="text-center">
                    <h5 className="fw-bold mb-2">No messages yet</h5>
                    <p className="text-muted mb-0">
                      Start the conversation and begin your skill exchange.
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((message) => {
                  const isOwn = String(message.sender) === String(currentUserId);

                  return (
                    <div
                      key={message._id || `${message.sender}-${message.createdAt}`}
                      className={`d-flex mb-3 ${isOwn ? "justify-content-end" : "justify-content-start"}`}
                    >
                      <div
                        style={{
                          maxWidth: "72%",
                          padding: "14px 18px",
                          borderRadius: isOwn ? "20px 20px 6px 20px" : "20px 20px 20px 6px",
                          background: isOwn
                            ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
                            : "#ffffff",
                          color: isOwn ? "#fff" : "#182026",
                          boxShadow: "0 10px 24px rgba(17, 24, 39, 0.08)",
                          border: isOwn ? "none" : "1px solid rgba(24,32,38,0.06)"
                        }}
                      >
                        <div style={{ lineHeight: 1.6 }}>{message.text}</div>

                        <div
                          className="mt-2"
                          style={{
                            fontSize: "0.75rem",
                            opacity: isOwn ? 0.85 : 0.55,
                            textAlign: "right"
                          }}
                        >
                          {message.createdAt
                            ? new Date(message.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit"
                              })
                            : ""}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-3 p-md-4 border-top bg-white">
              <div className="d-flex gap-3 align-items-center">
                <Link
                  to={`/video/${id}`}
                  className="btn btn-outline-warning fw-semibold"
                >
                  Video Call
                </Link>

                <input
                  className="form-control"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type your message..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendMessage();
                    }
                  }}
                />

                <button className="btn btn-primary px-4" onClick={sendMessage}>
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Chat;

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import Navbar from "./Navbar";
import { getStoredJson } from "../utils/storage";
import { SOCKET_BASE_URL } from "../utils/constants";

const socket = io(SOCKET_BASE_URL, {
  autoConnect: false
});

const VideoCall = () => {
  const { id } = useParams();
  const currentUser = getStoredJson("currentUser");
  const currentUserId = currentUser?._id;
  const roomId =
    currentUserId && id
      ? [String(currentUserId), String(id)].sort().join("_")
      : "";
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const socketHandlersRef = useRef(null);

  const [callStatus, setCallStatus] = useState("Ready to connect");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [pendingOffer, setPendingOffer] = useState(null);
  const [isSocketReady, setIsSocketReady] = useState(socket.connected);
  const displayStatus = roomId ? callStatus : "Unable to start call";

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
    if (!roomId) return;
    if (!isSocketReady) return;
    socket.emit("join_conversation", { roomId });
  }, [isSocketReady, roomId]);

  useEffect(() => {
    if (!roomId) {
      return;
    }

    const setupMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });

        localStreamRef.current = stream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        const peer = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
        });

        peerConnectionRef.current = peer;

        stream.getTracks().forEach((track) => {
          peer.addTrack(track, stream);
        });

        peer.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        peer.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("ice-candidate", { roomId, candidate: event.candidate });
          }
        };

        const handleOffer = async (offer) => {
          setPendingOffer(offer);
          setCallStatus("Incoming call...");
        };

        const handleAnswer = async (answer) => {
          await peer.setRemoteDescription(new RTCSessionDescription(answer));
          setCallStatus("Connected");
        };

        const handleIceCandidate = async (candidate) => {
          try {
            if (candidate) {
              await peer.addIceCandidate(new RTCIceCandidate(candidate));
            }
          } catch (error) {
            console.log(error);
          }
        };

        const handleCallRejected = () => {
          setCallStatus("Call rejected");
        };

        const handleCallEnded = () => {
          setCallStatus("Call ended by other user");
        };

        socket.on("offer", handleOffer);
        socket.on("answer", handleAnswer);
        socket.on("ice-candidate", handleIceCandidate);
        socket.on("call_rejected", handleCallRejected);
        socket.on("call_ended", handleCallEnded);

        socketHandlersRef.current = {
          handleOffer,
          handleAnswer,
          handleIceCandidate,
          handleCallRejected,
          handleCallEnded
        };
      } catch (error) {
        console.log(error);
        setCallStatus("Camera or microphone access failed");
      }
    };

    setupMedia();

    return () => {
      if (socketHandlersRef.current) {
        socket.off("offer", socketHandlersRef.current.handleOffer);
        socket.off("answer", socketHandlersRef.current.handleAnswer);
        socket.off("ice-candidate", socketHandlersRef.current.handleIceCandidate);
        socket.off("call_rejected", socketHandlersRef.current.handleCallRejected);
        socket.off("call_ended", socketHandlersRef.current.handleCallEnded);
        socketHandlersRef.current = null;
      }

      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [roomId]);

  const startCall = async () => {
    try {
      if (!peerConnectionRef.current || !roomId) return;
      setPendingOffer(null);
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      socket.emit("offer", { roomId, offer });
      setCallStatus("Calling...");
    } catch (error) {
      console.log(error);
    }
  };

  const acceptCall = async () => {
    if (!pendingOffer || !peerConnectionRef.current || !roomId) return;

    try {
      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(pendingOffer)
      );
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      socket.emit("answer", { roomId, answer });
      setPendingOffer(null);
      setCallStatus("Connected");
    } catch (error) {
      console.log(error);
      setCallStatus("Failed to accept call");
    }
  };

  const rejectCall = () => {
    if (!roomId) return;
    socket.emit("call_rejected", { roomId });
    setPendingOffer(null);
    setCallStatus("Call rejected");
  };

  const toggleMute = () => {
    if (!localStreamRef.current) return;

    const audioTracks = localStreamRef.current.getAudioTracks();
    audioTracks.forEach((track) => {
      track.enabled = !track.enabled;
    });

    setIsMuted((prev) => !prev);
  };

  const toggleVideo = () => {
    if (!localStreamRef.current) return;

    const videoTracks = localStreamRef.current.getVideoTracks();
    videoTracks.forEach((track) => {
      track.enabled = !track.enabled;
    });

    setIsVideoOff((prev) => !prev);
  };

  const endCall = () => {
    if (socketHandlersRef.current) {
      socket.off("offer", socketHandlersRef.current.handleOffer);
      socket.off("answer", socketHandlersRef.current.handleAnswer);
      socket.off("ice-candidate", socketHandlersRef.current.handleIceCandidate);
      socket.off("call_rejected", socketHandlersRef.current.handleCallRejected);
      socket.off("call_ended", socketHandlersRef.current.handleCallEnded);
      socketHandlersRef.current = null;
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    if (roomId) {
      socket.emit("call_ended", { roomId });
    }

    setPendingOffer(null);
    setCallStatus("Call ended");
  };

  return (
    <div>
      <Navbar />

      <section className="py-5" style={{ background: "rgba(255,255,255,0.42)", minHeight: "calc(100vh - 88px)" }}>
        <div className="container">
          <div className="card border-0 shadow-sm overflow-hidden">
            <div
              className="d-flex justify-content-between align-items-center px-4 py-3 flex-wrap gap-2"
              style={{
                background: "linear-gradient(135deg, #1f2937, #111827)",
                color: "#fff"
              }}
            >
              <div>
                <div className="section-eyebrow text-warning mb-1">Live Session</div>
                <h4 className="fw-bold mb-0">SkillSwap Video Call</h4>
              </div>

              <span
                className="px-3 py-2 rounded-pill"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                {displayStatus}
              </span>
            </div>

            <div className="p-4 p-lg-5">
              <div className="row g-4">
                <div className="col-lg-6">
                  <div className="card border-0 shadow-sm overflow-hidden">
                    <div className="px-3 py-2 bg-dark text-white fw-semibold">
                      Your Video
                    </div>
                    <video
                      ref={localVideoRef}
                      autoPlay
                      muted
                      playsInline
                      style={{
                        width: "100%",
                        height: "320px",
                        objectFit: "cover",
                        background: "#0f172a"
                      }}
                    />
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="card border-0 shadow-sm overflow-hidden">
                    <div className="px-3 py-2 bg-dark text-white fw-semibold">
                      Remote Video
                    </div>
                    <video
                      ref={remoteVideoRef}
                      autoPlay
                      playsInline
                      style={{
                        width: "100%",
                        height: "320px",
                        objectFit: "cover",
                        background: "#0f172a"
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-3 justify-content-center mt-4">
                <button className="btn btn-primary px-4" onClick={startCall}>
                  Start Call
                </button>

                {pendingOffer && (
                  <>
                    <button className="btn btn-success px-4" onClick={acceptCall}>
                      Accept
                    </button>

                    <button className="btn btn-secondary px-4" onClick={rejectCall}>
                      Reject
                    </button>
                  </>
                )}

                <button className="btn btn-dark px-4" onClick={toggleMute}>
                  {isMuted ? "Unmute" : "Mute"}
                </button>

                <button className="btn btn-warning px-4" onClick={toggleVideo}>
                  {isVideoOff ? "Turn Video On" : "Turn Video Off"}
                </button>

                <button className="btn btn-danger px-4" onClick={endCall}>
                  End Call
                </button>
              </div>

              <div className="card border-0 shadow-sm p-4 mt-4">
                <div className="section-eyebrow mb-2">Call Tips</div>
                <h5 className="fw-bold mb-3">Have a better learning session</h5>
                <p className="text-muted mb-2">
                  Make sure your camera and microphone permissions are allowed before starting.
                </p>
                <p className="text-muted mb-0">
                  Use chat and scheduled meeting time together for a smoother exchange experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VideoCall;

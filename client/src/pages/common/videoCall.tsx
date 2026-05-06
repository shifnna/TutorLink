import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaPhoneSlash,
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { sentFeedback } from "../../services/clientService";
import { useNavigate } from "react-router-dom";

const SIGNALING_SERVER = import.meta.env.VITE_SOCKET_URL;

const VideoCallPage: React.FC = () => {
  const parts = window.location.pathname.split("/");
  const sessionId = parts[3];
  const roomId = parts[4];   


  const socketRef = useRef<Socket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [unsatisfied, setUnsatisfied] = useState(false);

  const peerIdRef = useRef<string | null>(null);

  useEffect(() => {
    socketRef.current = io(SIGNALING_SERVER);

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    pcRef.current = pc;

    pc.ontrack = (event) => {
      const [stream] = event.streams;
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = stream;
    };

    const startLocal = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    };
    startLocal();

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socketRef.current?.emit("ice-candidate", {
          roomId,
          candidate: e.candidate,
          targetId: peerIdRef.current,
        });
      }
    };

    socketRef.current.on("connect", () => {
      socketRef.current?.emit("join-room", roomId);
    });

    socketRef.current.on("ready-to-offer", async ({ newPeerId }) => {
      peerIdRef.current = newPeerId;

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socketRef.current?.emit("offer", { targetId: newPeerId, roomId, offer });
    });

    socketRef.current.on("offer", async (payload) => {
      peerIdRef.current = payload.from;

      await pc.setRemoteDescription(new RTCSessionDescription(payload.offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socketRef.current?.emit("answer", {
        targetId: payload.from,
        roomId,
        answer,
      });
    });

    socketRef.current.on("answer", async (payload) => {
      await pc.setRemoteDescription(new RTCSessionDescription(payload.answer));
    });

    socketRef.current.on("ice-candidate", async (payload) => {
      if (payload.candidate) {
        await pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
      }
    });

    return () => {
      pc.getSenders().forEach((s) => s.track?.stop());
      pc.close();
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      socketRef.current?.disconnect();
    };
  }, [roomId]);

  const toggleMic = () => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setMicEnabled(track.enabled);
  };

  const toggleCam = () => {
    const track = localStreamRef.current?.getVideoTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setCamEnabled(track.enabled);
  };

  const endCall = () => {
    setShowModal(true); 
  };

  const navigate = useNavigate();
  const submitFeedback = async () => {
    try {
      const res = await sentFeedback({
        sessionId,
        rating,
        message,
        unsatisfied,
      })
      if(res.success){
        toast.success("Feedback submitted. Thank you!");
      }else{
        toast.error(res.message);
      }
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Error submitting feedback");
    }
  };

  return (
    <>
      <div className={`w-full h-screen relative flex flex-col items-center justify-center transition-all duration-300 ${
        showModal ? "blur-sm pointer-events-none" : ""
      } bg-gradient-to-br from-[#0b0b19] via-[#111132] to-[#1a1028] text-white overflow-hidden`}
      >
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-700/20 blur-[200px] rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-700/20 blur-[200px] rounded-full"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl px-6">

          <div className="flex flex-col items-center">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full rounded-2xl shadow-2xl border border-purple-700/40 backdrop-blur-sm"
            />
            <p className="mt-2 text-sm text-purple-300 font-semibold opacity-80">You</p>
          </div>

          <div className="flex flex-col items-center">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full rounded-2xl shadow-2xl border border-blue-700/40 backdrop-blur-sm"
            />
            <p className="mt-2 text-sm text-blue-300 font-semibold opacity-80">Participant</p>
          </div>
        </div>

        <div className="fixed bottom-6 flex items-center gap-6 bg-black/40 px-10 py-4 rounded-full border border-white/10 shadow-2xl backdrop-blur-md">
          <button onClick={toggleMic} className="text-2xl p-4 rounded-full hover:bg-white/10 transition-all">
            {micEnabled ? <FaMicrophone className="text-white" /> : <FaMicrophoneSlash className="text-red-400" />}
          </button>

          <button onClick={toggleCam} className="text-2xl p-4 rounded-full hover:bg-white/10 transition-all">
            {camEnabled ? <FaVideo className="text-white" /> : <FaVideoSlash className="text-red-400" />}
          </button>

          <button onClick={endCall} className="bg-red-600 hover:bg-red-700 text-white text-2xl p-4 rounded-full shadow-xl transition-all">
            <FaPhoneSlash />
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-md">
          <div className="bg-[#1c1b29] p-8 rounded-2xl w-11/12 max-w-lg shadow-2xl border border-purple-800/30 text-white">
            <h2 className="text-2xl font-bold mb-4">Rate Your Session</h2>

            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  onClick={() => setRating(i)}
                  className={`cursor-pointer text-2xl ${
                    i <= rating ? "text-yellow-400" : "text-gray-600"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            <textarea
              placeholder="Share your experience..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#111022] text-white border border-purple-800/40"
              rows={4}
            />

            <label className="flex items-center gap-3 mt-4 cursor-pointer">
              <input
                type="checkbox"
                checked={unsatisfied}
                onChange={(e) => setUnsatisfied(e.target.checked)}
              />
              <span className="text-red-400">I am unsatisfied (Refund/Split Requested)</span>
            </label>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={submitFeedback}
                className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 font-semibold"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
      <Toaster position="top-center" toastOptions={{ style: { zIndex: 999999 } }} />
    </>
  );
};

export default VideoCallPage;

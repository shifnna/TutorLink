import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Maximize2,
  Minimize2,
  PhoneOff,
  Copy,
  MonitorX,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { sentFeedback } from "../../services/clientService";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { useAuthStore } from "../../store/authStore";

declare global {
  interface ImportMetaEnv {
    readonly VITE_SOCKET_URL?: string;
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

const SIGNALING_SERVER = import.meta.env.VITE_SOCKET_URL;

const fraunces = { fontFamily: "'Fraunces', Georgia, serif" };
const mono = { fontFamily: "'Space Mono', monospace" };

const LOCK_HEARTBEAT_MS = 2000;
const LOCK_STALE_MS = 6000;
const DISCONNECT_GRACE_MS = 4000;

type ConnState = RTCPeerConnectionState;

const statusConfig: Record<ConnState, { label: string; dot: string }> = {
  new: { label: "Connecting…", dot: "bg-amber-400 animate-pulse" },
  connecting: { label: "Connecting…", dot: "bg-amber-400 animate-pulse" },
  connected: { label: "Connected", dot: "bg-emerald-400" },
  disconnected: { label: "Reconnecting…", dot: "bg-amber-400 animate-pulse" },
  failed: { label: "Connection lost", dot: "bg-rose-400" },
  closed: { label: "Call ended", dot: "bg-[#6B7185]" },
};

const formatDuration = (totalSeconds: number) => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
};

interface ParticipantInfo {
  _id: string;
  name: string;
}

interface SessionParticipants {
  tutorId: ParticipantInfo;
  userId: ParticipantInfo;
}

const BackgroundGlow: React.FC = () => (
  <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
    <div
      className="absolute top-[-15%] right-[-10%] w-[45vmax] h-[45vmax] rounded-full opacity-20 blur-3xl mix-blend-screen"
      style={{ background: "radial-gradient(circle, rgba(124,156,255,0.5) 0%, transparent 70%)" }}
    />
    <div
      className="absolute bottom-[-15%] left-[-10%] w-[40vmax] h-[40vmax] rounded-full opacity-20 blur-3xl mix-blend-screen"
      style={{ background: "radial-gradient(circle, rgba(192,139,250,0.5) 0%, transparent 70%)" }}
    />
  </div>
);

interface VideoTileProps {
  isMain: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  mirrored?: boolean;
  muted?: boolean;
  label?: string;
  onClick?: () => void;
  overlay?: React.ReactNode;
}

const VideoTile: React.FC<VideoTileProps> = ({
  isMain,
  videoRef,
  mirrored,
  muted,
  label,
  onClick,
  overlay,
}) => (
  <div
    onClick={onClick}
    className={
      isMain
        ? "absolute inset-4 sm:inset-8 md:inset-12 rounded-3xl overflow-hidden bg-[#0E1016] ring-1 ring-[#2A2E3D] shadow-2xl z-0"
        : `absolute bottom-36 right-6 w-64 sm:w-80 md:w-96 aspect-video rounded-2xl p-[3px] shadow-2xl bg-gradient-to-br from-[#7C9CFF] to-[#C08BFA] z-10 group transition-transform ${
            onClick ? "cursor-pointer hover:scale-[1.02]" : ""
          }`
    }
  >
    <div
      className={
        isMain
          ? "relative w-full h-full"
          : "relative w-full h-full rounded-[13px] overflow-hidden bg-[#171A24]"
      }
    >
      <video
        ref={videoRef}
        autoPlay
        muted={muted}
        playsInline
        className={`w-full h-full object-cover bg-[#171A24] ${mirrored ? "scale-x-[-1]" : ""}`}
      />

      {overlay}

      {!isMain && onClick && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/0 group-hover:bg-black/40 transition">
          <Maximize2 className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition" />
          <span
            style={mono}
            className="text-[10px] uppercase tracking-wide text-white opacity-0 group-hover:opacity-100 transition"
          >
            Click to focus
          </span>
        </div>
      )}

      {label && (
        <span
          style={mono}
          className={
            isMain
              ? "absolute bottom-4 left-5 text-xs sm:text-sm uppercase tracking-wide text-[#F3F4F8] bg-[#0E1016]/60 backdrop-blur-sm px-3 py-1.5 rounded-full"
              : "absolute bottom-2 left-3 text-[11px] uppercase tracking-wide text-[#F3F4F8]/80"
          }
        >
          {label}
        </span>
      )}
    </div>
  </div>
);

const VideoCallPage: React.FC = () => {
  const parts = window.location.pathname.split("/");
  const sessionId = parts[3];
  const roomId = parts[4];

  const { user } = useAuthStore();

  const socketRef = useRef<Socket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const peerIdRef = useRef<string | null>(null);
  const tabIdRef = useRef<string>(
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`
  );

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const hasRemoteConnectedRef = useRef(false);
  const notifiedLeftRef = useRef(false);
  const leaveTimeoutRef = useRef<number | undefined>(undefined);

  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSwapped, setIsSwapped] = useState(false);

  const [connectionState, setConnectionState] = useState<ConnState>("new");
  const [remoteConnected, setRemoteConnected] = useState(false);
  const [remoteCamOff, setRemoteCamOff] = useState(false);
  const [remoteLeft, setRemoteLeft] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [participantName, setParticipantName] = useState<string | null>(null);

  // Whether the *current* logged-in user is the tutor for this session.
  // Used to decide who sees the post-call feedback modal — only the
  // client (the person who booked) should be asked to rate the session.
  const [isTutorSide, setIsTutorSide] = useState(false);

  const [duplicateTab, setDuplicateTab] = useState(false);
  const [forceTakeover, setForceTakeover] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [unsatisfied, setUnsatisfied] = useState(false);

  const navigate = useNavigate();

  // Load the Fraunces / Space Mono pairing used across the app
  useEffect(() => {
    const id = "tutorlink-midnight-fonts";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,450;9..144,550;9..144,650&family=Space+Mono:wght@400;700&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  // Look up who the "other side" of this call actually is, so the tile
  // can show their real name instead of the generic "Participant" label,
  // and so we know whether the current user is the tutor or the client.
  useEffect(() => {
    if (!sessionId) return;

    const loadParticipantName = async () => {
      try {
        // Make sure this matches a real backend route that returns a single
        // populated session, e.g. GET /client/sessions/:id
        const res = await axiosClient.get(`/api/client/sessions/${sessionId}`);
        const data: SessionParticipants | undefined = res.data?.data;
        if (!data) return;

        const isTutor = data.tutorId?._id === user?._id;
        const other = isTutor ? data.userId : data.tutorId;

        setIsTutorSide(isTutor);
        if (other?.name) setParticipantName(other.name);
      } catch (error) {
        console.error("Couldn't load participant name:", error);
        // Not fatal — the tile just falls back to the generic label below.
      }
    };

    loadParticipantName();
  }, [sessionId, user?._id]);

  useEffect(() => {
    let isMounted = true;
    const lockKey = `tutorlink:call-lock:${roomId}`;
    const tabId = tabIdRef.current;

    const readLock = (): { tabId: string; updatedAt: number } | null => {
      try {
        const raw = localStorage.getItem(lockKey);
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    };

    const writeLock = () => {
      try {
        localStorage.setItem(lockKey, JSON.stringify({ tabId, updatedAt: Date.now() }));
      } catch {
        /* localStorage unavailable — fail open rather than block the call */
      }
    };

    const releaseLock = () => {
      const current = readLock();
      if (current?.tabId === tabId) {
        try {
          localStorage.removeItem(lockKey);
        } catch {
          /* ignore */
        }
      }
    };

    const existing = readLock();
    const existingIsStale = !existing || Date.now() - existing.updatedAt > LOCK_STALE_MS;
    const blockedByAnotherTab =
      !!existing && existing.tabId !== tabId && !existingIsStale && !forceTakeover;

    if (blockedByAnotherTab) {
      setDuplicateTab(true);
      return;
    }

    setDuplicateTab(false);
    writeLock();
    // Assigned exactly once, right here, so this can stay a const —
    // nothing before this point in the effect needs a reference to it.
    const heartbeatId = window.setInterval(writeLock, LOCK_HEARTBEAT_MS);

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    pcRef.current = pc;

    const teardown = () => {
      window.clearInterval(heartbeatId);
      if (leaveTimeoutRef.current) window.clearTimeout(leaveTimeoutRef.current);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("beforeunload", releaseLock);
      releaseLock();
      pc.getSenders().forEach((s) => s.track?.stop());
      pc.close();
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      socketRef.current?.disconnect();
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key !== lockKey || !e.newValue) return;
      try {
        const latest = JSON.parse(e.newValue);
        if (latest.tabId !== tabId) {
          setDuplicateTab(true);
          teardown();
        }
      } catch {
        /* ignore malformed value */
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("beforeunload", releaseLock);

    const declareParticipantLeft = () => {
      if (!hasRemoteConnectedRef.current || notifiedLeftRef.current) return;
      notifiedLeftRef.current = true;

      setRemoteConnected(false);
      setRemoteLeft(true);
      setIsSwapped(false);
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
      toast("Participant left the call");
    };

    const handleConnectionState = (state: string) => {
      if (!hasRemoteConnectedRef.current) return;

      if (state === "failed" || state === "closed") {
        if (leaveTimeoutRef.current) window.clearTimeout(leaveTimeoutRef.current);
        declareParticipantLeft();
        return;
      }

      if (state === "disconnected") {
        // Ordinary network blips briefly report "disconnected" too — wait
        // a few seconds before treating this as an actual hangup.
        if (!leaveTimeoutRef.current) {
          leaveTimeoutRef.current = window.setTimeout(() => {
            leaveTimeoutRef.current = undefined;
            declareParticipantLeft();
          }, DISCONNECT_GRACE_MS);
        }
        return;
      }

      if (state === "connected" && leaveTimeoutRef.current) {
        window.clearTimeout(leaveTimeoutRef.current);
        leaveTimeoutRef.current = undefined;
      }
    };

    pc.ontrack = (event) => {
      const [stream] = event.streams;
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = stream;
      setRemoteConnected(true);
      hasRemoteConnectedRef.current = true;

      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        setRemoteCamOff(videoTrack.muted);
        videoTrack.onmute = () => setRemoteCamOff(true);
        videoTrack.onunmute = () => setRemoteCamOff(false);
      }
    };

    pc.onconnectionstatechange = () => {
      setConnectionState(pc.connectionState);
      handleConnectionState(pc.connectionState);
    };

    pc.oniceconnectionstatechange = () => {
      handleConnectionState(pc.iceConnectionState);
    };

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socketRef.current?.emit("ice-candidate", {
          roomId,
          candidate: e.candidate,
          targetId: peerIdRef.current,
        });
      }
    };

    const init = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (!isMounted) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      socketRef.current = io(SIGNALING_SERVER);

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
        socketRef.current?.emit("answer", { targetId: payload.from, roomId, answer });
      });

      socketRef.current.on("answer", async (payload) => {
        await pc.setRemoteDescription(new RTCSessionDescription(payload.answer));
      });

      socketRef.current.on("ice-candidate", async (payload) => {
        if (payload.candidate) {
          await pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
        }
      });
    };

    init();

    return () => {
      isMounted = false;
      teardown();
    };
  }, [roomId, forceTakeover]);

  useEffect(() => {
    if (!remoteConnected) return;
    const id = window.setInterval(() => setCallDuration((d) => d + 1), 1000);
    return () => window.clearInterval(id);
  }, [remoteConnected]);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

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

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen().catch(() => {
        toast.error("Fullscreen isn't available here");
      });
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied");
    } catch {
      toast.error("Couldn't copy the link");
    }
  };

  const endCall = () => {
    if (isTutorSide) {
      navigate("/");
    } else {
      setShowModal(true);
    }
  };

  const submitFeedback = async () => {
    try {
      const res = await sentFeedback({ sessionId, rating, message, unsatisfied });
      if (res.success) {
        toast.success("Feedback submitted. Thank you!");
      } else {
        toast.error(res.message);
      }
      navigate("/");
    } catch (error: unknown) {
      console.error(error instanceof Error ? error.message : error);
      toast.error("Error submitting feedback");
    }
  };

  const handleUseThisTab = () => {
    setDuplicateTab(false);
    setForceTakeover(true);
  };

  if (duplicateTab) {
    return (
      <div className="relative w-full h-screen bg-[#0E1016] text-[#F3F4F8] overflow-hidden flex items-center justify-center px-6">
        <BackgroundGlow />
        <div className="bg-[#171A24] border border-[#2A2E3D] rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
          <div className="w-14 h-14 rounded-full bg-[#1E2230] border border-[#2A2E3D] flex items-center justify-center mx-auto mb-5">
            <MonitorX className="w-6 h-6 text-[#9CA1B5]" />
          </div>
          <h2 style={fraunces} className="text-xl font-bold mb-2">
            Session already open
          </h2>
          <p className="text-sm text-[#9CA1B5] mb-6">
            This call is already open in another tab in this browser. Only one tab
            can join at a time.
          </p>
          <button
            type="button"
            onClick={handleUseThisTab}
            className="bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] text-[#0E1016] font-semibold rounded-full px-5 py-2.5 hover:scale-105 transition"
          >
            Use this tab instead
          </button>
        </div>
      </div>
    );
  }

  const status = statusConfig[connectionState] ?? statusConfig.new;
  const canSwap = remoteConnected;
  const displayParticipantName = participantName ?? "Participant";

  const remoteOverlay = (
    <>
      {!remoteConnected && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#171A24]">
          <div className="w-14 h-14 rounded-full border-2 border-[#2A2E3D] border-t-[#7C9CFF] animate-spin" />
          <p style={mono} className="text-sm text-[#9CA1B5]">
            Waiting for {participantName ?? "the other participant"} to join…
          </p>
        </div>
      )}
      {remoteConnected && remoteCamOff && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0E1016]">
          <div className="w-16 h-16 rounded-full bg-[#1E2230] border border-[#2A2E3D] flex items-center justify-center">
            <VideoOff className="w-7 h-7 text-[#6B7185]" />
          </div>
        </div>
      )}
    </>
  );

  const localOverlay = !camEnabled ? (
    <div className="absolute inset-0 flex items-center justify-center bg-[#171A24]">
      <VideoOff className="w-7 h-7 text-[#6B7185]" />
    </div>
  ) : null;

  return (
    <div className="relative w-full h-screen bg-[#0E1016] text-[#F3F4F8] overflow-hidden">
      <BackgroundGlow />

      <div className={`relative w-full h-full transition-all duration-300 ${showModal ? "blur-sm pointer-events-none" : ""}`}>
        {/* header */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5 bg-[#171A24]/80 backdrop-blur-md border border-[#2A2E3D] rounded-full px-4 py-2">
            <span className={`w-2 h-2 rounded-full ${status.dot}`} />
            <span style={mono} className="text-xs uppercase tracking-wide text-[#9CA1B5]">
              {status.label}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {remoteConnected && (
              <span
                style={mono}
                className="text-sm text-[#F3F4F8] bg-[#171A24]/80 backdrop-blur-md border border-[#2A2E3D] rounded-full px-4 py-2"
              >
                {formatDuration(callDuration)}
              </span>
            )}
            <button
              onClick={copyLink}
              title="Copy session link"
              className="bg-[#171A24]/80 backdrop-blur-md border border-[#2A2E3D] hover:border-[#7C9CFF] text-[#9CA1B5] hover:text-[#F3F4F8] rounded-full p-2.5 transition"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* main stage */}
        <div className="relative w-full h-full">
          {!remoteLeft && (
            <VideoTile
              isMain={!isSwapped}
              videoRef={remoteVideoRef}
              label={displayParticipantName}
              overlay={remoteOverlay}
              onClick={isSwapped && canSwap ? () => setIsSwapped(false) : undefined}
            />
          )}

          <VideoTile
            isMain={remoteLeft || isSwapped}
            videoRef={localVideoRef}
            mirrored
            muted
            label="You"
            overlay={localOverlay}
            onClick={
              !remoteLeft && !isSwapped && canSwap ? () => setIsSwapped(true) : undefined
            }
          />
        </div>

        {/* controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 bg-[#171A24]/90 backdrop-blur-md border border-[#2A2E3D] px-5 py-3 rounded-full shadow-2xl">
          <button
            onClick={toggleMic}
            title={micEnabled ? "Mute mic" : "Unmute mic"}
            className={`p-3.5 rounded-full transition ${
              micEnabled
                ? "bg-[#1E2230] text-[#F3F4F8] hover:bg-[#252A3B]"
                : "bg-rose-500/15 text-rose-400 border border-rose-400/20"
            }`}
          >
            {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          <button
            onClick={toggleCam}
            title={camEnabled ? "Turn off camera" : "Turn on camera"}
            className={`p-3.5 rounded-full transition ${
              camEnabled
                ? "bg-[#1E2230] text-[#F3F4F8] hover:bg-[#252A3B]"
                : "bg-rose-500/15 text-rose-400 border border-rose-400/20"
            }`}
          >
            {camEnabled ? <VideoIcon className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            className="p-3.5 rounded-full bg-[#1E2230] text-[#F3F4F8] hover:bg-[#252A3B] transition"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>

          <button
            onClick={endCall}
            title="End call"
            className="p-3.5 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 text-white hover:scale-105 transition ml-1"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-md">
          <div className="bg-[#171A24] border border-[#2A2E3D] p-8 rounded-3xl w-11/12 max-w-lg shadow-2xl">
            <h2 style={fraunces} className="text-2xl font-bold mb-1 text-[#F3F4F8]">
              Rate your session
            </h2>
            <p className="text-sm text-[#9CA1B5] mb-5">
              Your feedback helps keep sessions running smoothly.
            </p>

            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  onClick={() => setRating(i)}
                  className={`cursor-pointer text-2xl transition ${
                    i <= rating ? "text-amber-400" : "text-[#2A2E3D]"
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
              className="w-full p-3 rounded-xl bg-[#0E1016] text-[#F3F4F8] border border-[#2A2E3D] focus:outline-none focus:ring-2 focus:ring-[#7C9CFF]/40 placeholder-[#6B7185]"
              rows={4}
            />

            <label className="flex items-center gap-3 mt-4 cursor-pointer">
              <input
                type="checkbox"
                checked={unsatisfied}
                onChange={(e) => setUnsatisfied(e.target.checked)}
              />
              <span className="text-sm text-rose-400">
                I'm unsatisfied (refund/split requested)
              </span>
            </label>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="border border-[#2A2E3D] text-[#F3F4F8] hover:bg-[#1E2230] hover:border-[#7C9CFF] bg-transparent rounded-full px-4 py-2 transition"
              >
                Cancel
              </button>

              <button
                onClick={submitFeedback}
                className="bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] text-[#0E1016] font-semibold rounded-full px-5 py-2 hover:scale-105 transition"
              >
                Submit review
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster
        position="top-center"
        toastOptions={{
          style: { background: "#171A24", color: "#F3F4F8", border: "1px solid #2A2E3D" },
        }}
      />
    </div>
  );
};

export default VideoCallPage;
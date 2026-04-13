import { useState, useEffect, useRef, useCallback } from "react";
import { socket } from "../socket";
import { v4 as uuidv4 } from "uuid";

const CHUNK_SIZE = 16 * 1024; // 16KB chunks – safe for most browsers

export function useP2PFileShare(isSender = true) {
  const [status, setStatus] = useState("Initializing...");
  const [files, setFiles] = useState([]);               // sender: File[], receiver: metadata[]
  const [progress, setProgress] = useState({});         // fileIndex → {loaded, total, percent}
  const [linkId, setLinkId] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [receivedBlobs, setReceivedBlobs] = useState({}); // index → Blob

  const pcRef = useRef(null);
  const dcRef = useRef(null);
  const currentFileIndex = useRef(-1);
  const fileBuffers = useRef([]); // receiver only

  // ── Utilities ────────────────────────────────────────
  const formatBytes = (bytes) => {
    if (!bytes) return "0 B";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${["B","KB","MB","GB"][i]}`;
  };

  // ── WebRTC Setup ─────────────────────────────────────
  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("signal", { linkId, payload: { type: "ice", candidate: e.candidate } });
      }
    };

    pc.onconnectionstatechange = () => {
      setStatus(pc.connectionState);
    };

    return pc;
  }, [linkId]);

  // Sender: create data channel
  const setupSenderChannel = useCallback(() => {
    if (!pcRef.current) return;
    dcRef.current = pcRef.current.createDataChannel("filetransfer", { ordered: true });
    dcRef.current.binaryType = "arraybuffer";

    dcRef.current.onopen = () => {
      setStatus("Connected → Sending files...");
      sendManifestAndFiles();
    };

    dcRef.current.onclose = () => setStatus("Data channel closed");
  }, []);

  // Receiver: receive data channel
  const setupReceiverChannel = useCallback(() => {
    if (!pcRef.current) return;

    pcRef.current.ondatachannel = (e) => {
      dcRef.current = e.channel;
      dcRef.current.binaryType = "arraybuffer";

      dcRef.current.onmessage = handleDataMessage;
      dcRef.current.onopen = () => setStatus("Connected → Receiving files...");
      dcRef.current.onclose = () => setStatus("Connection closed");
    };
  }, []);

  // ── Signaling ────────────────────────────────────────
  useEffect(() => {
    socket.connect();

    socket.on("signal", async (payload) => {
      try {
        if (payload.type === "offer") {
          if (!pcRef.current) pcRef.current = createPeerConnection();
          if (!isSender) setupReceiverChannel();

          await pcRef.current.setRemoteDescription(payload.sdp);
          const answer = await pcRef.current.createAnswer();
          await pcRef.current.setLocalDescription(answer);
          socket.emit("signal", { linkId, payload: { type: "answer", sdp: answer } });
        } else if (payload.type === "answer") {
          await pcRef.current.setRemoteDescription(payload.sdp);
        } else if (payload.type === "ice") {
          await pcRef.current.addIceCandidate(payload.candidate);
        }
      } catch (err) {
        console.error("Signaling error:", err);
        setStatus("Connection error");
      }
    });

    return () => {
      socket.off("signal");
      socket.disconnect();
      if (pcRef.current) pcRef.current.close();
    };
  }, [isSender, createPeerConnection, setupReceiverChannel]);

  // ── Sender logic ─────────────────────────────────────
  const createShareLink = () => {
    const id = uuidv4().slice(0, 8);
    setLinkId(id);
    const url = `${window.location.origin}/receive?id=${id}`;
    setShareLink(url);

    socket.emit("join", { linkId: id, role: "sender" });

    pcRef.current = createPeerConnection();
    setupSenderChannel();

    socket.emit("signal", {
      linkId: id,
      payload: { type: "offer", sdp: null }, // offer sent after join confirmation in real impl
    });
  };

  const sendManifestAndFiles = async () => {
    if (!dcRef.current || dcRef.current.readyState !== "open") return;

    // 1. Manifest
    const manifest = {
      type: "manifest",
      files: files.map(f => ({ name: f.name, size: f.size, type: f.type })),
    };
    dcRef.current.send(JSON.stringify(manifest));

    // 2. Send each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProgress(p => ({ ...p, [i]: { loaded: 0, total: file.size, percent: 0 } }));

      dcRef.current.send(JSON.stringify({ type: "start", index: i }));

      let offset = 0;
      while (offset < file.size) {
        const chunk = await file.slice(offset, offset + CHUNK_SIZE).arrayBuffer();
        dcRef.current.send(chunk);
        offset += chunk.byteLength;

        setProgress(p => {
          const prev = p[i] || { loaded: 0 };
          const loaded = prev.loaded + chunk.byteLength;
          const percent = Math.min(100, Math.floor((loaded / file.size) * 100));
          return { ...p, [i]: { loaded, total: file.size, percent } };
        });
      }

      dcRef.current.send(JSON.stringify({ type: "end", index: i }));
    }

    dcRef.current.send(JSON.stringify({ type: "done" }));
  };

  // ── Receiver logic ───────────────────────────────────
  const handleDataMessage = (e) => {
    const data = e.data;

    if (typeof data === "string") {
      try {
        const msg = JSON.parse(data);

        if (msg.type === "manifest") {
          setFiles(msg.files);
          fileBuffers.current = msg.files.map(() => []);
          setProgress(msg.files.reduce((acc, _, i) => ({ ...acc, [i]: { percent: 0 } }), {}));
        } else if (msg.type === "start") {
          currentFileIndex.current = msg.index;
        } else if (msg.type === "end") {
          const i = msg.index;
          const blob = new Blob(fileBuffers.current[i], { type: files[i]?.type || "application/octet-stream" });
          setReceivedBlobs(prev => ({ ...prev, [i]: blob }));
          fileBuffers.current[i] = []; // clean up
        } else if (msg.type === "done") {
          setStatus("Transfer complete!");
        }
      } catch {}
    } else {
      // Binary chunk
      if (currentFileIndex.current < 0) return;
      const i = currentFileIndex.current;
      fileBuffers.current[i].push(new Uint8Array(data));
      const received = fileBuffers.current[i].reduce((s, b) => s + b.byteLength, 0);
      const total = files[i]?.size || 0;
      const percent = total ? Math.floor((received / total) * 100) : 0;

      setProgress(p => ({ ...p, [i]: { ...p[i], percent } }));
    }
  };

  const downloadFile = (index) => {
    const blob = receivedBlobs[index];
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = files[index]?.name || `file-${index}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return {
    status,
    files,
    setFiles,               // sender uses this
    progress,
    linkId,
    shareLink,
    createShareLink,        // sender only
    downloadFile,           // receiver only
    isConnected: !!dcRef.current && dcRef.current.readyState === "open",
  };
}
// src/components/teacher/SessionControls.tsx
import React, { useEffect, useState } from "react";
import QRCode from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Copy, Repeat, Play, StopCircle } from "lucide-react";
import { toast } from "sonner";
// client socket snippet — paste inside a useEffect in TeacherDashboard or SessionControls
import { io } from "socket.io-client";
import { useEffect } from "react";

useEffect(() => {
  const classId = "active-session"; // replace with your dynamic classId
  const socket = io("http://localhost:4000", { transports: ["websocket"] });

  socket.on("connect", () => {
    console.log("socket connected", socket.id);
    // join the class room
    socket.emit("join-class", { classId });
  });

  socket.on("attendance:update", (payload) => {
    console.log("attendance:update", payload);
    // update local UI state — e.g. prepend to attendance list
  });

  socket.on("presence:change", (payload) => {
    console.log("presence:change", payload);
    // update presence indicators if you keep them
  });

  socket.on("session:ended", (data) => {
    console.log("session ended", data);
    // disable controls or show modal
  });

  // cleanup
  return () => {
    socket.emit("leave-class", { classId });
    socket.disconnect();
  };
}, []);

type Props = {
  classId: string; // pass the active session/class id from parent
  onSessionStarted?: (code: string | null) => void;
  onSessionEnded?: () => void;
};

type SessionStatusResponse = {
  code?: string | null;
  expiresAt?: number | null;
  active?: boolean;
};

export const SessionControls: React.FC<Props> = ({ classId, onSessionStarted, onSessionEnded }) => {
  const [code, setCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);

  // separate loading states for better button UX
  const [loadingStart, setLoadingStart] = useState(false);
  const [loadingRegen, setLoadingRegen] = useState(false);
  const [loadingEnd, setLoadingEnd] = useState(false);

  // status text for screen-readers
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // On mount: try to fetch current session status (if your backend supports it).
  // NOTE: implement a GET /api/classes/:id/status on server if you want persistent sessions.
  useEffect(() => {
    let mounted = true;
    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/classes/${encodeURIComponent(classId)}/status`);
        if (!mounted) return;
        if (!res.ok) {
          // if no status endpoint exists, server may return 404 — that's fine, ignore
          return;
        }
        const json: SessionStatusResponse = await res.json();
        setCode(json.code ?? null);
        setExpiresAt(json.expiresAt ?? null);
      } catch (err) {
        // fail silently — status endpoint is optional for demo
        // console.debug("no status endpoint or fetch failed", err);
      }
    };
    fetchStatus();
    return () => {
      mounted = false;
    };
  }, [classId]);

  // helper to read JSON error message if present
  const readErrorMessage = async (res: Response) => {
    try {
      const text = await res.text();
      try {
        const json = JSON.parse(text);
        return json.message || json.error || text || `HTTP ${res.status}`;
      } catch {
        return text || `HTTP ${res.status}`;
      }
    } catch {
      return `HTTP ${res.status}`;
    }
  };

  const startSession = async () => {
    setLoadingStart(true);
    setStatusMsg(null);
    try {
      // POST /start does not need a Content-Type header when no body is sent
      const res = await fetch(`/api/classes/${encodeURIComponent(classId)}/start`, { method: "POST" });
      if (!res.ok) {
        const msg = await readErrorMessage(res);
        throw new Error(msg);
      }
      const json = await res.json();
      setCode(json.code ?? null);
      setExpiresAt(json.expiresAt ?? null);
      setStatusMsg("Session started");
      toast.success("Session started");
      onSessionStarted?.(json.code ?? null);

      // OPTIONAL: emit socket event (if you have socket.io)
      // window.appSocket?.emit("session:started", { classId, code: json.code });
    } catch (err: any) {
      console.error("startSession error:", err);
      setStatusMsg(`Start failed: ${err?.message ?? "Unknown error"}`);
      toast.error(`Could not start session: ${err?.message ?? "check server"}`);
    } finally {
      setLoadingStart(false);
    }
  };

  const regenerateCode = async () => {
    if (!code) {
      toast.error("No active code — start session first");
      return;
    }
    setLoadingRegen(true);
    setStatusMsg(null);
    try {
      const res = await fetch(`/api/classes/${encodeURIComponent(classId)}/generate-code`, { method: "POST" });
      if (!res.ok) {
        const msg = await readErrorMessage(res);
        throw new Error(msg);
      }
      const json = await res.json();
      setCode(json.code ?? null);
      setExpiresAt(json.expiresAt ?? null);
      setStatusMsg("Code regenerated");
      toast.success("Code regenerated");

      // OPTIONAL: emit socket event (if you have socket.io)
      // window.appSocket?.emit("session:regenerated", { classId, code: json.code });
    } catch (err: any) {
      console.error("regenerateCode error:", err);
      setStatusMsg(`Regenerate failed: ${err?.message ?? "Unknown"}`);
      toast.error(`Could not regenerate code: ${err?.message ?? "check server"}`);
    } finally {
      setLoadingRegen(false);
    }
  };

  const endSession = async () => {
    if (!code) {
      toast.error("No active session to end");
      return;
    }
    if (!confirm("Are you sure you want to end this session? This will stop attendance marking.")) return;

    setLoadingEnd(true);
    setStatusMsg(null);
    try {
      const res = await fetch(`/api/classes/${encodeURIComponent(classId)}/end`, { method: "POST" });
      if (!res.ok) {
        const msg = await readErrorMessage(res);
        throw new Error(msg);
      }
      setCode(null);
      setExpiresAt(null);
      setStatusMsg("Session ended");
      toast.success("Session ended");
      onSessionEnded?.();

      // OPTIONAL: emit socket event (if you have socket.io)
      // window.appSocket?.emit("session:ended", { classId });
    } catch (err: any) {
      console.error("endSession error:", err);
      setStatusMsg(`End failed: ${err?.message ?? "Unknown"}`);
      toast.error(`Could not end session: ${err?.message ?? "check server"}`);
    } finally {
      setLoadingEnd(false);
    }
  };

  const copyCode = async () => {
    if (!code) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        // fallback
        const ta = document.createElement("textarea");
        ta.value = code;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      toast.success("Code copied");
    } catch (err) {
      console.error("copy failed", err);
      toast.error("Copy failed");
    }
  };

  const formattedExpiry = expiresAt ? new Date(expiresAt).toLocaleString() : null;

  return (
    <div className="bg-card rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-3">Session Controls</h2>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={startSession} disabled={loadingStart || !!code} title="Start session (generates code)">
            <Play className="w-4 h-4 mr-2" /> Start Session
          </Button>

          <Button onClick={regenerateCode} disabled={loadingRegen || !code} variant="outline">
            <Repeat className="w-4 h-4 mr-2" /> Regenerate Code
          </Button>

          <Button onClick={endSession} disabled={loadingEnd || !code} variant="destructive">
            <StopCircle className="w-4 h-4 mr-2" /> End Session
          </Button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:gap-6">
          <div className="flex-1">
            <div className="text-sm text-muted-foreground">Alphanumeric Code</div>
            <div className="mt-2 flex items-center gap-2">
              <div
                className="px-4 py-2 rounded-md bg-muted text-xl font-mono tracking-widest"
                aria-live="polite"
                aria-atomic="true"
              >
                {code ?? "—"}
              </div>
              <Button onClick={copyCode} disabled={!code} variant="ghost" title="Copy code to clipboard">
                <Copy className="w-4 h-4" /> Copy
              </Button>
              {formattedExpiry && <div className="text-xs text-muted-foreground ml-2">expires: {formattedExpiry}</div>}
            </div>
          </div>

          <div className="w-full md:w-48 text-center">
            <div className="text-sm text-muted-foreground mb-2">QR for code</div>
            <div className="inline-block p-2 bg-white rounded">
              {code ? (
                <QRCode value={code} size={128} includeMargin={true} />
              ) : (
                <div className="w-32 h-32 flex items-center justify-center text-sm text-muted-foreground" aria-hidden>
                  No code
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          Students can scan the QR or enter the code at the student attendance page. Regenerating the code invalidates the old code.
        </div>

        {/* aria-live region for status messages (screen readers) */}
        <div className="sr-only" aria-live="polite">
          {statusMsg ?? ""}
        </div>
      </div>
    </div>
  );
};

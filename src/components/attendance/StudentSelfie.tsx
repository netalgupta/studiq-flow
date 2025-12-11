// src/components/attendance/StudentSelfie.tsx
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Send, RotateCcw } from "lucide-react";
import { toast } from "sonner";

type Props = {
  classId?: string;
  onMarked?: (result: any) => void;
};

export const StudentSelfie: React.FC<Props> = ({ classId = "active-session", onMarked }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedDataUrl, setCapturedDataUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

  useEffect(() => {
    startCamera(facingMode);
    return () => stopCamera();
  }, [facingMode]);

  const startCamera = async (mode: "user" | "environment") => {
    stopCamera();
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode },
        audio: false,
      });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch (err) {
      console.error("camera start failed", err);
      toast.error("Cannot access camera. Allow camera permission or use a compatible browser.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const v = videoRef.current;
    const c = canvasRef.current;
    c.width = v.videoWidth || 640;
    c.height = v.videoHeight || 480;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(v, 0, 0, c.width, c.height);
    const dataUrl = c.toDataURL("image/jpeg", 0.9);
    setCapturedDataUrl(dataUrl);
  };

  const handleRetake = () => {
    setCapturedDataUrl(null);
  };

  const sendToServer = async () => {
    if (!capturedDataUrl) return toast("Capture image first");
    setIsProcessing(true);
    try {
      const res = await fetch(capturedDataUrl);
      const blob = await res.blob();
      const form = new FormData();
      form.append("photo", blob, "selfie.jpg");
      form.append("method", "selfie");
      const resp = await fetch(`/api/classes/${classId}/attendance/face`, {
        method: "POST",
        body: form,
      });
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || "Server error");
      }
      const json = await resp.json();
      if (json.status === "present") {
        toast.success("Attendance marked (selfie) ✅");
      } else {
        toast.error(json.message || "Face not recognized");
      }
      if (onMarked) onMarked(json);
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark attendance. Check console.");
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleFacing = () => setFacingMode((m) => (m === "user" ? "environment" : "user"));

  return (
    <div className="bg-card rounded-lg p-4">
      <h3 className="text-lg font-medium mb-2">Student Selfie (New)</h3>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <div className="relative rounded overflow-hidden bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full min-h-[200px] object-cover"
            />
            {!videoRef.current && (
              <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                Camera unavailable
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-2">
            <Button onClick={handleCapture}><Camera className="w-4 h-4 mr-2" /> Capture</Button>
            <Button variant="ghost" onClick={toggleFacing}><RotateCcw className="w-4 h-4 mr-2" /> Flip</Button>
            <Button variant="destructive" onClick={() => { stopCamera(); setCapturedDataUrl(null); }}>Stop</Button>
          </div>
        </div>

        <div>
          <div className="bg-muted rounded p-2 min-h-[200px] flex items-center justify-center">
            {capturedDataUrl ? (
              <img src={capturedDataUrl} alt="captured" className="w-full rounded" />
            ) : (
              <div className="text-sm text-muted-foreground">No capture yet — preview will appear here.</div>
            )}
          </div>

          <div className="flex gap-2 mt-2">
            <Button onClick={sendToServer} disabled={!capturedDataUrl || isProcessing}>
              {isProcessing ? "Marking..." : <><Send className="w-4 h-4 mr-2" /> Mark Attendance</>}
            </Button>
            <Button variant="ghost" onClick={handleRetake} disabled={!capturedDataUrl}>Retake</Button>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

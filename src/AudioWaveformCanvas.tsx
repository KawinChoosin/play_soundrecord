
import React, { useRef, useEffect } from "react";

interface AudioWaveformCanvasProps {
  stream: MediaStream;
}

const AudioWaveformCanvas: React.FC<AudioWaveformCanvasProps> = ({
  stream,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    audioContextRef.current = new AudioContext();
    const source = audioContextRef.current.createMediaStreamSource(stream);

    analyserRef.current = audioContextRef.current.createAnalyser();
    analyserRef.current.fftSize = 1024;

    const bufferLength = analyserRef.current.frequencyBinCount;
    dataArrayRef.current = new Uint8Array(bufferLength);

    source.connect(analyserRef.current);

    const draw = () => {
      if (!analyserRef.current || !dataArrayRef.current) return;

      analyserRef.current.getByteTimeDomainData(dataArrayRef.current);

      ctx.fillStyle = "#15172b";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = "#fa374a";
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArrayRef.current[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      animationIdRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      audioContextRef.current?.close();
    };
  }, [stream]);

  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          color: "#ffffff",
          fontSize: "1.2rem",
          marginBottom: "40px",
          animation: "blink 10s ease-in-out 1s infinite",
          fontFamily: "NotoSansThai, sans-serif",
        }}
      >
        Listening...
      </div>

      <canvas
        ref={canvasRef}
        width="340px"
        height="150px"
        style={{
          display: "block",
          backgroundColor: "#15172b",
          border: "1px solid #2c2f4a",
          borderRadius: "20px",
          margin: "0 auto",
        }}
      />
    </div>
  );
};

export default AudioWaveformCanvas;

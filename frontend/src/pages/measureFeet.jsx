import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function FootMeasurement() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Open Camera
  useEffect(() => {
    let stream;

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((s) => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(() => {
        alert("Camera permission denied");
      });

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // ⭐ Capture Frame
  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const capturedImage = canvas.toDataURL("image/jpeg");
    setImage(capturedImage);

    sendImage(capturedImage);
  };

  // ⭐ Send to AI Server
  const sendImage = async (image) => {
  setLoading(true);
  setResult(null);

  try {
    // CALL AI SERVER
    const response = await fetch("http://192.168.1.7:8000/measure", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image }),
    });

    const data = await response.json();

    if (data.error) {
      alert("AI could not detect foot properly");
      return;
    }

    // ⭐ SHOW RESULT
    setResult(data);

    // ⭐ SAVE IN DB (SEPARATE TRY)
    try {
      const token = localStorage.getItem("token");
        await axios.put(
      "http://192.168.1.3:5000/api/profile/foot-size",
        {
          footLengthCm: data.length,
          footWidthCm: data.width,
          euSize: data.eu_size,
          usSize: data.us_size,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Measurement saved in DB");

    } catch (dbError) {
      console.log("⚠ DB save failed but AI worked");
    }

  } catch (err) {
    alert("AI Server not reachable");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-4 pt-24 pb-20">
      {/* Heading */}
      <h1 className="text-4xl font-bold text-center mb-3">
        AI Foot Measurement
      </h1>

      <p className="text-gray-400 text-center max-w-xl mb-8">
        Place your foot on an A4 paper and capture a clear image to get your
        accurate shoe size recommendation.
      </p>

      {/* Camera Container */}
      <div
        className="relative bg-[#111] border border-yellow-500/20 
                    rounded-2xl shadow-2xl p-4"
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-[420px] rounded-xl"
        />

        {/* Glow Border */}
        <div
          className="absolute inset-0 rounded-2xl 
                      ring-1 ring-yellow-500/30 pointer-events-none"
        />
      </div>

      {/* Capture Button */}
      <button
        onClick={captureImage}
        className="mt-8 px-8 py-3 rounded-xl 
                 bg-yellow-500 text-black font-bold 
                 hover:bg-yellow-400 transition 
                 shadow-lg shadow-yellow-500/30"
      >
        Capture Measurement
      </button>

      {/* Loader */}
      {loading && (
        <div className="mt-6 text-yellow-400 text-lg font-semibold animate-pulse">
          Measuring your foot...
        </div>
      )}

      {/* Captured Preview */}
      {image && !result && (
        <img
          src={image}
          alt="Captured preview"
          className="mt-6 w-[260px] rounded-xl border border-yellow-500/20 shadow-lg"
        />
      )}

      {/* Result Card */}
      {result && (
        <div
          className="mt-8 bg-[#111] border border-yellow-500/30 
                      rounded-xl p-6 shadow-xl text-center w-[320px]"
        >
          <h3 className="text-2xl font-bold mb-4 text-yellow-400">
            Measurement Result
          </h3>

          <p className="text-lg mb-2">
            Foot Length:
            <span className="font-bold ml-2">{result.length} cm</span>
          </p>

          <p className="text-lg mb-2">
            Foot Width:
            <span className="font-bold ml-2">{result.width} cm</span>
          </p>

          <p className="text-xl font-bold text-yellow-400 mt-3">
            Recommended Size: US {result.us_size} (EU {result.eu_size})
          </p>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

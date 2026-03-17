import { useEffect, useRef, useState } from "react";

export default function FootMeasurement() {

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [image, setImage] = useState(null);

  // Open camera
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }
    })
    .then(stream => {
      if(videoRef.current){
        videoRef.current.srcObject = stream;
      }
    });
  }, []);

  const captureImage = () => {

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(video,0,0);

    const capturedImage = canvas.toDataURL("image/jpeg");

    setImage(capturedImage);

    sendImage(capturedImage);
  };

  const sendImage = async (image) => {

    const response = await fetch("http://192.168.100.34:8000/measure",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({image})
    });

    const data = await response.json();

    alert(
      "Foot Length: " + data.length + " cm\n" +
      "Foot Width: " + data.width + " cm\n" +
      "Shoe Size: " + data.size
    );
  };

  return (
    <div className="font-sans text-center bg-gray-100 min-h-screen flex flex-col items-center justify-center p-5">

      <h2 className="text-xl font-semibold mb-4">
        Place your foot on A4 paper
      </h2>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-[90%] max-w-[500px] rounded-lg shadow-md"
      />

      <button
        onClick={captureImage}
        className="mt-5 px-6 py-2 text-lg bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        Capture
      </button>

      {image && (
        <img
          src={image}
          alt="preview"
          className="mt-5 w-[90%] max-w-[400px] rounded-lg shadow"
        />
      )}

      <canvas ref={canvasRef} className="hidden"/>

    </div>
  );
}
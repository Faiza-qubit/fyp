import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const INFER_URL = "https://unsalutary-ariya-subgerminally.ngrok-free.dev/infer";

export default function FootTryOn() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const threeCanvasRef = useRef(null);
  const statusRef = useRef(null);
  const lastGoodFeet = useRef([null, null]);
  const shoeModels = useRef([null, null]);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    /* ================= THREE SETUP ================= */
    const scene = new THREE.Scene();
    const camera3D = new THREE.PerspectiveCamera(45, 1, 0.1, 3000);
    camera3D.position.set(0, 0, 1000); // Fixed depth for stable projection

    const renderer = new THREE.WebGLRenderer({
      canvas: threeCanvasRef.current,
      alpha: true,
      antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);

    scene.add(new THREE.AmbientLight(0xffffff, 1.5));
    const dir = new THREE.DirectionalLight(0xffffff, 1);
    dir.position.set(0, 1000, 1000);
    scene.add(dir);

    /* ================= LOAD SHOES ================= */
    const loader = new GLTFLoader();
    for (let i = 0; i < 2; i++) {
      loader.load("/winter_shoe.glb", gltf => {
        const shoe = gltf.scene;
        const box = new THREE.Box3().setFromObject(shoe);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Pivot = Bottom-center of the sole
        shoe.position.sub(center);
        shoe.position.y += size.y / 2;

        const wrapper = new THREE.Group();
        wrapper.add(shoe);
        wrapper.visible = false;
        shoeModels.current[i] = wrapper;
        scene.add(wrapper);
      });
    }

    /* ================= COORDINATE MAPPING (THE FIX) ================= */
    function getWorldPosFromPixels(x, y) {
      // 1. Get the actual rendered size of the video on screen
      const rect = video.getBoundingClientRect();
      
      // 2. Map pixel coordinates (0 to Width) to NDC (-1 to +1)
      const nx = (x / video.videoWidth) * 2 - 1;
      const ny = -(y / video.videoHeight) * 2 + 1;

      // 3. Unproject using a fixed depth (matching camera.z)
      const vec = new THREE.Vector3(nx, ny, 0.5).unproject(camera3D);
      const dir = vec.sub(camera3D.position).normalize();
      const distance = 1000; // Match camera3D.position.z
      return camera3D.position.clone().add(dir.multiplyScalar(distance));
    }

    function mapFootTo3D(det, shoe) {
      if (!det || !shoe || det.keypoints.length < 2) return;
      shoe.visible = true;

      // Swap logic: Usually KP[0] is ankle, KP[last] is toes
      const ankle = det.keypoints[0];
      const toe = det.keypoints[det.keypoints.length - 1];

      /* ---------- POSITIONING ---------- */
      // Project the shoe forward from the ankle towards the toes
      const cx = ankle[0] + (toe[0] - ankle[0]) * 1.5; 
      const cy = ankle[1] + (toe[1] - ankle[1]) * 1.5;

      const targetPos = getWorldPosFromPixels(cx, cy);
      shoe.position.lerp(targetPos, 0.5);

      /* ---------- ROTATION ---------- */
      // Reset rotations to prevent the "tumbling" seen in pic 9
      shoe.rotation.set(0, 0, 0);

      // Angle of the foot on the 2D plane
      const angle2D = Math.atan2(toe[0] - ankle[0], toe[1] - ankle[1]);
      shoe.rotation.y = angle2D; // Rotate around vertical axis
      
      // Flip laces up (fix inversion)
      shoe.rotation.x = Math.PI; 
      // Tilt nose down to match perspective
      shoe.rotateX(Math.PI / 8);

      /* ---------- SCALE ---------- */
      const footLen = Math.hypot(toe[0] - ankle[0], toe[1] - ankle[1]);
      // Fixed scaling factor based on camera distance (1000)
      const scale = footLen / 350; 
      shoe.scale.setScalar(scale);
    }

    /* ================= CAMERA & LOOP ================= */
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      .then(stream => {
        video.srcObject = stream;
        video.onloadedmetadata = () => video.play();
        statusRef.current.innerText = "Camera ready";
      })
      .catch(() => (statusRef.current.innerText = "Camera error"));

    let lastInfer = 0;
    async function loop() {
      if (!video.videoWidth) {
        requestAnimationFrame(loop);
        return;
      }

      // Sync canvas resolution to video source exactly
      if (canvas.width !== video.videoWidth) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        renderer.setSize(video.videoWidth, video.videoHeight, false);
        camera3D.aspect = video.videoWidth / video.videoHeight;
        camera3D.updateProjectionMatrix();
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0);

      const now = performance.now();
      if (now - lastInfer > 120) {
        lastInfer = now;
        canvas.toBlob(async blob => {
          try {
            const form = new FormData();
            form.append("file", blob);
            const res = await fetch(INFER_URL, { method: "POST", body: form });
            const data = await res.json();
            lastGoodFeet.current = data.detections
              .filter(d => d.confidence > 0.6)
              .slice(0, 2);
          } catch {}
        }, "image/jpeg", 0.6);
      }

      lastGoodFeet.current.forEach((det, i) => {
        if (shoeModels.current[i]) mapFootTo3D(det, shoeModels.current[i]);
      });

      renderer.render(scene, camera3D);
      requestAnimationFrame(loop);
    }

    loop();
  }, []);

  return (
    <div style={{ background: "#000", color: "#fff", textAlign: "center", minHeight: "100vh" }}>
      <h3 style={{ padding: "10px" }}>AR Foot Try-On (Alignment Fixed)</h3>
      <p ref={statusRef}>Initializing…</p>

      <div style={{ position: "relative", width: "100%", maxWidth: "500px", margin: "auto", overflow: "hidden" }}>
        <video ref={videoRef} muted playsInline style={{ width: "100%", display: "block" }} />
        {/* Transparent Canvas for Three.js Overlay */}
        <canvas ref={threeCanvasRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }} />
        {/* Canvas used for inference only (hidden) */}
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    </div>
  );
}
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const resultDiv = document.getElementById("result");

let stream;
let lockedPaperRect = null;

// 🔹 STATE
let step = "paper"; // paper → top → side → done
let footWidthMM = 0;
let footLengthMM = 0;

console.log("[INIT] App loaded");

// ---------------- CAMERA ----------------
async function startCamera() {
  stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" }
  });
  video.srcObject = stream;
}

document.getElementById("startBtn").onclick = startCamera;

// ---------------- OPENCV READY ----------------
function waitForCV() {
  if (typeof cv === "undefined") {
    setTimeout(waitForCV, 50);
    return;
  }

  cv.onRuntimeInitialized = () => {
    document.getElementById("captureBtn").onclick = captureHandler;
  };
}
waitForCV();

// ---------------- CAPTURE HANDLER ----------------
function captureHandler() {
  if (!video.videoWidth) {
    alert("Camera not ready");
    return;
  }

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);

  // 🔵 STEP 1 — PAPER (TOP VIEW)
  if (step === "paper") {
    lockedPaperRect = detectA4();
    if (!lockedPaperRect) {
      alert("A4 paper not detected. Try again.");
      return;
    }

    alert("Paper locked.\nNow place foot flat and capture TOP VIEW for WIDTH.");
    step = "top";
    return;
  }

  // 🟢 STEP 2 — TOP VIEW WIDTH
  if (step === "top") {
    const widthPx = detectFootWidth(lockedPaperRect);
    if (widthPx === 0) {
      alert("Foot not detected. Try again.");
      return;
    }

    const mmPerPixel = 210 / lockedPaperRect.width;
    footWidthMM = widthPx * mmPerPixel;

    alert("Width captured.\nNow place foot SIDEWAYS and capture SIDE VIEW for LENGTH.");
    step = "side";
    return;
  }

  // 🟣 STEP 3 — SIDE VIEW LENGTH (FIXED)
  if (step === "side") {
    // 🔴 IMPORTANT FIX: re-detect paper in side view
    const sidePaperRect = detectA4();
    if (!sidePaperRect) {
      alert("Paper not detected in side view. Try again.");
      return;
    }

    const lengthPx = detectFootLength(sidePaperRect);
    if (lengthPx === 0) {
      alert("Foot not detected. Try again.");
      return;
    }

    const mmPerPixel = 297 / sidePaperRect.height;
    footLengthMM = lengthPx * mmPerPixel;

    video.srcObject.getTracks().forEach(t => t.stop());
    showFinalResult();
    step = "done";
  }
}

// ---------------- A4 DETECTION ----------------
function detectA4() {
  let src = cv.imread(canvas);
  let gray = new cv.Mat();
  let edges = new cv.Mat();

  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
  cv.Canny(gray, edges, 50, 150);

  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

  let best = null;
  let maxWidth = 0;

  for (let i = 0; i < contours.size(); i++) {
    let r = cv.boundingRect(contours.get(i));
    let ratio = r.width / r.height;

    if (ratio > 0.45 && ratio < 0.8 && r.width > maxWidth) {
      maxWidth = r.width;
      best = r;
    }
  }

  if (best) {
    cv.rectangle(
      src,
      new cv.Point(best.x, best.y),
      new cv.Point(best.x + best.width, best.y + best.height),
      new cv.Scalar(255, 0, 0, 255),
      3
    );
    cv.imshow(canvas, src);
  }

  src.delete(); gray.delete(); edges.delete();
  contours.delete(); hierarchy.delete();

  return best;
}

// ---------------- TOP VIEW WIDTH ----------------
function detectFootWidth(paperRect) {
  let src = cv.imread(canvas);
  let roi = src.roi(new cv.Rect(paperRect.x, paperRect.y, paperRect.width, paperRect.height));

  let gray = new cv.Mat();
  cv.cvtColor(roi, gray, cv.COLOR_RGBA2GRAY);

  let edges = new cv.Mat();
  cv.Canny(gray, edges, 50, 150);

  let kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(9, 9));
  cv.morphologyEx(edges, edges, cv.MORPH_CLOSE, kernel);

  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

  let bestRect = null;
  let maxArea = 0;

  for (let i = 0; i < contours.size(); i++) {
    let area = cv.contourArea(contours.get(i));
    let r = cv.boundingRect(contours.get(i));
    if (area > maxArea) {
      maxArea = area;
      bestRect = r;
    }
  }

  if (!bestRect) return 0;

  cv.rectangle(
    roi,
    new cv.Point(bestRect.x, bestRect.y),
    new cv.Point(bestRect.x + bestRect.width, bestRect.y + bestRect.height),
    new cv.Scalar(0, 255, 0, 255),
    3
  );

  cv.imshow(canvas, src);

  src.delete(); roi.delete(); gray.delete(); edges.delete();
  contours.delete(); hierarchy.delete();

  return bestRect.width;
}

// ---------------- SIDE VIEW LENGTH ----------------
function detectFootLength(paperRect) {
  let src = cv.imread(canvas);
  let roi = src.roi(new cv.Rect(paperRect.x, paperRect.y, paperRect.width, paperRect.height));

  let gray = new cv.Mat();
  cv.cvtColor(roi, gray, cv.COLOR_RGBA2GRAY);

  let edges = new cv.Mat();
  cv.Canny(gray, edges, 50, 150);

  let kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(9, 9));
  cv.morphologyEx(edges, edges, cv.MORPH_CLOSE, kernel);

  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

  if (contours.size() === 0) return 0;

  let cnt = contours.get(0);
  let minX = 99999, maxX = 0;

  for (let i = 0; i < cnt.data32S.length; i += 2) {
    let x = cnt.data32S[i];
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
  }

  src.delete(); roi.delete(); gray.delete(); edges.delete();
  contours.delete(); hierarchy.delete();

  return maxX - minX;
}

// ---------------- FINAL RESULT ----------------
function showFinalResult() {
  const eu = Math.round((footLengthMM + 15) / 6.67);

  alert(
    `Foot Length: ${footLengthMM.toFixed(1)} mm\n` +
    `Foot Width: ${footWidthMM.toFixed(1)} mm\n` +
    `EU Shoe Size: ${eu}`
  );

  resultDiv.innerHTML = `
    <h3>Final Result</h3>
    <b>Foot Length:</b> ${footLengthMM.toFixed(1)} mm<br>
    <b>Foot Width:</b> ${footWidthMM.toFixed(1)} mm<br>
    <b>EU Shoe Size:</b> ${eu}
  `;
}

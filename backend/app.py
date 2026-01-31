from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from ultralytics import YOLO
import cv2, numpy as np, traceback, os

app = FastAPI()

# -------- CORS --------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------- YOLO MODEL --------
model = YOLO("best.pt")

# -------- API FIRST (IMPORTANT) --------
@app.post("/infer")
async def infer(file: UploadFile = File(...)):
    try:
        img = cv2.imdecode(
            np.frombuffer(await file.read(), np.uint8),
            cv2.IMREAD_COLOR
        )
        if img is None:
            return JSONResponse(400, {"error": "Invalid image"})

        results = model(img)[0]
        detections = []

        if results.boxes is not None and results.keypoints is not None:
            boxes = results.boxes.xyxy.cpu().numpy()
            scores = results.boxes.conf.cpu().numpy()
            kps = results.keypoints.xy.cpu().numpy()

            for i in range(len(boxes)):
                if scores[i] < 0.3:
                    continue
                detections.append({
                    "bbox": boxes[i].tolist(),
                    "confidence": float(scores[i]),
                    "keypoints": kps[i].tolist()
                })

        return {"detections": detections}

    except Exception as e:
        traceback.print_exc()
        return JSONResponse(500, {"error": str(e)})

# -------- FRONTEND MOUNT LAST --------
FRONTEND_BUILD = os.path.join(
    "..",
    "frontend",
    "foot-3d-app",
    "build"
)

app.mount(
    "/",
    StaticFiles(directory=FRONTEND_BUILD, html=True),
    name="frontend",
)

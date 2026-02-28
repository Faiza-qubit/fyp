from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from ultralytics import YOLO
import cv2
import numpy as np
import traceback

app = FastAPI()

# ================= CORS FIX =================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*",                       # dev
        "http://localhost:3000",
        "https://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= LOAD MODEL =================
model = YOLO("best.pt")

print("✅ YOLO model loaded")

# ================= INFERENCE API =================
@app.post("/infer")
async def infer(file: UploadFile = File(...)):
    try:
        print("🔥 /infer called")

        contents = await file.read()

        img = cv2.imdecode(
            np.frombuffer(contents, np.uint8),
            cv2.IMREAD_COLOR
        )

        if img is None:
            return JSONResponse(
                status_code=400,
                content={"error": "Invalid image"}
            )

        results = model(img)[0]

        detections = []

        if (
            results.boxes is not None
            and results.keypoints is not None
        ):

            boxes = results.boxes.xyxy.cpu().numpy()
            scores = results.boxes.conf.cpu().numpy()
            kps = results.keypoints.xy.cpu().numpy()

            for i in range(len(boxes)):

                if scores[i] < 0.3:
                    continue

                # ✅ CONVERT xyxy → xywh
                x1, y1, x2, y2 = boxes[i]

                detections.append({
                    "bbox": [
                        float(x1),
                        float(y1),
                        float(x2 - x1),
                        float(y2 - y1)
                    ],
                    "confidence": float(scores[i]),
                    "keypoints": kps[i].tolist()
                })

        return {"detections": detections}

    except Exception as e:
        traceback.print_exc()

        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )
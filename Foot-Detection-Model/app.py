from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from ultralytics import YOLO
import cv2
import numpy as np
import traceback

app = FastAPI(title="Foot Keypoints Detection")

# CORS - allows mobile browser access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Load trained model
model = YOLO("best.pt")

# Serve static files (index.html)
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def root():
    return FileResponse("static/index.html")

@app.post("/infer")
async def infer(file: UploadFile = File(...)):
    try:
        print("\n================ NEW REQUEST ================")

        image_bytes = await file.read()
        np_img = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

        if img is None:
            print("Image decode failed")
            return JSONResponse(status_code=400, content={"error": "Invalid image"})

        h, w = img.shape[:2]
        print(f"🖼 Image received: {w}x{h}")

        # Run inference
        results = model(img)[0]

        detections = []

        if results.boxes is None or results.keypoints is None:
            print("No boxes or keypoints returned")
        else:
            boxes = results.boxes.xyxy.cpu().numpy()
            scores = results.boxes.conf.cpu().numpy()
            keypoints = results.keypoints.xy.cpu().numpy()

            print(f"🔍 Total raw detections: {len(boxes)}")

            for i in range(len(boxes)):
                conf = float(scores[i])
                print(f"\nDetection {i} | Conf: {conf:.3f}")
                print("BBox:", boxes[i])
                print("Keypoints:", keypoints[i])

                if conf < 0.3:
                    print("Skipped (low confidence)")
                    continue

                detections.append({
                    "bbox": boxes[i].tolist(),
                    "confidence": conf,
                    "keypoints": keypoints[i].tolist()
                })

        print(f"\nSending {len(detections)} detections to frontend")
        print("============================================\n")

        return {
            "orig_shape": [h, w],
            "detections": detections
        }

    except Exception as e:
        print("SERVER ERROR")
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )
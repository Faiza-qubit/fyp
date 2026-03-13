from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import cv2
import numpy as np
import traceback

app = FastAPI()

# ================= CORS =================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= LOAD MODEL =================
print("Loading YOLO model...")
model = YOLO("best.pt")
print("YOLO model loaded successfully\n")


# ================= INFERENCE =================
@app.post("/infer")
async def infer(file: UploadFile = File(...)):

    try:
        print("\n==============================")
        print("🔥 /infer API CALLED")
        print("Received file:", file.filename)

        contents = await file.read()
        print("File size:", len(contents), "bytes")

        img = cv2.imdecode(
            np.frombuffer(contents, np.uint8),
            cv2.IMREAD_COLOR
        )

        if img is None:
            print("❌ Error: Invalid image received")
            return {"error": "Invalid image"}

        h, w, c = img.shape

        print("\n📷 IMAGE INFORMATION")
        print("Height:", h)
        print("Width :", w)
        print("Channels:", c)

        print("\n🚀 Running YOLO inference...")
        results = model(img)[0]
        print("Inference completed")

        detections = []

        if results.boxes is not None:

            boxes = results.boxes.xyxy.cpu().numpy()
            scores = results.boxes.conf.cpu().numpy()

            print("\n📦 Total detections:", len(boxes))

            if results.keypoints is not None:
                keypoints = results.keypoints.xy.cpu().numpy()
                print("🦶 Keypoints detected:", keypoints.shape)
            else:
                keypoints = None
                print("⚠️ No keypoints found")

            for i in range(len(boxes)):

                x1, y1, x2, y2 = boxes[i]
                conf = scores[i]

                width = x2 - x1
                height = y2 - y1

                print("\n------ Detection", i, "------")
                print("Confidence :", conf)
                print("x1 :", x1)
                print("y1 :", y1)
                print("x2 :", x2)
                print("y2 :", y2)

                kp_list = []

                if keypoints is not None:
                    for kp in keypoints[i]:
                        kp_list.append([float(kp[0]), float(kp[1])])

                detections.append({
                    "bbox": [float(x1), float(y1), float(x2), float(y2)],
                    "confidence": float(conf),
                    "keypoints": kp_list
                })

        else:
            print("⚠️ No bounding boxes detected")

        print("\n📤 Detections being sent to frontend:")
        print(detections)

        print("\n✅ Detection process finished")
        print("==============================\n")

        return {"detections": detections}

    except Exception as e:

        print("\n❌ ERROR OCCURRED")
        traceback.print_exc()

        return {"error": str(e)}
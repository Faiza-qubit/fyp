from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ultralytics import YOLO
import base64
import numpy as np
import cv2
import traceback

# Import your measurement functions
from measurement import measure_foot, foot_to_shoe_size

app = FastAPI()

# ================= CORS =================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= LOAD MODELS =================
print("\n==============================")
print("Loading YOLO models...")

try:
    model = YOLO("best.pt")     # Try-on model
    print("✅ best.pt loaded successfully")

    yolo_measure_model = YOLO("model.pt")   # Measurement model
    print("✅ model.pt loaded successfully")

except Exception as e:
    print("❌ Error loading YOLO models")
    traceback.print_exc()

print("==============================\n")

# ================= DATA MODEL =================
class ImageData(BaseModel):
    image: str


# ================= IMAGE DECODING =================
def decode_image(base64_string):
    try:
        print("📷 Decoding base64 image...")

        image_data = base64_string.split(",")[1]
        image_bytes = base64.b64decode(image_data)

        np_arr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if image is None:
            print("❌ cv2.imdecode failed")
            return None

        print("✅ Image decoded successfully")
        print("Image shape:", image.shape)

        return image

    except Exception:
        print("❌ Error decoding image")
        traceback.print_exc()
        return None


# ================= FOOT MEASUREMENT =================
def calculate_foot_size(image):

    try:
        print("\n🚀 Running YOLO measurement model...")

        results = yolo_measure_model(image)

        if results is None:
            print("❌ YOLO returned no results")
            return None

        result = results[0]

        if result.boxes is None:
            print("❌ No boxes detected")
            return None

        if result.masks is None:
            print("❌ No masks detected")
            return None

        masks = result.masks.data.cpu().numpy()
        classes = result.boxes.cls.cpu().numpy()

        print("Detected objects:", len(classes))

        paper_mask = None
        foot_mask = None

        for i, cls in enumerate(classes):

            print("Detected class:", int(cls))

            if int(cls) == 0:
                print("📄 A4 paper detected")
                paper_mask = masks[i]

            elif int(cls) == 1:
                print("🦶 Foot detected")
                foot_mask = masks[i]

        if paper_mask is None:
            print("❌ Paper not detected")

        if foot_mask is None:
            print("❌ Foot not detected")

        if paper_mask is None or foot_mask is None:
            return None

        print("📏 Calculating measurements...")

        result = measure_foot(image, paper_mask, foot_mask)

        if result is None:
            print("❌ Measurement algorithm failed")
            return None

        foot_length_cm, foot_width_cm = result

        print("Foot Length:", foot_length_cm)
        print("Foot Width :", foot_width_cm)

        shoe_size = foot_to_shoe_size(foot_length_cm)

        print("Shoe Size:", shoe_size)

        return {
            "length": foot_length_cm,
            "width": foot_width_cm,
            "size": shoe_size
        }

    except Exception:
        print("❌ Error during measurement")
        traceback.print_exc()
        return None


# ================= ROUTES =================
@app.get("/")
def home():
    print("Home route accessed")
    return {"message": "Foot Measurement & Try-On API is running"}


# ================= TRY-ON API =================
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

# ================= FOOT MEASUREMENT API =================
@app.post("/measure")
async def measure(data: ImageData):

    try:
        print("\n==============================")
        print("📥 /measure API CALLED")

        if not data.image:
            print("❌ No image received")
            return {"error": "No image received"}

        image = decode_image(data.image)

        if image is None:
            print("❌ Image decoding failed")
            return {"error": "Image decoding failed"}

        result = calculate_foot_size(image)

        if result is None:
            print("⚠️ Foot or paper not detected")
            return {"error": "Foot or paper not detected"}

        print("✅ Measurement successful")
        print("==============================\n")

        return result

    except Exception:
        print("❌ Error in /measure API")
        traceback.print_exc()
        return {"error": "Measurement failed"}
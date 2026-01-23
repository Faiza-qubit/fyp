# 👟 SizeWise – AI-Based Foot Measurement & Virtual Try-On System
---

## 📌Project Overview
SizeWise is an AI-powered e-commerce web application designed to improve online shoe shopping by addressing the common issue of incorrect shoe sizing. The system integrates **computer vision**, **machine learning**, and **web technologies** to provide accurate foot measurement, virtual try-on, and intelligent shoe size recommendations, along with complete e-commerce functionality.

---

## ❓Problem Statement
Online shoe shopping suffers from a high return rate due to incorrect size selection. Traditional size charts do not consider individual foot shape, width, or brand-specific variations. Additionally, most platforms lack real-time visual feedback to help users understand how shoes will look and fit before purchase. This results in customer dissatisfaction and increased operational costs for retailers.

---

## 💡Proposed Solution
SizeWise provides an integrated solution by combining:
- AI-based foot measurement using computer vision
- AR-based virtual shoe try-on
- Intelligent size recommendation
- A complete e-commerce platform with secure payments

The system allows users to measure their foot using a camera, visualize shoes virtually, receive accurate size recommendations, and complete purchases securely.

---

## 🛠️ Tools & Technologies

### Frontend
- **React.js**
- **Tailwind CSS** (UI styling)
- HTML5, CSS3, JavaScript
- WebXR & Three.js (for AR try-on – planned)

### Backend
- **Node.js**
- **Express.js**
- RESTful APIs

### Database
- **MongoDB Atlas** (cloud-based NoSQL database)

### AI & Computer Vision
- **YOLOv8 Pose Model** (trained for foot detection & keypoint extraction)
- OpenCV
- Python (model training & evaluation)

### Payments & External APIs
- **Stripe Payment Gateway** 

### Tools & Platforms
- Git & GitHub
- VS Code
- Postman
- Jupyter Notebook / Google Colab

---

## External Services Used
- **Stripe** – Secure online payment processing  
- **MongoDB Atlas** – Cloud database for users, products, orders, and measurements  


---

## ✅ Implemented Features

### User Features
- User Login & Signup  
- Product browsing and search  
- Add to cart and checkout  
- Secure Stripe payment checkout  
- Feedback form (working)  

### Admin Features
- Admin dashboard  
- Product management (add/update/delete)  
- Inventory and stock management  
- Order monitoring  

### AI & Intelligent Features
- YOLOv8 Pose model trained for foot detection and keypoints  
- Foot measurement module (model training completed)  
- AR Virtual Try-On (In progress)

---

## ⚙️ Backend Overview

The backend is built using **Express.js** and connects to **MongoDB Atlas**. It exposes RESTful APIs for shoes, products, cart, and orders.

### Main API Routes
- `/api/shoes`  
- `/api/products`  
- `/api/cart`  
- `/api/orders`  

### Middleware
- CORS handling  
- JSON body parsing  
- Environment configuration using dotenv  

---

## 🚀 Installation Steps

### Prerequisites
- Node.js  
- MongoDB Atlas account  
- Stripe account  

## ▶️ Run the Project
```bash
npm install
npm run dev
```

## 👥 Team Members

<div align="center">

<table>
  <tr>
    <th>Name</th>
    <th>Role</th>
  </tr>
  <tr>
    <td>Faiza Gull</td>
    <td>Model Training + Login/Signup</td>
  </tr>
  <tr>
    <td>Anum Asghar</td>
    <td>Model Training Accuracy + Dataset maintainance</td>
  </tr>
  <tr>
    <td>Mahnoor Ishaq</td>
    <td>Foot Measurmnets + Annotations</td>
  </tr>
  <tr>
    <td>M. Muneeb Amir</td>
    <td>E-Commerce Backend & Payment Integration</td>
  </tr>
</table>

</div>

## 📄License
This project is licensed under the **MIT License**.

---

## 📊 Project Status
- ✔ E-commerce platform completed  
- ✔ Stripe payment integration completed  
- ✔ Admin panel completed  
- ✔ YOLOv8 Pose model trained  
- ⏳ Virtual Try-On integration (in progress)  

# 📋 Project Requirements – SizeWise

SizeWise is an AI-powered e-commerce web application that addresses the problem of incorrect shoe sizing in online shopping. The project defines requirements for integrating computer vision, machine learning, and modern web technologies to support accurate foot measurement, virtual try-on functionality, intelligent shoe size recommendations, and standard e-commerce operations within a single system.

---

## ⚙️ Functional Requirements

### FR-1 User Registration & Authentication
- The system shall support secure user registration and login.
- User credentials shall be stored in encrypted form.
- Authenticated users shall have access to personalized features.

---
### FR-2 Product Browsing & Search
- The system shall allow users to browse available shoes.
- The system shall provide product search functionality using keywords.
- Product details including price, size, and description shall be displayed.

---

### FR-3 Shopping Cart & Checkout
- The system shall allow users to add and remove items from the cart.
- The system shall support a checkout process for placing orders.
- Order details shall be stored in the database.

---

### FR-4 Payment Processing
- The system shall integrate secure online payment processing using **Stripe**.
- Payment status shall be verified before order confirmation.
- The system shall generate confirmation for successful payments.

---

### FR-5 Admin Management
- The system shall provide admin functionality for product management.
- Admin users shall be able to add, update, and delete products.
- The system shall support inventory and stock management.
- Admin users shall be able to monitor customer orders.

---

### FR-6 AI-Based Foot Measurement
- The system shall include AI-based foot detection using a trained **YOLOv8 Pose model**.
- The system shall extract foot keypoints for measurement purposes.
- Measurement results shall be stored to support shoe size recommendation.

---

### FR-7 Virtual Try-On (In Progress)
- The system shall include support for virtual shoe visualization using AR.
- Virtual try-on functionality shall use foot measurements for alignment.
- This feature is currently under development.

---

## 🔐 Non-Functional Requirements

### NFR-1 Security
- Sensitive data shall not be stored in the public repository.
- Environment variables shall be managed using `.env` files.
- Payment processing shall comply with Stripe security standards.

---

### NFR-2 Performance
- The system shall respond to user requests within acceptable time limits.
- API responses shall be optimized for normal user load.

---

### NFR-3 Usability
- The system shall provide a simple and user-friendly interface.
- The application shall be responsive across different screen sizes.

---

### NFR-4 Scalability
- The system shall support future expansion of users and products.
- MongoDB Atlas shall be used to handle scalable data storage.

---

### NFR-5 Maintainability
- The codebase shall follow a modular design approach.
- Frontend, backend, and AI modules shall be maintained separately.
- GitHub shall be used for version control and team collaboration.

---

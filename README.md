# 🐾 Pet Match — Pet Adoption & Care Portal

A full-stack web application that connects pets with loving homes. Pet Match allows users to browse and post adoption listings, read and write blogs, book vet appointments, and donate to animal welfare — all in one platform.

---

## 🚀 Features

### 🔐 Authentication
- Session-based authentication using **Passport.js** (local strategy)
- Secure password hashing via **passport-local-mongoose**
- Flash messages for login/signup feedback via **connect-flash**
- Protected routes with custom middleware

### 🐶 Pet Adoption
- Browse all available pets for adoption
- Post new adoption listings with images
- View detailed pet profiles
- Image upload handled by **Multer** + stored on **Cloudinary**

### 📝 Blog System
- Create, read, and manage blog posts related to pet care
- Community-driven content for pet owners and adopters

### 💰 Donation Module
- Donate to support animal welfare initiatives
- Integrated donation flow within the platform

### 📅 Appointment Booking
- Book appointments for pet consultations or vet visits
- Manage upcoming appointments

### 📧 Email Notifications
- Automated email notifications via **Nodemailer**
- Triggered on key actions (booking confirmations, etc.)

### 📄 PDF Generation
- Generate PDF documents (e.g., adoption forms, receipts) using **pdf-creator-node**

### ✅ Validation
- Server-side schema validation using **Joi**
- Consistent error handling with **express-async-handler**

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express.js |
| Frontend | EJS, EJS-Mate, HTML, CSS |
| Database | MongoDB, Mongoose |
| Authentication | Passport.js, express-session |
| File Upload | Multer, Cloudinary |
| Email | Nodemailer |
| Validation | Joi |
| PDF | pdf-creator-node |
| Utilities | dotenv, method-override, axios, connect-flash |

---

## 📁 Project Structure

```
Pet-adoption-and-care-portal/
├── cloudinary/         # Cloudinary configuration
├── mail/               # Nodemailer email templates & config
├── model/              # Mongoose schemas (User, Pet, Blog, etc.)
├── public/             # Static assets (CSS, JS, images)
├── routes/             # Express route handlers
├── seeds/              # Seed data for development
├── views/              # EJS templates
├── middleware.js        # Auth & validation middleware
├── validateSchema.js   # Joi validation schemas
└── index.js            # App entry point
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Cloudinary account
- Gmail or SMTP account (for Nodemailer)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/AmanMishra2003/Pet-adoption-and-care-portal.git
cd Pet-adoption-and-care-portal
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:
```env
MONGO_URL=your_mongodb_connection_string
SESSION_SECRET=your_session_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

4. **(Optional) Seed the database**
```bash
node seeds/index.js
```

5. **Start the server**
```bash
npm start
```

The app will run at `http://localhost:3000`

---

## 📸 Demo

[Watch Demo on LinkedIn](https://www.linkedin.com/posts/amanmishra2003_petmatch-petadoption-techforgood-activity-7214339566227349504-f7iI)

---

## 👨‍💻 Author

**Aman Mishra**
- GitHub: [@AmanMishra2003](https://github.com/AmanMishra2003)
- LinkedIn: [amanmishra2003](https://www.linkedin.com/in/amanmishra2003)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

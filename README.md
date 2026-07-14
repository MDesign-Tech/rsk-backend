<<<<<<< HEAD
# RSK Associates - Backend API

A lightweight REST API backend for RSK Associates corporate company website CMS.

## Technology Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- HttpOnly Cookies
- bcrypt
- Multer (local file storage)
- dotenv
- cookie-parser
- cors
- helmet
- express-validator

## Folder Structure

```
├── .env
├── .env.example
├── .gitignore
├── package.json
├── README.md
├── app.js
├── server.js
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── heroController.js
│   ├── serviceController.js
│   ├── aboutController.js
│   ├── missionVisionController.js
│   ├── partnerController.js
│   ├── faqController.js
│   ├── teamController.js
│   └── contactController.js
├── middleware/
│   ├── auth.js
│   ├── errorHandler.js
│   └── upload.js
├── models/
│   ├── User.js
│   ├── HeroContent.js
│   ├── Service.js
│   ├── AboutUs.js
│   ├── MissionVision.js
│   ├── Partner.js
│   ├── FAQ.js
│   ├── TeamMember.js
│   └── ContactMessage.js
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── heroRoutes.js
│   ├── serviceRoutes.js
│   ├── aboutRoutes.js
│   ├── missionVisionRoutes.js
│   ├── partnerRoutes.js
│   ├── faqRoutes.js
│   ├── teamRoutes.js
│   └── contactRoutes.js
├── validators/
│   ├── authValidator.js
│   ├── userValidator.js
│   ├── heroValidator.js
│   ├── serviceValidator.js
│   ├── aboutValidator.js
│   ├── missionVisionValidator.js
│   ├── partnerValidator.js
│   ├── faqValidator.js
│   ├── teamValidator.js
│   └── contactValidator.js
├── src/
│   └── utils/
│       └── seed.js
├── uploads/
│   └── .gitkeep
└── public/
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and configure your environment variables
4. Make sure MongoDB is running

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/rsk-associates
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d
COOKIE_EXPIRE=7
```

## Running the Project

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## Seed Admin

Create the default admin user:

```bash
npm run seed
```

Default credentials:
- Email: `admin@rskassociates.com`
- Password: `Admin123!`

## API Routes

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Hero Content (Admin only)
- `GET /api/hero` - Get hero content
- `PUT /api/hero` - Update hero content
- `POST /api/hero/upload` - Upload hero background image

### Services (Admin only)
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get single service
- `POST /api/services` - Create service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### About Us (Admin only)
- `GET /api/about` - Get about us content
- `PUT /api/about` - Update about us content

### Mission Vision (Admin only)
- `GET /api/mission-vision` - Get mission and vision
- `PUT /api/mission-vision` - Update mission and vision

### Partners (Admin only)
- `GET /api/partners` - Get all partners
- `GET /api/partners/:id` - Get single partner
- `POST /api/partners` - Create partner
- `PUT /api/partners/:id` - Update partner
- `DELETE /api/partners/:id` - Delete partner

### FAQs (Admin only)
- `GET /api/faqs` - Get all FAQs
- `GET /api/faqs/:id` - Get single FAQ
- `POST /api/faqs` - Create FAQ
- `PUT /api/faqs/:id` - Update FAQ
- `DELETE /api/faqs/:id` - Delete FAQ

### Team Members (Admin only)
- `GET /api/team` - Get all team members
- `GET /api/team/:id` - Get single team member
- `POST /api/team` - Create team member
- `PUT /api/team/:id` - Update team member
- `DELETE /api/team/:id` - Delete team member
- `POST /api/team/:id/upload` - Upload team member image

### Contact Messages
- `POST /api/contact` - Submit contact message (Public)
- `GET /api/contact` - Get all messages (Admin only)
- `GET /api/contact/:id` - Get single message (Admin only)
- `DELETE /api/contact/:id` - Delete message (Admin only)

## Authentication

All management endpoints are protected. Use the login endpoint to get an access token stored in an HttpOnly cookie.

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@rskassociates.com",
  "password": "Admin123!"
}
```

## Uploads

Images are stored locally in the `/uploads` directory. Uploaded files are served statically at `/uploads/:filename`.

Supported formats: JPEG, JPG, PNG, WEBP
Maximum file size: 5MB

Only hero background image and team member image uploads are supported.

## API Responses

### Success
```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

### Error
```json
{
  "success": false,
  "message": "...",
  "errors": []
}
```

## Security

- Helmet for security headers
- CORS configured
- HttpOnly cookies for JWT
- Password hashing with bcrypt
- Input validation with express-validator

## License

ISC
=======
# rsk-backend
>>>>>>> 5fa3ad39fe1b025fa6b77e1b0e07ea44a0fecbc2

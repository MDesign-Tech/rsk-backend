require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const heroRoutes = require('./routes/heroRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const missionVisionRoutes = require('./routes/missionVisionRoutes');
const partnerRoutes = require('./routes/partnerRoutes');
const faqRoutes = require('./routes/faqRoutes');
const teamRoutes = require('./routes/teamMemberRoutes');
const teamSectionRoutes = require('./routes/teamSectionRoutes');
const contactRoutes = require('./routes/contactRoutes');
const websiteRoute = require('./routes/website.routes')
const newsRoutes = require('./routes/newsRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const opportunityRoutes = require('./routes/opportunityRoutes');
const opportunityTypeRoutes = require('./routes/opportunityTypeRoutes');
const whyJoinUsRoutes = require('./routes/whyJoinUsRoutes');
const whyBecomeMemberRoutes = require('./routes/whyBecomeMemberRoutes');

const app = express();

// Request logging middleware
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
});



// Connect to database a
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("DB connection error in middleware:", err.message);
    next(err);
  }
});
  
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Simple test route to verify routing works
app.get('/api/test', (req, res) => {
  console.log("Test route handler executing");
  res.json({ success: true, message: "Test route works" });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/mission-vision', missionVisionRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/team-sections', teamSectionRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/website', websiteRoute)
app.use('/api/news', newsRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/opportunity-types', opportunityTypeRoutes);
app.use('/api/why-join-us', whyJoinUsRoutes);
app.use('/api/why-become-member', whyBecomeMemberRoutes);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'RSK Associates API is running',
    version: '1.0.0',
  });
});

app.use(errorHandler);

module.exports = app;

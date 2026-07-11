require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const heroRoutes = require('./routes/heroRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const missionVisionRoutes = require('./routes/missionVisionRoutes');
const partnerRoutes = require('./routes/partnerRoutes');
const faqRoutes = require('./routes/faqRoutes');
const teamRoutes = require('./routes/teamMemberRoutes');
const contactRoutes = require('./routes/contactRoutes');
const websiteRoute = require('./routes/website.routes')

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? true : 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/mission-vision', missionVisionRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/website', websiteRoute)

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'RSK Associates API is running',
    version: '1.0.0',
  });
});

app.use(errorHandler);

module.exports = app;

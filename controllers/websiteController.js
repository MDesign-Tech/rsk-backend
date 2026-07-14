const Hero = require('../models/HeroContent')
const About = require("../models/AboutUs");
const MissionVision = require("../models/MissionVision");
const Service = require("../models/Service");
const Partner = require("../models/Partner");
const FAQ = require("../models/FAQ");
const TeamMember = require("../models/TeamMember");

exports.getWebsiteContent = async (req, res, next) => {
  try {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Request timeout: database query took too long")), 10000);
    });

    const [
      hero,
      about,
      missionVision,
      services,
      partners,
      faqs,
      teamMembers
    ] = await Promise.race([
      Promise.all([
        Hero.findOne(),
        About.findOne(),
        MissionVision.findOne(),
        Service.find(),
        Partner.find(),
        FAQ.find(),
        TeamMember.find()
      ]),
      timeoutPromise
    ]);

    res.json({
      success: true,
      data: {
        hero,
        about,
        missionVision,
        services,
        partners,
        faqs,
        teamMembers
      }
    });
  } catch (error) {
    console.error("Error fetching website content:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch website content",
      error: error.message
    });
  }
};

const Hero = require('../models/HeroContent')
const About = require("../models/AboutUs");
const MissionVision = require("../models/MissionVision");
const Service = require("../models/Service");
const Partner = require("../models/Partner");
const FAQ = require("../models/FAQ");
const TeamMember = require("../models/TeamMember");

exports.getWebsiteContent = async (req, res, next) => {
  try {
    console.log("Starting website content fetch...");

    const hero = await Hero.findOne();
    console.log("Hero fetched:", !!hero);

    const about = await About.findOne();
    console.log("About fetched:", !!about);

    const missionVision = await MissionVision.findOne();
    console.log("MissionVision fetched:", !!missionVision);

    const services = await Service.find();
    console.log("Services fetched count:", services.length);

    const partners = await Partner.find();
    console.log("Partners fetched count:", partners.length);

    const faqs = await FAQ.find();
    console.log("FAQs fetched count:", faqs.length);

    const teamMembers = await TeamMember.find();
    console.log("TeamMembers fetched count:", teamMembers.length);

    console.log("All queries completed successfully");

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

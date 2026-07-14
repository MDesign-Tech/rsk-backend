const Hero = require('../models/HeroContent')
const About = require("../models/AboutUs");
const MissionVision = require("../models/MissionVision");
const Service = require("../models/Service");
const Partner = require("../models/Partner");
const FAQ = require("../models/FAQ");
const TeamMember = require("../models/TeamMember");

exports.getWebsiteContent = async (req, res) => {
    const [
        hero,
        about,
        missionVision,
        services,
        partners,
        faqs,
        teamMembers
    ] = await Promise.all([
        Hero.findOne(),
        About.findOne(),
        MissionVision.findOne(),
        Service.find(),
        Partner.find(),
        FAQ.find(),
        TeamMember.find()
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
};
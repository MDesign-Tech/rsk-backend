const Hero = require('../models/HeroContent')
const About = require("../models/AboutUs");
const MissionVision = require("../models/MissionVision");
const Service = require("../models/Service");
const Partner = require("../models/Partner");
const FAQ = require("../models/FAQ");
const TeamMember = require("../models/TeamMember");
const TeamSection = require("../models/TeamSection");

// Keep only the visible social media platforms.
const filterSocialMedia = (socialMedia) => {
  if (!socialMedia) return socialMedia;
  const filtered = {};
  for (const [platform, value] of Object.entries(socialMedia)) {
    if (value && value.visible !== false) {
      filtered[platform] = value;
    }
  }
  return filtered;
};

// Strip hidden sub-items (stats, contactMethods) and hidden social platforms
// from the About document so the frontend never receives invisible data.
const filterAbout = (about) => {
  if (!about) return about;
  const doc = about.toObject ? about.toObject() : { ...about };
  doc.stats = (doc.stats || []).filter((s) => s.visible !== false);
  doc.contactMethods = (doc.contactMethods || []).filter((c) => c.visible !== false);
  doc.socialMedia = filterSocialMedia(doc.socialMedia);
  return doc;
};

exports.getWebsiteContent = async (req, res, next) => {
  try {
    console.log("Starting website content fetch...");

    const hero = await Hero.findOne();
    console.log("Hero fetched:", !!hero);

    const rawAbout = await About.findOne();
    const about = filterAbout(rawAbout);
    console.log("About fetched:", !!rawAbout);

    // MissionVision is a single document; only return it when visible.
    const missionVisionDoc = await MissionVision.findOne();
    const missionVision =
      missionVisionDoc && missionVisionDoc.visible !== false ? missionVisionDoc : null;
    console.log("MissionVision fetched:", !!missionVision);

    // Only visible items are served to the public website.
    const services = await Service.find({ visible: { $ne: false } });
    console.log("Services fetched count:", services.length);

    const partners = await Partner.find({ visible: { $ne: false } });
    console.log("Partners fetched count:", partners.length);

    const faqs = await FAQ.find({ visible: { $ne: false } });
    console.log("FAQs fetched count:", faqs.length);

    // Team: only visible members that belong to visible sections.
    const visibleSections = await TeamSection.find({ visible: { $ne: false } });
    const visibleSectionIds = visibleSections.map((s) => s._id);
    const rawTeamMembers = await TeamMember.find({
      visible: { $ne: false },
      section: { $in: visibleSectionIds },
    });
    // Strip hidden social media platforms from each member.
    const teamMembers = rawTeamMembers.map((member) => {
      const doc = member.toObject ? member.toObject() : { ...member };
      doc.socialMedia = filterSocialMedia(doc.socialMedia);
      return doc;
    });
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

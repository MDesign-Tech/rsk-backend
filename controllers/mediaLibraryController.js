const crypto = require("crypto");
const HeroContent = require("../models/HeroContent");
const Service = require("../models/Service");
const TeamMember = require("../models/TeamMember");
const News = require("../models/News");
const Opportunity = require("../models/Opportunity");
const Partner = require("../models/Partner");
const WhyJoinUs = require("../models/WhyJoinUs");
const WhyBecomeMember = require("../models/WhyBecomeMember");

// Helper to extract public_id from Cloudinary URL
function extractPublicIdFromUrl(url) {
  if (!url || typeof url !== "string") return null;
  
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");
    // Cloudinary URL pattern: /image/upload/v{version}/{public_id}.{format}
    // or /image/upload/{public_id}.{format}
    const uploadIndex = pathParts.indexOf("upload");
    if (uploadIndex === -1 || uploadIndex + 1 >= pathParts.length) return null;
    
    // Get everything after "upload"
    const afterUpload = pathParts.slice(uploadIndex + 1);
    // Remove version prefix if present (e.g., "v1234567890")
    if (afterUpload.length > 0 && afterUpload[0].startsWith("v") && /^\d+$/.test(afterUpload[0].slice(1))) {
      afterUpload.shift();
    }
    
    // Join the remaining parts and remove extension
    const publicIdWithExt = afterUpload.join("/");
    const lastDotIndex = publicIdWithExt.lastIndexOf(".");
    if (lastDotIndex > -1) {
      return publicIdWithExt.substring(0, lastDotIndex);
    }
    return publicIdWithExt;
  } catch {
    return null;
  }
}

// Scan all collections for a given public_id and return references
async function findImageReferences(publicId) {
  const references = [];

  // HeroContent
  const hero = await HeroContent.findOne({ imagePublicId: publicId });
  if (hero) {
    references.push({
      collection: "HeroContent",
      documentId: hero._id.toString(),
      field: "imagePublicId",
      label: hero.title || "Hero Content",
    });
  }

  // Service
  const service = await Service.findOne({ imagePublicId: publicId });
  if (service) {
    references.push({
      collection: "Service",
      documentId: service._id.toString(),
      field: "imagePublicId",
      label: service.title || "Service",
    });
  }

  // TeamMember
  const teamMember = await TeamMember.findOne({ imagePublicId: publicId });
  if (teamMember) {
    references.push({
      collection: "TeamMember",
      documentId: teamMember._id.toString(),
      field: "imagePublicId",
      label: teamMember.name || "Team Member",
    });
  }

  // Opportunity
  const opportunity = await Opportunity.findOne({ imagePublicId: publicId });
  if (opportunity) {
    references.push({
      collection: "Opportunity",
      documentId: opportunity._id.toString(),
      field: "imagePublicId",
      label: opportunity.title || "Opportunity",
    });
  }

  // Partner
  const partner = await Partner.findOne({ imagePublicId: publicId });
  if (partner) {
    references.push({
      collection: "Partner",
      documentId: partner._id.toString(),
      field: "imagePublicId",
      label: partner.name || "Partner",
    });
  }

  // WhyJoinUs (points array)
  const whyJoinUs = await WhyJoinUs.findOne({ "points.imagePublicId": publicId });
  if (whyJoinUs) {
    const point = whyJoinUs.points.find((p) => p.imagePublicId === publicId);
    references.push({
      collection: "WhyJoinUs",
      documentId: whyJoinUs._id.toString(),
      field: "points.imagePublicId",
      label: point?.title || whyJoinUs.title || "Why Join Us",
    });
  }

  // WhyBecomeMember (points array)
  const whyBecomeMember = await WhyBecomeMember.findOne({ "points.imagePublicId": publicId });
  if (whyBecomeMember) {
    const point = whyBecomeMember.points.find((p) => p.imagePublicId === publicId);
    references.push({
      collection: "WhyBecomeMember",
      documentId: whyBecomeMember._id.toString(),
      field: "points.imagePublicId",
      label: point?.title || whyBecomeMember.title || "Why Become Member",
    });
  }

  // News (coverImage and gallery - stored as URLs, need to extract public_id)
  const newsWithCover = await News.findOne({ coverImage: { $regex: publicId, $options: "i" } });
  if (newsWithCover) {
    references.push({
      collection: "News",
      documentId: newsWithCover._id.toString(),
      field: "coverImage",
      label: newsWithCover.title || "News Article",
    });
  }

  const newsWithGallery = await News.findOne({ gallery: { $regex: publicId, $options: "i" } });
  if (newsWithGallery) {
    references.push({
      collection: "News",
      documentId: newsWithGallery._id.toString(),
      field: "gallery",
      label: newsWithGallery.title || "News Article",
    });
  }

  return references;
}

// Get all used public_ids from database
async function getAllUsedPublicIds() {
  const usedPublicIds = new Set();
  console.log("[MediaLibrary] Scanning database for used images...");

  try {
    // Parallelize database queries for better performance
    const [
      heroDocs,
      serviceDocs,
      teamMemberDocs,
      opportunityDocs,
      partnerDocs,
      whyJoinUsDocs,
      whyBecomeMemberDocs,
      newsDocs,
    ] = await Promise.all([
      HeroContent.find({ imagePublicId: { $ne: null } }, { imagePublicId: 1 }),
      Service.find({ imagePublicId: { $ne: null } }, { imagePublicId: 1 }),
      TeamMember.find({ imagePublicId: { $ne: null } }, { imagePublicId: 1 }),
      Opportunity.find({ imagePublicId: { $ne: null } }, { imagePublicId: 1 }),
      Partner.find({ imagePublicId: { $ne: null } }, { imagePublicId: 1 }),
      WhyJoinUs.find({ "points.imagePublicId": { $ne: null } }, { "points.imagePublicId": 1 }),
      WhyBecomeMember.find({ "points.imagePublicId": { $ne: null } }, { "points.imagePublicId": 1 }),
      News.find({
        $or: [
          { coverImage: { $ne: null, $ne: "" } },
          { gallery: { $ne: null, $ne: [] } },
        ],
      }, { coverImage: 1, gallery: 1 }),
    ]);

    console.log("[MediaLibrary] Database scan results:", {
      hero: heroDocs.length,
      service: serviceDocs.length,
      teamMember: teamMemberDocs.length,
      opportunity: opportunityDocs.length,
      partner: partnerDocs.length,
      whyJoinUs: whyJoinUsDocs.length,
      whyBecomeMember: whyBecomeMemberDocs.length,
      news: newsDocs.length,
    });

    // Process results
    heroDocs.forEach((doc) => { if (doc.imagePublicId) usedPublicIds.add(doc.imagePublicId); });
    serviceDocs.forEach((doc) => { if (doc.imagePublicId) usedPublicIds.add(doc.imagePublicId); });
    teamMemberDocs.forEach((doc) => { if (doc.imagePublicId) usedPublicIds.add(doc.imagePublicId); });
    opportunityDocs.forEach((doc) => { if (doc.imagePublicId) usedPublicIds.add(doc.imagePublicId); });
    partnerDocs.forEach((doc) => { if (doc.imagePublicId) usedPublicIds.add(doc.imagePublicId); });

    whyJoinUsDocs.forEach((doc) => {
      doc.points.forEach((point) => {
        if (point.imagePublicId) usedPublicIds.add(point.imagePublicId);
      });
    });

    whyBecomeMemberDocs.forEach((doc) => {
      doc.points.forEach((point) => {
        if (point.imagePublicId) usedPublicIds.add(point.imagePublicId);
      });
    });

    newsDocs.forEach((doc) => {
      if (doc.coverImage) {
        const pid = extractPublicIdFromUrl(doc.coverImage);
        if (pid) usedPublicIds.add(pid);
      }
      if (doc.gallery && Array.isArray(doc.gallery)) {
        doc.gallery.forEach((url) => {
          const pid = extractPublicIdFromUrl(url);
          if (pid) usedPublicIds.add(pid);
        });
      }
    });
  } catch (error) {
    console.error("[MediaLibrary] Database scan error:", error);
    throw error;
  }

  console.log("[MediaLibrary] Total used public_ids found:", usedPublicIds.size);
  return usedPublicIds;
}

// Fetch all images from Cloudinary Admin API
async function fetchCloudinaryImages() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  console.log("[MediaLibrary] Cloudinary config:", {
    hasCloudName: !!cloudName,
    hasApiKey: !!apiKey,
    hasApiSecret: !!apiSecret,
    cloudName: cloudName || "missing",
  });

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary credentials are not configured on the server");
  }

  const authHeader = `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`;
  const images = [];
  let nextCursor = null;
  const MAX_IMAGES = 500; // Limit to prevent timeout

  do {
    if (images.length >= MAX_IMAGES) break;

    const url = new URL(`https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload`);
    url.searchParams.set("max_results", "50");
    if (nextCursor) {
      url.searchParams.set("next_cursor", nextCursor);
    }

    console.log("[MediaLibrary] Fetching Cloudinary images:", url.toString());

    try {
      const response = await fetch(url.toString(), {
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
      });

      console.log("[MediaLibrary] Cloudinary response status:", response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[MediaLibrary] Cloudinary API error:", response.status, errorText);
        throw new Error(`Failed to fetch images from Cloudinary: ${response.status}`);
      }

      const data = await response.json();
      console.log("[MediaLibrary] Cloudinary response resources count:", data.resources?.length || 0);
      if (data.resources) {
        images.push(...data.resources);
      }
      nextCursor = data.next_cursor;
    } catch (error) {
      console.error("[MediaLibrary] Cloudinary fetch error:", error);
      throw error;
    }
  } while (nextCursor && images.length < MAX_IMAGES);

  console.log("[MediaLibrary] Total images fetched:", images.length);
  return images;
}

// GET /api/media-library
// Get all Cloudinary images with usage status
const getMediaLibrary = async (req, res) => {
  try {
    const { filter = "all", search = "", page = 1, limit = 20 } = req.query;
    console.log("[MediaLibrary] Request params:", { filter, search, page, limit });

    // Fetch all images from Cloudinary
    console.log("[MediaLibrary] Starting Cloudinary fetch...");
    const cloudinaryImages = await fetchCloudinaryImages();
    console.log("[MediaLibrary] Cloudinary fetch complete, images:", cloudinaryImages.length);

    // Get all used public_ids from database
    console.log("[MediaLibrary] Starting database scan...");
    const usedPublicIds = await getAllUsedPublicIds();
    console.log("[MediaLibrary] Database scan complete, used count:", usedPublicIds.size);

    // Build response with usage status (without references yet)
    let images = cloudinaryImages.map((img) => {
      const isUsed = usedPublicIds.has(img.public_id);
      return {
        publicId: img.public_id,
        url: img.secure_url,
        width: img.width,
        height: img.height,
        format: img.format,
        bytes: img.bytes,
        createdAt: img.created_at,
        isUsed,
        references: null, // Will be populated only for paginated results
      };
    });

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      images = images.filter((img) =>
        img.publicId.toLowerCase().includes(searchLower) ||
        img.format.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (filter === "used") {
      images = images.filter((img) => img.isUsed);
    } else if (filter === "unused") {
      images = images.filter((img) => !img.isUsed);
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
    const total = images.length;
    const totalPages = Math.ceil(total / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedImages = images.slice(startIndex, startIndex + limitNum);

    // Only fetch references for used images on the current page
    const usedOnPage = paginatedImages.filter((img) => img.isUsed);
    const referencePromises = usedOnPage.map((img) => findImageReferences(img.publicId));
    const referencesList = await Promise.all(referencePromises);

    usedOnPage.forEach((img, idx) => {
      img.references = referencesList[idx];
    });

    return res.status(200).json({
      success: true,
      message: "Media library retrieved successfully",
      data: {
        images: paginatedImages,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages,
        },
      },
    });
  } catch (error) {
    console.error("Media library error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch media library",
      errors: [error.message || "Unknown error"],
    });
  }
};

// DELETE /api/media-library/:publicId
// Delete an unused image from Cloudinary
const deleteUnusedImage = async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: "publicId is required",
        errors: ["publicId parameter is required"],
      });
    }

    // Verify the image is not used
    const usedPublicIds = await getAllUsedPublicIds();
    if (usedPublicIds.has(publicId)) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete used image",
        errors: ["This image is currently used in the website. Remove all references before deleting."],
      });
    }

    // Delete from Cloudinary
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error("Cloudinary credentials are not configured on the server");
    }

    const timestamp = Math.round(Date.now() / 1000);
    const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash("sha1").update(stringToSign).digest("hex");

    const deleteResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          public_id: publicId,
          api_key: apiKey,
          timestamp,
          signature,
        }),
      }
    );

    if (!deleteResponse.ok) {
      const errorText = await deleteResponse.text();
      console.error("Cloudinary delete error:", deleteResponse.status, errorText);
      throw new Error(`Failed to delete image from Cloudinary: ${deleteResponse.status}`);
    }

    const deleteResult = await deleteResponse.json();

    if (deleteResult.result !== "ok") {
      throw new Error(`Cloudinary deletion failed: ${deleteResult.result}`);
    }

    return res.status(200).json({
      success: true,
      message: "Image deleted successfully",
      data: { publicId },
    });
  } catch (error) {
    console.error("Delete unused image error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete image",
      errors: [error.message || "Unknown error"],
    });
  }
};

module.exports = {
  getMediaLibrary,
  deleteUnusedImage,
};

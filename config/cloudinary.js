const axios = require("axios");
const crypto = require("crypto");

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.warn(
    "Warning: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET must be set in environment variables"
  );
}

const CLOUDINARY_BASE_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}`;

/**
 * Generate a Cloudinary API signature for authenticated requests.
 */
function generateSignature(params) {
  const sortedKeys = Object.keys(params).sort();
  const stringToSign = sortedKeys.map((key) => `${key}=${params[key]}`).join("&");
  return crypto.createHash("sha1").update(stringToSign + CLOUDINARY_API_SECRET).digest("hex");
}

/**
 * Fetch all Cloudinary image resources with pagination support.
 * @param {number} page - Page number (1-based)
 * @param {number} maxResults - Results per page (max 500)
 * @param {string} nextCursor - Cursor for pagination
 * @returns {Promise<Object>} Cloudinary resources response
 */
async function getCloudinaryResources(page = 1, maxResults = 50, nextCursor = null) {
  const params = {
    resource_type: "image",
    type: "upload",
    max_results: maxResults,
    next_cursor: nextCursor || undefined,
  };

  const timestamp = Math.round(Date.now() / 1000);
  const signature = generateSignature({ ...params, timestamp });

  const url = `${CLOUDINARY_BASE_URL}/resources/image/upload`;
  const response = await axios.get(url, {
    params: {
      ...params,
      api_key: CLOUDINARY_API_KEY,
      timestamp,
      signature,
    },
  });

  return response.data;
}

/**
 * Delete an image from Cloudinary by public_id.
 * @param {string} publicId - The public_id of the image to delete
 * @returns {Promise<Object>} Cloudinary deletion response
 */
async function deleteCloudinaryImage(publicId) {
  const timestamp = Math.round(Date.now() / 1000);
  const signature = generateSignature({ public_id: publicId, timestamp });

  const url = `${CLOUDINARY_BASE_URL}/image/destroy/${publicId}`;
  const response = await axios.post(
    url,
    {
      public_id: publicId,
      api_key: CLOUDINARY_API_KEY,
      timestamp,
      signature,
    },
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  return response.data;
}

module.exports = {
  getCloudinaryResources,
  deleteCloudinaryImage,
  CLOUDINARY_CLOUD_NAME,
};

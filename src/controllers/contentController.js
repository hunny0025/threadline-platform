const Content = require('../models/Content');
const { sendSuccess, sendError } = require('../utils/response');

// GET /content/:slug
// Handles /content/about, /content/faq, /content/returns
exports.getContent = async (req, res) => {
  try {
    const { slug } = req.params;

    // Step 1 — Validate slug is one of the allowed pages
    const allowedSlugs = ['about', 'faq', 'returns'];
    if (!allowedSlugs.includes(slug)) {
      return sendError(res, 'Content page not found', 404);
    }

    // Step 2 — Find content in DB
    const content = await Content.findOne({ slug, isActive: true });

    // Step 3 — If not in DB yet, return a default placeholder
    // This handles the case where admin hasn't created the content yet
    if (!content) {
      return sendSuccess(res, {
        slug,
        title: slug.charAt(0).toUpperCase() + slug.slice(1),
        body: `# ${slug.charAt(0).toUpperCase() + slug.slice(1)}\n\nThis page is coming soon. Check back later.`,
        lastEditedBy: null,
        updatedAt: null
      }, 'Content fetched successfully');
    }

    // Step 4 — Return content
    sendSuccess(res, {
      slug: content.slug,
      title: content.title,
      body: content.body,
      lastEditedBy: content.lastEditedBy,
      updatedAt: content.updatedAt
    }, 'Content fetched successfully');

  } catch (err) {
  console.error('[Content] error:', err);
  sendError(res, 'Something went wrong. Please try again.', 500);
  }
};

// PATCH /content/:slug (admin only)
// Allows admin to update content directly from dashboard
exports.updateContent = async (req, res) => {
  try {
    const { slug } = req.params;
    const { title, body } = req.body;

    // Step 1 — Validate slug
    const allowedSlugs = ['about', 'faq', 'returns'];
    if (!allowedSlugs.includes(slug)) {
      return sendError(res, 'Content page not found', 404);
    }

    // Step 2 — Validate required fields
    if (!title || !body) {
      return sendError(res, 'Title and body are required', 400);
    }

    // Step 3 — Upsert — create if not exists, update if exists
    const content = await Content.findOneAndUpdate(
      { slug },
      {
        title,
        body,
        isActive: true,
        lastEditedBy: req.user?._id || null
      },
      { new: true, upsert: true, runValidators: true }
    );

    sendSuccess(res, content, 'Content updated successfully');

  } catch (err) {
      console.error('[Content] error:', err);
      sendError(res, 'Something went wrong. Please try again.', 500);
  }
};
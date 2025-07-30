const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const Document = require('../models/Document');
const Project = require('../models/Project');

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage: storage });

// @route   POST /api/documents/:projectId/upload
// @desc    Upload a document for a project
// @access  Private (Admin or Project Lead)
router.post('/:projectId/upload', [auth, upload.single('document')], async (req, res) => {
  // Authorization Check: Must be Admin or Project Lead
  if (req.user.role !== 'Admin' && req.user.role !== 'Project Lead') {
    return res.status(403).json({ msg: 'Access denied.' });
  }

  try {
    const newDocument = new Document({
      fileName: req.file.originalname,
      filePath: req.file.path,
      project: req.params.projectId,
      uploadedBy: req.user.id
    });

    const doc = await newDocument.save();
    res.status(201).json(doc);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/documents/:projectId
// @desc    Get all documents for a specific project
// @access  Private (Assigned Users)
router.get('/:projectId', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    // Authorization Check: User must be assigned to the project
    const isAssigned = project.assignedUsers.some(user => user.equals(req.user.id));
    if (!isAssigned && req.user.role !== 'Admin') {
        return res.status(403).json({ msg: 'Access denied.' });
    }

    const documents = await Document.find({ project: req.params.projectId });
    res.json(documents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
module.exports = router;
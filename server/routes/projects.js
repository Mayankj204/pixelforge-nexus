const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Middleware to check if logged in
const admin = require('../middleware/admin'); // Middleware to check if admin
const Project = require('../models/Project');
const projectLead = require('../middleware/projectLead');
const User = require('../models/User'); // Also make sure User model is imported

// @route   POST api/projects
// @desc    Create a new project
// @access  Private (Admin Only)
router.post('/', [auth, admin], async (req, res) => {
  const { name, description, deadline } = req.body;

  try {
    const newProject = new Project({
      name,
      description,
      deadline
    });

    const project = await newProject.save();
    res.status(201).json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/projects
// @desc    Get all active projects
// @access  Private (All authenticated users)
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ status: 'Active' })
    .populate('assignedUsers', 'username') // <-- ADD THIS.sort({ deadline: 1 });
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/projects/:id/complete
// @desc    Mark a project as completed
// @access  Private (Admin Only)
router.put('/:id/complete', [auth, admin], async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    project.status = 'Completed';
    await project.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/projects/:id/assign
// @desc    Assign a developer to a project
// @access  Private (Project Lead Only)
router.put('/:id/assign', [auth, projectLead], async (req, res) => {
  const { userId } = req.body;

  try {
    const project = await Project.findById(req.params.id);
    const userToAssign = await User.findById(userId);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    if (!userToAssign) {
      return res.status(404).json({ msg: 'User to assign not found' });
    }
    if (userToAssign.role !== 'Developer') {
      return res.status(400).json({ msg: 'Can only assign users with the Developer role' });
    }

    // Check if user is already assigned
    if (project.assignedUsers.includes(userId)) {
      return res.status(400).json({ msg: 'User is already assigned to this project' });
    }

    project.assignedUsers.push(userId);
    await project.save();

    res.json(project.assignedUsers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/projects/my-projects
// @desc    Get projects assigned to the logged-in user
// @access  Private (Authenticated users)
router.get('/my-projects', auth, async (req, res) => {
  try {
    // Find projects where the assignedUsers array contains the logged-in user's ID
    const projects = await Project.find({ assignedUsers: req.user.id });
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   GET api/projects/:id
// @desc    Get a single project by ID with populated user details
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('assignedUsers', 'username role');
    
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    // Authorization: Check if user is Admin or assigned to the project
    const isAssigned = project.assignedUsers.some(user => user._id.equals(req.user.id));
    if (req.user.role !== 'Admin' && !isAssigned) {
        return res.status(403).json({ msg: 'Not authorized to view this project' });
    }

    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/projects/:id/unassign
// @desc    Remove (unassign) a developer from a project
// @access  Private (Project Lead Only)
router.put('/:id/unassign', [auth, projectLead], async (req, res) => {
    const { userId } = req.body;
  
    try {
      const project = await Project.findById(req.params.id);
  
      if (!project) {
        return res.status(404).json({ msg: 'Project not found' });
      }
  
      // Use MongoDB's $pull operator to remove the userId from the array
      project.assignedUsers.pull(userId);
  
      await project.save();
  
      res.json({ msg: 'Developer unassigned successfully.' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

  // @route   PUT api/projects/:id/unassign
// @desc    Remove (unassign) a developer from a project
// @access  Private (Project Lead Only)
router.put('/:id/unassign', [auth, projectLead], async (req, res) => {
    const { userId } = req.body;
    try {
      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ msg: 'Project not found' });
      }
      // Use Mongoose's pull method to remove the ObjectId from the array
      project.assignedUsers.pull(userId);
      await project.save();
      res.json({ msg: 'Developer unassigned successfully.' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});

module.exports = router;
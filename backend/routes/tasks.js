const express = require('express');
const router = express.Router();
const { body, param, query, validationResult } = require('express-validator');
const Task = require('../models/Task');

// Helper: send validation errors
const validate = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ success: false, errors: errors.array() });
    return true;
  }
  return false;
};

// ─── GET /api/tasks ──────────────────────────────────────────────────────────
// Query params: status, priority, sortBy, order, search
router.get('/', async (req, res) => {
  try {
    const { status, priority, sortBy = 'createdAt', order = 'desc', search } = req.query;

    const filter = {};
    if (status && ['pending', 'in-progress', 'completed'].includes(status)) {
      filter.status = status;
    }
    if (priority && ['low', 'medium', 'high'].includes(priority)) {
      filter.priority = priority;
    }
    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    const allowedSortFields = ['createdAt', 'updatedAt', 'title', 'priority', 'dueDate'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortOrder = order === 'asc' ? 1 : -1;

    const tasks = await Task.find(filter).sort({ [sortField]: sortOrder });

    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /api/tasks/:id ───────────────────────────────────────────────────────
router.get(
  '/:id',
  param('id').isMongoId().withMessage('Invalid task ID'),
  async (req, res) => {
    if (validate(req, res)) return;
    try {
      const task = await Task.findById(req.params.id);
      if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
      res.json({ success: true, data: task });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// ─── POST /api/tasks ──────────────────────────────────────────────────────────
router.post(
  '/',
  [
    body('title')
      .trim()
      .notEmpty().withMessage('Title is required')
      .isLength({ min: 3 }).withMessage('Title must be at least 3 characters')
      .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
    body('status')
      .optional()
      .isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
    body('dueDate')
      .optional({ nullable: true, checkFalsy: true })
      .isISO8601().withMessage('Invalid date format')
  ],
  async (req, res) => {
    if (validate(req, res)) return;
    try {
      const task = await Task.create(req.body);
      res.status(201).json({ success: true, data: task });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
);

// ─── PUT /api/tasks/:id ───────────────────────────────────────────────────────
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid task ID'),
    body('title')
      .optional()
      .trim()
      .notEmpty().withMessage('Title cannot be empty')
      .isLength({ min: 3 }).withMessage('Title must be at least 3 characters')
      .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
    body('status')
      .optional()
      .isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
    body('dueDate')
      .optional({ nullable: true, checkFalsy: true })
      .isISO8601().withMessage('Invalid date format')
  ],
  async (req, res) => {
    if (validate(req, res)) return;
    try {
      const task = await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
      res.json({ success: true, data: task });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
);

// ─── PATCH /api/tasks/:id/status ─────────────────────────────────────────────
router.patch(
  '/:id/status',
  [
    param('id').isMongoId().withMessage('Invalid task ID'),
    body('status').isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status')
  ],
  async (req, res) => {
    if (validate(req, res)) return;
    try {
      const task = await Task.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true, runValidators: true }
      );
      if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
      res.json({ success: true, data: task });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
);

// ─── DELETE /api/tasks/:id ────────────────────────────────────────────────────
router.delete(
  '/:id',
  param('id').isMongoId().withMessage('Invalid task ID'),
  async (req, res) => {
    if (validate(req, res)) return;
    try {
      const task = await Task.findByIdAndDelete(req.params.id);
      if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
      res.json({ success: true, message: 'Task deleted successfully' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

module.exports = router;

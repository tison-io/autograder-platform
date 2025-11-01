const Task = require('../models/Task');
const Notification = require('../models/Notification');
const { sendTaskAssignmentEmail } = require('../utils/emailService');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res, next) => {
  try {
    const { status, priority, assignedTo, search } = req.query;
    
    // Build query
    let query = { isArchived: false };
    
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignedTo) query.assignedTo = assignedTo;
    
    // Search by title
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email')
      .populate('comments.user', 'name avatar')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('comments.user', 'name avatar');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res, next) => {
  try {
    // Add created by user
    req.body.createdBy = req.user.id;

    const task = await Task.create(req.body);

    // Populate fields
    await task.populate('assignedTo', 'name email avatar');
    await task.populate('createdBy', 'name email');

    // Send notification if task is assigned
    if (task.assignedTo) {
      // Create notification
      await Notification.create({
        user: task.assignedTo._id,
        message: `You have been assigned a new task: ${task.title}`,
        type: 'task-assigned',
        relatedTask: task._id
      });

      // Send email (async, don't wait)
      sendTaskAssignmentEmail(task.assignedTo, task, req.user).catch(err => 
        console.error('Email send failed:', err)
      );

      // Emit socket event
      const io = req.app.get('io');
      io.to(task.assignedTo._id.toString()).emit('notification', {
        message: `New task assigned: ${task.title}`,
        task: task
      });
    }

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if assignee changed
    const assigneeChanged = req.body.assignedTo && 
      task.assignedTo?.toString() !== req.body.assignedTo;

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email');

    // Handle assignee change
    if (assigneeChanged && task.assignedTo) {
      await Notification.create({
        user: task.assignedTo._id,
        message: `Task reassigned to you: ${task.title}`,
        type: 'task-assigned',
        relatedTask: task._id
      });

      sendTaskAssignmentEmail(task.assignedTo, task, req.user).catch(err =>
        console.error('Email send failed:', err)
      );
    }

    // Emit real-time update
    const io = req.app.get('io');
    io.emit('task-updated', task);

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private (Admin only)
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    await task.deleteOne();

    // Emit real-time delete
    const io = req.app.get('io');
    io.emit('task-deleted', { id: req.params.id });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
exports.addComment = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    task.comments.push({
      user: req.user.id,
      text: req.body.text
    });

    await task.save();
    await task.populate('comments.user', 'name avatar');

    // Notify task assignee
    if (task.assignedTo && task.assignedTo.toString() !== req.user.id) {
      await Notification.create({
        user: task.assignedTo,
        message: `${req.user.name} commented on: ${task.title}`,
        type: 'comment-added',
        relatedTask: task._id
      });
    }

    // Emit real-time comment
    const io = req.app.get('io');
    io.emit('comment-added', { taskId: task._id, comment: task.comments[task.comments.length - 1] });

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};
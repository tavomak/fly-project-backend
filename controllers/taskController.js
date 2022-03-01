const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');
const { validationResult } = require("express-validator");

exports.createTask = async (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { project } = req.body;
    const findProject = await Project.findById(project);

    if(!findProject) {
      return res.status(404).json({msg: 'Project missing'})
    }
    
    let task = new Task(req.body);
    
    await task.save().then(result => {
      Task.find({_id: task._id }).populate('project').then(task => {
        res.json({ task });
      });
    });


  } catch (error) {
    res.status(500).send("Opps, an error has occured");
  }
};

exports.getTasksByProject = async (req, res) => {
  try {
    const project = req.params.id;

    const findProject = await Project.findById(project);

    if(!findProject) {
      return res.status(404).json({msg: 'Project missing'})
    }

    const tasks = await Task.find({ project });

    res.json({ tasks })

  } catch (error) {
    res.status(500).send("Opps, an error has occured");
  }
};

exports.getTasksByUser = async (req, res) => {
  try {
    const user = req.params.id;

    const findUser = await User.findById(user);

    if(!findUser) {
      return res.status(404).json({msg: 'User missing'})
    }

    const tasks = await Task.find({ attendant: findUser });

    res.json({ tasks })

  } catch (error) {
    res.status(500).send("Opps, an error has occured");
  }
};

exports.getAllTasks = async (req, res) => {
  try {

    const tasks = await Task.find();

    res.json({ tasks })

  } catch (error) {
    res.status(500).send("Opps, an error has occured");
  }
};

exports.updateTask = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, state, description } = req.body;
  const newTask = {};

  if (name) {
    newTask.name = name;
  }
  if (state) {
    newTask.state = state;
  }

  if (description) {
    newTask.description = description;
  }

  try {
    // Revisar el Id
    let task = await Task.findById(req.params.id);
    
    // Si la tarea existe
    if (!task) {
      return res.status(404).json({ msg: "Task has not found" });
    }

    // Actualizar
    task = await Task.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: newTask },
      { new: true }
    );

    res.json({ task });
  } catch (error) {
    console.log(error);
    res.status(500).send("Opps, an error has occured");
  }
};

exports.removeTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: "Task has not found" });
    }

    await Task.findByIdAndRemove({ _id: req.params.id });

    res.json({ msg: "Task removed" });

  } catch (error) {
    console.log(error);
    res.status(500).send("Opps, an error has occured");
  }
};
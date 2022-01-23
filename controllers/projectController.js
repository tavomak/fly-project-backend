const Project = require("../models/Project");
const Account = require("../models/Account");
const { validationResult } = require("express-validator");

exports.createProject = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { account } = req.body;

  try {
    const findAccount = await Account.findById(account);

    if(!findAccount) {
      return res.status(404).json({msg: 'Account is missing'})
    }

    const project = new Project(req.body);

    project.ownwer = req.user.id;

    project.save();
    res.json(project);
  } catch (error) {
    console.log(error);
    res.status(500).send("Opps, an error has occured");
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json({ projects });
  } catch (error) {
    res.status(500).send("Opps, an error has occured");
  }
};

exports.updateProject = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name } = req.body;
  const newProject = {};

  if (name) {
    newProject.name = name;
  }

  try {
    // Revisar el Id
    let project = await Project.findById(req.params.id);
    
    // Si el proyecto existe
    if (!project) {
      return res.status(404).json({ msg: "Project has not found" });
    }

    // Actualizar
    project = await Project.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: newProject },
      { new: true }
    );

    res.json({ project });
  } catch (error) {
    console.log(error);
    res.status(500).send("Opps, an error has occured");
  }
};

exports.removeProject = async (req, res) => {
  try {
    // Revisar el Id
    // console.log(req.params.id);
    let project = await Project.findById(req.params.id);

    // Si el proyecto existe
    if (!project) {
      return res.status(404).json({ msg: "Project has not found" });
    }

    // Eliminar proyecto
    await Project.findByIdAndRemove({ _id: req.params.id });

    res.json({ msg: "Project removed" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Opps, an error has occured");
  }
};

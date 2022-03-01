const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middelware/auth.js');
const access = require('../middelware/usersAccess');
const { check } = require('express-validator');

router.post('/',
  auth,
  access,
  [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('project', 'El proyecto es obligatorio').not().isEmpty(),
  ],
  taskController.createTask
)

router.get('/',
  auth,
  taskController.getAllTasks
);

router.get('/project/:id',
  auth,
  taskController.getTasksByProject
);

router.get('/user/:id',
  auth,
  taskController.getTasksByUser
);

router.put('/:id',
  auth,
  access,
  [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
  ],
  taskController.updateTask
);

router.delete('/:id',
  auth,
  access,
  taskController.removeTask
)

module.exports = router;
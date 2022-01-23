const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middelware/auth.js');
const access = require('../middelware/usersAccess.js');
const { check } = require('express-validator');

router.post('/',
  auth,
  access,
  [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('account', 'La cuenta es obligatoria').not().isEmpty(),
    check('account', 'Id de cuenta debe tener 24 carácteres').isLength({ min: 24 }),
    check('account', 'Id de cuenta debe tener 24 carácteres').isLength({ max: 24 }),
  ],
  projectController.createProject
);

router.get('/',
  auth,
  access,
  projectController.getProjects
);

router.put('/:id',
  auth,
  access,
  [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
  ],
  projectController.updateProject
);

router.delete('/:id',
  auth,
  access,
  projectController.removeProject
)

module.exports = router;
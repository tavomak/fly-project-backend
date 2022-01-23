const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const auth = require('../middelware/auth.js');
const { check } = require('express-validator');

// api/createAccount
router.post('/',
  auth,
  [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
  ],
  accountController.createAccount
);

router.get('/',
  auth,
  accountController.getAccounts
);

router.put('/:id',
  auth,
  [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
  ],
  accountController.updateAccount
);

router.delete('/:id',
  auth,
  accountController.removeAccount
)

module.exports = router;
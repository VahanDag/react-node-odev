const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

router.get('/accounts', accountController.getAllAccounts);
router.get('/accounts/:code', accountController.getAccountById);
router.get('/accounts/level/:level', accountController.getAccountsByLevel);

module.exports = router;

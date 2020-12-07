const express = require('express');
const { authorize } = require('../../Middleware/index');
const Role = require('../../Middleware/role');
const { WithdrawalValidation } = require('../../Utils/validators/Investor/withdrawal');


const {
	initiateWithdrawal,
	cancelWithdrawalRequest,
	getUserWithdrawals,
  getWithdrawal,
} = require('../../Controllers/Investor/withdrawal')

const {
	getAllDeposits,
	getDeposit,
	initiateDepositCharge,
	depositListener,
} = require('../../Controllers/Investor/deposit')

const  {
	dashboard,
} = require('../../Controllers/Investor/dashboard')


const getId = (req, res, next) => {
  const { userId } = req.user;
  req.params.userId = userId;
  next();
};


const router = express.Router();

// Deposit CRUD
router.get('/deposit', authorize(Role.Investor), getId, getAllDeposits);
router.get('/deposit/:depositId', authorize(Role.Investor), getId, getDeposit);
router.post('/deposit', authorize(Role.Investor), getId, initiateDepositCharge)

// withdrawal CRUD
router.get('/withdrawal', authorize(Role.Investor), getId, getUserWithdrawals);
router.get('/withdrawal/:withdrawalId', authorize(Role.Investor), getId, getWithdrawal);
router.post('/withdrawal', WithdrawalValidation.validateWithdrawal, authorize(Role.Investor), initiateWithdrawal
);
router.post('/withdrawal/:withdrawalId', authorize(Role.Investor), getId, cancelWithdrawalRequest);
// router.delete('/withdrawal/:id', authorize(Role.Investor), getId, destroy);

// Dashboard
router.get('/dashboard', authorize(Role.Investor), getId, dashboard);

router.post('/deposit-confirmation', depositListener)

module.exports.investorRouter = router;
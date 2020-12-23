const express = require('express');
const { authorize } = require('../../Middleware/index');
const Role = require('../../Middleware/role');
const { WithdrawalValidation } = require('../../Utils/validators/Investor/withdrawal');
const { 
	UserValidation
} = require('../../Utils/validators/auth/index');

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
} = require('../../Controllers/Investor/dashboard');

const {
	getReferralDetails,
	getAllReferredUsers,
} = require('../../Controllers/Investor/referral');

const { updateProfile, getProfile } = require('../../Controllers/Investor/profile');

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
router.post('/withdrawal', authorize(Role.Investor), getId, cancelWithdrawalRequest);
router.post('/withdrawal/:withdrawalId', authorize(Role.Investor), getId, cancelWithdrawalRequest);
// router.delete('/withdrawal/:id', authorize(Role.Investor), getId, destroy);

// Dashboard
router.get('/dashboard', authorize(Role.Investor), getId, dashboard);

// Deposit WebHook from Coinbase
router.post('/deposit-confirmation', depositListener);

// Referral 
router.get('/referral', authorize(Role.Investor), getId, getReferralDetails);
router.get('/referral/:referralId', authorize(Role.Investor), getId, getAllReferredUsers);

// Profile
router.get('/profile/:userId', authorize(Role.Investor), getId, getProfile)
router.patch('/profile/:userId', UserValidation.validateInvestorProfileUpdate, authorize(Role.Investor), getId, updateProfile);

module.exports.investorRouter = router;
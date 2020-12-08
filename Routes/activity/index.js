const express = require('express');
const { authorize } = require('../../Middleware/index');

const {
  getActivity,
  deleteActivity,
} = require('../../Controllers/activity/activity');

const router = express.Router();

router.get('/', authorize(), getActivity);

router.delete('/:activityId', authorize(), deleteActivity);

module.exports.activityRouter = router;

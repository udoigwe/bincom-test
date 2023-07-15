const express = require('express');
const router = express.Router();
const generalController = require('../controllers/generalController');

router.get('/states', generalController.fetchStates);
router.get('/lgas', generalController.fetchLGAs);
router.get('/wards', generalController.fetchWards);
router.get('/polling-units', generalController.fetchPollingUnits);
router.get('/parties', generalController.fetchParties);
router.get('/polling-unit-results', generalController.fetchPollingUnitResults);
router.get('/total-lga-polling-unit-results', generalController.fetchLGATotalPollingUnitResults);
router.post('/submit', generalController.submitScore);

module.exports = router;
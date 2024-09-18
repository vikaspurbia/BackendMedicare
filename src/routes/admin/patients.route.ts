import express from 'express';
import {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient
} from '../../controller/patients.controller';
import { authenticate } from '../../middleware/auth.middleware'; // Import the authenticate middleware

const router = express.Router();

// Apply authentication middleware for these routes
router.post('/create', authenticate(['admin']), createPatient);
router.get('/', authenticate(['admin']), getPatients);
router.get('/:id', authenticate(['admin']), getPatientById);
router.put('/:id', authenticate(['admin']), updatePatient);
router.delete('/:id', authenticate(['admin']), deletePatient);

export default router;

import { Router } from 'express';
import {
  createAppointment,
  deleteAppointment,
  getAllAppointments,
  updateAppointment,
} from '../controller/admin/appointment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/create', createAppointment);
router.get('/', authenticate(['admin']), getAllAppointments);
router.delete('/:id', authenticate(['admin']), deleteAppointment);
router.put('/:id', authenticate(['admin']), updateAppointment);

export default router;

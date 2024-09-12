import { Router } from 'express';
import { createDoctor, getAllDoctors, getDoctorById } from '../../controller/doctor.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.post('/create',authenticate(['admin']), createDoctor);
router.get('/',authenticate(['admin']), getAllDoctors);
router.get('/:id', authenticate(['admin']),getDoctorById);

export default router;

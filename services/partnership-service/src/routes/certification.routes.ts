import { Router } from 'express';
import { issueCertificate, verifyCertificate } from '../controllers/certification.controller';

const router = Router();

router.post('/issue', issueCertificate);
router.get('/verify/:restaurantAddress', verifyCertificate);

export default router;

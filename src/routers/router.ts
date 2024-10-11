import { Router } from 'express';
import SimService from './../services/sim.service';

const router = Router();

router.post('/register-information-1nce', SimService.saveInformationSim);

export default router;
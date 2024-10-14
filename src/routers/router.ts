import { Router } from 'express';
import SimService from './../services/sim.service';
import authenticateToken from "../middleware/auth";

const router = Router();

router.post('/register-information-1nce', authenticateToken , SimService.saveInformationSim);
router.post('/add-volumn', authenticateToken , SimService.addVolumeInSims);
router.get('/job-get-sim-new', authenticateToken , SimService.saveNewSim);
router.post('/login', SimService.loginWeb);

export default router;
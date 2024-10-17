import { Router } from 'express';
import SimService from './../services/sim.service';
import authenticateToken from "../middleware/auth";

const router = Router();

router.post('/register-information-1nce' , SimService.saveInformationSim);
// router.post('/add-volumn', authenticateToken , SimService.addVolumeInSims);
router.post('/login', SimService.loginWeb);

router.post('/weeb-hook', SimService.webHook);

export default router;
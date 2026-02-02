import { Router } from 'express';
import healthRoutes from './health.routes.js';
import contactRoutes from './contact.routes.js';
import debugRoutes from './debug.routes.js';
import enrollmentRoutes from './enrollment.routes.js';
import contentRoutes from './content.routes.js';
import mediaRoutes from './media.routes.js';

const router = Router();

router.use(healthRoutes);
router.use('/contact', contactRoutes);
router.use('/debug', debugRoutes);
router.use('/enrollment', enrollmentRoutes);
router.use('/content', contentRoutes);
router.use('/media', mediaRoutes);

// Voeg hier later extra API routes toe, bv:
// import locationsRoutes from './locations.routes.js';
// router.use('/locations', locationsRoutes);

export default router;

import { Router } from 'express';
import { getFeatureSettings, updateFeatureSetting } from '../controllers/featureControl.controller.js';
import { authenticate as verifyJWT, authorize } from '../middlewares/auth.js';

const verifyAdmin = authorize('admin');

const router = Router();

// Public route to get settings (frontend needs to know what to show/lock)
// Or maybe protected but accessible to all authenticated users?
// Let's make it public or at least accessible to students so they can see the UI state.
// Actually, for security, maybe just authenticated users.
router.use(verifyJWT);

router.route('/').get(getFeatureSettings);

// Admin only route to update
router.route('/update').patch(verifyAdmin, updateFeatureSetting);

export default router;

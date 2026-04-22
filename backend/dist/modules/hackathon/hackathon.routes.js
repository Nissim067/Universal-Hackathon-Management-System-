"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const hackathon_controller_1 = require("./hackathon.controller");
const validate_middleware_1 = require("../../middleware/validate.middleware");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const hackathon_schema_1 = require("./hackathon.schema");
const router = (0, express_1.Router)();
const hackathonController = new hackathon_controller_1.HackathonController();
// Public routes
router.get('/', (0, validate_middleware_1.validate)(hackathon_schema_1.getHackathonsQuerySchema), hackathonController.getHackathons);
router.get('/:id', hackathonController.getHackathonById);
// Protected routes (Organizer only)
router.post('/', auth_middleware_1.verifyToken, (0, auth_middleware_1.requireRole)('ORGANIZER'), (0, validate_middleware_1.validate)(hackathon_schema_1.createHackathonSchema), hackathonController.createHackathon);
router.put('/:id', auth_middleware_1.verifyToken, (0, auth_middleware_1.requireRole)('ORGANIZER'), (0, validate_middleware_1.validate)(hackathon_schema_1.updateHackathonSchema), hackathonController.updateHackathon);
router.delete('/:id', auth_middleware_1.verifyToken, (0, auth_middleware_1.requireRole)('ORGANIZER'), hackathonController.deleteHackathon);
// Protected routes (JWT for participants)
router.post('/:id/register', auth_middleware_1.verifyToken, hackathonController.registerParticipant);
exports.default = router;

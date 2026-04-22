"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmissionController = void 0;
const submission_service_1 = require("./submission.service");
const ApiError_1 = require("../../utils/ApiError");
const submissionService = new submission_service_1.SubmissionService();
class SubmissionController {
    async createSubmission(req, res, next) {
        try {
            if (!req.user) {
                throw new ApiError_1.ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
            }
            const submission = await submissionService.createSubmission(req.body, req.user.userId);
            res.status(201).json({
                success: true,
                data: submission,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getSubmissions(req, res, next) {
        try {
            const hackathonId = req.params.hackathonId;
            const submissions = await submissionService.getSubmissionsByHackathonId(hackathonId);
            res.status(200).json({
                success: true,
                data: submissions,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.SubmissionController = SubmissionController;

const express = require("express");
const router = express.Router();
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getAdminStats,
  getAllUsers,
  getAllRequests,
  getAllSkills,
  getAllComplaints,
  updateComplaintStatusByAdmin,
  deleteUserByAdmin,
  deleteRequestByAdmin,
  deleteSkillByAdmin
} = require("../controllers/adminController");

router.get("/stats", adminMiddleware, getAdminStats);
router.get("/users", adminMiddleware, getAllUsers);
router.get("/requests", adminMiddleware, getAllRequests);
router.get("/skills", adminMiddleware, getAllSkills);
router.get("/complaints", adminMiddleware, getAllComplaints);
router.put("/complaints/:id", adminMiddleware, updateComplaintStatusByAdmin);
router.delete("/users/:id", adminMiddleware, deleteUserByAdmin);
router.delete("/requests/:id", adminMiddleware, deleteRequestByAdmin);
router.delete("/skills/:id", adminMiddleware, deleteSkillByAdmin);

module.exports = router;

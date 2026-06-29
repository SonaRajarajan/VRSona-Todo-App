const express = require("express");
const router  = express.Router();
const {
  getAllWorkspaces,
  getWorkspaceById,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace
} = require("../controllers/workspaceController");

router.get("/",      getAllWorkspaces);
router.get("/:id",   getWorkspaceById);
router.post("/",     createWorkspace);
router.put("/:id",   updateWorkspace);
router.delete("/:id", deleteWorkspace);

module.exports = router;

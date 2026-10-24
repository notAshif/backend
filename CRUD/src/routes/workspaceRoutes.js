const WorkspacesController = require("../controllers/workspaceController");
const auth = require("../middleware/auth");

const router = require("express").Router();

router.use(auth);

router.post("/workspace", WorkspacesController.create);
router.get("/workspace", WorkspacesController.getWorkspace);
router.delete("/workspace/:workspaceId", WorkspacesController.deleteWorkspace);

module.exports = router;

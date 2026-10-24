const taskController = require("../controllers/taskController");
const auth = require("../middleware/auth");

const router = require("express").Router();

router.use(auth);

router.post("/task", taskController.createTask);
router.get("/task", taskController.getTask);
router.get("/tasks", taskController.getTask);
router.get("/dashboard", taskController.getDashboard);
router.patch("/task/:taskId", taskController.markComplete);
router.delete("/task/:taskId", taskController.deleteTask);

module.exports = router;
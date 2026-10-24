const { pool } = require("../db");
const { CreateTaskSchema, markCompleteSchema } = require("../types/types");

const taskController = {
    async createTask(req, res) {
        try {
            const { data, success } = CreateTaskSchema.safeParse(req.body);
            const workspaceId = req.headers.workspaceid;

            if (!workspaceId)
                return res.status(401).json({ message: "Invalid workspaceId" });

            if (!success) {
                return res.status(400).json({ message: "Input error" });
            }
            const { title, description } = data;

            const result = await pool.query(
                `INSERT INTO tasks (title, description, workspace_id)
                SELECT $1, $2, id
                FROM workspaces
                WHERE id = $3 AND user_id = $4
                RETURNING id 
                `,
                [title, description, workspaceId, req.userId],
            );

            if (!result) {
                return res.status(404).json({ message: "Task not found" });
            }

            return res.status(200).json({ taskId: result.rows[0].id });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    async getTask(req, res) {
        try {

            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            const workspaceId = req.headers.workspaceid;

            const search = req.query.search || ""; 

            if (!workspaceId) {
                return res.status(400).json({ message: "Invalid workspaceId" });
            }

            let query = `
                SELECT t.id, t.title, t.description, t.completed, t.workspace_id
                FROM tasks t
                JOIN workspaces w ON w.id = t.workspace_id
                WHERE w.user_id = $1
            `;
            const params = [req.userId];

            if (workspaceId) {
                params.push(workspaceId);
                query += ` AND t.workspace_id = $${params.length}`;
            }

            if (search) {
                params.push(`%${search}%`);
                query += ` AND (t.title ILIKE $${params.length} OR t.description ILIKE $${params.length})`;
            }

            params.push(limit);
            query += ` ORDER BY t.id ASC LIMIT $${params.length}`;
            params.push(offset);
            query += ` OFFSET $${params.length}`;

            const result = await pool.query(query, params)

            return res.status(200).json({ page, limit, tasks: result.rows });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    async markComplete(req, res) {
        try {
            const { data, success } = markCompleteSchema.safeParse(req.body);
            const { taskId } = req.params;

            if (!taskId) return res.status(401).json({ message: "Invalid taskId" });

            if (!success) {
                return res.status(400).json({ message: "Input error" });
            }

            const { completed } = data;

            const result = await pool.query(
                `UPDATE tasks t
                SET completed = $1
                FROM workspaces w
                WHERE t.id = $2
                    AND t.workspace_id = w.id
                    AND w.user_id = $3
                RETURNING t.id
                `,
                [completed, taskId, req.userId]
            )

            if (result.rows.length === 0) return res.status(404).json({ message: "Task not found" });

            return res.status(200).json({ message: "Task updated" });

        } catch (error) {
            console.log(error);
            return res.status(500).inter
        }
    },

    async deleteTask(req, res) {
        try {
            const { taskId } = req.params;

            if (!taskId) return res.status(400).json({ message: "Invalid taskId" });

            const result = await pool.query(
                `DELETE FROM tasks t 
                USING workspaces w
                WHERE t.id = $1
                    AND t.workspace_id = w.id
                    AND w.user_id = $2
                RETURNING t.id`,
                [taskId, req.userId]
            );

            if (result.rows.length === 0) return res.status(404).json({ message: "Task not found" });

            return res.status(200).json({ message: "Task deleted" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    async getDashboard(req, res) {
        try {

            const result = await pool.query(
                `SELECT
        (SELECT COUNT(*)::int FROM workspaces WHERE user_id = $1) AS "totalWorkspaces",
        (SELECT COUNT(*)::int FROM tasks t JOIN workspaces w ON w.id = t.workspace_id WHERE w.user_id = $1) AS "totalTasks",
        (SELECT COUNT(*)::int FROM tasks t JOIN workspaces w ON w.id = t.workspace_id WHERE w.user_id = $1 AND t.completed = true) AS "completedTasks",
        (SELECT COUNT(*)::int FROM tasks t JOIN workspaces w ON w.id = t.workspace_id WHERE w.user_id = $1 AND (t.completed = false OR t.completed IS NULL)) AS "pendingTasks"`,
                [req.userId]
            );
            return res.status(200).json(result.rows[0]);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
};

module.exports = taskController;

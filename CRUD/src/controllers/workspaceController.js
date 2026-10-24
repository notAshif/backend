const { pool } = require("../db");
const { CreateWorkspaceSchema } = require("../types/types");

const WorkspacesController = {
    async create(req, res) {
        try {
            
            const { data, success, error } = CreateWorkspaceSchema.safeParse(req.body);

            if (!success) {
                return res.status(400).json({ message: "Input error", errors: error.issues });
            }

            const { name } = data;

            const existingWorkspace = await pool.query(
                "SELECT id FROM workspaces WHERE name = $1",
                [name]
            );

            if (existingWorkspace.rows.length > 0) {
                return res.status(409).json({ message: "Workspace already exist" });
            }

            const result = await pool.query(
                "INSERT INTO workspaces (name, user_id) VALUES ($1, $2) RETURNING id",
                [name, req.userId]
            );

        
            return res.status(201).json({ workspaceId: result.rows[0].id });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    async getWorkspace(req, res) {
        try {
           const getWorkspace = await pool.query(
               "SELECT id, name FROM workspaces WHERE user_id = $1",
               [req.userId]
            );
            
            if (getWorkspace.rows.length === 0) {
                return res.status(404).json({ message: "Workspace not found" });
            }

            return res.status(200).json({ workspaces: getWorkspace.rows });
            
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    async deleteWorkspace(req, res) {
        try {
            const { workspaceId } = req.params;

            if (!workspaceId) {
                return res.status(400).json({ message: "Invalid workspaceId" });
            }

            const result = await pool.query(
                "DELETE FROM workspaces WHERE id=$1 AND user_id=$2 RETURNING id",
                [workspaceId, req.userId]
            );

            if (result.rows.length == 0) {
                return res.status(404).json({ message: "Workspace not found" });
            }

            return res.status(200).json({ message: "Workspace deleted" });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}

module.exports = WorkspacesController;
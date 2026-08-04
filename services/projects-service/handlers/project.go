package handlers

import (
	"database/sql"
	"net/http"

	"projects-service/database"
	"projects-service/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// CreateProject inserts a new project under the active tenant
func CreateProject(c *gin.Context) {
	tenantID := c.MustGet("tenant_id").(string)

	var req models.CreateProjectRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	projectID := uuid.New().String()

	err := database.ExecuteWithTenant(tenantID, func(tx *sql.Tx) error {
		// First verify client exists under this tenant (RLS enforces this, but let's query it first to return clean error)
		var exists bool
		err := tx.QueryRow("SELECT EXISTS(SELECT 1 FROM clients WHERE id = $1)", req.ClientID).Scan(&exists)
		if err != nil {
			return err
		}
		if !exists {
			return sql.ErrNoRows // Force client validation error
		}

		_, err = tx.Exec(
			"INSERT INTO projects (id, tenant_id, client_id, name, address, scope, status) VALUES ($1, $2, $3, $4, $5, $6, $7)",
			projectID, tenantID, req.ClientID, req.Name, req.Address, req.Scope, "planning",
		)
		return err
	})

	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Client not found under this tenant"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":    "Project created successfully",
		"project_id": projectID,
	})
}

// ListProjects returns all projects belonging to the active tenant
func ListProjects(c *gin.Context) {
	tenantID := c.MustGet("tenant_id").(string)

	var projects []models.Project

	err := database.ExecuteWithTenant(tenantID, func(tx *sql.Tx) error {
		rows, err := tx.Query("SELECT id, tenant_id, client_id, name, address, scope, status, created_at, updated_at FROM projects")
		if err != nil {
			return err
		}
		defer rows.Close()

		for rows.Next() {
			var pr models.Project
			err := rows.Scan(
				&pr.ID, &pr.TenantID, &pr.ClientID, &pr.Name,
				&pr.Address, &pr.Scope, &pr.Status, &pr.CreatedAt, &pr.UpdatedAt,
			)
			if err != nil {
				return err
			}
			projects = append(projects, pr)
		}
		return nil
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, projects)
}

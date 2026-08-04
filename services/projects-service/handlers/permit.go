package handlers

import (
	"database/sql"
	"net/http"

	"projects-service/database"
	"projects-service/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// CreatePermit inserts a new permit under the active tenant
func CreatePermit(c *gin.Context) {
	tenantID := c.MustGet("tenant_id").(string)

	var req models.CreatePermitRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	permitID := uuid.New().String()

	err := database.ExecuteWithTenant(tenantID, func(tx *sql.Tx) error {
		// Verify project exists under this tenant (RLS enforces this, but let's query it first to return clean error)
		var exists bool
		err := tx.QueryRow("SELECT EXISTS(SELECT 1 FROM projects WHERE id = $1)", req.ProjectID).Scan(&exists)
		if err != nil {
			return err
		}
		if !exists {
			return sql.ErrNoRows // Force project validation error
		}

		_, err = tx.Exec(
			"INSERT INTO permits (id, tenant_id, project_id, jurisdiction_id, type, internal_status, external_status) VALUES ($1, $2, $3, $4, $5, $6, $7)",
			permitID, tenantID, req.ProjectID, req.JurisdictionID, req.Type, "draft", "Pending Submission",
		)
		return err
	})

	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Project not found under this tenant"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":   "Permit case created successfully",
		"permit_id": permitID,
	})
}

// ListPermits returns all permits belonging to the active tenant
func ListPermits(c *gin.Context) {
	tenantID := c.MustGet("tenant_id").(string)

	var permits []models.Permit

	err := database.ExecuteWithTenant(tenantID, func(tx *sql.Tx) error {
		rows, err := tx.Query("SELECT id, tenant_id, project_id, jurisdiction_id, type, internal_status, external_status, created_at, updated_at FROM permits")
		if err != nil {
			return err
		}
		defer rows.Close()

		for rows.Next() {
			var pe models.Permit
			err := rows.Scan(
				&pe.ID, &pe.TenantID, &pe.ProjectID, &pe.JurisdictionID,
				&pe.Type, &pe.InternalStatus, &pe.ExternalStatus, &pe.CreatedAt, &pe.UpdatedAt,
			)
			if err != nil {
				return err
			}
			permits = append(permits, pe)
		}
		return nil
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, permits)
}

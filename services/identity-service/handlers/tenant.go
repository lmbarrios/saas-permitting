package handlers

import (
	"fmt"
	"net/http"

	"identity-service/database"
	"identity-service/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

// RegisterTenant handles the creation of a new subscriber company and its administrator
func RegisterTenant(c *gin.Context) {
	var req models.RegisterTenantRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 1. Hash the admin password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.AdminPassword), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	tenantID := uuid.New().String()
	adminUserID := uuid.New().String()

	// 2. Execute within a transaction
	tx, err := database.DB.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start database transaction"})
		return
	}
	defer tx.Rollback()

	// 3. Insert Tenant
	_, err = tx.Exec(
		"INSERT INTO tenants (id, name, plan, status) VALUES ($1, $2, $3, $4)",
		tenantID, req.TenantName, req.Plan, "active",
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to create tenant: %v", err)})
		return
	}

	// 4. Set Tenant RLS Context for the transaction before inserting the user
	_, err = tx.Exec(fmt.Sprintf("SET LOCAL app.current_tenant_id = '%s'", tenantID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to set security context"})
		return
	}

	// 5. Insert Admin User
	_, err = tx.Exec(
		"INSERT INTO users (id, tenant_id, email, name, password_hash, role, status) VALUES ($1, $2, $3, $4, $5, $6, $7)",
		adminUserID, tenantID, req.AdminEmail, req.AdminName, string(hashedPassword), "admin", "active",
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to create admin user: %v", err)})
		return
	}

	// Commit Transaction
	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save registration"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":   "Tenant and admin user successfully registered",
		"tenant_id": tenantID,
		"admin_id":  adminUserID,
	})
}

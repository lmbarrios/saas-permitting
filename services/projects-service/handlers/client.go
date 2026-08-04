package handlers

import (
	"database/sql"
	"net/http"

	"projects-service/database"
	"projects-service/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// CreateClient inserts a new client under the active tenant
func CreateClient(c *gin.Context) {
	tenantID := c.MustGet("tenant_id").(string)

	var req models.CreateClientRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	clientID := uuid.New().String()

	err := database.ExecuteWithTenant(tenantID, func(tx *sql.Tx) error {
		_, err := tx.Exec(
			"INSERT INTO clients (id, tenant_id, name, contact_email, contact_phone, billing_address) VALUES ($1, $2, $3, $4, $5, $6)",
			clientID, tenantID, req.Name, req.ContactEmail, req.ContactPhone, req.BillingAddress,
		)
		return err
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":   "Client created successfully",
		"client_id": clientID,
	})
}

// ListClients returns all clients belonging to the active tenant
func ListClients(c *gin.Context) {
	tenantID := c.MustGet("tenant_id").(string)

	var clients []models.Client

	err := database.ExecuteWithTenant(tenantID, func(tx *sql.Tx) error {
		rows, err := tx.Query("SELECT id, tenant_id, name, contact_email, contact_phone, billing_address, created_at, updated_at FROM clients")
		if err != nil {
			return err
		}
		defer rows.Close()

		for rows.Next() {
			var cl models.Client
			err := rows.Scan(
				&cl.ID, &cl.TenantID, &cl.Name, &cl.ContactEmail,
				&cl.ContactPhone, &cl.BillingAddress, &cl.CreatedAt, &cl.UpdatedAt,
			)
			if err != nil {
				return err
			}
			clients = append(clients, cl)
		}
		return nil
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, clients)
}

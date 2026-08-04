package models

import "time"

// Client represents an end client of the tenant company
type Client struct {
	ID           string    `json:"id" db:"id"`
	TenantID     string    `json:"tenant_id" db:"tenant_id"`
	Name         string    `json:"name" db:"name"`
	ContactEmail string    `json:"contact_email" db:"contact_email"`
	ContactPhone string    `json:"contact_phone" db:"contact_phone"`
	BillingAddress string  `json:"billing_address" db:"billing_address"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time `json:"updated_at" db:"updated_at"`
}

// Project represents a construction project
type Project struct {
	ID        string    `json:"id" db:"id"`
	TenantID  string    `json:"tenant_id" db:"tenant_id"`
	ClientID  string    `json:"client_id" db:"client_id"`
	Name      string    `json:"name" db:"name"`
	Address   string    `json:"address" db:"address"`
	Scope     string    `json:"scope" db:"scope"`
	Status    string    `json:"status" db:"status"` // planning, active, completed, on_hold
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}

// Permit represents a construction permit case
type Permit struct {
	ID              string    `json:"id" db:"id"`
	TenantID        string    `json:"tenant_id" db:"tenant_id"`
	ProjectID       string    `json:"project_id" db:"project_id"`
	JurisdictionID  string    `json:"jurisdiction_id" db:"jurisdiction_id"`
	Type            string    `json:"type" db:"type"` // building, electrical, plumbing
	InternalStatus  string    `json:"internal_status" db:"internal_status"` // draft, submitted, approved...
	ExternalStatus  string    `json:"external_status" db:"external_status"`
	CreatedAt       time.Time `json:"created_at" db:"created_at"`
	UpdatedAt       time.Time `json:"updated_at" db:"updated_at"`
}

// CreateClientRequest payload to create a client
type CreateClientRequest struct {
	Name           string `json:"name" binding:"required"`
	ContactEmail   string `json:"contact_email" binding:"required,email"`
	ContactPhone   string `json:"contact_phone"`
	BillingAddress string `json:"billing_address"`
}

// CreateProjectRequest payload to create a project
type CreateProjectRequest struct {
	ClientID string `json:"client_id" binding:"required"`
	Name     string `json:"name" binding:"required"`
	Address  string `json:"address" binding:"required"`
	Scope    string `json:"scope"`
}

// CreatePermitRequest payload to create a permit
type CreatePermitRequest struct {
	ProjectID      string `json:"project_id" binding:"required"`
	JurisdictionID string `json:"jurisdiction_id" binding:"required"`
	Type           string `json:"type" binding:"required"`
}

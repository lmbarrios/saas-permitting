package models

import (
	"encoding/json"
	"time"
)

// Tenant represents a subscriber company in the B2B2B platform
type Tenant struct {
	ID        string          `json:"id" db:"id"`
	Name      string          `json:"name" db:"name"`
	Plan      string          `json:"plan" db:"plan"` // starter, professional, enterprise
	Status    string          `json:"status" db:"status"` // active, suspended, canceled
	Branding  json.RawMessage `json:"branding" db:"branding"`
	CreatedAt time.Time       `json:"created_at" db:"created_at"`
	UpdatedAt time.Time       `json:"updated_at" db:"updated_at"`
}

// User represents a user belonging to a specific tenant
type User struct {
	ID           string    `json:"id" db:"id"`
	TenantID     string    `json:"tenant_id" db:"tenant_id"`
	Email        string    `json:"email" db:"email"`
	Name         string    `json:"name" db:"name"`
	Role         string    `json:"role" db:"role"` // admin, operator, viewer
	Status       string    `json:"status" db:"status"` // pending, active, suspended
	PasswordHash string    `json:"-" db:"password_hash"` // Never expose password in JSON
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time `json:"updated_at" db:"updated_at"`
}

// RegisterTenantRequest defines the payload needed to register a new tenant along with its administrator
type RegisterTenantRequest struct {
	TenantName    string `json:"tenant_name" binding:"required"`
	Plan          string `json:"plan" binding:"required"` // starter, professional, enterprise
	AdminEmail    string `json:"admin_email" binding:"required,email"`
	AdminName     string `json:"admin_name" binding:"required"`
	AdminPassword string `json:"admin_password" binding:"required,min=8"`
}

// LoginRequest defines the payload for user login
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// LoginResponse defines the response after successful authentication
type LoginResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}

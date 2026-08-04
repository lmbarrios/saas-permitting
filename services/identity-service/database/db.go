package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
)

var DB *sql.DB

// InitDB initializes the connection to the PostgreSQL database
func InitDB() {
	host := getEnv("DB_HOST", "localhost")
	port := getEnv("DB_PORT", "5432")
	user := getEnv("DB_USER", "saas_admin")
	password := getEnv("DB_PASSWORD", "saas_password_2026")
	dbname := getEnv("DB_NAME", "saas_permits")

	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	var err error
	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("Failed to open database: %v", err)
	}

	err = DB.Ping()
	if err != nil {
		log.Fatalf("Failed to ping database: %v", err)
	}

	log.Println("Successfully connected to the database")
}

// ExecuteWithTenant executes a callback function within a transaction where the RLS tenant context is set
func ExecuteWithTenant(tenantID string, fn func(*sql.Tx) error) error {
	tx, err := DB.Begin()
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback()

	// Set tenant context for RLS
	_, err = tx.Exec(fmt.Sprintf("SET LOCAL app.current_tenant_id = '%s'", tenantID))
	if err != nil {
		return fmt.Errorf("failed to set tenant RLS context: %w", err)
	}

	// Run the operations
	if err := fn(tx); err != nil {
		return err
	}

	if err := tx.Commit(); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	return nil
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}

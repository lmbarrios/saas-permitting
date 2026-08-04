package main

import (
	"log"
	"net/http"
	"os"
	"strings"

	"identity-service/database"
	"identity-service/handlers"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte(getEnv("JWT_SECRET", "super_secret_key_2026_change_me"))

func main() {
	log.Println("Starting Identity & Tenant Service...")

	// 1. Initialize DB Connection
	database.InitDB()
	defer database.DB.Close()

	// 2. Set up Gin
	r := gin.Default()

	// Enable CORS middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// 3. Define Routes
	v1 := r.Group("/api/v1")
	{
		// Public Routes
		v1.POST("/tenants/register", handlers.RegisterTenant)
		v1.POST("/auth/login", handlers.Login)

		// Protected Routes
		protected := v1.Group("")
		protected.Use(AuthMiddleware())
		{
			protected.GET("/auth/me", func(c *gin.Context) {
				userID := c.MustGet("user_id").(string)
				tenantID := c.MustGet("tenant_id").(string)
				role := c.MustGet("role").(string)

				c.JSON(http.StatusOK, gin.H{
					"user_id":   userID,
					"tenant_id": tenantID,
					"role":      role,
				})
			})
		}
	}

	// 4. Start Server
	port := getEnv("PORT", "8081")
	log.Printf("Server listening on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}

// AuthMiddleware extracts and validates JWT from Authorization header
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			c.Abort()
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization format must be Bearer <token>"})
			c.Abort()
			return
		}

		tokenString := parts[1]
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Failed to parse claims"})
			c.Abort()
			return
		}

		// Set context values for use in handlers
		c.Set("user_id", claims["user_id"].(string))
		c.Set("tenant_id", claims["tenant_id"].(string))
		c.Set("role", claims["role"].(string))

		c.Next()
	}
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}

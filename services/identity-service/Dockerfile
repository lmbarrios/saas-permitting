# Stage 1: Build the Go binary
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Copy all source files
COPY . .

# Run go mod tidy to ensure go.sum and go.mod are in sync
RUN go mod tidy

# Build the Go application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o identity-service .

# Stage 2: Minimal production-ready runtime container
FROM alpine:latest  

RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copy the pre-built binary from the builder stage
COPY --from=builder /app/identity-service .

# Expose port 8081
EXPOSE 8081

# Command to run the executable
CMD ["./identity-service"]

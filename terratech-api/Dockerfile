# Multi-stage build para terratech-api en Go
FROM golang:1.26-alpine AS builder

WORKDIR /app

# Copiar manifiestos y descargar dependencias
COPY go.mod go.sum ./
RUN go mod download

# Copiar código fuente
COPY . .

# Compilar binario estático optimizado
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o terratech-api ./cmd/api

# Imagen final ultra liviana
FROM alpine:3.20

RUN apk --no-cache add ca-certificates tzdata
ENV TZ=America/Lima

WORKDIR /app
COPY --from=builder /app/terratech-api .

EXPOSE 8080

ENTRYPOINT ["./terratech-api"]

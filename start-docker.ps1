#!/usr/bin/env pwsh

# Task Manager - Docker Compose Startup Script for PowerShell

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Task Manager - Docker Compose Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is installed
try {
    docker --version | Out-Null
} catch {
    Write-Host "ERROR: Docker is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Docker Desktop from https://www.docker.com/products/docker-desktop" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Docker Compose is installed
try {
    docker-compose --version | Out-Null
} catch {
    Write-Host "WARNING: docker-compose might not be available" -ForegroundColor Yellow
    Write-Host "Attempting to use 'docker compose' instead..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Services will be available at:" -ForegroundColor Green
Write-Host "  - Frontend:  http://localhost:4200" -ForegroundColor Green
Write-Host "  - Backend:   http://localhost:8080/api" -ForegroundColor Green
Write-Host "  - MySQL:     localhost:3307" -ForegroundColor Green
Write-Host ""

# Build and start services
Write-Host "Starting Docker containers..." -ForegroundColor Cyan
Write-Host ""

docker-compose up --build

# If the user exits, offer options
Write-Host ""
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Docker Compose Stopped" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Options:" -ForegroundColor Yellow
Write-Host "  1. Restart services (docker-compose up)" -ForegroundColor Yellow
Write-Host "  2. Stop and remove containers (docker-compose down)" -ForegroundColor Yellow
Write-Host "  3. Remove all data including database (docker-compose down -v)" -ForegroundColor Yellow
Write-Host "  4. Exit" -ForegroundColor Yellow
Write-Host ""

$choice = Read-Host "Enter your choice (1-4)"

switch ($choice) {
    "1" {
        docker-compose up
    }
    "2" {
        docker-compose down
        Write-Host "Containers stopped and removed." -ForegroundColor Green
    }
    "3" {
        docker-compose down -v
        Write-Host "Containers, volumes, and data removed." -ForegroundColor Green
    }
    default {
        Write-Host "Exiting..." -ForegroundColor Cyan
    }
}

Read-Host "Press Enter to exit"


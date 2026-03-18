@echo off
REM Task Manager - Docker Compose Startup Script for Windows

echo.
echo ========================================
echo Task Manager - Docker Compose Startup
echo ========================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not installed or not in PATH
    echo Please install Docker Desktop from https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo WARNING: docker-compose might not be available
    echo Attempting to use 'docker compose' instead...
)

echo.
echo Services will be available at:
echo   - Frontend:  http://localhost:4200
echo   - Backend:   http://localhost:8080/api
echo   - MySQL:     localhost:3307
echo.

REM Build and start services
echo Starting Docker containers...
echo.

docker-compose up --build

REM If the user exits, offer options
echo.
echo.
echo ========================================
echo Docker Compose Stopped
echo ========================================
echo.
echo Options:
echo   1. Restart services (docker-compose up)
echo   2. Stop and remove containers (docker-compose down)
echo   3. Remove all data including database (docker-compose down -v)
echo   4. Exit
echo.

setlocal enabledelayedexpansion
set /p choice="Enter your choice (1-4): "

if "!choice!"=="1" (
    docker-compose up
) else if "!choice!"=="2" (
    docker-compose down
    echo Containers stopped and removed.
) else if "!choice!"=="3" (
    docker-compose down -v
    echo Containers, volumes, and data removed.
) else (
    echo Exiting...
)

pause


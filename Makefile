.PHONY: help up build down logs restart clean reset health ps exec-backend exec-mysql

help:
	@echo "╔════════════════════════════════════════════════════╗"
	@echo "║     Task Manager - Docker Compose Commands        ║"
	@echo "╚════════════════════════════════════════════════════╝"
	@echo ""
	@echo "USAGE: make [target]"
	@echo ""
	@echo "MAIN COMMANDS:"
	@echo "  make up              - Start all services with build"
	@echo "  make build           - Build images only"
	@echo "  make down            - Stop all services (keep data)"
	@echo "  make reset           - Stop and remove everything"
	@echo ""
	@echo "MONITORING:"
	@echo "  make logs            - View all service logs"
	@echo "  make health          - Check service health status"
	@echo "  make ps              - List all containers"
	@echo ""
	@echo "RESTART:"
	@echo "  make restart         - Restart all services"
	@echo "  make restart-backend - Restart backend only"
	@echo "  make restart-frontend- Restart frontend only"
	@echo "  make restart-mysql   - Restart MySQL only"
	@echo ""
	@echo "DEBUG:"
	@echo "  make exec-backend    - Enter backend container bash"
	@echo "  make exec-mysql      - Enter MySQL CLI"
	@echo "  make exec-frontend   - Enter frontend container bash"
	@echo ""
	@echo "CLEANING:"
	@echo "  make clean           - Remove containers (keep data)"
	@echo "  make clean-all       - Remove everything including data"
	@echo ""

# Main commands
up:
	docker-compose up --build

build:
	docker-compose build

down:
	docker-compose down

logs:
	docker-compose logs -f

ps:
	docker-compose ps

# Restart commands
restart:
	docker-compose restart

restart-backend:
	docker-compose restart backend

restart-frontend:
	docker-compose restart frontend

restart-mysql:
	docker-compose restart mysql

# Health and status
health:
	docker-compose ps

# Clean commands
clean:
	docker-compose down

clean-all:
	docker-compose down -v

reset: clean-all up

# Execution commands
exec-backend:
	docker-compose exec backend /bin/bash

exec-mysql:
	docker-compose exec mysql mysql -u root -p task_manager

exec-frontend:
	docker-compose exec frontend sh

# Log shortcuts
logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend

logs-mysql:
	docker-compose logs -f mysql

# Quick test
test-api:
	curl -s http://localhost:8080/api/health | jq . || echo "API not responding"

test-frontend:
	curl -s http://localhost:4200 | head -20 || echo "Frontend not responding"

# Development helpers
shell-backend:
	docker-compose exec backend /bin/bash

shell-mysql:
	docker-compose exec mysql mysql -u root -p

# One-liners
stop:
	docker-compose stop

start:
	docker-compose start

destroy:
	docker-compose down -v

pull:
	docker-compose pull

push:
	docker-compose push

# Docker system commands
prune:
	docker system prune -a

system-info:
	@echo "Docker Version:"
	@docker --version
	@echo ""
	@echo "Docker Compose Version:"
	@docker-compose --version
	@echo ""
	@echo "System Space Used:"
	@docker system df


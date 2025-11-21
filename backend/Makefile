# Laravel Docker Makefile

.PHONY: help install start stop restart build test ssh db-backup db-restore logs ps composer artisan npm clean

# Help
help:
	@echo "Laravel Docker development for Travel Portal"
	@echo ""
	@echo "Usage:"
	@echo "  make install        - Use for first-time installation"
	@echo "  make start          - Start containers"
	@echo "  make stop           - Stop containers"
	@echo "  make restart        - Restart containers"
	@echo "  make build          - Build Docker containers"
	@echo "  make test           - Run tests"
	@echo "  make ssh            - Open a shell in the PHP application container"
	@echo "  make db-backup      - Create a database backup (MySQL)"
	@echo "  make db-restore     - Restore the database from a backup (MySQL)"
	@echo "  make logs           - Show application logs"
	@echo "  make ps             - Show container status"
	@echo "  make composer cmd=  - Run a composer command (e.g., make composer cmd=require package/name)"
	@echo "  make artisan cmd=   - Run an Artisan command (e.g., make artisan cmd=make:model User)"
	@echo "  make npm cmd=       - Run an NPM command (e.g., make npm cmd=install)"
	@echo "  make clean          - Stop and clean up containers and volumes"

# Initial settings
export UID = $(shell id -u)
export GID = $(shell id -g)

# Main commands
install: build
	@echo "Setting up .env file..."
	@if [ ! -f "./src/.env" ]; then \
		if [ -f "./src/.env.example" ]; then \
			cp ./src/.env.example ./src/.env; \
		elif [ -f ".env.example" ]; then \
			cp .env.example ./src/.env; \
		else \
			echo "No .env.example found in ./src or project root. Skipping copy."; \
		fi \
	else \
		echo "./src/.env already exists. Skipping."; \
	fi
	@echo "Generating application key and installing dependencies..."
	@docker compose exec backend_app composer install
	@docker compose exec backend_app php artisan key:generate
	@echo "Preparing storage volumes (logs and public app storage)..."
	@mkdir -p ./src/storage/logs ./src/storage/app/public
	@docker compose down
	@docker compose up -d
	@echo "Installation complete!"

start:
	docker compose up -d

stop:
	docker compose down

restart:
	docker compose down
	docker compose up -d

build:
	UID=$(shell id -u) GID=$(shell id -g) docker compose build
	docker compose up -d

# Development and testing
test:
	docker compose exec backend_app php artisan test

ssh:
	@docker compose exec backend_app bash || docker compose exec backend_app sh

logs:
	docker compose logs -f

ps:
	docker compose ps

# Database (MySQL via backend_db)
db-backup:
	@echo "Creating database backup (MySQL)..."
	@mkdir -p ./backups
	@docker compose exec -T backend_db sh -c 'mysqldump -u"$$MYSQL_USER" -p"$$MYSQL_PASSWORD" "$$MYSQL_DATABASE"' > ./backups/db_backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "Backup created in ./backups"

db-restore:
	@echo "Restoring database from backup (MySQL)..."
	@echo "Available backup files:"
	@ls -1 ./backups/*.sql 2>/dev/null || echo "No backup files found in ./backups"
	@read -p "Enter backup file name (e.g., db_backup_YYYYmmdd_HHMMSS.sql): " file; \
	docker compose exec -T backend_db sh -c 'mysql -u"$$MYSQL_USER" -p"$$MYSQL_PASSWORD" "$$MYSQL_DATABASE"' < ./backups/$$file

# Utility commands
composer:
	docker compose exec backend_app composer $(cmd)

artisan:
	docker compose exec backend_app php artisan $(cmd)

npm:
	docker compose exec backend_app npm $(cmd)

clean:
	@echo "Stopping and removing containers, networks, and volumes..."
	@docker compose down -v --remove-orphans

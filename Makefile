.PHONY: up down logs test-backend test-frontend init

up:
	docker compose up --build -d

down:
	docker compose down

logs:
	docker compose logs -f

test-backend:
	cd backend && .venv/bin/pytest -v $(ARGS)

test-frontend:
	cd frontend && npm run test -- --ci

init:
	docker compose up --build -d backend
	@echo "Waiting for backend..."
	@until docker compose exec backend python manage.py check --database default > /dev/null 2>&1; do sleep 2; done
	docker compose exec backend python manage.py migrate
	docker compose exec -e DJANGO_SUPERUSER_PASSWORD=admin backend python manage.py createsuperuser --noinput --username admin --email admin@admin.com
	docker compose exec backend python manage.py seed_submissions

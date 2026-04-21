Implementation Notes
====================

# Approach and tradeoffs
* BE: leverage DRF classes whenever possible
* FE: lean on scoped context providers + presentational (dumb) components pattern

# How to run
## Running the app

1. Initialize the project. `make init` will create a default admin/admin user (ok for local development ONLY), will run migrations and seed the DB.

By default, the new database will be created at `backend/data/db.sqlite3`

```sh
make init
```

2. Run both frontend and backend. `make up` will build and run both services on the background. You can use `make logs` to tail their logs.
```sh
make up
make logs
```

## Running tests

1. Frontend tests can be run with `make test-frontend`
```sh
make test-frontend
```

2. Backend tests can be run with `make test-backend`
```sh
make test-backend
```

# Assumptions
* There is no limit to the amount of contacts/documents/notes tied to a submission. For all cases it is worth it to have paginated results.

# Extras

## Local development environment setup with docker compose

Both `frontend/` and `backend/` directories got each a minimal `Dockerfile`. Then, there's a `docker-compose.yml` file to orchestrate both. This makes running the full project locally easier, specially if there's frontend-only or backend-only devs on the team.

## Backend tests


## Frontend tests
1. Unit tests for presentational components like `SubmissionRow.test.tsx`. These provide basic validation that the component mounts ok and props are used and show up as intented.

2. Unit tests for providers, like `SubmissionFiltersProvider.test.tsx`. These test the scoped context behavior through the hook interface.

## CI pipeline
Set up a basic Github worflow that runs both backend and frontend tests, required by a dummy deployment step.

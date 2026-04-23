Implementation Notes
====================

# Approach and tradeoffs
## Backend
Leveraging DRF features whenever possible.

Used `pytest` and `pytest-django` for testing. This is mostly just a personal preference, when compared to regular `unitttest`.

Maintained the use of `ReadOnlyModelViewSet` for both Submissions and Brokers as the challenge involved no write actions. 

Implemented a custom `TotalPageNumberPagination` class that extends the default DRF `PageNumberPagination` to add a `total_pages` key, to be displayed on the frontend. 

## Frontend 
Scoped context providers + presentational (dumb) components pattern so providers own all state and data fetching while leaf components just render.

The SubmissionsProvider wraps both the filters and the results list, while the SubmissionDetailProvider handles the detail view separately. 

Filters and pagination were stored as URL search params. This makes for links that can be shared or bookmarked with the applied filters, like http://localhost:3000/submissions?status=in_review&companySearch=llc. 

Implemented a simple previous - next pagination so there's no way to jump to a specific page, but since there's filtering by all relevant fields, navigating to a specific page is not a big UX improvement.

Each unique (filters, page) gets a tantstack cache key so navigating back and forward do not refetch data. 

Company search is also debounced 300ms before updating the url for better UX and performance.

For the detail view, went with eager loading of all notes, documents and contacts.  

Avoided early optimization of paginating notes, documents and contacts. If they ever became too many and slowed down the initial page load, then it would be a good time to look into using separate endpoints for each section and/or tabs for lazy loading.

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
* Brokers (relevant to an account) are few so there's no need for pagination.
* Assuming the same of a submission contacts/documents/notes. 

# Extras

## Local development environment setup with docker compose

Both `frontend/` and `backend/` directories got each a minimal `Dockerfile`. Then, there's a `docker-compose.yml` file to orchestrate both. This makes running the full project locally easier, specially if there's frontend-only or backend-only devs on the team.

## django debug toolbar
Set up django-debug-toolbar for the DRF browsable API. Makes it easier to debug and optimize ORM queries.

## Backend tests
1. Unit tests for list item's defaults like `TestBrokerListShape`. Basic validation of the item's structure and values.
2. Tests for filters to ensure they work as expected, like `TestSubmissionListFilter`. 

## Frontend tests
1. Unit tests for presentational components like `SubmissionRow.test.tsx`. These provide basic validation that the component mounts ok and props are used and show up as intented.

2. Unit tests for providers, like `SubmissionFiltersProvider.test.tsx`. These test the scoped context behavior through the hook interface.

## CI pipeline
Set up a basic Github worflow that runs both backend and frontend tests, required by a dummy deployment step.

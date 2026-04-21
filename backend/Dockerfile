FROM python:3.13-slim AS base

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN chmod +x entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["./entrypoint.sh"]


FROM base AS test

COPY dev_requirements.txt .
RUN pip install --no-cache-dir -r dev_requirements.txt

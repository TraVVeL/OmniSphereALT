FROM python:3.12-slim

WORKDIR /app

ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

RUN apt-get update && apt-get install  \
    -y --no-install-recommends netcat-openbsd libpq-dev \
    default-libmysqlclient-dev pkg-config gcc python3-dev \
    && apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir uv gunicorn

COPY requirements.txt ./
RUN --mount=type=cache,target=/root/.cache uv pip install --system -r requirements.txt

COPY . .

EXPOSE 8000

COPY gunicorn.conf.py /app/gunicorn.conf.py
CMD ["gunicorn", "--config", "gunicorn.conf.py", "backend.wsgi:application"]
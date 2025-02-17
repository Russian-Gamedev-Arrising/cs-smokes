FROM python:3.12.7-alpine3.20

WORKDIR /backend

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY requirements.txt /backend/requirements.txt
COPY . /backend
EXPOSE 8000

RUN apk update && apk add postgresql-client build-base postgresql-dev

RUN pip install --no-cache-dir -r requirements.txt

RUN adduser --disabled-password service-user
USER service-user

CMD ["sh", "-c", "python manage.py runserver 0.0.0.0:8000"]
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . .

RUN python manage.py collectstatic --noinput

ENV PYTHONUNBUFFERED 1

CMD ["gunicorn", "diary.wsgi:application", "--bind", "0.0.0.0:8000"]

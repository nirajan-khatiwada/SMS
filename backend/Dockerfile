FROM python:3.10-alpine

WORKDIR /app

# Add dependencies for building some Python packages
RUN apk add --no-cache gcc musl-dev libffi-dev

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

RUN python manage.py makemigrations

RUN python manage.py migrate

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

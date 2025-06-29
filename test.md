---
title: "Docker Basic: Commands and Concepts"
date: 2024-10-18
description: "A comprehensive guide covering essential Docker commands, from creating containers to managing volumes."
ShowToc: true
categories: ["Docker"]
tags: ["Docker", "Guide", "Cheat Sheet"]
summary: "A guide to understanding Docker commands and concepts."
images: ["/images/docker.png"]  # For social share
---

# Docker Cheat Sheet: Commands and Concepts

This guide covers essential Docker commands, from creating containers, managing images, building Dockerfiles, to working with volumes.

---

## 🚀 **Creating and Running Containers**

### 1. **Run a Container from an Image**
To create and run a container from an image:
```bash
docker run image
```

### 2. **Run a Container in Interactive Mode**
To run a container and open its terminal:
```bash
docker run -it image
```
- After the container starts, you can interact with it directly in the terminal.

### 3. **Name a Container**
To give a container a specific name:
```bash
docker run --name container_name image
```

### 4. **Port Mapping**
To map a port from your computer to the container:
```bash
docker run -p computer_port:container_port image
```
- Incoming traffic to `computer_port` will be forwarded to `container_port` in the container.

### 5. **Run a Container in the Background (Detached Mode)**
To run the container in the background:
```bash
docker run -d image
```

### 6. **Passing Environment Variables to a Container**
To pass environment variables to a container:
```bash
docker run -e key=value image
```

---

## 🛠️ **Managing Containers**

### 7. **Start a Container**
To start an existing container:
```bash
docker start container_id
```

### 8. **Stop a Container**
To stop a running container:
```bash
docker stop container_id
```

### 9. **Remove a Container**
To remove a container:
```bash
docker rm container_id
```
- **Note**: The container must be stopped before removal.

### 10. **Execute a Command in a Running Container**
To start a terminal session inside a running container:
```bash
docker exec -it container_id bash
```

### 11. **View Running Containers**
To list all currently running containers:
```bash
docker ps
```

### 12. **View All Containers (Running and Stopped)**
To see all containers, including those that are stopped:
```bash
docker ps -a
```

---

## 🧱 **Building Docker Images**

### 13. **Creating a Dockerfile**
A `Dockerfile` is a script used to build Docker images. Here’s an example of common Dockerfile commands:

```Dockerfile
# Set the base image for your container
FROM base_image

# Run commands during the image build process
RUN command

# Copy files from your local machine to the container
COPY source /path/in/container

# Set environment variables
ENV key=value

# Expose a port for the container. This is only for documentation purposes; it does not actually publish the port.We need to use -p option in docker run command to publish the port or use host networking.
EXPOSE 8080

# Define the command to run when the container starts.There can be only one CMD instruction in a Dockerfile. 
CMD ["executable"]

# Optionally, run commands automatically when the container starts
ENTRYPOINT ["/path/to/script"]

# Set the working directory in the container
WORKDIR /app

# Copy all files from the local directory to the container, excluding files listed in .dockerignore
COPY . .
```

### 14. **Building a Docker Image**
To build a Docker image from a `Dockerfile`:
```bash
docker build -t image_name /path/to/Dockerfile
```

---

## 📂 **Managing Docker Files**

### 15. **Using the `.dockerignore` File**
The `.dockerignore` file helps exclude unnecessary files from being copied into the Docker image, improving build speed and reducing image size:
```bash
node_modules/
.git/
```

### 16. **COPY Command in Dockerfile**
The `COPY` command copies files from your local system to the container:

- **Copy all files from the current directory** to the container:
```Dockerfile
COPY . /path/in/container
```

- **Copy a specific file**:
```Dockerfile
COPY ./filename.extension /path/in/container
```

- **Copy an entire folder**:
```Dockerfile
COPY ./foldername /path/in/container
```

- **Copy contents of a folder (not the folder itself)**:
```Dockerfile
COPY ./foldername/ /path/in/container
```

---

## 📦 **Working with Volumes**

### 17. **Mounting Volumes**
Volumes allow data to persist even if the container is deleted. To mount a folder from your host to the container:
```bash
docker run -it -v /path/on/host:/path/in/container image
```
- Example:
```bash
docker run -it -v /home/user/backup:/app/data ubuntu
```
- This will map `/home/user/backup` on your host to `/app/data` inside the container.

#### **Use Cases for Volumes:**
1. **Data Persistence**: Preserve data even after the container is removed.
2. **Backups**: Easily back up container data to the host.
3. **Shared Data**: Share data between multiple containers or between host and container.

---

## 💾 **Publishing Docker Images**

### 18. **Pushing an Image to Docker Hub**
To publish an image to Docker Hub:
1. Tag the image with your Docker Hub username:
```bash
docker tag image_name username/image_name
```
2. Log in to Docker Hub:
```bash
docker login
```
3. Push the image to your repository:
```bash
docker push username/image_name
```

---

This guide gives you the essentials for working with Docker. With these commands, you'll be able to manage containers, build images, use volumes, and more effectively.

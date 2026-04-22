# AWS Setup Guide - Barber Booking System

This guide outlines how to deploy the Barber Booking application to AWS using EC2, S3, and Application Load Balancer (ALB).

## 1. Database (MongoDB Atlas)
- Ensure your MongoDB Atlas cluster allows connections from anywhere (`0.0.0.0/0`) or specifically from your EC2 instance's Elastic IP.
- The connection string is already configured in the `.env` file.

## 2. Infrastructure Setup (EC2 & ALB)

### EC2 Instance
1. Launch an **Ubuntu 22.04 LTS** instance (t3.medium recommended for Node + Docker).
2. Attach an **IAM Role** with `S3FullAccess` if you plan to use S3 for image uploads from the server.
3. Security Group: Allow port `22` (SSH) and `5000` (Backend API).

### Application Load Balancer
1. Create a **Target Group** for port `5000`.
2. Create an **ALB** (Internet-facing) and add a listener for port `80` (HTTP).
3. Point the listener to your Target Group.

## 3. Frontend Hosting (S3)
1. Create an S3 bucket (e.g., `sharp-sleek-frontend`).
2. Enable **Static Website Hosting**.
3. Set the **Bucket Policy** to allow public reads.
4. Run `npm run build` in the `client` directory and upload the contents of the `dist` folder to the bucket.

## 4. Deployment via Docker

### Install Docker on EC2
```bash
sudo apt update
sudo apt install docker.io docker-compose -y
sudo usermod -aG docker $USER
```

### Run the Application
1. Clone your repository to the EC2 instance.
2. Create the `.env` file in the `server` directory.
3. Run:
```bash
docker-compose up -d --build
```

## 5. Nginx Configuration (Optional but Recommended)
If you want to use a custom domain, set up Nginx as a reverse proxy on the EC2 instance to redirect traffic from port 80 to 5000, and handle SSL via Certbot.

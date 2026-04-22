# AWS Deployment Guide: EC2 + RDS

This guide provides step-by-step instructions for deploying your Barber Booking System using AWS EC2 for the application and AWS RDS for the PostgreSQL database.

## 1. Set up AWS RDS (PostgreSQL)

1.  Log in to the **AWS Management Console** and navigate to **RDS**.
2.  Click **Create database**.
3.  Choose **Standard create** and **PostgreSQL**.
4.  Select **Free Tier** (if applicable) or **Dev/Test**.
5.  **Settings**:
    -   DB instance identifier: `barber-booking-db`
    -   Master username: `user` (as configured in your .env)
    -   Master password: `password` (as configured in your .env)
6.  **Connectivity**:
    -   Public access: **No** (best practice for security).
    -   VPC Security Group: Create a new one (e.g., `rds-sg`).
7.  Once created, note down the **Endpoint** (host).

## 2. Set up AWS EC2 (Application)

1.  Navigate to **EC2** and click **Launch instance**.
2.  Choose **Ubuntu Server 22.04 LTS**.
3.  Instance type: `t2.micro` (Free Tier) is sufficient.
4.  **Key pair**: Create or select an existing one to SSH into the instance.
5.  **Network settings**:
    -   Allow SSH (22).
    -   Allow HTTP (80) and custom TCP (5000) for the API.
6.  Launch the instance.

## 3. Configure EC2 and Deploy

1.  SSH into your EC2 instance:
    ```bash
    ssh -i your-key.pem ubuntu@your-ec2-ip
    ```
2.  Install Docker and Docker Compose:
    ```bash
    sudo apt update
    sudo apt install docker.io docker-compose -y
    sudo usermod -aG docker $USER
    # Log out and log back in for group changes to take effect
    ```
3.  Clone your repository on the EC2 instance.
4.  Update `server/.env` with your **RDS Connection String**:
    ```text
    DATABASE_URL="postgresql://user:password@your-rds-endpoint:5432/barber-booking?schema=public"
    ```
5.  Run the application using Docker Compose:
    ```bash
    docker-compose up -d --build
    ```

## 4. Important Network Notes

-   **Security Groups**: Ensure the Security Group for RDS allows inbound traffic from the EC2 instance's Security Group on port 5432.
-   **Prisma Migrations**: When running for the first time, you can run migrations inside the container:
    ```bash
    docker exec -it <backend-container-id> npx prisma migrate deploy
    docker exec -it <backend-container-id> npx prisma db seed
    ```

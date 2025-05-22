FROM golang:1.24.3 AS builder

# Set working directory
WORKDIR /app

# Checkout the repository
RUN git clone --depth 1 https://github.com/dell/cert-csi.git .

# Install dependencies (if necessary.  Adjust based on the project's needs)
# RUN go mod download

# Build the binary (adjust the make command if necessary)
RUN make

# # Use a smaller base image for production
# FROM alpine:latest
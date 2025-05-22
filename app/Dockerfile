FROM golang:1.24.3 AS gobuilder

# Set working directory
WORKDIR /app

# Checkout the repository
RUN git clone --depth 1 https://github.com/dell/cert-csi.git .

# Build the binary
RUN make

# Build
FROM node:slim AS uxbuilder

WORKDIR /app

COPY frontend/. ./

# install and build
RUN npm install && npm run build

# final run image
# Runtime
FROM python:3.12.10-slim AS runtime

WORKDIR /app

# create directory for UX
RUN mkdir /app/frontend

COPY --from=uxbuilder /app/dist /app/frontend/dist/.

# copy the executable for cert-csi
COPY --from=gobuilder /app/cert-csi /app/.

# copy python requirements
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# copy support components
RUN mkdir /app/server

COPY server/. /app/server

# copy entrypoint 
COPY main.py /app/main.py

# set env variables
EXPOSE 5000

ENTRYPOINT ["python","main.py"]



FROM node:19.6.0-alpine3.16 as builder

RUN mkdir -p /sidenav
WORKDIR /sidenav

# Copy my local files to conatiner
COPY package.json .
COPY package-lock.json .

# Set up the environment variables for angular
RUN npm install -g @angular/cli
RUN npm install --force
RUN npm audit fix
COPY . .
RUN npm run build --prod

#Print working directory
RUN echo "$PWD"
RUN echo $(ls -a /sidenav/)

# Set up nginx webserver for build statistics
FROM nginx:latest
COPY --from=builder /sidenav/dist/sidenav/ /usr/share/nginx/html

# Build image in terminal: sudo docker build . -t repo/sitory
# Spin container in terminal: sudo docker run -p 3000:80 repo/sitory

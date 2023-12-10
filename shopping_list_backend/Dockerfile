# Use an official Node runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

RUN npm install -g nodemon


# Make port available to the world outside this container
EXPOSE 3000

# Define environment variable for MongoDB (Change as per your config)
ENV MONGO_DB_URI=mongodb://mongo:27017/mydb

# Run the application when the container launches
CMD ["npm", "run", "dev"]

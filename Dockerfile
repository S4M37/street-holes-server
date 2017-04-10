#what image we want to built
FROM node:argon

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
#COPY ./package.json /usr/src/app/
#RUN npm install

# Bundle app source
COPY . /usr/src/app/

#APP BINDING PORT
EXPOSE 8080

#START THE APP
CMD [ "npm", "start" ]
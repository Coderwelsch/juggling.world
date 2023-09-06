# pull node image
FROM node:20

ENV PORT 80

# set working directory
WORKDIR /usr/src/app

# copy package.json and package-lock.json
COPY package.json ./
COPY yarn.lock ./

# install dependencies
RUN yarn install

# copy source code
COPY . .

# expose port
EXPOSE 80

# run app
CMD ["yarn", "dev"]

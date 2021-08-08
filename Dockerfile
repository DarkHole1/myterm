FROM node
WORKDIR /app
COPY server/package.json server/yarn.lock ./
RUN yarn install --production
COPY .config.json ./
COPY server .
CMD ["yarn", "start"]
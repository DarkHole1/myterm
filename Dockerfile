FROM node
WORKDIR /app
COPY . .
RUN yarn install --production
CMD ["yarn", "start"]
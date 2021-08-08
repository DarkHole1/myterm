FROM node AS build
WORKDIR /app
COPY spa/package.json spa/yarn.lock ./
RUN yarn install
COPY spa .
RUN yarn build

FROM node
WORKDIR /app
COPY server/package.json server/yarn.lock ./
RUN yarn install --production
COPY .config.json ./
COPY server .
COPY --from=build /app/dist/ ./dist
CMD ["yarn", "start"]
FROM node AS build
WORKDIR /app
COPY svelte/package.json svelte/yarn.lock ./
RUN yarn install
COPY svelte .
RUN yarn build

FROM node
WORKDIR /app
COPY server/package.json server/yarn.lock ./
RUN yarn install --production
COPY .config.json ./
COPY server .
COPY --from=build /app/public/ ./dist
CMD ["yarn", "start"]
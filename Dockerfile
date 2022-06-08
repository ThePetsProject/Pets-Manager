FROM node:16.15.0-alpine as base

FROM base as prebuild
WORKDIR /app

COPY package*.json /app/
COPY tsconfig*.json /app/

RUN npm ci --quiet

COPY src /app/src
RUN npm run build

FROM base as production

WORKDIR /app

COPY --from=prebuild /app/package*.json /app/
RUN npm install --quiet --production
COPY --from=prebuild /app/build /app/build

EXPOSE 80

CMD ["npm", "run", "start"]

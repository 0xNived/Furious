FROM node:24-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY --chown=node:node src ./src
COPY --chown=node:node drizzle ./drizzle
COPY --chown=node:node drizzle.config.js ./

ENV NODE_ENV=production
USER node

CMD ["npm", "start"]

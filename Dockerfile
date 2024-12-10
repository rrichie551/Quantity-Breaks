FROM node:20-alpine

# Install OpenSSL
RUN apk add --no-cache openssl

EXPOSE 3000

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json* ./

RUN npm ci --omit=dev && npm cache clean --force
RUN npm remove @shopify/cli

COPY . .

RUN npm run build

RUN rm -f prisma/dev.sqlite

CMD ["npm", "run", "docker-start"]
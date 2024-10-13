FROM node:20-alpine AS production

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY prisma ./prisma/

RUN npx prisma generate

COPY . .

RUN npm run build

RUN npm prune --production

EXPOSE 4200

ENV NODE_ENV production

CMD ["npm", "run", "start:prod"]

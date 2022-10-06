FROM node:18-alpine AS base
WORKDIR /usr/src/app
COPY ./prisma ./prisma
COPY package.json ./
RUN  yarn install --frozen-lockfile

FROM base AS builder
COPY . .
RUN yarn build

FROM  node:18-alpine
COPY --from=base /usr/src/app/node_modules ./node_modules
COPY --from=base /usr/src/app/package.json ./package.json
COPY --from=base /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 8080

CMD npx prisma db push | yarn start:prod

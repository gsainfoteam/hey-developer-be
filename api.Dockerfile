#Step 1: Build the app in image 'builder'
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN apk update && \
  apk add build-base libheif vips-dev vips -q
RUN yarn

COPY . .

RUN npx prisma generate

RUN npx nest build api

#Step 2: Copy the build from 'builder' to 'runner'
FROM node:22-alpine

WORKDIR /app

ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone && \
  apk update && \
  apk add build-base libheif vips-dev vips -q

COPY --from=builder /app ./

RUN yarn add prisma -D

EXPOSE 3000

CMD ["npm", "run", "start:api.deploy"]
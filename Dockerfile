FROM jitesoft/node-yarn:lts-slim as builder
WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

ENV PATH PATH:/app/node_modules/.bin:/usr/local/bin

COPY . .

RUN vite build

FROM scratch
WORKDIR /
COPY --from=builder /app/dist .
# Fullstack Javascript Framework

> *"By the power combined I am... FullstackJS"* :boom: :sunglasses:

WARNING: this is an ongoing work. don't use in production yet!

## Featuring Advanced Authorization for Graphql
Role based + Policy based authorization using:
1. User - The authenticated object
2. Role - Group for permissions and policies
3. Resource - Graphql resource (Queries, Mutations, etc...)
4. Permission - Access (allow/deny) for Role/Resource
5. Policy (or hook) - IN-code function, allows to compare database attributes for fine-grained permissions
6. Policy Bypass - Allows to bypass/enforce policies for given roles
7. Batteries included: React backend UI (Semantic UI) to manage all this!

## Server
1. KnexJS - For database connections and migrations
2. ObjectionJS - ORM
3. Apollo Server - GraphQL server
4. Koa - NodeJS web framework
5. (only tested with PostgreSQL)

## Client
1. ReactJS - React app created with CRA
2. React Router DOM - Managing routing in client side
3. React Cookie - Handling cookies
4. React Semantic UI - CSS framework for React
5. Backend starter with authorization UI

## Install
```shell
$ cd server
$ npm install
$ npm i knex -g
$ cp .env.example .env # Edit .env with your configuration
$ knex migrate:latest
$ knex seed:run

$ cd client
$ npm install
$ cp .env.example .env # Edit .env with your configuration
$ npm run start
```

## Build & Deploy & Run
```shell
$ cd server
$ nohup node app.js &
$ cd client
$ npm run build
$ npm run deploy
```
Login with ([look at the code](./server/seeds/02_users.js#L14))

## Tutorial (TODO)

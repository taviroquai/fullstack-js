# Fullstack Javascript Framework

> *"By the power combined I am... FullstackJS"* :boom: :sunglasses:

**WARNING: this is an ongoing work. Don't use in production yet!**

## Featuring

### Modular architecture
**Server Module: folder with module name containing**
1. gql folder with .gql files
2. resolvers.js (Graphql resolvers)
3. routes.js (Koa routes)

**Client Module: folder with module name containing:**
1. Routes.js

### Advanced Authorization
Role based + Policy based authorization using:
1. User - The authenticated object
2. Role - Group for permissions and policies
3. Resource - Currently supports Graphql resolver and Koa Router's path
4. Permission - Access (allow/deny) for Role/Resource
5. Policy (or hook) - IN-code function, allows to use input args for fine-grained permissions
6. Policy Bypass - Allows to bypass/enforce policies for given roles
7. Cache for faster resolution
---

## Server
1. KnexJS - For database connections and migrations
2. ObjectionJS - ORM
3. Apollo Server - GraphQL server
4. Koa - NodeJS web framework

## Client
1. ReactJS - React app created with CRA
2. Semantic UI - CSS framework
3. Batteries included: Backend starter with Authorization Management UI
---

## Install
```shell
$ cd server
$ npm install
$ npm i knex -g
$ cp .env.example .env # Edit .env with your configuration
$ knex migrate:latest
$ node updateCache.js
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

---

## Hello World Module Example

**1. Server Module Structure**

/root  
../modules  
../../**helloworld**  
../../../gql  
../../../../queries.gql  
../../../../types.gql  
../../../HelloWorld.js  
../../../resolvers.js  
../../../routes.js  

1.1. queries.gql
```gql
getHello(name: String!): Hello
```

1.2. types.gql
```gql
type Hello {
  name: String
}
```

At this point, the framework will generate the following **schema.gql** automatically:  
/cache/schema.gql  
```gql
Queries {
  getHello(name: String!): Hello
}
type Hello {
  name: String
}
```

1.3. HelloWorld.js
```js
class HelloWorld {
  static async talkTo(name) {
    return new Promise(resolve => {
      resolve(`Hello ${name}!`);
    });
  }
}
module.exports = HelloWorld;
```

1.4. resolvers.js
```js
const HelloWorld = require('./HelloWorld');

module.exports = {
  Query: {
    getHello: async (root, args, context) => {
      const name = await HelloWorld.talkTo(args.name);
      return { name };
    }
  }
}
```

1.5. routes.js
```js
module.exports = (app, router) => {
  router.get('/hello/:name', async (ctx, next) => {
    ctx.body = 'Hello ' + ctx.params.name;
  });
}
```


**2. Client Module Structure**
/src  
../modules  
../../**welcome**  
../../../Routes.js  

2.1 Routes.js  
```jsx
import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Welcome from './Welcome';

class Routes extends Component {
  render() {
    return (
      <Route exact path="/" component={Welcome} />
    );
  }
}
export default Routes;
```
Module routes will be loaded using the Loadable lib

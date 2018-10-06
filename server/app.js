const Koa = require('koa');
const apolloServer = require('./graphql/server');

const app = new Koa();
apolloServer.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`),
);

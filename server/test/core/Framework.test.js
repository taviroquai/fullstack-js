// Load enviroment variables
require('dotenv').config();

const Framework = require('../../core/Framework');

test('Framework can be instantiated', () => {
  const fw = new Framework();
  expect.anything(fw);
});

test('Alternative port', () => {
  const fw = new Framework({ port: 4001 });
  expect.anything(fw);
});

test('getModuleManager from framework', () => {
  const fw = new Framework();
  const ModuleManager = fw.getModuleManager();
  expect.anything(ModuleManager);
});

test('getAuthorization from framework', () => {
  const fw = new Framework();
  const Authorization = fw.getAuthorization();
  expect.anything(Authorization);
});

test('getGraphqlManager from framework', () => {
  const fw = new Framework();
  const GraphqlManager = fw.getGraphqlManager();
  expect.anything(GraphqlManager);
});

test('getKoa from framework', () => {
  const fw = new Framework();
  const koa = fw.getKoa();
  expect.anything(koa);
});

test('getHTTPServer from framework', () => {
  const fw = new Framework();
  const server = fw.getHTTPServer();
  expect.anything(server);
});

test('getHTTPRouter from framework', () => {
  const fw = new Framework();
  const router = fw.getHTTPRouter();
  expect.anything(router);
});

test('Load middleware', () => {
  const fw = new Framework();
  const middleware = fw.requireMiddleware();
  expect.anything(middleware);
});

test('Load module routes', () => {
  const fw = new Framework();
  const koa = fw.getKoa();
  const router = fw.getHTTPRouter();
  fw.addRoutes(koa, router);
});


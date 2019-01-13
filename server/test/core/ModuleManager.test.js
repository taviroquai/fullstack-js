// Load enviroment variables
require('dotenv').config();

const Framework = require('../../core/Framework');
const fw = new Framework();
const ModuleManager = fw.getModuleManager();

test('Get modules paths', () => {
  const paths = ModuleManager.getModulesPaths();
  expect.anything(paths);
  expect(Array.isArray(paths)).toBe(true);
});

test('Load modules routes', () => {
  const routes = ModuleManager.loadRoutes();
  expect.anything(routes);
  expect(typeof routes).toBe('object');
});

test('Get resources names from cache', () => {
  const names = ModuleManager.getResourcesNames();
  expect.anything(names);
  expect(Array.isArray(names)).toBe(true);
});

test('Resolve cache filename', () => {
  const filename = ModuleManager.getCacheFilename('bla');
  expect.anything(filename);
  expect(typeof filename).toBe('string');
});

test('Update modules cache', () => {
  ModuleManager.updateCache();
});

test('Generate resources names from modules', () => {
  const names = ModuleManager.generateResourcesNames();
  expect(Array.isArray(names)).toBe(true);
});

test('Get hooks names from cache', () => {
  let names = ModuleManager.getHooksNames('before');
  expect(Array.isArray(names)).toBe(true);
  names = ModuleManager.getHooksNames('after');
  expect(Array.isArray(names)).toBe(true);
});

test('Generate hooks names from modules', () => {
  let names = ModuleManager.generateHooksNames('before');
  expect(Array.isArray(names)).toBe(true);
  names = ModuleManager.generateHooksNames('after');
  expect(Array.isArray(names)).toBe(true);
});

test('Generate Graphql schema from modules', () => {
  let schema = ModuleManager.generateGraphqlSchema();
  expect(typeof schema).toBe('string');
});

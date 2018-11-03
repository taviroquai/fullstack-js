import React from 'react';
import ModuleLoaders from './loaders';

// Validate module loader
const loaderName = process.env.REACT_APP_MODULES_LOADER;
if (!loaderName) throw new Error('Missing .env var: REACT_APP_MODULES_LOADER');
const Loader = ModuleLoaders[loaderName];
if (!Loader) throw new Error('Module loader not found: ' + loaderName);

// Get loader from environment (.env file)
const ModuleLoader = (path) => {
  return <Loader path={path} />
}

export default ModuleLoader;

import React from 'react';
import ModuleLoaders from './modules/loaders';

const loaderName = process.env.REACT_APP_MODULES_LOADER;

// Get ModuleLoader from environment (.env file)
const ModuleLoader = (path) => {
  const ModuleLoader = ModuleLoaders[loaderName];
  return <ModuleLoader path={path} />
}

export default ModuleLoader;

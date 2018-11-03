import React from 'react';
import LoaderRender from '../share/LoaderRender';

export default ({ path }) => {
  if (!process.env.REACT_APP_MODULES) throw new Error('Missing .env var: REACT_APP_MODULES');
  const modules = process.env.REACT_APP_MODULES.split(',');
  const items = modules.map(key => key + '/' + path);
  return <LoaderRender items={items} />
}

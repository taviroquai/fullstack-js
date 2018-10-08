import React from 'react';
import Loadable from 'react-loadable';

// Get routes from environment (.env file)
const modules = process.env.REACT_APP_MODULES ?
  process.env.REACT_APP_MODULES.split(',') :
  ['dashboard', 'system', 'auth'];

/**
 * Load modules routes using code-spliting (react-loadable)
 */
const TopMenuItems = () => {
  return (
    <React.Fragment>
      { modules.map(key => {
        let ModuleRoutes = Loadable({
          loader: () => import('./' + key + '/TopMenuRight'),
          loading: () => <div>Loading...</div>
        });
        return <ModuleRoutes key={key} />
      }) }
    </React.Fragment>
  )
}

export default TopMenuItems;

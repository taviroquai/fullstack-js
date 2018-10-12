import React from 'react';
import Loadable from 'react-loadable';

// Get routes from environment (.env file)
const modules = process.env.REACT_APP_MODULES ?
  process.env.REACT_APP_MODULES.split(',') : [];

export default ({ path }) => {
  return (
    <React.Fragment>
      { modules.map(key => {
        let ModuleItem = Loadable({
          loader: () => import('./modules/' + key + '/' + path),
          loading: () => null
        });
        return <ModuleItem key={key} />
      }) }
    </React.Fragment>
  )
}

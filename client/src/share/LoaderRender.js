import React from 'react';
import Loadable from 'react-loadable';

let modulesCache = {};

export default ({ items }) => {
  return (
    <React.Fragment>
      { items.map((filename, i) => {
        if (!modulesCache[filename]) {
          modulesCache[filename] = Loadable({
            loader: () => import('../modules/' + filename),
            loading: () => null,
            delay: 300
          });
        }
        let Module = modulesCache[filename];
        return <Module key={i} />
      }) }
    </React.Fragment>
  )
}

import React, { Component } from 'react';
import LoaderRender from '../share/LoaderRender';

let urlModulesCache = null;

class UrlModuleLoader extends Component {

  state = { modules: urlModulesCache };

  componentDidMount() {
    const { modules } = this.state;
    if (modules) return;

    // Validate url
    const url = process.env.REACT_APP_MODULES_URL;
    if (!url) throw new Error('Missing .env var: REACT_APP_MODULES_URL');

    // Load modules
    fetch(url)
    .then(r => r.json())
    .then(modules => {
      urlModulesCache = modules;
      this.setState({
        modules
      });
    })
  }

  render() {
    const { path } = this.props;
    const modules = this.state.modules || [];
    const items = modules.map(key => key + '/' + path);
    return <LoaderRender items={items} />
  }
}

export default UrlModuleLoader;
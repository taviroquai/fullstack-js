import React, { Component } from 'react';
import { HashRouter as Router, Switch } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import ModuleLoader from './ModuleLoader';
import './InitStore';
import './i18next';
import './assets/dist/semantic.min.css';
import './assets/index.css';

class App extends Component {
  render() {
    return (
      <CookiesProvider>
        <Router>
          <Switch>
            <React.Fragment>

              { ModuleLoader('Routes') }

            </React.Fragment>
          </Switch>
        </Router>
      </CookiesProvider>
    );
  }
}

export default App;

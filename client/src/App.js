import React, { Component } from 'react';
import { HashRouter as Router, Switch } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import ModulesRoutes from './modules/routes';
import './assets/dist/semantic.min.css';
import './assets/index.css';

class App extends Component {
  render() {
    return (
      <CookiesProvider>
        <Router>
          <Switch>
            <React.Fragment>

              <ModulesRoutes />

            </React.Fragment>
          </Switch>
        </Router>
      </CookiesProvider>
    );
  }
}

export default App;

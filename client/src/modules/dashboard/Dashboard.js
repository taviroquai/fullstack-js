import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import Layout from '../../share/AdminLayoutExample';
import loc from '../../locales/en/translations.json';

class Dashboard extends Component {
  render() {
    return (
      <Layout>

        <Header as='h1'>{loc.dashboard}</Header>
        <p>{loc.welcome}</p>

        <p>{loc.visit} <a href="https://github.com/taviroquai/FullstackJavascriptFramework">Github</a>
          {' '}{loc.for_documentation}
        </p>

      </Layout>
    )
  }
}

export default Dashboard;

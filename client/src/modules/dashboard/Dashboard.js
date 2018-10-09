import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import Layout from '../../share/AdminLayoutExample';

class Dashboard extends Component {
  render() {
    return (
      <Layout>

        <Header as='h1'>Dashboard</Header>
        <p>Welcome to Fullstack Javascript Framework</p>

        <p>Visit <a href="https://github.com/taviroquai/FullstackJavascriptFramework">Github</a>
          {' '}for documentation
        </p>

      </Layout>
    )
  }
}

export default Dashboard;

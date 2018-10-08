import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import Layout from '../shared/Layout';

class Dashboard extends Component {
  render() {
    return (
      <Layout>

        <Header as='h1'>Dashboard</Header>
        <p>Welcome to Fullstack Frameword</p>

        <p>Visit <a href="https://github.com/taviroquai/ObjectionKoaApolloReact-Boilerplate">Github</a>
          {' '}for documentation
        </p>
            
      </Layout>
    )
  }
}

export default Dashboard;
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Divider, List, Icon } from 'semantic-ui-react';
import { get } from '../../graphql';
import { getHello } from './queries.js';

const stack = [
  'Fullstack Client Module',
  'React (and Apollo Client)',
  'Koa',
  'Koa Middleware (inc. Apollo Server)',
  'Fullstack Authorization',
  'Fullstack Server Module'
]

class Welcome extends Component {

  state = { name: 'Wait...' }

  /**
   * Use Graphql demo
   */
  componentDidMount() {
    get(getHello, 'getHello', { name: 'FullstackJS' })
    .then(result => {
      this.setState(result);
    })
  }

  /**
   * Render our Hello World!
   */
  render() {
    const { name } = this.state;
    return (
      <React.Fragment>
        <style>{`
          body, #root, #root > div
          {
            height: 100%;
          }
        `}</style>
        <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 766 }}>

            <h1>{ name }</h1>
            <Link to='/demo'>Backoffice</Link>

            <div style={{ maxWidth: '360px', margin: '0 auto' }}>

              <Divider />

              <List celled animated verticalAlign='middle'>
                { stack.map((item, i) => (
                  <List.Item key={i}>
                    <Icon name="sort" />
                    <List.Content>
                      <List.Header as='h3'>{ item }</List.Header>
                    </List.Content>
                  </List.Item>
                )) }
              </List>
            </div>

            <p><small><em>
              
            </em></small></p>

          </Grid.Column>
        </Grid>
      </React.Fragment>
    )
  }
}

export default Welcome;

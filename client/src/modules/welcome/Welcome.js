import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Divider } from 'semantic-ui-react';
import { get } from '../../graphql';
import { getHello } from './queries.js';

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

            <Divider />

            <p><small><em>
              SemanticUI &lt;&gt;
              React &lt;&gt;
              Apollo Client &lt;&gt;
              Koa &lt;&gt;
              Middleware &lt;&gt;
              Authorization &lt;&gt;
              ApolloServer &lt;&gt;
              Module &lt;&gt;
              ObjectionJS &lt;&gt;
              Database
            </em></small></p>

          </Grid.Column>
        </Grid>
      </React.Fragment>
    )
  }
}

export default Welcome;

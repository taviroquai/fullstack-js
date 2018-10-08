import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';

class Layout extends Component {
  render() {
    const { children } = this.props;
    return (
      <div className='login-form'>
        <style>{`
          body > div,
          body > div > div,
          body > div > div > div.login-form {
            height: 100%;
          }
        `}</style>
        <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 450 }}>

            { children }

          </Grid.Column>
        </Grid>
      </div>
    )
  }
}

export default Layout;

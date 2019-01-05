import React, { Component } from 'react';
import {
  Header,
  Image,
  Message,
  Grid,
  Button
 } from 'semantic-ui-react';
import imgLogo from '../assets/logo.svg';
import { NamespacesConsumer } from 'react-i18next';

class SplashScreenExample extends Component {

  back() {
    window.history.back();
  }

  render() {
    const { error } = this.props;
    return (
      <NamespacesConsumer ns="translations">
        { (t, { i18n }) => (
          <div className="login-form">
            <style>{`
                body > div,
                body > div > div,
                body > div > div > div.login-form {
                    height: 100%;
                }
                `}
            </style>
            <Grid
              textAlign="center"
              style={{ height: '100%' }}
              verticalAlign="middle"
              >
              <Grid.Column style={{ maxWidth: 450 }}>

                <Header as="h2" textAlign="center">
                  <Image src={imgLogo} style={{width: '200px'}} />
                </Header>

                { error 
                  ? (
                    <React.Fragment>
                      <Message error header="" content={t(error)} />
                      <Button as='a' onClick={this.back}>{t('back')}</Button>
                    </React.Fragment>
                  )
                  : <Message header="" content={t('loading')} />
                }

              </Grid.Column>
            </Grid>
          </div>
        )}
      </NamespacesConsumer>
    )
  }
}

export default SplashScreenExample

import React, { Component } from 'react';
import {
  Header,
  Image,
  Message,
  Grid
 } from 'semantic-ui-react';
import imgLogo from '../assets/logo.svg';
import { I18n } from 'react-i18next';

class SplashScreenExample extends Component {
  render() {
    return (
      <I18n ns="translations">
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

                <Message header="" content={t('loading')} />

              </Grid.Column>
            </Grid>
          </div>
        )}
      </I18n>
    )
  }
}

export default SplashScreenExample

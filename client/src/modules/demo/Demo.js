import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import { NamespacesConsumer } from 'react-i18next';
import Layout from '../../share/AdminLayoutExample';

class Dashboard extends Component {
  render() {
    return (
      <NamespacesConsumer ns="translations">
        { (t, { i18n }) => (
          <Layout>

            <Header as='h1'>{t('welcome')}</Header>
            <p>{t('slogan')}</p>

            <p>{t('visit')} <a href="https://github.com/taviroquai/FullstackJavascriptFramework">Github</a>
              {' '}{t('for_documentation')}
            </p>

          </Layout>
        )}
      </NamespacesConsumer>
    )
  }
}

export default Dashboard;

import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import Layout from '../../share/AdminLayoutExample';
import { I18n } from 'react-i18next';

class Dashboard extends Component {
  render() {
    return (
      <I18n ns="translations">
        { (t, { i18n }) => (
          <Layout>

            <Header as='h1'>{t('dashboard')}</Header>
            <p>{t('welcome')}</p>

            <p>{t('visit')} <a href="https://github.com/taviroquai/FullstackJavascriptFramework">Github</a>
              {' '}{t('for_documentation')}
            </p>

          </Layout>
        )}
      </I18n>
    )
  }
}

export default Dashboard;

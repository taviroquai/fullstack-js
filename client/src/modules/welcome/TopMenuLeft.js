import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Icon } from 'semantic-ui-react';
import { I18n } from 'react-i18next';

class TopMenuItem extends Component {

  render() {
    return (
      <I18n ns="translations">
        { (t, { i18n }) => (
          <React.Fragment>

            <Menu.Item as={Link} to='/'>
              <Icon name="smile" className="mob-only" />
              <span className="desk-only">{t('welcome')}</span>
            </Menu.Item>

          </React.Fragment>
        )}
      </I18n>
    )
  }
}

export default TopMenuItem;

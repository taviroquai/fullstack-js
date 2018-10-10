import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, Button } from 'semantic-ui-react';
import { getUser } from '../auth/actions';
import { I18n } from 'react-i18next';

class TopMenuItem extends Component {
  render() {
    const logged = getUser();
    return (
      <I18n ns="translations">
        { (t, { i18n }) => (
          <React.Fragment>

            { !logged ? (
              <Button as={Link} to='/login'>
                {t('login')}
              </Button>
            ) : (
              <Dropdown item simple text={logged.username}>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to='/logout'>{t('logout')}</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}

          </React.Fragment>
        )}
      </I18n>
    )
  }
}

export default TopMenuItem;

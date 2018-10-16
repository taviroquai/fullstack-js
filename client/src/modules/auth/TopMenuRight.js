import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, Button } from 'semantic-ui-react';
import { getUserFromCookie } from '../auth/actions';
import { NamespacesConsumer } from 'react-i18next';

class TopMenuItem extends Component {
  render() {
    const user = getUserFromCookie();
    return (
      <NamespacesConsumer ns="translations">
        { (t, { i18n }) => (
          <React.Fragment>

            { !user ? (
              <Button as={Link} to='/auth/login'>{t('login')}</Button>
            ) : (

              <Dropdown item simple text={user.username}>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to='/auth/profile'>
                    {t('my_profile')}
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to='/auth/logout'>
                    {t('logout')}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

            )}

          </React.Fragment>
        )}
      </NamespacesConsumer>
    )
  }
}

export default TopMenuItem;

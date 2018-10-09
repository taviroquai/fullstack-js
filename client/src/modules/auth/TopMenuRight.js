import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, Button } from 'semantic-ui-react';
import { getUser } from '../auth/actions';
import loc from '../../locales/en/translations.json';

class TopMenuItem extends Component {
  render() {
    const logged = getUser();
    return (
      <React.Fragment>

        { !logged ? (
          <Button as={Link} to='/login'>
            {loc.login}
          </Button>
        ) : (
          <Dropdown item simple text={logged.username}>
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to='/logout'>{loc.logout}</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}

      </React.Fragment>
    )
  }
}

export default TopMenuItem;

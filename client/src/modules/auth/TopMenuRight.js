import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, Button } from 'semantic-ui-react';
import { getUser } from '../auth/actions';

class TopMenuItem extends Component {
  render() {
    const logged = getUser();
    return (
      <React.Fragment>

        { !logged ? (
          <Button as={Link} to='/login'>
            Log in
          </Button>
        ) : (
          <Dropdown item simple text={logged.username}>
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to='/logout'>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}

      </React.Fragment>
    )
  }
}

export default TopMenuItem;

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, Icon } from 'semantic-ui-react';

class TopMenuItem extends Component {

  render() {
    return (
      <React.Fragment>

        <Dropdown item simple trigger={(
            <React.Fragment>
              <Icon name="cog" />
              <span className="desk-only">System</span>
            </React.Fragment>
          )}>
          <Dropdown.Menu>
            <Dropdown.Item as={Link} to='/users'>Users</Dropdown.Item>
            <Dropdown.Item as={Link} to='/roles'>Roles</Dropdown.Item>
            <Dropdown.Item as={Link} to='/permissions'>Permissions</Dropdown.Item>
            <Dropdown.Item as={Link} to='/resources'>Resources</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

      </React.Fragment>
    )
  }
}

export default TopMenuItem;

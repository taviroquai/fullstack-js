import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, Icon, Loader } from 'semantic-ui-react';
import { allowed } from './Authorization';
import Store, { withStore } from 'react-observable-store';
import { load as loadAuth } from './Authorization';

class TopMenuItem extends Component {

  componentDidMount() {
    if (this.props.authorization) return;

    // Load authorization
    loadAuth().then(data => {
      Store.set('system.authorization', data);
    });
  }

  render() {
    const { authorization } = this.props;
    if (!authorization) return <Loader size='mini' active inline />;
    return (
      <React.Fragment>

        <Dropdown item simple trigger={(
            <React.Fragment>
              <Icon name="cog" />
              <span className="desk-only">System</span>
            </React.Fragment>
          )}>
          <Dropdown.Menu>

            { allowed('Query.getUsers') && (
              <Dropdown.Item as={Link} to='/system/users'>Users</Dropdown.Item>
            )}

            { allowed('Query.getRoles') && (
              <Dropdown.Item as={Link} to='/system/roles'>Roles</Dropdown.Item>
            )}

            { allowed('Query.getResources') && (
              <Dropdown.Item as={Link} to='/system/resources'>Resources</Dropdown.Item>
            )}

          </Dropdown.Menu>
        </Dropdown>

      </React.Fragment>
    )
  }
}

export default withStore('system', TopMenuItem);

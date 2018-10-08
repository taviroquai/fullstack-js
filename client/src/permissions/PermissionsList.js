import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Header,
  Table,
  Loader,
  Message,
  Button,
  Checkbox
} from 'semantic-ui-react';
import Layout from '../shared/Layout';
import { getPermissions, savePermission } from './actions';

class PermissionsList extends Component {

  state = {
    loading: false,
    total: 0,
    permissions: [],
    errors: null
  }

  reload() {
    this.setState({ ...this.state, loading: true});
    getPermissions().then((permissions, total) => {
      this.setState({
        ...this.state,
        loading: false,
        permissions,
        total
       });
    }).catch(errors => {
      this.setState({ ...this.state, loading: false, errors });
    });
  }

  componentDidMount() {
    this.reload();
  }

  toggleAccess(permission) {
    this.setState({ ...this.state, loading: true});
    const variables = {
      ...permission,
      access: !permission.access
    }
    savePermission(variables).then(() => {
      this.reload();
    }).catch(errors => {
      this.setState({ ...this.state, loading: false, errors });
    });
  }

  render() {
    const { loading, errors, permissions } = this.state;
    return (
      <Layout>
        <Header as='h1'>
          Permissions

          <Button floated='right' primary
            as={Link} to='/permissions/edit'>
            New
          </Button>
        </Header>

        { errors && <Message error size='mini'
          icon='exclamation triangle'
          list={errors.map(e => e.message)}
        /> }

        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>Label</Table.HeaderCell>
              <Table.HeaderCell>System</Table.HeaderCell>
              <Table.HeaderCell>
                { loading && <Loader active inline='centered' /> }
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            { permissions.map(permission => (
              <Table.Row key={permission.id}>
                <Table.Cell>{permission.id}</Table.Cell>
                <Table.Cell>{permission.resource_id}</Table.Cell>
                <Table.Cell>{permission.role_id}</Table.Cell>
                <Table.Cell width={2}>

                  <Checkbox toggle
                    disabled={loading}
                    checked={permission.access}
                    title={permission.access ? 'Deny' : 'Allow'}
                    size='mini'
                    onClick={this.toggleAccess.bind(this, permission)}
                    style={{ marginTop: '0.5rem' }}
                  />{' '}

                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>

        </Table>
            
      </Layout>
    )
  }
}

export default PermissionsList;
import React, { Component } from 'react';
import {
  Header,
  Table,
  Loader,
  Message,
  Checkbox
} from 'semantic-ui-react';
import { getUsers, changeUserRole } from '../users/actions';
import { getRoleUsers } from './actions';

class RoleUsersList extends Component {

  state = {
    loading: false,
    total: 0,
    users: [],
    current: [],
    errors: null
  }

  reload(role) {
    this.setState({ ...this.state, loading: true});
    getUsers().then((users, total) => {
      getRoleUsers(role.id).then(current => {
        this.setState({
          ...this.state,
          loading: false,
          users,
          total,
          current: current.map(i => i.id)
          });
      });
    }).catch(errors => {
      this.setState({ ...this.state, loading: false, errors });
    });
  }

  componentDidMount() {
    const { role } = this.props;
    if (!role.id) return;
    this.reload(role);
  }

  toggleUser(user) {
    const { role } = this.props;
    const { current } = this.state;
    const role_id = current.indexOf(user.id) > -1 ? null : role.id;
    this.setState({ ...this.state, loading: true});
    changeUserRole(user.id, role_id).then(() => {
      this.reload();
    }).catch(errors => {
      this.setState({ ...this.state, loading: false, errors });
    });
  }

  render() {
    const { role } = this.props;
    const { loading, errors, users, current } = this.state;
    if (!role.id) return null;
    return (
      <React.Fragment>
        <Header as='h1'>
          Users
        </Header>

        { errors && <Message error size='mini'
          icon='exclamation triangle'
          list={errors.map(e => e.message)}
        /> }

        { loading ? <Loader active inline='centered' /> : (
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>ID</Table.HeaderCell>
                <Table.HeaderCell>Username</Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              { users.map(user => (
                <Table.Row key={user.id}>
                  <Table.Cell>{user.id}</Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell width={1}>

                    <Checkbox toggle
                      disabled={loading}
                      checked={current.indexOf(user.id) > -1}
                      title={current.indexOf(user.id) > -1 ? 'Deny' : 'Allow'}
                      size='mini'
                      onClick={this.toggleUser.bind(this, user)}
                      style={{ marginTop: '0.5rem' }}
                    />

                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>

          </Table>
        )}

      </React.Fragment>
    )
  }
}

export default RoleUsersList;

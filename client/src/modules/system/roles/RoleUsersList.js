import React, { Component } from 'react';
import {
  Header,
  Table,
  Loader,
  Message,
  Button,
  Icon
} from 'semantic-ui-react';
import Layout from '../../../share/AdminLayoutExample';
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

  addUser(user_id) {
    const { role } = this.props;
    this.setState({ ...this.state, loading: true});
    changeUserRole(user_id, role.id).then(() => {
      this.reload(role);
    }).catch(errors => {
      this.setState({ ...this.state, loading: false, errors });
    });
  }

  removeUser(user_id) {
    const { role } = this.props;
    this.setState({ ...this.state, loading: true});
    changeUserRole(user_id, null).then(() => {
      this.reload(role);
    }).catch(errors => {
      this.setState({ ...this.state, loading: false, errors });
    });
  }

  render() {
    const { role } = this.props;
    const { loading, errors, users, current } = this.state;
    if (!role.id) return null;
    console.log(users, current);
    return (
      <Layout>
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

                    { current.indexOf(user.id) > -1 ? (
                      <Button negative icon
                        title='Remove user'
                        size='mini'
                        onClick={this.removeUser.bind(this, user.id)}>
                        <Icon name="minus" />
                      </Button>
                    ) : (
                      <Button positive icon
                        title='Add user'
                        size='mini'
                        onClick={this.addUser.bind(this, user.id)}>
                        <Icon name="plus" />
                      </Button>
                    )}

                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>

          </Table>
        )}

      </Layout>
    )
  }
}

export default RoleUsersList;

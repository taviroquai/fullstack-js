import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Header,
  Table,
  Loader,
  Message,
  Button,
  Icon
} from 'semantic-ui-react';
import Layout from '../../../share/AdminLayoutExample';
import { getUsers } from './actions';

class UsersList extends Component {

  state = {
    loading: false,
    total: 0,
    users: [],
    errors: null
  }

  componentDidMount() {
    this.setState({ ...this.state, loading: true});
    getUsers().then((users, total) => {
      this.setState({
        ...this.state,
        loading: false,
        users,
        total
       });
    }).catch(errors => {
      this.setState({ ...this.state, loading: false, errors });
    });
  }

  render() {
    const { loading, errors, users } = this.state;
    return (
      <Layout>
        <Header as='h1'>
          Users

          <Button floated='right' primary
            as={Link} to='/users/edit'>
            New
          </Button>
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
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Active</Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              { users.map(user => (
                <Table.Row key={user.id}>
                  <Table.Cell>{user.id}</Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>

                    { user.active ? (
                      <React.Fragment>
                        <Icon circular color='green' name="check" />Active
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <Icon circular color='red' name="remove" />Inactive
                      </React.Fragment>
                    )}

                  </Table.Cell>
                  <Table.Cell width={1}>
                    <Button.Group>
                      <Button primary icon
                        size='mini'
                        as={Link} to={'/users/edit/'+user.id}>
                        <Icon name="pencil" />
                      </Button>
                    </Button.Group>
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

export default UsersList;

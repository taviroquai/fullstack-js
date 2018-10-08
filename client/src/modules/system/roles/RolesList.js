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
import { getRoles } from './actions';

class RolesList extends Component {

  state = {
    loading: false,
    total: 0,
    roles: [],
    errors: null
  }

  componentDidMount() {
    this.setState({ ...this.state, loading: true});
    getRoles().then((roles, total) => {
      this.setState({
        ...this.state,
        loading: false,
        roles,
        total
       });
    }).catch(errors => {
      this.setState({ ...this.state, loading: false, errors });
    });
  }

  render() {
    const { loading, errors, roles } = this.state;
    return (
      <Layout>
        <Header as='h1'>
          Roles

          <Button floated='right' primary
            as={Link} to='/roles/edit'>
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
                <Table.HeaderCell>Label</Table.HeaderCell>
                <Table.HeaderCell>System</Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              { roles.map(role => (
                <Table.Row key={role.id}>
                  <Table.Cell>{role.id}</Table.Cell>
                  <Table.Cell>{role.label}</Table.Cell>
                  <Table.Cell>{role.system}</Table.Cell>
                  <Table.Cell width={1}>
                    <Button.Group>
                      <Button primary icon
                        size='mini'
                        as={Link} to={'/roles/edit/'+role.id}>
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

export default RolesList;

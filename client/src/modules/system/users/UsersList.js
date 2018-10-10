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
import { I18n } from 'react-i18next';

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
      <I18n ns="translations">
        { (t, { i18n }) => (
          <Layout>
            <Header as='h1'>
              {t('users')}

              <Button floated='right' primary
                as={Link} to='/users/edit'>
                {t('create')}
              </Button>
            </Header>

            { errors && <Message error size='mini'
              icon='exclamation triangle'
              list={errors.map(e => e.message)}
            /> }

            { loading ? <Loader active inline='centered' /> : (
              <Table size='small'>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>{t('id')}</Table.HeaderCell>
                    <Table.HeaderCell>{t('username')}</Table.HeaderCell>
                    <Table.HeaderCell>{t('email')}</Table.HeaderCell>
                    <Table.HeaderCell>{t('active')}</Table.HeaderCell>
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
                            <Icon circular color='green' name="check" />{t('active')}
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            <Icon circular color='red' name="remove" />{t('inactive')}
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
        )}
      </I18n>
    )
  }
}

export default UsersList;

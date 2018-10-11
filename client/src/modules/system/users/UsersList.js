import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import debounce from 'lodash.debounce';
import {
  Header,
  Table,
  Message,
  Button,
  Icon,
  Input,
  Segment,
  Pagination,
  Loader
} from 'semantic-ui-react';
import Layout from '../../../share/AdminLayoutExample';
import { getUsers } from './actions';
import { NamespacesConsumer } from 'react-i18next';
import Store, { withStore } from 'react-observable-store';

Store.add('sysuserslist', {
  sysuserslist: {
    loading: false,
    total: 0,
    page: 1,
    limit: 25,
    users: [],
    errors: null,
    query: ''
  }
});

// Helpers
const put = (data) => Store.update('sysuserslist', data);
const get = () => Store.get('sysuserslist');

/**
 * Component for list of users
 */
class UsersList extends Component {

  constructor(props) {
    super(props);

    // Create reload debounce
    this.reloadDebounce = debounce(() => {
      this.reload();
    }, 300);
  }

  componentDidMount() {
    const { users } = this.props;
    if (!users.length) this.reload();
  }

  reload() {
    put({ loading: true });
    const { query, page, limit } = get();
    getUsers({ query, page, limit }).then(result => {
      put({
        loading: false,
        errors: false,
        users: result.results,
        total: result.total
       });
    }).catch(errors => {
      put({ loading: false, errors, users: null });
    });
  }

  onSearch(query) {
    put({ query, page: 1 });
    this.reloadDebounce();
  }

  handlePaginationChange(e, { activePage }) {
    put({ page: activePage })
    this.reload();
  }

  render() {
    const { loading, errors, total, page, limit, users, query } = this.props;
    return (
      <NamespacesConsumer ns="translations">
        { (t, { i18n }) => (
          <Layout>
            <Header as='h1'>
              {t('users')}

              <Button floated='right' primary
                disabled={loading}
                as={Link} to='/system/users/edit'>
                {t('create')}
              </Button>
            </Header>

            { errors && <Message error size='mini'
              icon='exclamation triangle'
              list={errors.map(e => t(e.message))}
            /> }

            { users && (
              <React.Fragment>
                <Table size='small'>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>{t('id')}</Table.HeaderCell>
                      <Table.HeaderCell>
                        {t('username')}
                        <Input style={{fontSize: '.8rem', float: 'right'}}
                          placeholder={t('search')}
                          value={query}
                          loading={loading}
                          onChange={e => this.onSearch(e.target.value)}
                        />
                      </Table.HeaderCell>
                      <Table.HeaderCell>{t('email')}</Table.HeaderCell>
                      <Table.HeaderCell>{t('active')}</Table.HeaderCell>
                      <Table.HeaderCell width={1}>
                        { loading ? (
                          <Loader size='mini' active inline='centered' />
                        ) : (
                          <Button color='orange' icon
                            title={t('refresh')}
                            size='mini'
                            disabled={loading}
                            onClick={e => this.reload()}>
                            <Icon name="redo" />
                          </Button>
                        ) }
                      </Table.HeaderCell>
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
                              disabled={loading}
                              as={Link} to={'/system/users/edit/'+user.id}>
                              <Icon name="pencil" />
                            </Button>
                          </Button.Group>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>

                </Table>

                {Math.floor(total / limit) > 0 && (
                  <Segment textAlign='right' basic>
                    <Pagination size='mini'
                      totalPages={Math.floor(total / limit)}
                      activePage={page}
                      onPageChange={this.handlePaginationChange.bind(this)}
                    />
                  </Segment>
                ) }

              </React.Fragment>
            )}

          </Layout>
        )}
      </NamespacesConsumer>
    )
  }
}

export default withStore('sysuserslist', UsersList);

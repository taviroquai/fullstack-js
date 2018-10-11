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
import { NamespacesConsumer } from 'react-i18next';
import Store, { withStore } from 'react-observable-store';

Store.add('sysroleslist', {
  sysroleslist: {
    loading: false,
    total: 0,
    roles: [],
    errors: null
  }
});

// Helpers
const put = (data) => Store.update('sysroleslist', data);

class RolesList extends Component {

  componentDidMount() {
    const { roles } = this.props;
    if (!roles.length) this.reload();
  }

  reload() {
    put({ loading: true});
    getRoles().then((roles, total) => {
      put({
        loading: false,
        errors: null,
        roles,
        total
       });
    }).catch(errors => {
      put({ loading: false, errors, roles: [] });
    });
  }

  render() {
    const { loading, errors, roles } = this.props;
    return (
      <NamespacesConsumer ns="translations">
        { (t, { i18n }) => (
          <Layout>
            <Header as='h1'>
              {t('roles')}

              <Button floated='right' primary
                disabled={loading}
                as={Link} to='/system/roles/edit'>
                {t('create')}
              </Button>
            </Header>

            { errors && <Message error size='mini'
              icon='exclamation triangle'
              list={errors.map(e => t(e.message))}
            /> }

            { roles && (
              <Table size='small'>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>{t('id')}</Table.HeaderCell>
                    <Table.HeaderCell>{t('label')}</Table.HeaderCell>
                    <Table.HeaderCell>{t('system_keyword')}</Table.HeaderCell>
                    <Table.HeaderCell width={1}>
                      { loading ? (
                        <Loader size='mini' active inline='centered' />
                      ) : (
                        <Button color='orange' icon
                          title={t('refresh')}
                          size='mini'
                          onClick={e => this.reload()}>
                          <Icon name="redo" />
                        </Button>
                      ) }
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  { roles.map(role => (
                    <Table.Row key={role.id}>
                      <Table.Cell>{role.id}</Table.Cell>
                      <Table.Cell>{role.label}</Table.Cell>
                      <Table.Cell>{role.system}</Table.Cell>
                      <Table.Cell width={1}>
                        <Button.Group size='mini'>
                          <Button primary icon
                            disabled={loading}
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
        )}
      </NamespacesConsumer>
    )
  }
}

export default withStore('sysroleslist', RolesList);

import React, { Component } from 'react';
import {
  Header,
  Table,
  Loader,
  Message,
  Checkbox,
  Input,
  Select
} from 'semantic-ui-react';
import Layout from '../../../share/AdminLayoutExample';
import { getPermissions, savePermission } from './actions';
import { I18n } from 'react-i18next';

class PermissionsList extends Component {

  state = {
    loading: false,
    total: 0,
    permissions: [],
    roleFilter: 'Registered',
    resourceFilter: '',
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

  onFilter(name, value) {
    this.setState({
      ...this.state,
      [name]: value
    });
  }

  render() {
    const {
      loading,
      errors,
      permissions,
      resourceFilter,
      roleFilter
    } = this.state;
    let filtered = permissions;

    // Role options
    const roleOptions = permissions.reduce((acc, i) => {
      if (acc.indexOf(i.role.label) < 0) acc.push(i.role.label);
      return acc;
    }, []).map((opt, i) => ({
      key: i,
      value: opt,
      text: opt
    }));

    // Filter by resource
    if (resourceFilter) {
      const regex = new RegExp(resourceFilter, 'ig');
      filtered = filtered.filter(i => regex.test(i.resource));
    }

    // Filter by role
    if (roleFilter) {
      const regex = new RegExp(roleFilter, 'ig');
      filtered = filtered.filter(i => regex.test(i.role.label));
    }

    // Render
    return (
      <I18n ns="translations">
        { (t, { i18n }) => (
          <Layout>
            <Header as='h1'>{t('permissions')}</Header>

            { errors && <Message error size='mini'
              icon='exclamation triangle'
              list={errors.map(e => t(e.message))}
            /> }

            <Table size='small'>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>{t('id')}</Table.HeaderCell>
                    <Table.HeaderCell>
                      <Select
                        style={{ fontSize: '0.8rem'}}
                        placeholder={t('filter_by_role')}
                        value={roleFilter}
                        options={roleOptions}
                        onChange={(e, { value }) => this.onFilter('roleFilter', value)}
                      />
                    </Table.HeaderCell>
                  <Table.HeaderCell>
                    {t('resource')}
                    <Input style={{fontSize: '.8rem', float: 'right'}}
                      placeholder={t('filter_by_resource')}
                      value={resourceFilter}
                      loading={loading}
                      onChange={e => this.onFilter('resourceFilter', e.target.value)}
                    />
                  </Table.HeaderCell>
                  <Table.HeaderCell width={3}>
                    { !loading ? t('allowed') :
                      <Loader size='mini' active inline='centered' />
                    }
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                { filtered.map(permission => (
                  <Table.Row key={permission.id}>
                    <Table.Cell>{permission.id}</Table.Cell>
                    <Table.Cell>{permission.role.label}</Table.Cell>
                    <Table.Cell>{permission.resource}</Table.Cell>
                    <Table.Cell width={3}>

                      <Checkbox toggle
                        disabled={loading}
                        checked={permission.access}
                        title={permission.access ? t('deny') : t('allow')}
                        className='mini'
                        onClick={this.toggleAccess.bind(this, permission)}
                        style={{ marginTop: '0.5rem' }}
                      />

                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>

            </Table>

          </Layout>
        )}
      </I18n>
    )
  }
}

export default PermissionsList;

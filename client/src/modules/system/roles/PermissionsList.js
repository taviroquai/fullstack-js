import React, { Component } from 'react';
import {
  Header,
  Table,
  Loader,
  Message,
  Checkbox,
  Input,
  Button,
  Icon
} from 'semantic-ui-react';
import { getPermissions, updatePermission } from './actions';
import { NamespacesConsumer } from 'react-i18next';

class PermissionsList extends Component {

  state = {
    loading: false,
    total: 0,
    permissions: [],
    roleFilter: '2',
    resourceFilter: '',
    errors: null
  }

  reload() {
    this.setState({ ...this.state, loading: true});
    getPermissions({}).then(({ results, total}) => {
      this.setState({
        ...this.state,
        loading: false,
        errors: null,
        permissions: results,
        total
       });
    }).catch(errors => {
      this.setState({
        ...this.state,
        loading: false, 
        errors, 
        permissions: []
      });
    });
  }

  componentDidMount() {
    const { role } = this.props;
    this.onFilter('roleFilter', role.id, () => {
      this.reload();
    });
  }

  toggleAccess(permission) {
    this.setState({ ...this.state, loading: true});
    const variables = { ...permission, access: !permission.access };
    updatePermission(variables).then(() => {
      this.reload();
    }).catch(errors => {
      this.setState({ ...this.state, loading: false, errors });
    });
  }

  onFilter(name, value, cb) {
    this.setState({ ...this.state, [name]: value }, cb);
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

    // Filter by role
    if (roleFilter) {
      filtered = filtered.filter(i => roleFilter === i.role_id);
    }

    // Filter by resource
    if (resourceFilter) {
      const regex = new RegExp(resourceFilter, 'i');
      filtered = filtered.filter(i => regex.test(i.resource));
    }
    
    // Render
    return (
      <NamespacesConsumer ns="translations">
        { (t, { i18n }) => (
          <React.Fragment>
            <Header as='h3'>
              {t('role')} {t('permissions')}
            </Header>

            { errors && <Message error size='mini'
              icon='exclamation triangle'
              list={errors.map(e => t(e.message))}
            /> }

            <Table size='small'>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell width={1}>
                    {t('id')}
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    {t('resource')}
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <Input style={{fontSize: '.8rem', float: 'right'}}
                      placeholder={t('filter_by_resource')}
                      value={resourceFilter}
                      loading={loading}
                      onChange={e => this.onFilter('resourceFilter', e.target.value)}
                    />
                  </Table.HeaderCell>
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
                { filtered.map(permission => (
                  <Table.Row key={permission.id}>
                    <Table.Cell width={1}>{permission.id}</Table.Cell>
                    <Table.Cell>{permission.resource}</Table.Cell>
                    <Table.Cell></Table.Cell>
                    <Table.Cell width={1}>

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

          </React.Fragment>
        )}
      </NamespacesConsumer>
    )
  }

  /**
   * Get role options from permissions list
   * @param {Array} permissions 
   */
  getRoleOptionsFromPermissions(permissions) {
    let roleOptions = {};
    for (let p of permissions) {
      if (Object.keys(roleOptions).indexOf(p.role_id === 0)) {
        roleOptions[p.role_id] = {
          key: p.role_id,
          value: p.role_id,
          text: p.role.label
        }
      }
    }
    roleOptions = Object.keys(roleOptions).map((id, i) => ({
      key: i,
      value: roleOptions[id].value,
      text: roleOptions[id].text
    }));
    return roleOptions;
  }
}

export default PermissionsList;

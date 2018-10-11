import React, { Component } from 'react';
import {
  Header,
  Table,
  Loader,
  Message,
  Checkbox
} from 'semantic-ui-react';
import { getRoleHooks, updateRoleHook } from './actions';
import { NamespacesConsumer } from 'react-i18next';

class RoleHooksList extends Component {

  state = {
    loading: false,
    total: 0,
    hooks: [],
    errors: null
  }

  reload(role) {
    this.setState({ ...this.state, loading: true});
    const variables = { role_id: role.id }
    getRoleHooks(variables).then(result => {
      this.setState({
        ...this.state,
        loading: false,
        hooks: result.results
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

  toggleHook(hook) {
    const { role } = this.props;
    this.setState({ ...this.state, loading: true});
    const variables = {
      ...hook,
      bypass: !hook.bypass,
    }
    updateRoleHook(variables).then(() => {
      this.reload(role);
    }).catch(errors => {
      this.setState({ ...this.state, loading: false, errors });
    });
  }

  render() {
    const { role } = this.props;
    const { loading, errors, hooks } = this.state;
    if (!role.id) return null;
    return (
      <NamespacesConsumer ns="translations">
        { (t, { i18n }) => (
          <React.Fragment>
            <Header as='h3'>
              {t('bypass')} {t('hooks')}
            </Header>

            { errors ? <Message negative size='mini'
              icon='exclamation triangle'
              list={errors.map(e => t(e.message))}
            /> : null }

            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>{t('id')}</Table.HeaderCell>
                  <Table.HeaderCell>{t('system_keyword')}</Table.HeaderCell>
                  <Table.HeaderCell>
                    { loading && <Loader inline active /> }
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                { hooks.map(hook => (
                  <Table.Row key={hook.id}>
                    <Table.Cell>{hook.id}</Table.Cell>
                    <Table.Cell>{hook.hook}</Table.Cell>
                    <Table.Cell width={1}>

                      <Checkbox toggle
                        disabled={loading}
                        checked={hook.bypass}
                        title={
                          (hook.bypass ? t('enforce') : t('bypass'))
                          + ' ' + t('policy')
                        }
                        size='mini'
                        onClick={this.toggleHook.bind(this, hook)}
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
}

export default RoleHooksList;

import React, { Component } from 'react';
import {
  Header,
  Table,
  Loader,
  Message,
  Checkbox
} from 'semantic-ui-react';
import { getResourceHooks, updateResourceHook } from './actions';
import { I18n } from 'react-i18next';

class ResourceHooksList extends Component {

  state = {
    loading: false,
    total: 0,
    hooks: [],
    errors: null
  }

  reload(resource) {
    const variables = { resource }
    this.setState({ ...this.state, loading: true});
    getResourceHooks(variables).then(result => {
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
    const { resource } = this.props;
    if (!resource) return;
    this.reload(resource);
  }

  toggleHook(hook) {
    const { resource } = this.props;
    const variables = { ...hook, active: !hook.active };
    this.setState({ ...this.state, loading: true});
    updateResourceHook(variables).then(result => {
      this.reload(resource);
    }).catch(errors => {
      this.setState({ ...this.state, loading: false, errors });
    });
  }

  render() {
    const { resource } = this.props;
    const { loading, errors, hooks } = this.state;
    if (!resource) return null;
    return (
      <I18n ns="translations">
        { (t, { i18n }) => (
          <React.Fragment>
            <Header as='h3'>
              {t('applied_hooks')}
            </Header>

            { errors && <Message negative size='mini'
              icon='exclamation triangle'
              list={errors.map(e => t(e.message))}
            /> }

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
                        checked={hook.active}
                        title={
                          (hook.active ? t('deactivate') : t('activate'))
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
      </I18n>
    )
  }
}

export default ResourceHooksList;

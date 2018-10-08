import React, { Component } from 'react';
import {
  Header,
  Table,
  Loader,
  Message,
  Checkbox
} from 'semantic-ui-react';
import Layout from '../shared/Layout';
import { changeHookResource } from '../hooks/actions';
import { getResourceHooks } from './actions';

class ResourceHooksList extends Component {

  state = {
    loading: false,
    total: 0,
    hooks: [],
    errors: null
  }

  reload(resource) {
    this.setState({ ...this.state, loading: true});
    getResourceHooks(resource.id).then(hooks => {
      this.setState({
        ...this.state,
        loading: false,
        hooks
      });  
    }).catch(errors => {
      this.setState({ ...this.state, loading: false, errors });
    });
  }

  componentDidMount() {
    const { resource } = this.props;
    if (!resource.id) return;
    this.reload(resource);
  }

  toggleHook(hook) {
    const { resource } = this.props;
    this.setState({ ...this.state, loading: true});
    const variables = {
      ...hook,
      resource_id: resource.id,
      active: !hook.active,
    }
    changeHookResource(variables).then(() => {
      this.reload(resource);
    }).catch(errors => {
      this.setState({ ...this.state, loading: false, errors });
    });
  }

  render() {
    const { resource } = this.props;
    const { loading, errors, hooks } = this.state;
    if (!resource.id) return null;
    return (
      <Layout>
        <Header as='h1'>
          Hooks
        </Header>

        { errors && <Message error size='mini'
          icon='exclamation triangle'
          list={errors.map(e => e.message)}
        /> }
        
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>System Name</Table.HeaderCell>
              <Table.HeaderCell>
                { loading && <Loader inline active /> }
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            { hooks.map(hook => (
              <Table.Row key={hook.id}>
                <Table.Cell>{hook.id}</Table.Cell>
                <Table.Cell>{hook.system}</Table.Cell>
                <Table.Cell width={1}>

                  <Checkbox toggle
                    disabled={loading}
                    checked={hook.active}
                    title='Remove hook'
                    size='mini'
                    onClick={this.toggleHook.bind(this, hook)}
                  />
                  
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>

        </Table>
            
      </Layout>
    )
  }
}

export default ResourceHooksList;
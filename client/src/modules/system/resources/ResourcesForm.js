import React, { Component } from 'react';
import { Header, Message } from 'semantic-ui-react';
import Layout from '../../../share/AdminLayoutExample';
import ResourceHooksList from './ResourceHooksList';
import { NamespacesConsumer } from 'react-i18next';
import Objection from '../../../share/Objection';

class ResourcesForm extends Component {

  state = {
    errors: null,
    success: null,
    edit: ''
  }

  componentDidMount() {
    const { params } = this.props.match;
    if (!params.id) return;

    // Load Resource
    this.setState({ ...this.state, loading: false, edit: params.id });
  }

  render() {
    const { errors, success, edit } = this.state;
    return (
      <NamespacesConsumer ns="translations">
        { (t, { i18n }) => (
          <Layout>

            <Header as='h1'>

              {edit}

            </Header>

            { errors && <Message error size='mini'
              icon='exclamation triangle'
              list={Objection.format(errors[0].message, t)}
            /> }

            { success && <Message success size='mini'
              icon='bullhorn'
              content={success}
            /> }

            <ResourceHooksList resource={edit} />

          </Layout>
        )}
      </NamespacesConsumer>
    )
  }
}

export default ResourcesForm;

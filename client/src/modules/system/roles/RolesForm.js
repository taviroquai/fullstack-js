import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Grid,
  Header,
  Form,
  Loader,
  Message,
  Button
} from 'semantic-ui-react';
import Layout from '../../../share/AdminLayoutExample';
import RoleHooksList from './RoleHooksList';
import { getRoleById, saveRole } from './actions';
import { NamespacesConsumer } from 'react-i18next';
import Objection from '../../../share/Objection';
import RedirectNotAuthenticated from '../../auth/RedirectNotAuthenticated';

class RolesForm extends Component {

  state = {
    loading: false,
    errors: null,
    success: null,
    edit: false
  }

  componentDidMount() {
    const { params } = this.props.match;
    if (!params.id) {
      return this.setState({
        ...this.state,
        edit: {
          id: '',
          label: '',
          system: ''
        }
      })
    }

    // Load role
    this.setState({ ...this.state, loading: true });
    getRoleById(params.id).then(edit => {
      this.setState({ ...this.state, loading: false, edit });
    }).catch(errors => {
      this.setState({ ...this.state, loading: false, errors });
    });
  }

  onEdit(field, value) {
    const { edit } = this.state;
    edit[field] = value;
    this.setState({ ...this.state, edit });
  }

  onSubmit(e) {
    e.preventDefault();
    let { edit } = this.state;

    // Save role
    this.setState({ ...this.state, loading: true, success: null });
    saveRole(edit).then(() => {
      this.props.history.push('/system/roles?refresh=1');
    }).catch(errors => {
      this.setState({ ...this.state, loading: false, errors, success: false });
    });
  }

  /**
   * On cancel form, go back
   * @param {Object} e
   */
  onCancel(e) {
    e.preventDefault();
    const { history } = this.props;
    history.goBack();
  }

  render() {
    const { loading, errors, success, edit } = this.state;
    return (
      <NamespacesConsumer ns="translations">
        { (t, { i18n }) => (
          <Layout>

            { edit && (
              <Header as='h1'>
                { (edit.id ? t('edit') : t('create')) + ' ' + t('role') }

                <React.Fragment>
                  <Button negative
                    floated='right'
                    onClick={this.onCancel.bind(this)}>
                    {t('cancel')}
                  </Button>
                  <Button primary
                    floated='right'
                    onClick={e => this.onSubmit(e)}
                    type='submit'>
                    {t('save')}
                  </Button>
                </React.Fragment>
              </Header>
            )}

            { errors && <Message error size='mini'
              icon='exclamation triangle'
              list={Objection.formatErrors(errors[0].message, t)}
            /> }

            { success && <Message success size='mini'
              icon='bullhorn'
              content={t(success)}
            /> }

            { loading && <Loader active inline='centered' /> }
            { edit && (
              <Form loading={loading} onSubmit={this.onSubmit.bind(this)}>

                <Grid>
                  <Grid.Column width={16}>
                    <Form.Field>
                      <label>{t('label')}</label>
                      <Form.Input value={edit.label}
                        placeholder={t('edit_label')}
                        onChange={e => this.onEdit('label', e.target.value)}
                      />
                    </Form.Field>
                  </Grid.Column>
                </Grid>

                <Grid>
                  <Grid.Column width={16}>
                    <Form.Field>
                      <label>{t('system_keyword')}</label>
                      <Form.Input value={edit.system}
                        placeholder={t('enter_system_keyword')}
                        onChange={e => this.onEdit('system', e.target.value)}
                      />
                    </Form.Field>
                  </Grid.Column>
                </Grid>

                <RoleHooksList role={edit} />

              </Form>
            )}

          </Layout>
        )}
      </NamespacesConsumer>
    )
  }
}

const RolesFormWithDeps = withRouter(RolesForm);
class ProtectedRolesForm extends Component {
  render() {
    return (
      <RedirectNotAuthenticated to='/auth/login'>
        <RolesFormWithDeps />
      </RedirectNotAuthenticated>
    )
  }
}

export default ProtectedRolesForm;

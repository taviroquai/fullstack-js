import React, { Component } from 'react';
import {
  Grid,
  Header,
  Form,
  Loader,
  Message,
  Button
} from 'semantic-ui-react';
import Layout from '../../../share/AdminLayoutExample';
import { getHookById, saveHook } from './actions';
import { t } from 'i18next';
import { I18n } from 'react-i18next';

class HooksForm extends Component {

  state = {
    loading: false,
    errors: null,
    success: null,
    edit: {
      id: '',
      system: ''
    }
  }

  componentDidMount() {
    const { params } = this.props.match;
    if (!params.id) return;

    // Load hook
    this.setState({ ...this.state, loading: true });
    getHookById(params.id).then(edit => {
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

    // Save hook
    this.setState({ ...this.state, loading: true, success: null });
    saveHook(edit).then(() => {
      this.setState({
        ...this.state,
        loading: false,
        errors: false,
        success: t('hook_saved')
      });
    }).catch(errors => {
      this.setState({ ...this.state, loading: false, errors, success: false });
    });
  }

  render() {
    const { loading, errors, success, edit } = this.state;
    return (
      <I18n ns="translations">
        { (t, { i18n }) => (
          <Layout>

            <Header as='h1'>
            { edit.id ? t('edit') + ' ' + t('hook')
              : t('create') + ' ' + t('hook')
            }
              <Button primary
                floated='right'
                onClick={e => this.onSubmit(e)}
                type='submit'>
                {t('save')}
              </Button>
            </Header>

            { errors && <Message error size='mini'
              icon='exclamation triangle'
              list={errors[0].message.split(',')}
            /> }

            { success && <Message success size='mini'
              icon='bullhorn'
              content={t('hook_saved')}
            /> }

            { loading ? <Loader active inline='centered' /> : (
              <Form loading={loading} onSubmit={this.onSubmit.bind(this)}>

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

              </Form>
            )}

          </Layout>
        )}
      </I18n>
    )
  }
}

export default HooksForm;

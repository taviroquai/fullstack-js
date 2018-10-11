import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Grid,
  Header,
  Form,
  Loader,
  Message,
  Button,
  Image
} from 'semantic-ui-react';
import Layout from '../../../share/AdminLayoutExample';
import RoleUsersList from './RoleUsersList';
import { getUserById, saveUser, uploadAvatar } from './actions';
import { NamespacesConsumer } from 'react-i18next';
import Objection from '../../../share/Objection';

const endpoint = process.env.REACT_APP_SERVER_URL;

class UsersForm extends Component {

  state = {
    loading: false,
    errors: null,
    success: null,
    edit: null
  }

  componentDidMount() {
    const { params } = this.props.match;
    if (!params.id) {
      return this.setState({
        ...this.state,
        edit: {
          id: '',
          username: '',
          email: '',
          password: '',
          password_confirm: ''
        }
      });
    }

    // Load user
    this.setState({ ...this.state, loading: true });
    getUserById(params.id).then(edit => {
      this.setState({ ...this.state, loading: false, edit });
    }).catch(errors => {
      this.setState({ ...this.state, loading: false, errors });
    });
  }

  /**
   * Edit form field
   * @param {String} field
   * @param {String} value
   */
  onEdit(field, value) {
    const { edit } = this.state;
    edit[field] = value;
    this.setState({ ...this.state, edit });
  }

  /**
   * On submit form
   * @param {Object} e
   */
  onSubmit(e) {
    e.preventDefault();
    let { edit } = this.state;

    // Save user
    this.setState({ ...this.state, loading: true, success: null });
    saveUser(edit).then(() => {
      this.setState({
        ...this.state,
        loading: false,
        errors: false,
        success: 'user_saved_successfuly'
      });
    }).catch(errors => {
      this.setState({ ...this.state, loading: false, errors, success: false });
    });
  }

  /**
   * Get avatar file url
   */
  getAvatarUrl() {
    const { edit } = this.state;
    return endpoint + '/avatar/' + edit.id + '/' + edit.avatar;
  }

  /**
   * Upload avatar
   * @param {Object} files
   */
  onUpload(id, files) {
    if (!files.length) return;
    this.setState({ ...this.state, loading: true, success: null });
    uploadAvatar(id, files.item(0)).then((file) => {
      const { edit } = this.state;
      edit.avatar = file.filename;
      this.setState({
        ...this.state,
        loading: false,
        errors: false,
        success: 'avatar_uploaded',
        edit
      });
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
                { (edit.id ? t('edit') : t('create')) + ' ' + t('user') }

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
                  <Grid.Column mobile={12}>
                    <Form.Field>
                      <label>{t('username')}</label>
                      <Form.Input value={edit.username}
                        placeholder={t('enter_username')}
                        onChange={e => this.onEdit('username', e.target.value)}
                      />
                    </Form.Field>
                  </Grid.Column>
                  <Grid.Column mobile={4}>
                    <Form.Field>
                      <label>{t('active')}</label>
                      <Form.Checkbox
                        toggle
                        checked={edit.active}
                        onChange={e => this.onEdit('active', !edit.active)}
                      />
                    </Form.Field>
                  </Grid.Column>
                </Grid>

                <Grid>
                  <Grid.Column computer={12} mobile={8} tablet={12}>
                    <Form.Field>
                      <label>{t('email')}</label>
                      <Form.Input value={edit.email}
                        placeholder={t('enter_email_address')}
                        onChange={e => this.onEdit('email', e.target.value)}
                      />
                    </Form.Field>
                    <Form.Field>
                      <label>{t('password')} { edit.id ? t('opcional') : ''}</label>
                      <Form.Input
                        type='password'
                        value={edit.password}
                        placeholder={t('enter_password')}
                        onChange={e => this.onEdit('password', e.target.value)}
                      />
                    </Form.Field>
                    <Form.Field>
                      <label>{t('confirm_password')}</label>
                      <Form.Input
                        type='password'
                        value={edit.password_confirm}
                        placeholder={t('confirm_password')}
                        onChange={e => this.onEdit('password_confirm', e.target.value)}
                      />
                    </Form.Field>
                  </Grid.Column>
                  <Grid.Column computer={4} mobile={8} tablet={4}>
                    <Form.Field>
                      <label>{t('avatar')}</label>
                      <label htmlFor="avatar"
                        title={t('choose_file')}
                        className={
                          loading || !edit.id ?
                          "ui primary button disabled"
                          : "ui primary button"}>
                          <i className="ui upload icon"></i>
                      </label>
                      <input name="upload"
                        id="avatar"
                        placeholder={t('choose_file')}
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={e => this.onUpload(edit.id, e.target.files)}
                        style={{display: 'none'}}
                        disabled={loading || !edit.id}
                      />
                      { edit.avatar && <Image fluid src={this.getAvatarUrl()} /> }
                    </Form.Field>
                  </Grid.Column>
                </Grid>

                <RoleUsersList user={edit} />

              </Form>
            )}

          </Layout>
        )}
      </NamespacesConsumer>
    )
  }
}

export default withRouter(UsersForm);

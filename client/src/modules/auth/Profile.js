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
import Layout from './Layout';
import { getUserFromCookie } from '../auth/actions';
import { getUserById, saveUser, uploadAvatar } from '../system/users/actions';
import { NamespacesConsumer } from 'react-i18next';
import Objection from '../../share/Objection';
import { withStore } from 'react-observable-store';
import RedirectNotAuthenticated from './RedirectNotAuthenticated';

const endpoint = process.env.REACT_APP_SERVER_URL;

class Profile extends Component {

  state = {
    loading: false,
    errors: null,
    success: null,
    user: null
  }

  componentDidMount() {
    const user = getUserFromCookie();
    if (!user) return null;

    // Load user
    this.setState({ ...this.state, loading: true });
    getUserById(user.id).then(user => {
      this.setState({ ...this.state, loading: false, user });
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
    const { user } = this.state;
    user[field] = value;
    this.setState({ ...this.state, user });
  }

  /**
   * On submit form
   * @param {Object} e
   */
  onSubmit(e) {
    e.preventDefault();
    let { user } = this.state;

    // Save user
    this.setState({ ...this.state, loading: true, success: null });
    saveUser(user).then(() => {
      this.setState({ ...this.state, loading: false, success: true });
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

  /**
   * Get avatar file url
   */
  getAvatarUrl() {
    const { user } = this.state;
    return endpoint + '/avatar/' + user.id + '/' + user.avatar;
  }

  /**
   * Upload avatar
   * @param {Object} files
   */
  onUpload(id, files) {
    if (!files.length) return;
    this.setState({ ...this.state, loading: true, success: null });
    uploadAvatar(id, files.item(0)).then((file) => {
      const { user } = this.state;
      user.avatar = file.filename;
      this.setState({
        ...this.state,
        loading: false,
        errors: false,
        success: 'avatar_uploaded',
        user
      });
    }).catch(errors => {
      this.setState({
        ...this.state,
        loading: false,
        errors,
        success: false
      });
    });
  }

  render() {
    const { loading, errors, success, user } = this.state;
    if (!user) return null;
    return (
      <NamespacesConsumer ns="translations">
        { (t, { i18n }) => (
          <Layout>

            <Header as='h1'>{ t('my_profile') }</Header>

            { errors && <Message error size='mini'
              icon='exclamation triangle'
              list={Objection.formatErrors(errors[0].message, t)}
            /> }

            { success && <Message success size='mini'
              icon='bullhorn'
              content={t('user_saved_successfully')}
            /> }

            { loading && <Loader active inline='centered' /> }

            <Form loading={loading} onSubmit={this.onSubmit.bind(this)}>
              <Grid textAlign='left'>
                <Grid.Column mobile={12} tablet={12} computer={12}>
                  <Form.Field>
                    <label>{t('username')}</label>
                    <Form.Input value={user.username}
                      placeholder={t('enter_username')}
                      onChange={e => this.onEdit('username', e.target.value)}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>{t('email')}</label>
                    <Form.Input value={user.email}
                      placeholder={t('enter_email_address')}
                      onChange={e => this.onEdit('email', e.target.value)}
                    />
                  </Form.Field>
                </Grid.Column>
                <Grid.Column mobile={4} tablet={4} computer={4}>
                  <Form.Field>
                    <label>{t('avatar')}</label>
                    <label htmlFor="avatar"
                      title={t('choose_file')}
                      className={
                        loading || !user.id ?
                        "ui primary button disabled"
                        : "ui primary button"}>
                        <i className="ui upload icon"></i>
                    </label>
                    <input name="upload"
                      id="avatar"
                      placeholder={t('choose_file')}
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={e => this.onUpload(user.id, e.target.files)}
                      style={{display: 'none'}}
                      disabled={loading || !user.id}
                    />
                    { user.avatar && <Image fluid src={this.getAvatarUrl()} /> }
                  </Form.Field>
                </Grid.Column>
              </Grid>

              <Grid textAlign='left'>
                <Grid.Column mobile={16} tablet={8} computer={8}>
                  <Form.Field>
                    <label>{t('password')} { user.id ? t('opcional') : ''}</label>
                    <Form.Input
                      type='password'
                      value={user.password}
                      placeholder={t('enter_password')}
                      onChange={e => this.onEdit('password', e.target.value)}
                    />
                  </Form.Field>
                </Grid.Column>
                <Grid.Column mobile={16} tablet={8} computer={8}>
                  <Form.Field>
                    <label>{t('confirm_password')}</label>
                    <Form.Input
                      type='password'
                      value={user.password_confirm}
                      placeholder={t('confirm_password')}
                      onChange={e => this.onEdit('password_confirm', e.target.value)}
                    />
                  </Form.Field>
                </Grid.Column>
              </Grid>

              <Grid textAlign='left'>
                <Grid.Column mobile={12} tablet={12} computer={12}>
                  <Button negative
                    floated='left'
                    onClick={this.onCancel.bind(this)}>
                    {t('cancel')}
                  </Button>
                </Grid.Column>
                <Grid.Column mobile={4} tablet={4} computer={4}>
                <Button primary
                    fluid
                    onClick={e => this.onSubmit(e)}
                    type='submit'>
                    {t('save')}
                  </Button>
                </Grid.Column>
              </Grid>
            </Form>

          </Layout>
        )}
      </NamespacesConsumer>
    )
  }
}

const ProfileWithDeps = withRouter(withStore('app', Profile));
class SecuredProfile extends Component {
  render() {
    return (
      <RedirectNotAuthenticated to="/auth/login">
        <ProfileWithDeps redirect={this.props.redirect} />
      </RedirectNotAuthenticated>
    )
  }
}

export default SecuredProfile;

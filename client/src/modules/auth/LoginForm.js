import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import {
  Button,
  Form,
  Header,
  Image,
  Segment,
  Message,
  Divider
} from 'semantic-ui-react';
import Layout from './Layout';
import { login, remember } from './actions';
import logoImg from '../../assets/logo.svg';
import { NamespacesConsumer } from 'react-i18next';
import Store, { withStore } from 'react-observable-store';
import RedirectAuthenticated from './RedirectAuthenticated';

class LoginForm extends Component {

  /**
   * Submit login form
   * @param {Event} e
   */
  submit(e) {
    const { history, redirect } = this.props;
    e.preventDefault();
    const { email, password } = e.target.elements;
    Store.update('app', { loading: true, errors: null });

    // Login
    login(email.value, password.value).then(user => {
      Store.update('app', { loading: false, user });
      if (remember()) return history.push(remember()); 
      history.push(redirect);
    })

    // Fail
    .catch(errors => {
      Store.update('app', { errors, loading: false });
    });
  }

  render() {
    const { loading, errors } = this.props;
    return (
      <NamespacesConsumer ns="translations">
        { (t, { i18n }) => (
          <Layout>
            <Header as='h2' color='teal' textAlign='center'>
              <Image src={logoImg} /> {t('login')}
            </Header>
            <Form size='large'
              loading={loading}
              error={!!errors}
              onSubmit={this.submit.bind(this)}>
              <Segment stacked>

                <Form.Input
                  fluid
                  icon='user'
                  iconPosition='left'
                  placeholder={t('email_address')}
                  name="email"
                />

                <Form.Input
                  fluid
                  icon='lock'
                  iconPosition='left'
                  placeholder={t('password')}
                  type='password'
                  name='password'
                />

                { errors && <Message error size='mini'
                  icon='exclamation triangle'
                  list={errors.map(e => t(e.message))}
                /> }

                <Button type="submit" color='teal' fluid size='large'>
                  {t('login')}
                </Button>

                <Divider />

                <Link to='/recover'>{t('forgot_password')}</Link>

              </Segment>
            </Form>
          </Layout>
        )}
      </NamespacesConsumer>
    )
  }
}

const LoginFormWithDeps = withRouter(withCookies(withStore('app', LoginForm)));
const loginRedirect = process.env.REACT_APP_LOGIN_REDIRECT;

class SecuredLoginForm extends Component {
  render() {
    return (
      <RedirectAuthenticated to={loginRedirect}>
        <LoginFormWithDeps redirect={loginRedirect} />
      </RedirectAuthenticated>
    )
  }
}

export default SecuredLoginForm;

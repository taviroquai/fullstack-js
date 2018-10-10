import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import { Button, Form, Header, Image, Segment, Message } from 'semantic-ui-react';
import Layout from './Layout';
import { login } from './actions';
import logoImg from '../../assets/logo.svg';
import { I18n } from 'react-i18next';

class LoginForm extends Component {

  state = {
    loading: false,
    errors: ''
  }

  /**
   * Submit login form
   * @param {Event} e
   */
  submit(e) {
    const { redirect } = this.props;
    e.preventDefault();
    const { email, password } = e.target.elements;
    this.setState({ loading: true, errors: null });
    login(email.value, password.value).then(data => {

      // Success
      this.setState({ errors: null, loading: false }, () => {
        const { history } = this.props;
        history.push(redirect);
      });
    })

    // Fail
    .catch(errors => {
      this.setState({ errors, loading: false });
    });
  }

  render() {
    const { loading, errors } = this.state;
    return (
      <I18n ns="translations">
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
                  Login
                </Button>

              </Segment>
            </Form>
          </Layout>
        )}
      </I18n>
    )
  }
}

export default withRouter(withCookies(LoginForm));

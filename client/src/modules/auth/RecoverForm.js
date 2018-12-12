import React, { Component } from 'react';
import { Button, Form, Header, Image, Segment, Message } from 'semantic-ui-react';
import Layout from './Layout';
import { recover } from './actions';
import logoImg from '../../assets/logo.svg';
import { NamespacesConsumer } from 'react-i18next';
import RedirectAuthenticated from './RedirectAuthenticated';

class RecoverForm extends Component {

  state = {
    loading: false,
    email: '',
    result: null
  }

  /**
   * Submit recover form
   * @param {Event} e
   */
  submit(e) {
    e.preventDefault();
    const { email } = e.target.elements;
    this.setState({
      ...this.state,
      loading: true,
      result: null
    });

    // Recover
    recover(email.value).then(result => {
      this.setState({
        ...this.state,
        loading: false,
        result
      });
    })

    // Fail
    .catch(errors => {
      this.setState({
        ...this.state,
        loading: false,
        result: false
      });
    });
  }

  render() {
    const { loading, result } = this.state;
    return (
      <NamespacesConsumer ns="translations">
        { (t, { i18n }) => (
          <Layout>
            <Header as='h2' color='teal' textAlign='center'>
              <Image src={logoImg} /> {t('recover_password')}
            </Header>
            <Form size='large'
              loading={loading}
              error={result === false}
              success={result === true}
              onSubmit={this.submit.bind(this)}>
              <Segment stacked>

                <Form.Input
                  fluid
                  icon='user'
                  iconPosition='left'
                  placeholder={t('email_address')}
                  name="email"
                />

                { (result === false) && <Message error size='mini'
                  icon='exclamation triangle'
                  list={[t('could_not_start_recover')]}
                /> }

                { (result === true) && <Message success size='mini'
                  icon='check'
                  list={[t('check_mailbox')]}
                /> }

                <Button type="submit" color='teal' fluid size='large'>
                  {t('start_recover')}
                </Button>

              </Segment>
            </Form>
          </Layout>
        )}
      </NamespacesConsumer>
    )
  }
}

const loginRedirect = process.env.REACT_APP_LOGIN_REDIRECT;

class SecuredRecoverForm extends Component {
  render() {
    return (
      <RedirectAuthenticated to={loginRedirect}>
        <RecoverForm />
      </RedirectAuthenticated>
    )
  }
}

export default SecuredRecoverForm;

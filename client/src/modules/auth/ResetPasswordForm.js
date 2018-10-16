import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
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
import { resetUserPassword } from './actions';
import logoImg from '../../assets/logo.svg';
import { NamespacesConsumer } from 'react-i18next';

class ResetPasswordForm extends Component {

  state = {
    loading: false,
    result: null
  }

  /**
   * Submit recover form
   * @param {Event} e
   */
  submit(e) {
    e.preventDefault();
    const { password, password_confirm } = e.target.elements;
    this.setState({
      ...this.state,
      loading: true,
      result: null
    });

    // Reset user password
    const { search } = this.props.location;
    const token = search.replace('?token=', '');
    resetUserPassword(token, password.value, password_confirm.value).then(result => {
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
    console.log(this.props);
    return (
      <NamespacesConsumer ns="translations">
        { (t, { i18n }) => (
          <Layout>
            <Header as='h2' color='teal' textAlign='center'>
              <Image src={logoImg} /> {t('reset_password')}
            </Header>
            <Form size='large'
              loading={loading}
              error={result === false}
              success={result === true}
              onSubmit={this.submit.bind(this)}>
              <Segment stacked>

                <Form.Input
                  type='password'
                  fluid
                  icon='lock'
                  iconPosition='left'
                  placeholder={t('password')}
                  name="password"
                />

                <Form.Input
                  type='password'
                  fluid
                  icon='lock'
                  iconPosition='left'
                  placeholder={t('password_confirm')}
                  name="password_confirm"
                />

                { (result === false) && <Message error size='mini'
                  icon='exclamation triangle'
                  list={[t('password_reset_failed')]}
                /> }

                { (result === true) && <Message success size='mini'
                  icon='check'
                  list={[t('password_reset_ok')]}
                /> }

                <Button type="submit" color='teal' fluid size='large'>
                  {t('reset_password')}
                </Button>

                <Divider />

                <Link to='/auth/login'>{t('cancel')}</Link>

              </Segment>
            </Form>
          </Layout>
        )}
      </NamespacesConsumer>
    )
  }
}

export default withRouter(ResetPasswordForm);

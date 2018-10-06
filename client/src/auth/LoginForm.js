import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import {
  Button,
  Form,
  Grid,
  Header,
  Image,
  Segment,
  Message
} from 'semantic-ui-react';
import { login } from './actions';
import logoImg from '../logo.svg';

class LoginForm extends Component {

  state = { loading: false, errors: '' }

  /**
   * Submit login form
   * 
   * @param {Event} e 
   */
  submit(e) {
    e.preventDefault();
    const { email, password } = e.target.elements;
    this.setState({ loading: true, errors: null });
    login(email.value, password.value).then(data => {

      // Success
      this.setState({ errors: null, loading: false }, () => {
        const { history } = this.props;
        history.push('/');
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
      <div className='login-form'>
        <style>{`
          body > div,
          body > div > div,
          body > div > div > div.login-form {
            height: 100%;
          }
        `}</style>
        <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as='h2' color='teal' textAlign='center'>
              <Image src={logoImg} /> Log-in to your account
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
                  placeholder='E-mail address'
                  name="email"
                />

                <Form.Input
                  fluid
                  icon='lock'
                  iconPosition='left'
                  placeholder='Password'
                  type='password'
                  name='password'
                />

                { errors && <Message error size='mini'
                  icon='exclamation triangle'
                  list={errors.map(e => e.message)}
                /> }

                <Button type="submit" color='teal' fluid size='large'>
                  Login
                </Button>

              </Segment>
            </Form>
            
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}

export default withRouter(withCookies(LoginForm));

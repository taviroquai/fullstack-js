import React, { Component } from 'react';
import {
  Grid,
  Segment,
  Header,
  Form,
  Loader,
  Message,
  Button,
  Image
} from 'semantic-ui-react';
import Layout from '../shared/Layout';
import { getUserById, saveUser, uploadAvatar } from './actions';
const endpoint = process.env.REACT_APP_SERVER_URL;

class UsersForm extends Component {

  state = {
    loading: false,
    errors: null,
    success: null,
    edit: {
      id: '',
      username: '',
      email: ''
    }
  }

  componentDidMount() {
    const { params } = this.props.match;
    if (!params.id) return;

    // Load user
    this.setState({ ...this.state, loading: true });
    getUserById(params.id).then(edit => {
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

  /**
   * Validate password
   * 
   * @param {String} password 
   * @param {String} password_confirm 
   * @param {Object} edit 
   */
  validatePassword(password, password_confirm, edit) {
    if (password) {
      if (password !== password_confirm) {
        return false;
      } else {
        edit.password = password;
      }
    }
    return true;
  }

  onSubmit(e) {
    e.preventDefault();
    let { edit } = this.state;

    // Validate password
    const { password, password_confirm } = e.target.elements;
    const isValid = this.validatePassword(password.value, password_confirm.value, edit);
    if (!isValid) {
      return this.setState({
        ...this.state,
        errors: [{message: 'Password does not match'}]
      });
    }

    // Save user
    this.setState({ ...this.state, loading: true, success: null });
    saveUser(edit).then(() => {
      this.setState({
        ...this.state,
        loading: false,
        errors: false,
        success: 'User saved successfully'
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
        success: 'Avatar uploaded',
        edit
      });
    }).catch(errors => {
      this.setState({ ...this.state, loading: false, errors, success: false });
    });
  }

  render() {
    const { loading, errors, success, edit } = this.state;
    return (
      <Layout>

        { edit.id ?
        <Header as='h1'>Edit User</Header> :
        <Header as='h1'>Create User</Header>
        }

        { errors && <Message error size='mini'
          icon='exclamation triangle'
          list={errors[0].message.split(',')}
        /> }

        { success && <Message success size='mini'
          icon='bullhorn'
          content='User saved successfully'
        /> }
        
        { loading ? <Loader active inline='centered' /> : (
          <Form loading={loading} onSubmit={this.onSubmit.bind(this)}>

            <Grid>
              <Grid.Column mobile={12}>
                <Form.Field>
                  <label>Username</label>
                  <Form.Input value={edit.username}
                    placeholder="Enter username..."
                    onChange={e => this.onEdit('username', e.target.value)}
                  />
                </Form.Field>
              </Grid.Column>
              <Grid.Column mobile={4}>
                <Form.Field>
                  <label>Active</label>
                  <Form.Checkbox
                    toggle 
                    checked={edit.active}
                    onChange={e => this.onEdit('active', !edit.active)}
                  />
                </Form.Field>
              </Grid.Column>
            </Grid>

            <Grid>
              <Grid.Column mobile={12}>
                <Form.Field>
                  <label>Email</label>
                  <Form.Input value={edit.email}
                    placeholder="Enter email address..."
                    onChange={e => this.onEdit('email', e.target.value)}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Password { edit.id ? '(opcional)' : ''}</label>
                  <Form.Input
                    type='password'
                    name='password'
                    placeholder='Enter password'
                  />
                </Form.Field>
                <Form.Field>
                  <label>Confirm Password</label>
                  <Form.Input
                    type='password'
                    name='password_confirm'
                    placeholder='Confirm password...'
                  />
                </Form.Field>
              </Grid.Column>
              <Grid.Column mobile={4}>
                <Form.Field>
                  <label>Avatar</label>
                  <label htmlFor="avatar"
                    className="ui primary button">
                      <i className="ui upload icon"></i>
                      Carregar
                  </label>
                  <input name="upload"
                    id="avatar"
                    placeholder="Escolha o ficheiro"
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

            <Segment basic align='right'>
              <Button primary type='submit'>Save</Button>
            </Segment>
            
          </Form>
        )}
        
      </Layout>
    )
  }
}

export default UsersForm;
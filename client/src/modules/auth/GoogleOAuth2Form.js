import React, { Component } from 'react';
const endpoint = process.env.REACT_APP_SERVER_URL;

class GoogleOAuth2Form extends Component {

  state = {
    url: ''
  }

  async url() {
    return new Promise((resolve, reject) => {
      fetch(endpoint + '/googleoauth2')
      .then(res => res.text())
      .then(url => {
        resolve(url);
      })
      .catch(err => {
        console.log(err);
        reject(false);
      })
    });
  }

  componentDidMount() {
    this.url().then(url => {
      if (url) this.setState({ url });
    });
  }

  render() {
    const { url } = this.state;
    if (!url) return null;
    return (
      <a href={url}>Google Log In</a>
    )
  }
}

export default GoogleOAuth2Form;

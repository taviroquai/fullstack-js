import Store from 'react-observable-store';

const store = {
  app: {
    loading: false,
    errors: '',
    user: null
  }
}

Store.init(store);

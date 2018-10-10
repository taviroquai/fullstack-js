import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Header,
  Table,
  Message,
  Button,
  Icon,
  Input,
  Loader
} from 'semantic-ui-react';
import Layout from '../../../share/AdminLayoutExample';
import { getResources } from './actions';
import { I18n } from 'react-i18next';

class ResourcesList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      query: '',
      total: 0,
      resources: [],
      errors: null
    };
  }

  reload() {
    const { query } = this.state;
    this.setState({ ...this.state, loading: true});
    getResources({ query }).then((resources, total) => {
      this.setState({
        ...this.state,
        loading: false,
        resources,
        total
       });
    }).catch(errors => {
      this.setState({ ...this.state, loading: false, errors });
    });
  }

  componentDidMount() {
    this.reload();
  }

  onSearch(query) {
    this.setState({...this.state, query });
  }

  render() {
    const { loading, errors, resources, query } = this.state;
    let filtered = resources;

    // Filter by resource
    if (query) {
      const regex = new RegExp(query, 'ig');
      filtered = filtered.filter(r => regex.test(r));
    }

    return (
      <I18n ns="translations">
        { (t, { i18n }) => (
          <Layout>
            <Header as='h1'>{t('resources')}</Header>

            { errors && <Message error size='mini'
              icon='exclamation triangle'
              list={errors.map(e => t(e.message))}
            /> }

            { !!resources.length && (
              <Table size='small'>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>
                      {t('system_keyword')}
                      <Input style={{fontSize: '.8rem', float: 'right'}}
                        placeholder={t('search')}
                        value={query}
                        loading={loading}
                        onChange={e => this.onSearch(e.target.value)}
                      />
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      { loading && <Loader active inline='centered' /> }
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  { filtered.map((resource, i) => (
                    <Table.Row key={i}>
                      <Table.Cell>{resource}</Table.Cell>
                      <Table.Cell width={1}>
                        <Button.Group size='mini'>
                          <Button primary icon
                            size='mini'
                            as={Link} to={'/resources/edit/'+resource}>
                            <Icon name="list" />
                          </Button>
                        </Button.Group>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>

              </Table>
            )}

          </Layout>
        )}
      </I18n>
    )
  }
}

export default ResourcesList;

import React from 'react';
import {getIndex} from '../util';

const DOCS_URL = 'https://github.com/metalabdesign/startupslam-2017';

class Config extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {base, kibanaUrl, type} = this.props;
    const {onUpdateBase, onUpdateKibanaUrl, onUpdateType} = this.props;
    const index = getIndex(base);
    return (
      <div>
        <h3>Configuration</h3>
        <form>
          <div className='form-group'>
            <label htmlFor='es-index'>I am...</label>
            <div className='form-check'>
              <label className='form-check-label'>
                <input
                  className='form-check-input'
                  type='radio'
                  name='type'
                  value='shared'
                  onChange={(ev) => {
                    if (ev.target.checked) {
                      onUpdateType('shared');
                    }
                  }}
                  checked={type === 'shared'}
                />{' '}
                using the shared ElasticSearch instance.
              </label>
            </div>
            <div className='form-check'>
              <label className='form-check-label'>
                <input
                  className='form-check-input'
                  type='radio'
                  name='type'
                  value='local'
                  onChange={(ev) => {
                    if (ev.target.checked) {
                      onUpdateType('local');
                    }
                  }}
                  checked={type === 'local'}
                />{' '}
                using my own local ElasticSearch instance.
              </label>
            </div>
          </div>
          <div className='form-group'>
            <label htmlFor='es-index'>ElasticSearch URL</label>
            <input
              id='es-index'
              className='form-control'
              type='text'
              value={base}
              onChange={(ev) => {
                onUpdateBase(ev.target.value);
              }}
              disabled={type === 'shared'}
            />
            <small className='form-text text-muted'>
              This is the URL to the index all operations will
              use. e.g.{' '}
              <code>http://localhost:9200/my-index</code>. If
              you want to setup a server yourself please see the
              documentation <a href={DOCS_URL}>here</a>.
              Your index is <code>{index}</code>.
            </small>
          </div>
          <div className='form-group'>
            <label htmlFor='kibana-url'>Kibana URL</label>
            <input
              id='kibana-url'
              className='form-control'
              type='text'
              value={kibanaUrl}
              onChange={(ev) => {
                onUpdateKibanaUrl(ev.target.value);
              }}
              disabled={type === 'shared'}
            />
            <small className='form-text text-muted'>
              This is the URL to Kibana. e.g.{' '}
              <code>http://localhost:5601</code>. If
              you want to setup a server yourself please see the
              documentation <a href={DOCS_URL}>here</a>.
            </small>
          </div>
        </form>
      </div>
    );
  }
}

export default Config;

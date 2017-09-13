import React from 'react';
import JSONView from 'react-json-view';
import {handleResponse} from '../util';

const getPath = (url) => {
  const result = /\/\/[^\/]+\/(.+)/.exec(url);
  return result ? result[1] : null;
};

class Client extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      result: null,
      method: 'GET',
      path: '',
      payload: '',
    };
  }

  render() {
    const {base} = this.props;
    const {result, payload, path, method} = this.state;
    return (
      <div>
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            fetch(`${base}${path}`, {
              method,
              body: method === 'GET' ? undefined : payload,
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
            }).then(handleResponse).then(
              (res) => this.setState({result: res, error: false}),
              (err) => this.setState({result: err, error: true})
            );
          }}
        >
          <div className='form-group'>
            <div className='input-group'>
              <span className='input-group-addon'>
                <select
                  onChange={(ev) => this.setState({method: ev.target.value})}
                  value={method}
                >
                  <option value='GET'>GET</option>
                  <option value='PUT'>PUT</option>
                  <option value='POST'>POST</option>
                  <option value='DELETE'>DELETE</option>
                </select>
              </span>
              <span className='input-group-addon'>
                /{getPath(base)}
              </span>
              <input
                className='form-control'
                type='text'
                value={path}
                onChange={(ev) => this.setState({path: ev.target.value})}
              />
              <span className='input-group-btn'>
                <button className='btn btn-secondary' type='submit'>Go</button>
              </span>
            </div>
          </div>
          <div className='form-group'>
            <label>Payload</label>
            <textarea
              rows={15}
              className='form-control'
              value={payload}
              onChange={(ev) => this.setState({payload: ev.target.value})}
            />
            <small className='form-text text-muted'>
              NOTE: The payload is ignored for <code>GET</code> requests.
            </small>
          </div>
        </form>
        {result && <JSONView src={result}/>}
      </div>
    );
  }
}

export default Client;

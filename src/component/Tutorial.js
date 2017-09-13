import React from 'react';
import JSONView from 'react-json-view';

import {setupIndex, removeIndex, bulk} from '../admin';
import {sendEvent} from '../analytics';
import {indexSettings} from '../config';
import {fetchSampleData, sampleIndex} from '../tutorial';

const MAPPINGS_URL = [
  'https://www.elastic.co/guide/en/elasticsearch',
  '/reference/current/mapping-types.html',
].join('');

const MESSAGES = {
  setupIndex: {
    success: 'Index setup successfully.',
    error: 'Unable to setup index.',
  },
  removeIndex: {
    success: 'Index removed successfully.',
    error: 'Unable to remove index.',
  },
  sendSampleEvent: {
    success: 'Sample event sent successfully.',
    error: 'Unable to send sample event.',
  },
  loadSampleData: {
    success: 'Sample data loaded successfully.',
    error: 'Unable to load sample data.',
  },
};

class Tutorial extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sampleEvent: this.generateSampleEvent(),
      requests: {},
    };
  }

  handleResponse(name, res) {
    this.setState({
      requests: {
        [name]: {
          ...this.state.requests[name],
          loading: true,
        },
      },
    });
    res.then(
      (out) => this.setState({
        requests: {
          [name]: {
            ...this.state.requests[name],
            loading: false,
            result: out,
            error: false,
          },
        },
      }),
      (err) => this.setState({
        requests: {
          [name]: {
            ...this.state.requests[name],
            loading: false,
            result: err,
            error: true,
          },
        },
      })
    );
  }

  generateSampleEvent() {
    const os = ['android', 'ios', 'mac', 'windows', 'linux'];
    const browser = ['chrome', 'firefox', 'safari', 'ie', 'other'];
    const gender = ['male', 'female', 'other'];
    const pick = (x) => x[Math.floor(Math.random() * x.length)];
    return {
      os: pick(os),
      browser: pick(browser),
      gender: pick(gender),
      age: Math.floor(Math.random() * 20 + 20),
    };
  }

  renderSetupIndex() {
    const {base} = this.props;
    const {loading} = this.state;
    return (
      <div>
        <div className='row'>
          <div className='col-2'>
            Step 1:
          </div>
          <div className='col'>
            <p>
              First you need to setup your index. This tells ElasticSearch what
              kinds of data you're going to be sending it. We can start with a
              simple mapping that defines what a <code>pageview</code> event
              might look like. This is the payload we will be sending:
            </p>

            <figure className='figure'>
              <JSONView src={indexSettings}/>
            </figure>
            {this.renderResult('setupIndex')}
            <p>
              Let us{' '}
              <button
                className='btn btn-outline-primary btn-sm'
                onClick={(ev) => {
                  ev.preventDefault();
                  this.handleResponse(
                    'setupIndex',
                    setupIndex(base, indexSettings)
                  );
                }}
                disabled={loading}
              >
                setup your index
              </button>{' '}
              for you. Clicking this button will send ElasticSearch the payload
              to setup your index. You should open your browser developer tools
              to see the request being sent over the network.
            </p>

            <p className='text-muted'>
              <small>
                If you get an error back it could be for several reasons. The
                developer tools should be able to assist you in debugging it.
                If you have a local instance setup and it appears as though
                nothing is happening most likely you forgot to configure CORS
                correctly.
              </small>
            </p>
            {this.renderResult('removeIndex')}
            <p>
              If you screw up or want to change your mappings you can
              always{' '}
              <button
                className='btn btn-outline-danger btn-sm'
                onClick={(ev) => {
                  ev.preventDefault();
                  this.handleResponse(
                    'removeIndex',
                    removeIndex(base)
                  );
                }}
                disabled={loading}
              >
                delete your index
              </button>{' '}
              and try again. You can see the list of data types available{' '}
              in the <a href={MAPPINGS_URL}>ElasticSearch documentation</a>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  renderSendTestEvent() {
    const {base, kibanaUrl} = this.props;
    const {loading, sampleEvent} = this.state;
    return (
      <div>
        <div className='row'>
          <div className='col-2'>
            Step 2:
          </div>
          <div className='col'>
            <p>
              Once your index is ready you can test it out and{' '}
              send events to it.
              The events you send will appear in{' '}
              <a href={kibanaUrl}>Kibana</a>{' '}
              once you configure your index in{' '}
              <a href={`${kibanaUrl}/app/kibana#/management/kibana/index`}>
                Kibana's settings
              </a>. Instructions how to do this are available in the slides.
            </p>
            <figure className='figure'>
              <JSONView src={sampleEvent}/>
            </figure>
            {this.renderResult('sendSampleEvent')}
            <p>
              Feel free to{' '}
              <button
                className='btn btn-outline-secondary btn-sm'
                onClick={(ev) => {
                  ev.preventDefault();
                  this.handleResponse(
                    'sendSampleEvent',
                    sendEvent(base, 'pageview', sampleEvent)
                  );
                  this.setState({
                    sampleEvent: this.generateSampleEvent(),
                  });
                }}
                disabled={loading}
              >
                send the above event
              </button> into your index. The event will change randomly every
              time you send it to simulate different users viewing your page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  renderLoadSampleData() {
    const {base} = this.props;
    const {loading} = this.state;
    return (
      <div>
        <div className='row'>
          <div className='col-2'>
            Step 3:
          </div>
          <div className='col'>
            {this.renderResult('loadSampleData')}
            <p>
              Once you're satisfied with being able to put data into
              ElasticSearch it's time to{' '}
              <button
                className='btn btn-outline-secondary btn-sm'
                onClick={(ev) => {
                  ev.preventDefault();
                  this.handleResponse(
                    'loadSampleData',
                    Promise.resolve()
                      .then(() => removeIndex(base)
                        .catch(() => Promise.resolve())
                      )
                      .then(() => setupIndex(base, sampleIndex))
                      .then(() => fetchSampleData()
                        .then((sampleData) => bulk(base, sampleData))
                      )
                      .then(() => Promise.resolve({status: 'ok'}))
                  );
                }}
                disabled={loading}
              >
                load the sample data set
              </button> and explore it with Kibana. Note that this will delete
              all existing data in your index and replace it with the sample
              data. You may need to reload your index settings in Kibana if
              you have played around with different mappings.
            </p>
            <p>
              <strong>IMPORTANT</strong>: You need to set the view of time in
              Kibana to match the timespan of the events in the sample data.
              This is <code>September 17, 2017</code> to{' '}
              <code>September 23, 2017</code>.
            </p>
            <p>
              You can now create the visualizations and dashboard as shown
              in the slide deck and experiment with more of Kibana's abilities.
            </p>
          </div>
        </div>
      </div>
    );
  }

  renderConfig() {
    const {base} = this.props;
    return (
      <form>
        <h3>Configuration</h3>
        <div className='form-group'>
          <label htmlFor='es-index'>ElasticSearch URL</label>
          <input
            id='es-index'
            className='form-control'
            type='text'
            value={base}
            onChange={(ev) => {
              this.setState({base: ev.target.value});
            }}
          />
          <small className='form-text text-muted'>
            This is the URL to the index all operations will
            use. e.g.{' '}
            <code>http://localhost:9200/my-index</code>. If
            you want to setup a server yourself please see the
            docs here.
          </small>
        </div>
      </form>
    );
  }

  renderResult(name) {
    const {result, error, loading} = this.state.requests[name] || {};
    if (loading) {
      return (
        <div ref={(x) => x && x.scrollIntoView()}>
          <div
            className='alert alert-light'
            role='alert'
          >
            Running your request...
          </div>
          {result && (
            <figure className='figure' style={{opacity: 0.4}}>
              <JSONView src={result}/>
            </figure>
          )}
        </div>
      );
    }
    return result && (
      <div>
        <div
          className={`alert alert-${error ? 'danger' : 'primary'}`}
          role='alert'
        >
          {error ? MESSAGES[name].error : MESSAGES[name].success}
        </div>
        <figure className='figure'>
          <JSONView src={result}/>
        </figure>
      </div>
    );
  }

  render() {
    return (
      <div>
        <h3>Tutorial</h3>
        {this.renderSetupIndex()}
        {this.renderSendTestEvent()}
        {this.renderLoadSampleData()}
      </div>
    );
  }
}

export default Tutorial;

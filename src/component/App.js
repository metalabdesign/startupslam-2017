import React from 'react';
import Tutorial from './Tutorial';
import Config from './Config';
import Workshop from './Workshop';

import {base as defaultBase, kibanaUrl as defaultKibanaUrl} from '../config';

const SLIDES_LINK = [
  'https://docs.google.com',
  '/presentation/d/1ubyoRG08TdUyf_rN_evLnFJ3iWkl1NDT4QzpegS0xqs',
].join('');

const GH_LINK = 'https://github.com/metalabdesign/startupslam-2017.git';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      base: defaultBase,
      kibanaUrl: defaultKibanaUrl,
      type: 'shared',
    };
  }

  loadState() {
    try {
      const state = JSON.parse(localStorage.getItem('slam-config'));
      this.setState(state);
    } catch (_err) {
      // do nothing
    }
  }

  saveState() {
    localStorage.setItem('slam-config', JSON.stringify(this.state));
  }

  componentWillMount() {
    this.loadState();
  }

  renderHeader() {
    return (
      <header>
        <h1>Startup Slam 2017</h1>
        Welcome to analytics with ElasticSearch.
        View the slide deck <a href={SLIDES_LINK}>here</a>.
        View the GitHub repo <a href={GH_LINK}>here</a>.
        Both have a lot of information in them so if you get stuck
        either is a good place to go.
      </header>
    );
  }

  renderFooter() {
    return (
      <footer>
        Made with <span role='img' aria-label='love'>❤️</span> by MetaLab.
      </footer>
    );
  }

  render() {
    const {base, kibanaUrl, type} = this.state;
    return (
      <div className='container mt-3 mb-3'>
        {this.renderHeader()}
        <hr/>
        <Config
          base={base}
          kibanaUrl={kibanaUrl}
          type={type}
          onUpdateBase={(base) => {
            this.setState({base}, () => this.saveState());
          }}
          onUpdateKibanaUrl={(kibanaUrl) => {
            this.setState({kibanaUrl}, () => this.saveState());
          }}
          onUpdateType={(type) => {
            if (type === 'local') {
              this.setState({
                type,
                base: 'http://localhost:9200/startupslam-2017',
                kibanaUrl: 'http://localhost:5601',
              }, () => this.saveState());
            } else if (type === 'shared') {
              this.setState({
                type,
                base: defaultBase,
                kibanaUrl: defaultKibanaUrl,
              }, () => this.saveState());
            }
          }}
        />
        <hr/>
        <Tutorial base={base} kibanaUrl={kibanaUrl}/>
        <hr/>
        <Workshop base={base}/>
        <hr/>
        {this.renderFooter()}
      </div>
    );
  }
}

export default App;

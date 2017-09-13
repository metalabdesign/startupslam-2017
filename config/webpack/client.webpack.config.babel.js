import {compose} from 'ramda';
import {output} from 'webpack-partial';
import base from './partial/base';

const createConfig = compose(
  output({
    publicPath: '/assets',
  }),
  base({name: 'main', target: 'web'}),
);

export default createConfig();

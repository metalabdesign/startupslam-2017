import {compose, assoc} from 'ramda';
import nearest from 'find-nearest-file';
import path from 'path';

import {output, loader} from 'webpack-partial';
import env from 'webpack-config-env';

const context = path.dirname(nearest('package.json'));

const base = ({name, target}) => compose(
  assoc('target', target),
  env({
    NODE_ENV: {required: false},
  }),
  // ========================================================================
  // Loaders
  // ========================================================================
  loader({
    loader: 'babel-loader',
    exclude: /(node_modules)/,
    test: /\.js$/,
  }),
  // ========================================================================
  // Output Settings
  // ========================================================================
  // Define chunk file name pattern. Use the content hash as the filename in
  // production web targeted builds to prevent browser caching between releases.
  output({
    path: path.join(context, 'dist', name),
    ...process.env.NODE_ENV === 'production' && target === 'web' ? {
      filename: '[name].[chunkhash].js',
      chunkFilename: '[id].[name].[chunkhash].js',
    } : {
      filename: '[name].js',
      chunkFilename: '[id].[name].js',
    },
  }),

  // Define an entry chunk. A `name` property must be defined on the initial
  // config object.
  assoc('entry', {
    index: path.join(context, 'src', `${name}.js`),
  }),

  // Define the build root context as the nearest directory containing a
  // `package.json` file. This is be the absolute path to the project root.
  assoc('context', context),
);

export default base;

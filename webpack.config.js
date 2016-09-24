const webpack = require('webpack');
const pkg     = require('./package.json');
module.exports = {

    entry: {
        'app': './src/js/index.jsx',
        'vendor': Object.keys(pkg.dependencies)
    },
    plugins: [
        /**
         * This is the plugin that wraps up the dependencies listed in
         * `entry.vendor` and writes it to `libs.js` in the `output.path` dir
         */
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.js',
            minChunks: Infinity
        })
    ],
    output: {
        /**
         * Where to spit out all the JS files
         */
        path: './dist',

        /**
         * What to call the `app` file.
         */
        filename: 'bundle.js'
    },
    module: {
        /**
         * Webpack loaders are the equivalent of grunt tasks / plugins
         */
        loaders: [
            {
                /**
                 * Only apply on `.js` files
                 */
                test: /\.jsx?$/,
                /**
                 * npm packages are already babelified to ES5
                 */
                exclude: /node_modules/,
                /**
                 * The name of the plugin / loader
                 */
                loader: 'babel',
                /**
                 * Options passed to the plugin (in this case it's
                 * babel settings)
                 */
                query: {
                    plugins: [
                        'transform-es2015-modules-commonjs',
                        'transform-runtime',
						'transform-object-rest-spread',
                        'transform-vue-jsx'
                    ],
                    presets: [
                        'es2015',
                        'es2017'
                    ]
                }
            }
        ]
    }
};
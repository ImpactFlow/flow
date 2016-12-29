var webpack = require('webpack');

var fullOutputConfig = {
    output: {
        library: 'Flow',
        libraryTarget: 'umd',
        path: './dist',
        filename: 'flow.js'
    },
    entry: {
        library: './flow'
    },
};

var minfiedOutputConfig = {
    output: {
        library: 'Flow',
        libraryTarget: 'umd',
        path: './dist',
        filename: 'flow.min.js'
    },
    entry: {
        library: './flow'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: false,
            mangle: false,
            sourceMap: false,
        })
    ]
};

module.exports = [ fullOutputConfig, minfiedOutputConfig ];

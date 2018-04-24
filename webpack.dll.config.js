const path = require('path');
const webpack = require('webpack');
module.exports = {
    entry: {
        vendor: ["lodash", "react", "react-dom"]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].dll.js',
        library: '[name]_library'
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.resolve('./dist', '[name]-manifest.json'),
            name: '[name]_library'
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            beautify: false,
            mangle: {
                screw_ie8: false,
                keep_fnames: false,
            },
            compress: {
                screw_ie8: false,
                warnings: false,
                drop_console: true,
            },
            comments: false
        })
    ]
};
// webpack.config.js
const path = require('path')

module.exports = {
    mode: 'development',
    entry: './frontend/main.js',
    watch: true,
    output: {
        path: path.resolve(__dirname, 'todo', 'static'),
        filename: 'index.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
        ],
    },
};

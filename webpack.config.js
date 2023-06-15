const path = require('path')
const { merge } = require('webpack-merge')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const TerserPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const commonConfig = {
    entry: './src/js/index.js',
    module: {
        rules: [
            {
                test: /\.html$/,
                use: ['html-loader']
            },
            {
                test: /\.(svg|png|jpe?g|gif|ttf|woff2)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[hash].[ext]',
                        outputPath: './assets'
                    }
                }
            }
        ],
    },
}

const devConfig = {
    mode: 'development',
    watch: true,
    output: {
        path: path.resolve(__dirname, 'todo', 'static'),
        filename: 'main.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
        ]
    },
    plugins: [new HtmlWebpackPlugin({
        template: 'src/base_template.html',
        filename: '../templates/base.html'
    })]
}

const prodConfig = {
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'todo', 'static'),
        filename: 'main.[contentHash].js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
            },
        ]
    },
    optimization: {
        minimizer: [new CssMinimizerPlugin(), new TerserPlugin(), new HtmlWebpackPlugin({
            template: 'src/base_template.html',
            filename: '../templates/base.html',
            minify: {
                removeAttributeQuotes: true,
                collapseWhitespace: true,
                removeComments: true
            }
        })]
    },
    plugins: [new CleanWebpackPlugin(), new MiniCssExtractPlugin({
        filename: '[name].[contentHash].css'
    })]
}

module.exports = (env, args) => {
    switch (args.mode) {
        case 'development':
            return merge(commonConfig, devConfig)
        case 'production':
            return merge(commonConfig, prodConfig)
        default:
            throw new Error('No matching configuration was found!')
    }
};

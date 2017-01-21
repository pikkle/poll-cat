var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    devServer: {
        contentBase: './<%= pkg.src %>/',
        historyApiFallback: true,
        proxy: {
            "/api": {
                target: "http://localhost:8000",
                pathRewrite: {"^/api": ""}
            }
        },
    },

    entry: {
        'main': './src/main.ts',
    },

    output: {
        path: './dist',
        filename: '[name].bundle.js',
    },
    module: {
        loaders: [
            {
                test: /\.ts$/,
                loaders: ['ts', 'angular2-template-loader'],
                exclude: ["./assets/"]
            },
            {
                test: /\.(html|css)$/,
                loader: 'raw-loader',
                exclude: ["src/index.html"]
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.ts'],
        exclude: ["./assets/"]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new CopyWebpackPlugin([
                {from: "./src/assets", to: "./assets"}
            ]
        )
    ]
};
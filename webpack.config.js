const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//require('@babel/register');

module.exports = {
    mode: 'development',
    entry: ["@babel/polyfill", "./src/index.js", "./src/style.css"],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "bundle.js"
    },
    devServer: {
        contentBase: path.resolve(__dirname, "dist")
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html',
            hash: true
        }),

    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/,
                exclude: /(node_modules)/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    resolve: {
        modules: [
            path.resolve(__dirname, "src"),
            path.resolve(__dirname, "node_modules")
        ],
    },
    experiments: {
        topLevelAwait: true,
    }
}

/*
plugins: [
    new webpack.DefinePlugin({
                'API_URL': JSON.stringify(env.API_URL)
            })
]
        */
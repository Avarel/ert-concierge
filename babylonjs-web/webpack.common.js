const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        style: './src/scss/style.scss',
        index: './src/ts/index.ts'
    },
    output: {
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    externals: {
        'babylonjs': "BABYLON",
        'babylonjs-gui': "BABYLON.GUI"
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/pug/index.pug',
            inject: true
        })
    ],
    resolve: {
        extensions: [".ts", ".scss", ".js", ".pug"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.s[ac]ss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.pug$/,
                loaders: ['pug-loader']
            }
        ]
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
};
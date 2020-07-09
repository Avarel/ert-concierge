const path = require("path");

module.exports = {
    entry: {
        index: './src/ts/index.ts',
        style: './src/scss/style.scss',
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
    resolve: {
        extensions: [".ts"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            },
            {
                test: /\.s[ac]ss$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: { name: '[name].min.css' }
                    },
                    'sass-loader'
                ]
            },
        ]
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
};
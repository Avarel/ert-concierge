const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: {
        login: "./src/login/login.ts",
        viewer: "./src/viewer/viewer.tsx"
    },
    output: {
        filename: "[name].bundle.js",
        chunkFilename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist")
    },
    externals: {
        "babylonjs": "BABYLON",
        "babylonjs-gui": "BABYLON.GUI",
        "react": "React",
        "react-dom": "ReactDOM"
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/login/login.pug",
            scriptLoading: "defer",
            chunks: ["login"]
        }),
        new HtmlWebpackPlugin({
            filename: "viewer.html",
            template: "./src/viewer/viewer.pug",
            scriptLoading: "defer",
            chunks: ["viewer"]
        })
    ],
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".scss", ".css",  ".pug", ".html"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.s[ac]ss$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.pug$/,
                loaders: ["pug-loader"]
            }
        ]
    },
    optimization: {
        splitChunks: {
            chunks: "all",
        },
    },
};
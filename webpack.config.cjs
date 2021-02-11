const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const dev = process.env.NODE_ENV === 'development';

/** @type {webpack.Configuration} */
const config = {
    mode: dev ? 'development' : 'production',

    target: 'web',

    entry: {
        app: './src/app.ts',
        // Package each language's worker and give these filenames in `getWorkerUrl`
        'editor.worker': 'monaco-editor/esm/vs/editor/editor.worker.js',
        'json.worker': 'monaco-editor/esm/vs/language/json/json.worker',
        'css.worker': 'monaco-editor/esm/vs/language/css/css.worker',
        'html.worker': 'monaco-editor/esm/vs/language/html/html.worker',
        'ts.worker': 'monaco-editor/esm/vs/language/typescript/ts.worker',
    },

    output: {
        globalObject: 'self',
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },

    // devServer: {
    //     contentBase: __dirname, // path.join(__dirname, 'dist'),
    // },

    devtool: dev ? 'inline-source-map' : false,

    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
            },

            {
                test: /\.wasm$/,
                type: 'javascript/auto',
                loaders: ['arraybuffer-loader'],
            },

            {
                test: /\.json$/,
                loader: 'json-loader',
                type: "javascript/auto"
            },

            // {
            //     test: /\.json$/,
            //     use: [
            //         {
            //             loader: 'raw-loader',
            //             options: {
            //                 esModule: true,
            //             },
            //         },
            //     ],
            // },

            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },

            {
                test: /\.ttf$/,
                use: ['file-loader'],
            },

            // {
            //     test: /\.wasm$/,
            //     use: ['wasm-loader'],
            // },
        ],
    },

    // As suggested on:
    // https://github.com/NeekSandhu/monaco-editor-textmate/blame/45e137e5604504bcf744ef86215becbbb1482384/README.md#L58-L59
    //
    // Use the MonacoWebpackPlugin to disable all built-in tokenizers/languages.
    plugins: [
        new webpack.SourceMapDevToolPlugin({
            filename: null,
            exclude: [/node_modules/],
            test: /\.ts($|\?)/i,
        }),

        new webpack.EvalSourceMapDevToolPlugin({
            moduleFilenameTemplate: 'webpack://[namespace]/[resource-path]',
        }),

        new MonacoWebpackPlugin({ languages: ['python'] })
    ],

    node: {
        fs: 'empty'
    }
};

module.exports = config;

const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    mode: 'development',
    entry: './main.ts',

    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /(node_modules)/,
                use: { loader: 'ts-loader' }
            },

            {
                test: /\.(png|jpg|woff|wav|ogg|mp3)$/i,
                use: { loader: 'file-loader' }
            },

            {
                test: /\.glsl$/,
                use: 'raw-loader'
            },

            {
                test: /\.vue$/i,
                use: 'vue-loader'
            },

            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    { loader: 'css-loader',  options: { url: false } },
                    'sass-loader'
                ],
            }
        ]
    },

    resolve: {
        extensions: ['.js', '.ts', '.vue'],
        alias: {
            '@core': path.resolve(__dirname, 'core'),
            'game': path.resolve(__dirname, 'game'),
            'vue$': 'vue/dist/vue.esm.js',
        }
    },

    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'public')
    },

    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        }
    },

    plugins: [
        new VueLoaderPlugin
    ]
}

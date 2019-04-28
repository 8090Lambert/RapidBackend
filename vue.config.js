const path = require('path');

module.exports = {
    // Project deployment base
    // By default we assume your app will be deployed at the root of a domain,
    // e.g. https://www.my-app.com/
    // If your app is deployed at a sub-path, you will need to specify that
    // sub-path here. For example, if your app is deployed at
    // https://www.foobar.com/my-app/
    // then change this to '/my-app/'
    publicPath: '/',

    // where to output built files
    outputDir: 'output',

    // where to put static assets (js/css/img/font/...)
    // assetsDir: '',

    // whether to use eslint-loader for lint on save.
    // valid values: true | false | 'error'
    // when set to 'error', lint errors will cause compilation to fail.
    lintOnSave: true,

    // use the full build with in-browser compiler?
    // https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only
    runtimeCompiler: false,

    // babel-loader skips `node_modules` deps by default.
    // explicitly transpile a dependency with this option.
    transpileDependencies: [/* string or regex */],

    // generate sourceMap for production build?
    productionSourceMap: true,

    // tweak internal webpack configuration.
    // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
    chainWebpack: (config) => {
        const svgRule = config.module.rule('svg');
        // clear all.
        svgRule.uses.clear();
        svgRule
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({symbolId: 'icon-[name]'});
    },
    configureWebpack: () => {
        return {
            resolve: {
                alias: {
                    '@modules': path.resolve(__dirname, 'src/modules'),
                    '@views': path.resolve(__dirname, 'src/views'),
                    '@utils': path.resolve(__dirname, 'src/utils'),
                    '@assets': path.resolve(__dirname, 'src/assets'),
                    '@scss': path.resolve(__dirname, 'src/assets/scss'),
                    '@icon': path.resolve(__dirname, 'src/assets/icon'),
                    '@components': path.resolve(__dirname, 'src/components'),
                    '@config': path.resolve(__dirname, 'src/config'),
                    '@root': path.resolve(__dirname, 'src/')
                },
                extensions: [
                    '.vue'
                ]
            }
        }
    },

    // CSS related options
    css: {
        // extract CSS in components into a single CSS file (only in production)
        // can also be an object of options to pass to extract-text-webpack-plugin
        extract: true,

        // enable CSS source maps?
        sourceMap: false,

        // pass custom options to pre-processor loaders. e.g. to pass options to
        // sass-loader, use { sass: { ... } }
        loaderOptions: {

        }

        // Enable CSS modules for all css / pre-processor files.
        // This option does not affect *.vue files.
        // modules: false
    },

    // use thread-loader for babel & TS in production build
    // enabled by default if the machine has more than 1 cores
    parallel: require('os').cpus().length > 1,

    // options for the PWA plugin.
    // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
    pwa: {},

    // configure webpack-dev-server behavior
    devServer: {
        open: process.env.NODE_ENV === 'development' && process.platform === 'darwin',
        host: '0.0.0.0',
        port: 8888,
        https: false,
        hotOnly: false,
        // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#configuring-proxy
        proxy: null, // string | Object
        before: app => {}
    },

    // options for 3rd party plugins
    pluginOptions: {
    }
};

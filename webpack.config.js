const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = (webpackConfigEnv, argv) => {
    // 生产环境
    const isProd = argv.mode === 'production';
    const isAnalyzer = webpackConfigEnv.analyze;
    const config = {
        entry: isProd ? './src/index.ts' : './src/App.tsx', // 入口文件
        mode: isProd ? 'production' : 'development', // 开发模式
        output: {
            path: path.resolve(__dirname, 'dist'), // 输出目录
            filename: 'index.js',
            clean: true,
        },
        devtool: 'source-map',
        module: {
            rules: [
                {
                    test: /\.(js|ts)x?$/,
                    use: ['babel-loader'],
                    exclude: /node_modules/, //排除 node_modules 目录
                },
            ],
        },
        plugins: [],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
            extensions: ['.mjs', '.js', '.jsx', '.wasm', '.json', '.ts', '.tsx'],
        },
        optimization: {
            concatenateModules: !isAnalyzer,
        },
        devServer: {
            // open: true, // 启动时自动打开浏览器
            hot: true, // 启用热替换功能
            port: 9011, // 设置端口号
            allowedHosts: 'all',
            historyApiFallback: { rewrites: [{ from: /\/*/, to: '/' }] },
        },
    };
    if (isAnalyzer) {
        config.plugins.push(new BundleAnalyzerPlugin());
    }
    if (!isProd) {
        config.plugins.push(
            new HtmlWebpackPlugin({
                template: './public/index.html', // 指定模板文件，插件会根据这个模板生成HTML文件
            }),
        );
    }
    if (isProd) {
        config.externals = ['react'];
    }
    return config;
};

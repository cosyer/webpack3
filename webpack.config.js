const path = require('path')
const ip = require('ip')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin') // 把所有的css文件抽成一个文件
const assetsViews = require("./assets-views")

const api_host = "http://cloud.mydearest.cn"

module.exports = {
    entry: {
        main: './src/index.js',
        // vendor: ["lodash", "react", "react-dom"] // 公共模块 加入内存缓存不会监听变化 用于CommonsChunkPlugin拆分代码
        // 1.entry:'./src/index.js' 
        // 2.数组形式 entry:[path1,path2] tree-market
        // 3.多页应用或者提取公共代码 CommonsChunkPlugin entry:{pageOne:path1||[],pageTwo:path2||[]}
    },
    output: {
        path: path.resolve(__dirname, 'dist'), // 通常是绝对路径 __dirname+'/dist' path.join(__dirname,'dist')
        filename: '[name]-[chunkhash].js', // [name].js name即是entry定义的key 默认name:main [id][hash] [contenthash] [hash:8]取前8位等内置变量
        publicPath: "",// 添加上公共目录
    },
    devServer: {
        inline: true, //设置为true，代码有变化，浏览器端刷新。
        open: true, //:在默认浏览器打开url(webpack-dev-server版本> 2.0)
        port: "8888",//页面端口
        compress: true, //使用gzip压缩
        // host: ip.address(),//ip地址，同时也可以设置成是localhost,
        progress: true, //让编译的输出内容带有进度和颜色
        historyApiFallback: true, //回退:支持历史API。
        contentBase: "./dist", //本地服务器所加载的页面所在的目录 index.html 一般选择dist目录下的
        // proxy: {
        //     '*': {
        //         target: 'http://127.0.0.1:80', //跨域Ip地址
        //         secure: false
        //     }
        // }
        // webpack-dev-server如果是3.x的话，webpack必须是4.x才不会报此TypeError: Cannot read property 'compile' of undefined错误, 
        // 同理如果webpack是3.x，则webpack-dev-server必须是2.x
    },
    // 更好的处理文件夹引入不用写后缀
    resolve: {
        modules: [path.resolve(__dirname, "common"), path.resolve(__dirname, "util"), "node_modules"],
        extensions: [".js", ".json", ".jsx"],
        mainFiles: ["index"],
        alias: {
            // 替换别名
        }
    },
    module: {
        // loaders
        rules: [
            {
                // 转译js、jsx文件
                test: /\.(js|jsx)$/,// 匹配特定文件的正则表达式或正则表达式数组
                include: path.resolve(__dirname, 'src'),// 指定需要转译的文件夹
                exclude: path.resolve(__dirname, 'node_modules'),// 指定转译时忽略的文件夹  
                // loader:'' loaders:'' use:{loader} use:[{}]      
                // use: {
                //     loader: 'babel-loader',
                //     options: {
                //         presets: ['react']
                //     }
                // }
                loader: 'babel-loader',// use:'babel-loader'
                options: {
                    presets: ['env', 'es2015', 'react', 'stage-0'],
                    plugins: ['transform-decorators-legacy']
                }
            },
            {
                // 处理图片 url-loader内置了file-loader
                // 1.文件大小小于limit参数，url-loader将会把文件转为DataURL；
                // 2.文件大小大于limit，url-loader会调用file-loader进行处理，参数也会直接传给file-loader。
                test: /\.(jpg|png|gif|eot|woff|ttf|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,// 文件大小限制
                            name: 'static/img/[name].[ext]' // 导出
                        }
                    }
                ]
            },
            {
                // 处理css less文件
                test: /\.(css|less)$/,
                // use: [ // 应用于模块的 loader 使用列表
                //     'style-loader',
                //     {
                //         loader: "css-loader",
                //         options: {
                //             minimize: true //css压缩
                //         }
                //     },
                // ],
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{
                        loader: 'css-loader',
                        options: {
                            minimize: true //css压缩
                        }
                    }, {
                        loader: 'less-loader'
                    }],
                })
            }
        ]
    },
    plugins: [
        // 全局变量
        new webpack.DefinePlugin({
            api_host: JSON.stringify(api_host) // 需要转成JSON字符串
        }),
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: "vendor" // 指定公共 bundle 的名字。
        // }),
        // 对于 CommonsChunkPlugin，webpack 每次打包实际还是需要去处理这些第三方库，只是打包完之后，能把第三方库和我们自己的代码分开。而
        // DLLPlugin 则是能把第三方代码完全分离开，即每次只打包项目自身的代码。
        // 模块不变打出来的包就不会变。
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require("./dist/vendor-manifest.json")
        }),
        // 根据模板生成html
        // new HtmlWebpackPlugin({
        //     title: "webpack3配置",
        //     filename: 'index.html',
        //     template: './src/index.html', // 使用模板title无效
        //     inject: 'body',//将script标签插入到body标签中
        // minify: {
        //     removeComments: true,//删除注释
        //     collapseWhitespace: true//删除空格
        // }
        // }),
        // 提取css到单独的文件
        new ExtractTextPlugin({
            filename: "css/style.css",
            disable: false,
            allChunks: true
        }),
        assetsViews({
            gloabal: {
                api_host: JSON.stringify(api_host)
            },
            from: "./views/",
            to: "./dist/"
        }),
    ]
}
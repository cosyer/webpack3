/**
 * Description: 自动替换chunkhash的工具
 */
var fs = require('fs');
var path = require('path');
var ejs = require('ejs');
/**
 * 静态资源管理webpack插件
 */
module.exports = function assetsPlugin(opts) {
  console.log(
    'from Dir------>', path.join(__dirname, opts.from),
    '\nto Dir-------->', path.join(__dirname, opts.to)
  );


  return function() {
    var output = this.options.output;
    //webpack的path
    var outputPath = output.path;
    //webpack的publicPath
    var publicPath = output.publicPath;
    //删除目录下已经存在的文件
    deleteAllOldFiles(outputPath);


    this.plugin('done', function(stats) {
      var json = stats.toJson();
      var assetsByChunkName = json.assetsByChunkName;
      //filter
      var assetsChunkFilter = {};
      for (var entry in assetsByChunkName) {
        if (assetsByChunkName.hasOwnProperty(entry)) {
          assetsChunkFilter[entry] = (publicPath + chunkName(assetsByChunkName[entry]));
        }
      }
      var gloabalConfig = opts.gloabal||{};
      for(var key in gloabalConfig){
        if(gloabalConfig.hasOwnProperty(key)){
            assetsChunkFilter[key] = gloabalConfig[key];
        }
      }


      console.log('assetsChunkFilter===========>', assetsChunkFilter);

      var fromDir = opts.from;
      var toDir = opts.to;

      if (!fromDir) {
        return console.log('请配置模板路径');
      }

      if (!toDir) {
        return console.log('请配置生成文件的目标路径');
      }

      var tplFiles = fs.readdirSync(fromDir);
      tplFiles.forEach(function(v) {
        var content = fs.readFileSync(path.join(__dirname, fromDir, v));
        var dFileName = path.basename(v, '.ejs');
        console.log('写入模板:) =========>', path.join(__dirname, toDir, dFileName + '.jsp'));
        ejs.delimiter = '$';
        fs.writeFileSync(
          path.join(__dirname, toDir, dFileName + '.html'),
          ejs.render(content.toString(), assetsChunkFilter));
      });
    });
  }
};

/**
 * 删除上一次打包好的所有文件
 *
 * @param publicPath 生产环境打包路径
 */
function deleteAllOldFiles(publicPath) {
  try {
    var res = fs.readdirSync(publicPath);
      res.forEach(function(file) {
        if(file == 'vendor.dll.js' || file == 'vendor-manifest.json')return;
       if(/\.js$/.test(file)) {
        var filePath = path.join(publicPath, file);
        console.log('正在删除', filePath);
        fs.unlinkSync(filePath);
      }
    });

  } catch(err) {
    console.log('没有', publicPath ,'目录');
  }
}

/**
 * 获取chunkname
 *
 * @param chunkName
 * @returns {*}
 */
function chunkName(chunkName) {
  return Array.isArray(chunkName) ? chunkName[0] : chunkName;
}

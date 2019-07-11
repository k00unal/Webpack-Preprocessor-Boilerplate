var path = require("path");
var webpack = require("webpack");
var fs = require("fs");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require("autoprefixer");

var src = path.join(__dirname, "src");
var dist = path.join(__dirname, "dist");

function generateHtmlPlugins(templateDir) {
  // Read files in template directory
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
  return templateFiles.map(item => {
    // Split names and extension
    const parts = item.split(".");
    const name = parts[0];
    const extension = parts[1];
    // Create new HtmlWebpackPlugin with options
    return new HtmlWebpackPlugin({
      inject: true,
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`)
    });
  });
}

// Call our function on our views directory.
const htmlPlugins = generateHtmlPlugins(path.join(src, "pug/views"));

var config = {
  devServer: {
    // hot: true,
    stats: "errors-only"
  },
  devtool: "source-map",
  stats: {
    assets: false,
    colors: true,
    version: false,
    hash: true,
    timings: true,
    chunks: false,
    chunkModules: false
  },
  context: path.resolve(__dirname, "src"),
  entry: {
    // app: path.join(src, "main.js")
    app: [
      "../src/sass/app.scss",
      "../src/js/app.js",
      "../src/typescript/index.ts"
    ]
  },
  output: {
    path: dist,
    filename: "js/[name].js"
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: ["html-loader", "pug-html-loader?pretty&exports=false"]
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: true
            }
          }
        ]
      },

      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: true
            }
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: function() {
                return [autoprefixer];
              }
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          }
        ]
      },
      // {
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   use: {
      //     loader: "babel-loader"
      //   }
      // },
      {
        test: /\.(js|jsx|tsx|ts)$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },
  resolve: {
    extensions: ["*", ".js", ".jsx", ".tsx", ".ts"]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      path: dist,
      filename: "css/[name].css"
    })
  ]

    // We join our htmlPlugin array to the end
    // of our webpack plugins array.
    .concat(htmlPlugins)
};

module.exports = config;

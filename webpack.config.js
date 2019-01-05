const ExtractTextPlugin = require("extract-text-webpack-plugin")
module.exports = {
  mode: "production",
  // mode: "development",
  entry: {
    "main.js": "./index.js"
  },
  output: {
    filename: "[name]"
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          use: ["css-loader", "less-loader"]
        })
      }
    ]
  },
  plugins: [new ExtractTextPlugin("custom.css")]
}

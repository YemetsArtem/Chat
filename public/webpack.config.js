const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/js/client.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "client_min.js"
  },
  module: {
    rules: [
      {
        test: /\.(html)$/,
        use: { loader: "html-loader", options: { minimize: true } }
      },
      {
        test: /\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }]
      },
      {
        test: /\.(scss)$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: "sass-loader" },
          {
            loader: "postcss-loader",
            options: {
              plugins: function() {
                return [require("precss"), require("autoprefixer")];
              }
            }
          },
          {
            loader: "sass-loader"
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "main_min.html",
      template: "./src/templates/main.html"
    })
  ]
};

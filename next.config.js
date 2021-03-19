
/* eslint-disable */
const withLess = require("@zeit/next-less");
// const cssLoaderConfig = require("@zeit/next-css/css-loader-config");
const lessToJS = require('less-vars-to-js');
const fs = require('fs');
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, './public/antd-custom.less'), 'utf8')
);

module.exports = withLess({
  cssModules: true,
  cssLoaderOptions: {
    localIdentName: '[local]--[hash:base64:5]',
  },
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  webpack: (config, { isServer, ...options }) => {
    if (isServer) {
      const antStyles = /antd\/.*?\/style.*?/
      const origExternals = [...config.externals]
      config.externals = [
        (context, request, callback) => {
          if (request.match(antStyles)) return callback()
          if (typeof origExternals[0] === 'function') {
            origExternals[0](context, request, callback)
          } else {
            callback()
          }
        },
        ...(typeof origExternals[0] === 'function' ? [] : origExternals),
      ]

      // config.module.rules.unshift({
      //   test: antStyles,
      //   use: 'null-loader',
      // });
    } else {
      const { defaultLoaders, dev } = options;
      
      config.module.rules.push({
        test: /\.(css|less)$/,
        include: /(node_modules)/,
        use: [
          {
            loader: !dev ? MiniCssExtractPlugin.loader : 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: false,
              sourceMap: true,
              importLoaders: 1
            }
          },
          {
            loader: 'less-loader',
            options: {
              modifyVars: themeVariables,
              javascriptEnabled: true,
            },
          }
        ]
      });
      
      let ruleIndex = null;
      config.module.rules.forEach((item, index) => {
        if (item.use === defaultLoaders.less) {
          ruleIndex = index;
        }
      });
      ruleIndex !== null && (config.module.rules[ruleIndex].exclude = /(node_modules)/);
      config.plugins.push(new MiniCssExtractPlugin({
        filename: 'static/css/[name].[hash].css',
        chunkFilename: 'static/css/[name].[hash].css'
      }))
    }
    

    return config
  },
});

// const wrapper = module.exports = (nextConfig = {}) => {
//   return Object.assign({}, nextConfig, {
//     webpack: (config, options) => {
//       if (!options.defaultLoaders) {
//         throw new Error(
//           'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade'
//         );
//       }

//       const { dev, isServer } = options;
//       const {
//         cssModules,
//         cssLoaderOptions,
//         postcssLoaderOptions,
//         lessLoaderOptions = {},
//       } = nextConfig;

//       options.defaultLoaders.less = cssLoaderConfig(config, {
//         extensions: ['less'],
//         cssModules,
//         cssLoaderOptions,
//         postcssLoaderOptions,
//         dev,
//         isServer,
//         loaders: [
//           {
//             loader: 'less-loader',
//             options: lessLoaderOptions,
//           },
//         ],
//       });

//       config.module.rules.push({
//         test: /\.less$/,
//         exclude: /node_modules/,
//         use: options.defaultLoaders.less,
//       });

//       // disable antd css module
//       config.module.rules.push({
//         test: /\.less$/,
//         include: /node_modules/,
//         use: cssLoaderConfig(config, {
//           extensions: ['less'],
//           cssModules: false,
//           cssLoaderOptions: {},
//           dev,
//           isServer,
//           loaders: [
//             {
//               loader: 'less-loader',
//               options: lessLoaderOptions,
//             },
//           ],
//         }),
//       });

//       if (isServer) {
//         const antStyles = /antd\/.*?\/style.*?/;
//         const origExternals = [...config.externals];
//         config.externals = [
//           (context, request, callback) => {
//             if (request.match(antStyles)) return callback();
//             if (typeof origExternals[0] === 'function') {
//               origExternals[0](context, request, callback);
//             } else {
//               callback();
//             }
//           },
//           ...(typeof origExternals[0] === 'function' ? [] : origExternals),
//         ];
  
//         config.module.rules.unshift({
//           test: antStyles,
//           use: 'null-loader',
//         });
//       }

//       if (typeof nextConfig.webpack === 'function') {
//         return nextConfig.webpack(config, options);
//       }

//       return config;
//     }
//   });
// };

// module.exports = wrapper({
//   cssModules: true,
//   cssLoaderOptions: {
//     importLoaders: 1,
//     localIdentName: '[local]___[hash:base64:5]',
//   },
//   lessLoaderOptions: {
//     modifyVars: themeVariables,
//     javascriptEnabled: true
//   },
// })

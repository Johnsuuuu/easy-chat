const CracoLessPlugin = require('craco-less');
module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': '#006653',
              '@error-color': '#f50057',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};

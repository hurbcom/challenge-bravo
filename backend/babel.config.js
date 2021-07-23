module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@configs': './src/configs',
          '@container': './src/container',
          '@errors': './src/errors',
          '@infra': './src/infra',
          '@interfaces': './src/interfaces',
          '@repositories': './src/repositories',
          '@services': './src/services',
          '@utils': './src/utils',
        },
      },
    ],
    'babel-plugin-transform-typescript-metadata',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
  ],
};

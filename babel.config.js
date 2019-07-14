module.exports = function (api) {
  api.cache(true);

  const presets = [
    ['@babel/preset-env', {
      modules: process.env.BABEL_TARGET === 'esm' ? false : 'auto',
      targets: {
        browsers: 'last 2 versions, not dead',
      },
    }],
  ];

  return {
    presets,
  };
}

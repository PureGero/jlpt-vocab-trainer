module.exports = function override(config, env) {
  const newRule = {
    test: /\.csv$/i,
    loader: 'raw-loader',
    options: {
      esModule: false,
    },
  }
  config.module.rules.find((r) => r.oneOf).oneOf.unshift(newRule)
  return config
}
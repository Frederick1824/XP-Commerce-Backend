export default {
  default: {
    paths: ["features/**/*.feature"],
    import: ["tests/step_definitions/**/*.ts"],
    loaders: ["tsx"],
    format: ["progress"],
    publishQuiet: true
  }
};

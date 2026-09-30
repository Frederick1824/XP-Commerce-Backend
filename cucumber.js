export default {
  default: {
    paths: ["features/**/*.feature"],
    import: ["tests/support/**/*.ts","tests/step_definitions/**/*.ts"],
    loader: ["tsx"],
    format: ["progress"]
  }
};

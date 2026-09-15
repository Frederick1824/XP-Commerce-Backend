export default {
  default: {
    paths: ["features/**/*.feature"],
    import: ["tests/step_definitions/**/*.ts"],
    loader: ["tsx"],
    format: ["progress"]
  }
};

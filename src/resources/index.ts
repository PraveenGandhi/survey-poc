export function configure(config) {
  config.globalResources([
    './binding-behaviours/dynamic-binding-behavior',
    './value-converters/noop-value-converter'
  ]);
}

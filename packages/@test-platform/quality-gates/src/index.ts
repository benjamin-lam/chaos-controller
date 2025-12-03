export * from './network-fixtures';

export const QualityGateScripts = {
  lint: 'npm run lint',
  typecheck: 'npm run typecheck',
  stability: 'npm run test:stability',
  flaky: 'npm run test:flaky'
};

function requireUncached(module) {
  delete require.cache[require.resolve(module)];
  return require(module);
}

describe('log.setLevel(level) - loglevel', () => {
  const logger = requireUncached('../src/log').createLogger('loglevel');
  const log = logger.default;
  const { setLevel } = logger;
  // eslint-disable-next-line no-console
  global.console = {
    error: () => true,
    warn: () => true,
    info: () => true,
    log: () => true
  };
  it("should only log 'trace', 'silly', 'debug', 'info', 'warn', and 'error' when 'level' set to 'trace'", async () => {
    setLevel('trace');
    expect(!!log.trace('hello')).toBe(true);
    expect(!!log.silly('hello')).toBe(true);
    expect(!!log.debug('hello')).toBe(true);
    expect(!!log.info('hello')).toBe(true);
    expect(!!log.warn(new Error('hello'))).toBe(true);
    expect(!!log.error(new Error('hello'))).toBe(true);
  });
  it("should only log 'silly', 'debug', 'info', 'warn', and 'error' when 'level' set to 'silly'", async () => {
    setLevel('silly');
    expect(!!log.trace('hello')).toBe(false);
    expect(!!log.silly('hello')).toBe(true);
    expect(!!log.debug('hello')).toBe(true);
    expect(!!log.info('hello')).toBe(true);
    expect(!!log.warn(new Error('hello'))).toBe(true);
    expect(!!log.error(new Error('hello'))).toBe(true);
  });
  it("should only log 'debug', 'info', 'warn', and 'error' when 'level' set to 'debug'", async () => {
    setLevel('debug');
    expect(!!log.trace('hello')).toBe(false);
    expect(!!log.silly('hello')).toBe(false);
    expect(!!log.debug('hello')).toBe(true);
    expect(!!log.info('hello')).toBe(true);
    expect(!!log.warn(new Error('hello'))).toBe(true);
    expect(!!log.error(new Error('hello'))).toBe(true);
  });
  it("should only log 'info', 'warn', and 'error' when 'level' set to 'info'", async () => {
    setLevel('info');
    expect(!!log.trace('hello')).toBe(false);
    expect(!!log.silly('hello')).toBe(false);
    expect(!!log.debug('hello')).toBe(false);
    expect(!!log.info('hello')).toBe(true);
    expect(!!log.warn(new Error('hello'))).toBe(true);
    expect(!!log.error(new Error('hello'))).toBe(true);
  });
  it("should only log 'warn', and 'error' when 'level' set to 'warn'", async () => {
    setLevel('warn');
    expect(!!log.trace('hello')).toBe(false);
    expect(!!log.silly('hello')).toBe(false);
    expect(!!log.debug('hello')).toBe(false);
    expect(!!log.info('hello')).toBe(false);
    expect(!!log.warn(new Error('hello'))).toBe(true);
    expect(!!log.error(new Error('hello'))).toBe(true);
  });
  it("should only log 'error' when 'level' set to 'error'", async () => {
    setLevel('error');
    expect(!!log.trace('hello')).toBe(false);
    expect(!!log.silly('hello')).toBe(false);
    expect(!!log.debug('hello')).toBe(false);
    expect(!!log.info('hello')).toBe(false);
    expect(!!log.warn(new Error('hello'))).toBe(false);
    expect(!!log.error(new Error('hello'))).toBe(true);
  });
});

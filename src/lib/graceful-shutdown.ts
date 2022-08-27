// Credits: Matteo Collina https://github.com/mcollina/close-with-grace

import { promisify } from 'util';

const sleep = promisify(setTimeout);

handleGracefulShutdown.closing = false;

type Out = { signal: string; manual: boolean; err: Error };

function handleGracefulShutdown(
  opts: { delay?: number },
  fn: (opts: Partial<Out>, done?: (opts: Out) => any) => any
) {
  if (typeof opts === 'function') {
    fn = opts;
    opts = {};
  }
  const delay = opts.delay ? opts.delay : 10000;
  process.once('SIGTERM', onSignal);
  process.once('SIGINT', onSignal);
  process.once('uncaughtException', onError);
  process.once('unhandledRejection', onError);

  const sleeped = Symbol('sleeped');

  return {
    close() {
      run({ manual: true });
    },
    uninstall() {
      process.removeListener('SIGTERM', onSignal);
      process.removeListener('SIGINT', onSignal);
      process.removeListener('uncaughtException', onError);
      process.removeListener('unhandledRejection', onError);
    },
  };

  function onSignal(signal: string) {
    run({ signal });
  }

  function afterFirstSignal(signal: string) {
    console.error(`second ${signal}, exiting`);
    process.exit(1);
  }

  function onError(err: unknown) {
    run({ err });
  }

  function afterFirstError(err: unknown) {
    console.error('second error, exiting');
    console.error(err);
    process.exit(1);
  }

  function exec(out: any) {
    const res = fn(out, done);

    if (res && typeof res.then === 'function') {
      return res;
    }

    let _resolve: (value: unknown) => any;
    let _reject: (reason?: unknown) => any;

    const p = new Promise(function (resolve, reject) {
      _resolve = resolve;
      _reject = reject;
    });

    return p;

    function done(err: unknown) {
      if (!_resolve) {
        return;
      }

      if (err) {
        _reject(err);
        return;
      }

      _resolve(null);
    }
  }

  async function run(out: any) {
    process.on('SIGTERM', afterFirstSignal);
    process.on('SIGINT', afterFirstSignal);
    process.on('uncaughtException', afterFirstError);
    process.on('unhandledRejection', afterFirstError);

    handleGracefulShutdown.closing = true;

    try {
      const res = await Promise.race([sleep(delay, sleeped), exec(out)]);
      if (res === sleeped || out.err) {
        process.exit(1);
      } else {
        process.exit(0);
      }
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }
}

export default handleGracefulShutdown;
export { handleGracefulShutdown };

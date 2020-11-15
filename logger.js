const fs = require('fs');

// eslint-disable-next-line no-multi-assign
const Logger = (exports.Logger = {});

const level = {
  info: 3,
  debug: 2,
  error: 1,
  critical: 0,
};

const getCallerFile = () => {
  const originalFunc = Error.prepareStackTrace;

  let callerFile;
  let errObj = null;
  let functionName;
  let lineNumber;
  try {
    const err = new Error();

    Error.prepareStackTrace = (errStack, stack) => { return stack; };

    const currentFile = err.stack.shift().getFileName();

    while (err.stack.length) {
      errObj = err.stack.shift();
      callerFile = errObj.getFileName();

      if (currentFile !== callerFile) break;
    }
    if (errObj) {
      lineNumber = errObj.getLineNumber();
      functionName = errObj.getFunctionName();
    } else {
      lineNumber = err.stack.shift().getLineNumber();
      functionName = err.stack.shift().getFunctionName();
    }
    // eslint-disable-next-line no-empty
  } catch (e) {}

  Error.prepareStackTrace = originalFunc;

  return { callerFile, lineNumber, functionName };
};

const infoStream = fs.createWriteStream('logs/info.log', { flags: 'a' });
const errorStream = fs.createWriteStream('logs/error.log', { flags: 'a' });
const debugStream = fs.createWriteStream('logs/debug.log', { flags: 'a' });
const criticalStream = fs.createWriteStream('logs/critical.log', { flags: 'a' });

Logger.info = (msg) => {
  const [date, time] = new Date().toISOString().split('T');
  const message = `${date} ${time.slice(0, -1)} INFO ${level.info} --- ${module.parent.filename} : ${msg}\n`;
  infoStream.write(message);
};

Logger.debug = (msg) => {
  const [date, time] = new Date().toISOString()
  .split('T');
  const message = `${date} ${time.slice(0,
    -1
  )} DEBUG ${level.debug} --- ${module.parent.filename} : ${msg}\n`;
  debugStream.write(message);
};

Logger.error = (msg) => {
  // __filename.slice(__dirname.length + 1) -> get a filename
  const [date, time] = new Date().toISOString()
  .split('T');
  const message = `${date} ${time.slice(0,
    -1
  )} ERROR ${level.error} --- ${getCallerFile().callerFile}:${getCallerFile().functionName}:${getCallerFile().lineNumber}: ${msg}\n`;
  errorStream.write(message);
};

Logger.critical = (msg) => {
  const [date, time] = new Date().toISOString()
  .split('T');
  const message = `${date} ${time.slice(0,
    -1
  )} CRITICAL ${level.info} --- ${module.parent.filename} : ${msg}\n`;
  criticalStream.write(message);
};

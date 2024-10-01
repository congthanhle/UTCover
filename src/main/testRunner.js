const { exec } = require('child_process');

const runTests = (fileList) => {
  return new Promise((resolve, reject) => {
    const testCommand = `mocha ${fileList.join(' ')} --reporter json`; // Jest can also be used
    exec(testCommand, (error, stdout, stderr) => {
      if (error) {
        reject(stderr);
      } else {
        resolve(JSON.parse(stdout)); // Parse Mocha's JSON output
      }
    });
  });
};

module.exports = { runTests };

const core = require("@actions/core");
const FtpDeploy = require("ftp-deploy");

// most @actions toolkit packages have async methods
async function run() {
  const ftpDeploy = new FtpDeploy();

  const username = core.getInput("username");
  const password = core.getInput("password");
  const server = core.getInput("server");
  const localDir = core.getInput("local-directory");
  const serverDir = core.getInput("server-directory");

  var config = {
    user: username,
    // Password optional, prompted if none given
    password: password,
    host: server,
    port: 21,
    localRoot: __dirname + localDir,
    remoteRoot: serverDir,
    // delete ALL existing files at destination before uploading, if true
    deleteRemote: false,
    // Passive mode is forced (EPSV command is not sent)
    forcePasv: true,
  };

  try {
    core.info(`Setting up FTP.`);

    await ftpDeploy
      .deploy(config)
      .then((res) => core.info("finished:", res))
      .catch((err) => core.setFailed(err));
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

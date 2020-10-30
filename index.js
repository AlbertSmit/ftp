const core = require("@actions/core");
const FtpDeploy = require("ftp-deploy");

function blue(text) {
  return `\u001b[38;5;6m${text}`;
}

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
    localRoot: localDir,
    remoteRoot: serverDir,
    include: ["*", "**/*"],
    deleteRemote: false,
    forcePasv: true,
  };

  ftpDeploy.on("uploading", function (data) {
    core.info(
      blue(
        `Uploading ${data.totalFilesCount} files, currently done ${data.transferredFileCount}.`
      )
    );
  });

  ftpDeploy.on("uploaded", function (data) {
    core.info(blue(`Done uploading ${data.filename}.`));
  });

  try {
    core.info(blue("Setting up FTP."));

    await ftpDeploy
      .deploy(config)
      .then((res) => core.info(blue("finished:"), res))
      .catch((err) => core.setFailed(err));
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

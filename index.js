const chalk = require("chalk");
const core = require("@actions/core");
const FtpDeploy = require("ftp-deploy");
const gradient = require("gradient-string");

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
      chalk.blue(
        `Uploading ${data.totalFilesCount} files, currently done ${data.transferredFileCount}.`
      )
    );
  });

  ftpDeploy.on("uploaded", function (data) {
    core.info(chalk.blue(`Done uploading ${data.filename}.`));
  });

  try {
    core.info(chalk.blue("Setting up FTP."));

    await ftpDeploy
      .deploy(config)
      .then(() =>
        core.info(gradient("cyan", "pink")("finished uploading your crap."))
      )
      .catch((err) => core.setFailed(err));
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

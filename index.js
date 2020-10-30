const style = require("ansi-styles");
const core = require("@actions/core");
const FtpDeploy = require("ftp-deploy");

function blue(text) {
  return `${style.green.open}${text}${style.green.close}`;
}

function red(text) {
  return `${style.redBright.open}${text}${style.redBright.close}`;
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
      blue(`Uploading ${data.totalFilesCount} / ${data.transferredFileCount}.`)
    );
  });

  ftpDeploy.on("uploaded", function (data) {
    core.info(blue(`Done uploading ${data.filename}.`));
  });

  ftpDeploy.on("uploaded", function (data) {
    const random = Math.floor(Math.random * 10);
    switch (random) {
      case 1:
        core.info(red(`${data.filename}? That sounds dumb.`));
        break;
      case 2:
        core.info(
          red(
            `${data.filename}, are you kidding me? Is that the best you come up with?`
          )
        );
        break;
      case 3:
        core.info(red(`Who names their file ${data.filename}? Hideous!`));
        break;
      case 4:
        core.info(red(`Who still uses FTP? That's ridiculous.`));
        break;

      default:
        break;
    }
  });

  try {
    core.info(blue("Setting up FTP."));

    await ftpDeploy
      .deploy(config)
      .then(() => core.info(blue("Finished uploading your crap.")))
      .catch((err) => core.setFailed(err));
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

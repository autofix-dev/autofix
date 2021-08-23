// Copyright © 2020 Jan Keromnes.
// The following code is covered by the MIT license.

const { getData } = require("crawler-toolbox");
const { patchDom } = require("crawler-toolbox/build/utils");

const getLatestGoVersion = async () => {
  const url = "https://golang.org/dl/";

  let golangVersion = undefined
  const result = await getData(url);
  patchDom(result.content, ($) => {
    // https://regex101.com/r/cJLyi6/1
    const regex = /\/dl\/go(.*?).src.tar.gz/gm;
    const links = [... $("a[href]")];
    for (const l of links) {
      const version = regex.exec(l.attribs["href"])?.[1];
      if (version != undefined) {
        golangVersion = version
        break;
      }
    }
  });

  return golangVersion
};
exports.register = async (fixers) => {
  const golangVersion = await getLatestGoVersion()
  console.log(golangVersion)
  fixers[0].push({
    id: "upgrade-golang",
    cmd: `todo`,
    description: "Update pinned Go module versions",
  });
};

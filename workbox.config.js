const path = require('path');

module.exports = {
  swSrc: path.join("./www/sw.js"),
  swDest: path.join("./output/www/sw.js"),
  globDirectory: "./output/www/",
  globPatterns: ["static/home/**/*.{js,css,ttf,svg,eot}"],
  dontCacheBustURLsMatching: /[0-9a-z]+_([0-9a-z]{5})\.[a-z]+$/,
  manifestTransforms: [
    (originalManifest) => {
      const manifest = originalManifest
        .filter((item) => item.revision === null)
        .map((item) => ({
          ...item,
          url: `/${item.url}`,
        }));
      return {
        manifest,
        warnings: [],
      };
    },
  ],
};
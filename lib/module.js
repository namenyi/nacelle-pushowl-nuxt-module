const path = require('path')

module.exports = function (moduleOptions) {
  const filename = 'nacelle-pushowl-plugin.js'
  const options = {
    ...this.options.nacelle,
    ...moduleOptions
  }

  // Add PushOwl script
  this.options.head.script.push({
    hid: 'pushowl-script',
    innerHTML: `
      window.pushowl = window.pushowl || {
        queue: [],
        trigger: function (taskName, taskData) {
          return new Promise((resolve, reject) => {
            this.queue.push({
              taskName,
              taskData,
              promise: { resolve, reject },
            });
          });
        },
        init: function () {
          const subdomain = '${options.pushowl.subdomain}'
          if (!subdomain) {
            return;
          }
          this.subdomain = subdomain;
          var s = document.createElement("script");
          s.type = "text/javascript";
          s.async = true;
          s.src =
            "https://cdn.pushowl.com/sdks/pushowl-sdk.js?subdomain=" +
            subdomain +
            "&environment=production&shop=" +
            subdomain +
            ".myshopify.com";
          var x = document.getElementsByTagName("script")[0];
          x.parentNode.insertBefore(s, x);
        },
      };
      `,
    charset: 'utf-8'
  })
  this.options.head['__dangerouslyDisableSanitizersByTagID'] = {
    'pushowl-script': ['innerHTML']
  }

  // Add plugin to nuxt
  this.addPlugin({
    src: path.resolve(__dirname, filename),
    fileName: filename,
    options
  })
}

module.exports.meta = require('../package.json')

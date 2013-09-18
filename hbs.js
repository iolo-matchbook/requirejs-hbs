define(["handlebars"], function (Handlebars) {
  var templateExtension = ".hbs";

  return {

    pluginBuilder: "./hbs-builder",

    // http://requirejs.org/docs/plugins.html#apiload
    load: function (name, parentRequire, onload, config) {

      // Get the template extension.
      var ext = (config.hbs && config.hbs.templateExtension ? config.hbs.templateExtension : templateExtension);
      var self = this;

      // In browsers use the text-plugin to the load template. This way we
      // don't have to deal with ajax stuff
      parentRequire(["text!" + name + ext], function (raw) {
        parentRequire(self.extractDependencies(raw), function () {
          // Just return the compiled template
          onload(Handlebars.compile(raw));
        });
      });

    },

    extractDependencies: function (content) {
      var dependencies = [];
      content.replace(/\{\{!require\s+([\S\s]+?)\}\}/g, function (_, list) {
        list.replace(/\s*([^\s,]+)\s*,?/g, function (_, dependency) {
          dependencies.push(dependency);
        });
      });
      return dependencies;
    }

  };
});

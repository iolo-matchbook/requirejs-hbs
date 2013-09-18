define(["handlebars-compiler"], function (Handlebars) {
  var buildMap = {},
      templateExtension = ".hbs";

  return {

    // http://requirejs.org/docs/plugins.html#apiload
    load: function (name, parentRequire, onload, config) {

      // Get the template extension.
      var ext = (config.hbs && config.hbs.templateExtension ? config.hbs.templateExtension : templateExtension);

      // Use node.js file system module to load the template.
      // Sorry, no Rhino support.
      var fs = nodeRequire("fs");
      var fsPath = config.dirBaseUrl + "/" + name + ext;
      var content = fs.readFileSync(fsPath).toString();
      var dependencies = this.extractDependencies(content);
      buildMap[name] = {
        content: content,
        dependencies: ["handlebars"].concat(dependencies)
      };
      parentRequire(dependencies, function () {
        onload();
      });

    },

    // http://requirejs.org/docs/plugins.html#apiwrite
    write: function (pluginName, name, write) {
      var compiled = Handlebars.precompile(buildMap[name].content);
      var dependencies = JSON.stringify(["handlebars"].concat(buildMap[name].dependencies));
      // Write out precompiled version of the template function as AMD
      // definition.
      write(
        "define('hbs!" + name + "', " + dependencies + ", function(Handlebars){ \n" +
          "return Handlebars.template(" + compiled.toString() + ");\n" +
        "});\n"
      );
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

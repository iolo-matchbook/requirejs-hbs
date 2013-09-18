define(["handlebars"], function (Handlebars) {
  Handlebars.registerHelper("foo", function () {
    return "bar";
  });
});

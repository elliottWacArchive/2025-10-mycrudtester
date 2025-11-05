const Jasmine = require("jasmine");
const { SpecReporter } = require("jasmine-spec-reporter");

const jasmine = new Jasmine();
jasmine.configureDefaultReporter({ print: () => { } });
jasmine.addReporter(new SpecReporter());
jasmine.loadConfigFile("spec/support/jasmine.json");
jasmine.execute();
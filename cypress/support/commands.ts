import { ReinitOpts } from "../../demo/server/reInitMiddleware";

function testableSelector(id) {
  return `[data-test-id="${id}"]`;
}

function random() {
  return Math.random()
    .toString(36)
    .substring(2);
}

Cypress.Commands.add("testable", (id, options) => {
  return cy.get(testableSelector(id), options);
});

Cypress.Commands.add("testableContains", (id, contains, options) => {
  return cy.contains(testableSelector(id), contains, options);
});

Cypress.Commands.add("reinit", (config, db) => {
  return cy.request("POST", "/admin/__reinit", {
    config,
    db
  });
});

Cypress.Commands.add("randomStr", (lengthI, templateI) => {
  const length = (typeof lengthI === "number" ? lengthI : templateI) || 10;
  const template = (typeof lengthI === "number" ? templateI : lengthI) || "%s";
  let str = "";
  while (str.length < length) {
    str += random();
  }
  return cy.wrap(template.replace("%s", str.substring(0, length)));
});

declare global {
  namespace Cypress {
    interface Chainable {
      reinit: (
        config?: ReinitOpts["config"],
        db?: ReinitOpts["db"]
      ) => Cypress.Chainable<JQuery>;
      testable: (
        id: string,
        options?: Partial<Loggable & Timeoutable>
      ) => Cypress.Chainable<JQuery>;
      testableContains: (
        id: string,
        contains: string | number | RegExp,
        options?: Partial<Loggable & Timeoutable>
      ) => Cypress.Chainable<JQuery>;
      randomStr: (
        template?: string | number,
        length?: string | number
      ) => Cypress.Chainable<string>;
    }
  }
}

/*
 = Tests for src/lib/middleware/tenantchecker
 */
import { describe, it } from "mocha";
import chai from "chai";

const assert = chai.assert;

import { processTenantHeader } from "../../../src/middleware/tenantchecker";

describe("Test process tenant header", function () {
  let tests = [
    {
      name: "empty header",
      header: "",
      expected: ["public"],
    },
    {
      name: "no tenant in header",
      header: "hdjfgjdh",
      expected: ["public"],
    },
    {
      name: "no tenant name",
      header: "tenant()",
      expected: ["public"],
    },
    {
      name: "tenant test",
      header: "tenant(name=test)",
      expected: ["test"],
    },
    {
      name: "tenants pace, test",
      header: "tenant(name=pace,name=test)",
      expected: ["pace", "test"],
    },
    {
      name: "tenants test, pace",
      header: "tenant(name=test,name=pace)",
      expected: ["pace", "test"],
    },
    {
      name: "tenants three, two, one",
      header: "tenant(name=three,name=two,name=one)",
      expected: ["one", "three", "two"],
    },
    {
      name: "tenants t4, t3, t2, t1",
      header: "tenant(name=t4,name=t3,name=t2,name=t1)",
      expected: ["t1", "t2", "t3", "t4"],
    },
    {
      name: "tenants t4, t3, t2, t1, t0",
      header: "tenant(name=t4,name=t3,name=t2,name=t1,name=t0)",
      expected: ["public"],
    },
  ];
  tests.forEach(function (test) {
    it(`should succeed with ${test.name}`, function () {
      assert.deepEqual(processTenantHeader(test.header), test.expected);
    });
  });
});

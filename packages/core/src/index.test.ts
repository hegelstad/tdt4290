/* eslint-disable */
jest.mock("./utils");
import { callAPI } from "./utils";
import {
  initialize,
  followBranch,
  stringifyPath,
  filterQuery,
  aggregateQuery
} from "./index";
import { PropertyTypes, MethodTypes, ValueRangeTypes } from "./types";

test("Branches are updated correctly", async () => {
  // Mock api responses
  callAPI
    /*eslint-disable*/
    // @ts-ignore
    .mockImplementationOnce(async a => ({
      result: ["label1", "label2"] // Initial labels from initialize
    }))
    // @ts-ignore
    .mockImplementation(async (config, body) => ({
      result: body.query.endsWith(".both().label().dedup()")
        ? ["label3", "label4"] // requesting labels
        : body.query.endsWith(".inE().label().dedup()")
        ? ["edgeIn1", "edgeIn2"] // requesting edges in
        : body.query.endsWith(".outE().label().dedup()")
        ? ["edgeOut1", "edgeOut2"] // requesting edges out
        : [] // anything else (like properties)
    }));

  // @ts-ignore
  let query = await initialize({});

  expect(query.branches).toEqual([
    { type: "label", value: "label1", notValue: false },
    { type: "label", value: "label2", notValue: false }
  ]); /* eslint-enable*/

  query = await followBranch(query, {
    type: "label",
    value: "label1",
    notValue: false
  });

  expect(query.branches).toEqual([
    { type: "label", value: "label3", notValue: false },
    { type: "label", value: "label4", notValue: false },
    { type: "edge", value: "edgeIn1", direction: "in", notValue: false },
    { type: "edge", value: "edgeIn2", direction: "in", notValue: false },
    { type: "edge", value: "edgeOut1", direction: "out", notValue: false },
    { type: "edge", value: "edgeOut2", direction: "out", notValue: false }
  ]);
});

test("Basic query is buildt correctly", async () => {
  /*eslint-disable*/
  callAPI
    // @ts-ignore
    .mockImplementation(async a => ({
      result: [] // Initial labels from initialize
    }));

  // @ts-ignore
  let query = await initialize({});

  query = await followBranch(query, {
    type: "label",
    value: "label1",
    notValue: false
  });

  expect(stringifyPath(query.path)).toEqual("g.V().hasLabel('label1')");

  query = await followBranch(query, {
    type: "label",
    value: "label2",
    notValue: false
  });

  expect(stringifyPath(query.path)).toEqual(
    "g.V().hasLabel('label1').both().hasLabel('label2')"
  );
});

test("Filter query is buildt correctly", async () => {
  /*eslint-disable*/
  callAPI
    // @ts-ignore
    .mockImplementation(async a => ({
      result: [] // Initial labels from initialize
    }));

  // @ts-ignore
  let query = await initialize({});

  query = await filterQuery(
    query,
    { label: "property1", type: PropertyTypes.String },
    ["value"],
    ValueRangeTypes.Normal
  );

  expect(stringifyPath(query.path)).toEqual("g.V().has('property1', 'value')");
});

test("Aggregate query is buildt correctly", async () => {
  /*eslint-disable*/
  callAPI
    // @ts-ignore
    .mockImplementation(async a => ({
      result: [] // Initial labels from initialize
    }));

  // @ts-ignore
  let query = await initialize({});

  query = await aggregateQuery(query, {
    properties: [
      {
        label: "property1",
        type: PropertyTypes.String
      },
      {
        label: "property2",
        type: PropertyTypes.String
      }
    ],
    method: MethodTypes.Sum
  });

  expect(stringifyPath(query.path, query.aggregation)).toEqual(
    'g.V().properties("property1","property2").group().by(key).by(value().sum())'
  );
});

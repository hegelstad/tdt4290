jest.mock("./utils");
import { callAPI } from "./utils";
import { initialize, followBranch } from "./index";

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
    { type: "label", value: "label1" },
    { type: "label", value: "label2" }
  ]); /* eslint-enable*/

  query = await followBranch(query, { type: "label", value: "label1" });

  expect(query.branches).toEqual([
    { type: "label", value: "label3" },
    { type: "label", value: "label4" },
    { type: "edge", value: "edgeIn1", direction: "in" },
    { type: "edge", value: "edgeIn2", direction: "in" },
    { type: "edge", value: "edgeOut1", direction: "out" },
    { type: "edge", value: "edgeOut2", direction: "out" }
  ]);
});

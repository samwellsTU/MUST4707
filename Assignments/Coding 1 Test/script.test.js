import song from "./script.js";

test("Song has Name", () => {
  expect(song).toHaveProperty("name");
});

test("Song has Artist", () => {
  expect(song).toHaveProperty("artist");
});

test("Song has Label", () => {
  expect(song).toHaveProperty("label");
});

const song = require("./script.js");

describe("Song Object Created", () => {
  test("Song object exists", () => {
    expect(song).toBeDefined();
  });
  test("'Song' is an object", () => {
    expect(typeof song).toBe("object");
  });
});

describe("Song Object Properties", () => {
  test("Song object has a property called 'name'", () => {
    expect(song).toHaveProperty("name");
  });

  test("Song object has a property called 'album'", () => {
    expect(song).toHaveProperty("name");
  });

  test("Song object has a property called 'artist'", () => {
    expect(song).toHaveProperty("artist");
  });

  test("Song object has a property called 'duration'", () => {
    expect(song).toHaveProperty("duration");
  });

  test("The property 'duration' is a number", () => {
    expect(typeof myObject.artist).toBe("number");
  });

  test("Song object has a property called 'genre'", () => {
    expect(song).toHaveProperty("genre");
  });

  test("Song object has a property called 'label'", () => {
    expect(song).toHaveProperty("label");
  });

  test("Song object has a property called 'songwriter'", () => {
    expect(song).toHaveProperty("songwriter");
  });

  test("Song object has a property called 'producer'", () => {
    expect(song).toHaveProperty("producer");
  });
});
describe("Nested Artist object as proptery", () => {
  test("The property 'artist' is an object", () => {
    expect(typeof song.artist).toBe("object");
  });

  test("Artist property has its property called 'name'", () => {
    expect(song.artist).toHaveProperty("name");
  });

  test("Artist property has its property called 'instrument'", () => {
    expect(song.artist).toHaveProperty("instrument");
  });

  test("Artist property has its property called 'birthdate'", () => {
    expect(song.artist).toHaveProperty("birthdate");
  });
});

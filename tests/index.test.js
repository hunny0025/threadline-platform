const helloWorld = require('../src/index.js');

test('returns the correct greeting', () => {
    expect(helloWorld()).toBe('Hello, Threadline!');
});

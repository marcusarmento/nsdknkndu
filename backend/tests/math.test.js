const sum = (a, b) => a + b;

describe('sum', () => {
  it('adds two numbers', () => {
    expect(sum(1, 1)).toBe(2);
  });
});

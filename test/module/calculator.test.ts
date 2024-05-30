import Calculator from "@/module/calculator";

describe('Calculator', () => {
  it('should add two numbers', () => {
    const calculator = new Calculator();
    expect(calculator.add(40, 2)).toBe(42);
  });
});
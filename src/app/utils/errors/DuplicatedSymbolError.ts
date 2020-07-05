export default class DuplicatedSymbolError extends Error {
  constructor(args: any) {
    super(args);
    this.name = "DuplicatedSymbolError"
  }
}
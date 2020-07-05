export default class UnsupportedSymbolError extends Error {
  constructor(args: any) {
    super(args);
    this.name = "UnsupportedSymbolError"
  }
}
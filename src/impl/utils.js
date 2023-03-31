"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
class Utils {
    static loadJsonFileByName(jsonName) {
        const cwd = process.cwd();
        const json = fs_1.default.readFileSync(cwd + this.definePathByOperationSystem() + jsonName);
        return JSON.parse(json.toString());
    }
    static saveJsonFile(data, jsonName) {
        const cwd = process.cwd();
        fs_1.default.writeFileSync(cwd + this.definePathByOperationSystem() + jsonName, JSON.stringify(data, null, 2));
    }
    static definePathByOperationSystem() {
        const platform = process.platform;
        switch (platform) {
            case 'win32': {
                return "\\src\\jsons\\";
            }
            case 'linux': {
                return "/src/jsons/";
            }
        }
    }
}
exports.default = Utils;

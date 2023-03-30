import fs from "fs";

export default class Utils {
    public static loadJsonFileByName(jsonName: string) {
        const cwd = process.cwd();        
        const json = fs.readFileSync(cwd + this.definePathByOperationSystem() + jsonName);
        return JSON.parse(json.toString());
    }

    public static saveJsonFile(data: any, jsonName: string) {
        const cwd = process.cwd();  
        fs.writeFileSync(cwd + this.definePathByOperationSystem() + jsonName, JSON.stringify(data, null, 2));
    }

    private static definePathByOperationSystem() {
        const platform = process.platform;

        switch(platform) {
            case 'win32': {
                return "\\src\\jsons\\"
            }
            case 'linux': {
                return "/src/jsons/"
            }
        }
        
    }
}
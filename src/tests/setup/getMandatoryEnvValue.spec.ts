import { getMandatoryEnvValue } from "@/util";

describe("getMandatoryEnvValue", () => {
    it("show return erro when ENV not exist", () => {
        const env = "NOT_EXIST";
        expect(() => getMandatoryEnvValue(env)).toThrowError(
            `env ${env} must be defined`
        );
    });

    it("show return ENV when default value setted", () => {
        const result = getMandatoryEnvValue("EXIST", 1);
        expect(result).toEqual(1);
    });
});

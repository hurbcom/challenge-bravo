import { getMandatoryEnvValue } from "@/util";

export default {
    app: {
        name: getMandatoryEnvValue("APP_NAME", "Hurb"),
        port: getMandatoryEnvValue("APP_PORT", 3001),
        timeout: getMandatoryEnvValue("TIMEOUT", 5000) as number,
    },
};

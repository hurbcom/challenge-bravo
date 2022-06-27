export const getMandatoryEnvValue = (
    env: string,
    default_value?: string | number
) => {
    const envValue = process.env[env] || default_value;
    if (!envValue) {
        throw new Error(`env ${env} must be defined`);
    }
    return envValue;
};

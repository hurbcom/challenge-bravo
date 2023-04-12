export default {
    string: (key: string) => {
        if (process.env[key] === undefined || process.env[key] === '') {
            console.error(
                `Can't start the project, missing required env var ${key}`,
            );
            process.exit(1);
        }

        return process.env[key];
    },
    number: (key: string) => {
        if (
            process.env[key] === undefined ||
            process.env[key] === '' ||
            isNaN(parseInt(process.env[key]))
        ) {
            console.error(
                `Can't start the project, missing or invalid required env var ${key}`,
            );
            process.exit(1);
        }
        return parseInt(process.env[key]);
    },

    boolean: (key: string) => {
        if (process.env[key] !== 'false' && process.env[key] !== 'true') {
            console.error(
                `Can't start the project, missing or invalid required env var ${key}`,
            );
            process.exit(1);
        }
        return process.env[key] === 'true';
    },
};

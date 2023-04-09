import EnvironmentChecker from '../libs/environment-checker';

export interface EnvironmentVariables {
    url: string;
    port: number;
    database: {
        host: string;
        port: number;
    };
    cryptoApi: {
        url: string;
        token: string;
    };
    fiatApi: {
        url: string;
        token: string;
    };
    supportCode: string;
    refetchTimeInSeconds: number;
}

export default (): EnvironmentVariables => ({
    url: EnvironmentChecker.string('API_URL'),
    port: EnvironmentChecker.number('API_PORT'),
    database: {
        host: EnvironmentChecker.string('DATABASE_HOST'),
        port: EnvironmentChecker.number('DATABASE_PORT'),
    },
    cryptoApi: {
        url: EnvironmentChecker.string('CRYPTO_API_URL'),
        token: EnvironmentChecker.string('CRYPTO_API_TOKEN'),
    },
    fiatApi: {
        url: EnvironmentChecker.string('FIAT_API_URL'),
        token: EnvironmentChecker.string('FIAT_API_TOKEN'),
    },
    supportCode: EnvironmentChecker.string('SUPPORT_CODE'),
    refetchTimeInSeconds: EnvironmentChecker.number('REFETCH_TIME_IN_SECONDS'),
});

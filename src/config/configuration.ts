import { EnvironmentChecker } from '../libs/environment-checker';

export interface EnvironmentVariables {
    url: string;
    port: number;
}

export default (): EnvironmentVariables => ({
    url: EnvironmentChecker.string('API_URL'),
    port: EnvironmentChecker.number('API_PORT'),
});

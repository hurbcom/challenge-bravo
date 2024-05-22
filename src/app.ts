import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import currencyRoutes from './routes/currencyRoute';

export default async function app(server: FastifyInstance, opts: FastifyPluginOptions) {
    server.register(currencyRoutes);
}

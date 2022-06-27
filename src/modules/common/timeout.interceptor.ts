import env from "@/config/env";
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
    constructor(private readonly reflector: Reflector) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const response = context.switchToHttp().getResponse();
        const timeout =
            this.reflector.get<number>(
                "request-timeout",
                context.getHandler()
            ) || env.app.timeout;
        response.setTimeout(timeout);

        return next.handle();
    }
}

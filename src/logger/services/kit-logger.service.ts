import { Injectable, Scope, Logger } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class KitLogger extends Logger {
  error(message: string, trace: string): void {
    super.error(message, trace);
  }
}

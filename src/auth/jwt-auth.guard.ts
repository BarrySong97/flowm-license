import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JWTAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    // RESTful request
    return context.switchToHttp().getRequest();
  }
}

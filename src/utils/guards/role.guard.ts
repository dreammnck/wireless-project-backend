import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Role } from 'src/types';

@Injectable()
export class RolesGuard implements CanActivate {
  private role: Role;

  constructor(private readonly targetRole: Role) {
    this.role = targetRole;
  }
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    return request['user'] && request['user']['role'] === this.role;
  }
}

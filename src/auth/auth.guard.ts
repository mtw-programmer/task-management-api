import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor (private readonly usersService: UsersService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    
    const request = context.switchToHttp().getRequest();
    const session = request.session;

    if (!session || !session?.user) {
      return false;
    }

    return this.usersService.exists(session.user);
  }
}

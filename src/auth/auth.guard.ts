import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor (private readonly usersService: UsersService) {}

  canActivate(
    ctx: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    
    const context = GqlExecutionContext.create(ctx);
    const request = context.getContext().req;

    if (!request.session || !request.session?.user) {
      return false;
    }

    return this.usersService.idExists(request.session?.user);
  }
}

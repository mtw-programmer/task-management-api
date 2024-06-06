import { UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

export default async (req: any, usersService: UsersService) => {
  if (!req || !req.session.user || !await usersService.idExists(req.session.user)) {
    throw new UnauthorizedException();
  }
};

import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GraphqlService {
  constructor(
    private usersService: UsersService,
  ) {}

  private readonly logger = new Logger(GraphqlService.name);

  async getTasks():Promise<any> {

  }

  async getTags():Promise<any> {

  }
}

import { Role } from '@prisma/client';

export class PayloadDto {
  username: string;
  role: Role;
}

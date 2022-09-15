import { Role } from '@prisma/client';
import { Request } from 'express';

export type ExtendRequest = Request & {
  user: {
    username: string;
    role: Role;
  };
};

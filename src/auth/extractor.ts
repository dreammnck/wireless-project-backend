import { Request } from 'express';

export default (req: Request) => {
  if (!req.cookies || !req.cookies['token']) {
    return null;
  }
  return req.cookies['token'];
};

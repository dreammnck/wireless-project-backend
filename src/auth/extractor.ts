import { Request } from 'express';

export default (req: Request) => {
  if (!req.cookies || !req.cookies['token']) {
    return null;
  }
  console.log(req.cookies['token'])
  return req.cookies['token'];
};

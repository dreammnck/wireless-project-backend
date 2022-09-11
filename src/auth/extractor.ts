import { Request } from 'express';

export default (req: Request) => {

  if(! req.cookies || !req.complete['token']) {
    return null
  }
  return req.cookies['token']
};

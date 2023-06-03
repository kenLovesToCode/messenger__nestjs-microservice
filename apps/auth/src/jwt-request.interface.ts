import { Request } from 'express';

export interface IJwtRequest extends Request {
  jwt?: string;
}

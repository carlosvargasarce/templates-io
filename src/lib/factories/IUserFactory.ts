import { UserProps } from '@/types/user';
import { IUser } from '../models/IUser';

export interface IUserFactory {
  createUser(userData: UserProps, answers: string[]): IUser;
}

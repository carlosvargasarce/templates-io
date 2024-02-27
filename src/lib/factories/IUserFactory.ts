import { UserProps } from '@/types/user';
import { User } from '../models/User';

export interface IUserFactory {
  createUser(userData: UserProps, answers: string[]): User;
}

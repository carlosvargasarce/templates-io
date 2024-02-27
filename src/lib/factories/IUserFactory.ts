import { UserProps } from '@/types/user';

export interface IUserFactory {
  createUser(userData: any, answers: string[]): UserProps;
}

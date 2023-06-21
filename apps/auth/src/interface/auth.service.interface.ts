import { UserJwt } from '@app/shared';
import { ExistingUserDTO } from '../dto/existing-user.dto';
import { NewUserDTO } from '../dto/new-user.dto';
import { UserEntity } from '../entities/user.entity';
import { FriendRequestEntity } from '../entities/friend-request.entity';

export interface AuthServiceInterface {
  getUsers(): Promise<UserEntity[]>;
  findByEmail(email: string): Promise<UserEntity>;
  hashPassword(password: string): Promise<string>;
  register(newUser: Readonly<NewUserDTO>): Promise<UserEntity>;
  doesPasswordMatch(password: string, hashedPassword: string): Promise<boolean>;
  validateUser(email: string, password: String): Promise<UserEntity>;
  login(
    existingUser: Readonly<ExistingUserDTO>,
  ): Promise<{ token: string; user: UserEntity }>;
  verifyJwt(jwt: string): Promise<{ user: UserEntity; exp: string }>;
  getUserFromHeader(jwt: string): Promise<UserJwt>;
  addFriend(userId: number, friendId: number): Promise<FriendRequestEntity>;
  getFriends(userId: number): Promise<FriendRequestEntity[]>;
}

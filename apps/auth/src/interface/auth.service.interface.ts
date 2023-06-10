import { ExistingUserDTO } from '../dto/existing-user.dto';
import { NewUserDTO } from '../dto/new-user.dto';
import { UserEntity } from '../entities/user.entity';

export interface AuthServiceInterface {
  getUsers(): Promise<UserEntity[]>;
  findByEmail(email: string): Promise<UserEntity>;
  hashPassword(password: string): Promise<string>;
  register(newUser: Readonly<NewUserDTO>): Promise<UserEntity>;
  doesPasswordMatch(password: string, hashedPassword: string): Promise<boolean>;
  validateUser(email: string, password: String): Promise<UserEntity>;
  login(existingUser: Readonly<ExistingUserDTO>);
  verifyJwt(jwt: string): Promise<{ exp: string }>;
}

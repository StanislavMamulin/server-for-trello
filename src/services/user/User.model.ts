export interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    token?: string;
    accessLevel: AccessLevel;
    gender: string;
    registrationDate: Date;
}

export type IUserParams = Omit<IUser, 'id' | 'token' | 'registrationDate'>;

export type UserEditParams = Partial<Pick<IUser, 'firstName' | 'lastName' | 'password' | 'gender'>>;

export type UserProfile = Omit<IUser, 'password' | 'token'>;

export type UserRegistration = Pick<
    IUser,
    'firstName' | 'lastName' | 'email' | 'password' | 'gender'
>;

export type UserLogin = Pick<IUser, 'email' | 'password'>;

export enum AccessLevel {
    'Admin',
    'User',
    'Anonymous',
}

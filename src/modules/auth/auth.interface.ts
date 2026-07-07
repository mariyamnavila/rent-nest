import { UserRole } from "../../../generated/prisma/enums";

export interface IRegisterUser {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    phone?: string;
    profileImage?: string;
}

export interface ILoginUser {
    email: string;
    password: string
}

export interface IUpdateUser {
    name?: string;
    phone?: string;
    profileImage?: string
}
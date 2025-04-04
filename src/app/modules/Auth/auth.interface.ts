
export interface ILoginUser {
    email: string;
    password: string
}

export interface IVerifyOTp {
    email: string;
    otp: string;
}

export interface INewPassword {
    email: string;
    otp: string;
    password: string
}

export interface IChangePass {
    currentPassword: string;
    newPassword: string;
}

export interface OAuth {
    provider: 'google' | 'apple';
    idToken: string;
}
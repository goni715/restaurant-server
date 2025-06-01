
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

export type TSocialLoginPayload = {
  email: string;
  fcmToken: string;
  provider: 'GOOGLE' | 'APPLE';
  image: string;
  fullName: string;
  phoneNumber: string;
  address: string;
};

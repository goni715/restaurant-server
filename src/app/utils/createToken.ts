import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';

export type TExpiresIn = number | `${number}${'s' | 'm' | 'h' | 'd'}`

type TPayload = {
    email: string;
    id: string;
    role: 'user' | 'admin' | 'super_admin' | "administrator"
}

const createToken = (payload: TPayload, secretKey: Secret, expiresIn: TExpiresIn) => {
    const options: SignOptions = {
        algorithm: "HS256",
        expiresIn, // This can be a number (e.g., 3600) or a string (e.g., "1h")
    };

    const token = jwt.sign(payload, secretKey, options);
    return token;
};

 export default createToken;
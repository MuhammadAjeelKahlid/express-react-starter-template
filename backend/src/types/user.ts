import "multer";
interface CreateUserInput {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    profileIcon: string,
    profileIconFile?: Express.Multer.File;
    dob?: Date;
    city?: string;
    state?: string;
    country?: string;
    ipAddress?: string;
}

interface JwtPayload {
    userId: string;
    email: string;
    role: string;
}


export type { CreateUserInput }
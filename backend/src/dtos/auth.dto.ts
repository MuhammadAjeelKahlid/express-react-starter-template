import { User } from "@/database/entity/User.entity";

export class SuccessResponseDto<T = any> {
    constructor(public message: string, public data?: T) { }
}
export class LoginResponseDto {
    constructor(public accessToken: string, public refreshToken: string) { }
}


export class SafeUserDto {
    constructor(user: User) {
        Object.assign(this, {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            profileIcon: user.profileIcon,
            role: user.role,
            dob: user.dob,
            city: user.city,
            state: user.state,
            country: user.country,
            emailVerified: user.emailVerified,
            ipAddress: user.ipAddress,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    }
}
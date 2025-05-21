import { User } from "@/database/entity/User.entity";

export const tokenPayload = (user: User) => {
    return {
        id: user.id,
        email: user.email,
        role: user.role,
        profileIcon: user.profileIcon
    }
};
export class SuccessResponseDto {
    constructor(public message: string) { }
}

export class LoginResponseDto {
    constructor(public accessToken: string, public refreshToken: string) { }
}

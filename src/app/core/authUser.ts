export class AuthUser{
    constructor(
        public name?: string,
        public email?: string,
        public photo?: any
    ){}
}

export class UserProfile{
    constructor(
        public name?: string,
        public email?: string,
        public jobTitle?: string,
        public phone?: string,
        public location?: string,
        public connection?: string,
        public photo?: any,
        public rank?: number
    ){}
}
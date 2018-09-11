export class AuthUser{
    constructor(
        public name?: string,
        public email?: string,
        public photo?: any
    ){}
}

export class UserProfile{
    constructor(
        public email?: string,
        public connection?: string,
        public rank?: number,
        public name?: string,
        public jobTitle?: string,
        public phone?: string,
        public location?: string,
        public photo?: any
    ){}
}
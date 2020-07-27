export class UserModel{
    constructor(
        public _id: String,
        public name: String,
        public username: String,
        public email: String,
        public password: String,
        public role: String,
        public image: String
    ){}
}
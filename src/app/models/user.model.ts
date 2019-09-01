export class User {
    constructor (
        public email: string,
        public password: string,
        public phoneNumber: string,
        public sponsor: number,
        public DNI?: number,
        public name?: string,
        public lastname?: string,
        public arm?: number,
        public photoURL?: string,
        public address?: string,
        public id?: string,
        public newPassword?: string,
        public city?: string,
        public country?: string,
        public points?: number,
        public rank?: string,
        public postalCode?: string,
        public file?: File
    ) {}
}

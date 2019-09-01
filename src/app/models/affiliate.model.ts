
export class Affiliate {
    constructor (
        public DNI: number,
        public email: string,
        public arm: number,
        public by: string,
        public sponsor: any = {
            DNI: null,
            name: '',
            lastname: '',
            rank: ''
        }
    ) {}
}

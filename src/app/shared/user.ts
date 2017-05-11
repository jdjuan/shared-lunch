export class User {
    active: boolean;
    currentMatch: string;
    email: string;
    firstName: string;
    lastName: string;
    location: number;
    matchConfirmed: boolean;
    matches: Matches[];
}
export interface Matches {
    [id: string]: number;
}


export class User {

    static createUsers(users: User[]): User[] {
        return users.map((user: User) => User.createUser(user));
    }

    static createUser(user: User): User {
        return new User(
            user.$key,
            user.$exists,
            user.active,
            user.currentMatch,
            user.email,
            user.firstName,
            user.lastName,
            user.location,
            user.matchConfirmed,
            user.matches
        );
    }

    constructor(
        public $key: string,
        public $exists: boolean,
        public active: boolean,
        public currentMatch: string,
        public email: string,
        public firstName: string,
        public lastName: string,
        public location: number,
        public matchConfirmed: boolean,
        public matches: Matches[]
    ) { }

    isNewUser(): boolean {
        return !this.hasMatched() && !this.hasCurrentMatch();
    }

    hasCurrentMatch(): boolean {
        return this.currentMatch !== 'NO_MATCH_SET';
    }

    hasMatched(): boolean {
        return this.matches ? !Object.keys(this.matches).length : false;
    }

    getMatch(users: User[]) {
        const selectedUser = this.selectRandomMatch(this.getPossibleMatches(users));
        return selectedUser ? selectedUser : 'NO_MATCH_FOUND';
    }

    getPossibleMatches(users: User[]): User[] {
        const availableUsers: User[] = [];
        const filteredUsers: User[] = this.filterUsersByLocation(users, this.location);
        filteredUsers.forEach((user: User) => {
            if (this.$key !== user.$key && !user.hasCurrentMatch()) {
                availableUsers.push(user);
            }
        });
        return availableUsers;
    }

    filterUsersByLocation(users: User[], location: number): User[] {
        const availableUsers: User[] = users
            .filter((user: User) => location === 2 || location === user.location);
        return availableUsers.length ? availableUsers : users;
    }

    selectRandomMatch(possibleMatches: User[]): User {
        return possibleMatches[this.getRandomNumber(possibleMatches.length)];
    }

    getRandomNumber(limit: number): number {
        return Math.trunc(Math.random() * limit);
    }

}
export interface Matches {
    [id: string]: number;
}


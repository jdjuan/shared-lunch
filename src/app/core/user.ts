import { IMatches } from './definitions/imatches';
export class User {

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
        public matches: IMatches
    ) { }

    isActive() {
        return this.active;
    }

    isNewUser(): boolean {
        return !this.hasMatched() && !this.currentMatch;
    }

    hasMatched(): boolean {
        return this.matches ? true : false;
    }

    getFullName(): string {
        return this.firstName + ' ' + this.lastName;
    }

    match(users: User[]) {
        if (this.active) {
            const matches: User[] = this.getPossibleMatches(users);
            if (matches.length) {
                const userRight: User = this.selectRandomMatch(matches);
                userRight.currentMatch = this.$key;
                this.currentMatch = userRight.$key;
                return userRight;
            } else {
                alert('No one available for ' + this.getFullName());
                return null;
            }
        }
    }

    getPossibleMatches(users: User[]): User[] {
        const availableUsers: User[] = [];
        let filteredUsers: User[] = this.filterFitUsers(users);
        filteredUsers = this.filterRepeatedMatches(filteredUsers);
        filteredUsers = this.filterUsersByLocation(filteredUsers);
        filteredUsers.forEach((userRight: User) => availableUsers.push(userRight));
        return availableUsers;
    }

    filterFitUsers(users: User[]): User[] {
        return users.filter((user: User) => {
            return user.isActive() && !user.currentMatch && this.$key !== user.$key;
        });
    }

    filterRepeatedMatches(users: User[]): User[] {
        const availableUsers: User[] = users
            .filter((user: User) => this.isUserInMatches(user.$key));
        return availableUsers.length ? availableUsers : users;
    }

    filterUsersByLocation(users: User[]): User[] {
        const availableUsers: User[] = users
            .filter((user: User) => this.location === 2 || user.location === 2  || this.location === user.location);
        return availableUsers.length ? availableUsers : users;
    }


    isUserInMatches(id: string) {
        if (this.matches) {
            for (const matchId of Object.keys(this.matches)) {
                if (matchId === id) {
                    return true;
                }
            }
        }
        return false;
    }

    selectRandomMatch(possibleMatches: User[]): User {
        return possibleMatches[this.getRandomNumber(possibleMatches.length)];
    }

    getRandomNumber(limit: number): number {
        return Math.trunc(Math.random() * limit);
    }
}
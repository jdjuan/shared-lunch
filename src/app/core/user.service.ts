import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { User } from './user';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserService {

    users: User[];
    filter: string[];
    cachedUsers: { [id: string]: User } = {};

    constructor(private db: AngularFireDatabase) {
        this.fetchUsers().subscribe((users: User[]) => {
            this.users = users;
            if (!this.filter) {
                this.showAll();
            }
        });
    }

    fetchUsers(): Observable<[User]> {
        return this.db.list('/users').map((users: User[]) => users.map((user: User) => {
            const userInstance = User.createUser(user);
            this.cachedUsers[user.$key] = userInstance;
            return userInstance;
        }));
    }

    isIn(user: User): boolean {
        return this.filter.includes(user.$key);
    }

    showAll() {
        this.filter = Object.keys(this.cachedUsers);
    }

    filterUsersThatHaveMatched(haveMatched: boolean) {
        this.filter = [];
        this.users.forEach((user: User) => {
            const filterUser = haveMatched ? user.hasMatched() : !user.hasMatched();
            if (filterUser) {
                this.filter.push(user.$key);
            }
        });
    }

    filterUsersWithCurrentMatch(withCurrentMatch: boolean) {
        this.filter = [];
        this.users.forEach((user: User) => {
            const filterUser = withCurrentMatch ? user.currentMatch : !user.currentMatch;
            if (filterUser) {
                this.filter.push(user.$key);
            }
        });
    }

    filterConfirmed(confirmed) {
        this.filter = [];
        this.users.forEach((user: User) => {
            const filterUser = confirmed ? user.matchConfirmed : !user.matchConfirmed;
            if (filterUser) {
                this.filter.push(user.$key);
            }
        });
    }

    filterInactiveUsers() {
        this.filter = [];
        this.users.forEach((user: User) => {
            if (!user.isActive()) {
                this.filter.push(user.$key);
            }
        });
    }

    matchAllUsers() {
        this.users.forEach((user: User) => this.matchUser(user));
    }

    matchUser(userLeft: User) {
        if (!userLeft.currentMatch) {
            const userRight: User = userLeft.match(this.users);
            if (userRight) {
                this.db.object('/users/' + userLeft.$key).update({ 'currentMatch': userRight.$key });
                this.db.object('/users/' + userRight.$key).update({ 'currentMatch': userLeft.$key });
            }
        }
    }

    unmatchUser(userLeft: User) {
        if (userLeft.currentMatch) {
            const userRight: User = this.getUserById(userLeft.currentMatch);
            this.db.object('/users/' + userLeft.$key).update({ 'currentMatch': '' });
            this.db.object('/users/' + userRight.$key).update({ 'currentMatch': '' });
        }
    }

    confirmAllMatches() {
        this.users.forEach((user: User) => this.confirmMatch(user));
    }

    confirmMatch(userLeft: User) {
        if (userLeft.currentMatch && !userLeft.matchConfirmed) {
            const userRight: User = this.getUserById(userLeft.currentMatch);
            this.db.object('/users/' + userLeft.$key).update({ 'matchConfirmed': true });
            this.db.object('/users/' + userRight.$key).update({ 'matchConfirmed': true });
        }
    }

    unconfirmMatch(userLeft: User) {
        if (userLeft.currentMatch && userLeft.matchConfirmed) {
            const userRight: User = this.getUserById(userLeft.currentMatch);
            this.db.object('/users/' + userLeft.$key).update({ 'matchConfirmed': false });
            this.db.object('/users/' + userRight.$key).update({ 'matchConfirmed': false });
        }
    }

    settleAllMatches() {
        this.users.forEach((user: User) => this.settleMatch(user));
    }

    settleMatch(userLeft: User) {
        if (userLeft.currentMatch && userLeft.matchConfirmed) {
            const userRight: User = this.getUserById(userLeft.currentMatch);
            if (userRight.currentMatch && userRight.matchConfirmed) {
                this.db.database
                    .ref('/users/' + userLeft.$key + '/matches/' + userRight.$key)
                    .transaction((oldValue) => oldValue ? oldValue + 1 : 1, this.onTransactionError, true);
                this.db.database
                    .ref('/users/' + userRight.$key + '/matches/' + userLeft.$key)
                    .transaction((oldValue) => oldValue ? oldValue + 1 : 1, this.onTransactionError, true);
                this.db.object('/users/' + userLeft.$key).update({ 'currentMatch': '', 'matchConfirmed': false });
                this.db.object('/users/' + userRight.$key).update({ 'currentMatch': '', 'matchConfirmed': false });
            }
        }
    }

    getUserFullName(id: string): string {
        return id ? this.getUserById(id).getFullName() : '';
    }

    getUserById(id: string): User {
        const user: User = this.cachedUsers[id];
        if (!user) {
            console.log('Cannot find user', id);
        }
        return user;
    }

    onTransactionError(error, committed, snapshot) {
        if (error) {
            console.log('error in transaction');
        } else if (!committed) {
            console.log('transaction not committed');
        } else {
            console.log('Transaction Committed');
        }
    }
}
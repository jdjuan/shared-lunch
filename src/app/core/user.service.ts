import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { User } from './user';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserService {

    users: User[];
    filteredUsers: User[];
    private cachedUsers: { [id: string]: User } = {};

    constructor(private db: AngularFireDatabase) {
        this.fetchUsers().subscribe((users: User[]) => {
            this.users = users;
            if (!this.filteredUsers) {
                this.filteredUsers = users;
            } else {
                this.filteredUsers = this.filteredUsers.map((user: User) => {
                    return this.cachedUsers[user.$key];
                });
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

    showAll() {
        this.filteredUsers = this.users;
    }

    filterUsersThatHaveMatched(haveMatched: boolean) {
        this.filteredUsers = this.users
            .filter((user: User) => haveMatched ? user.hasMatched() : !user.hasMatched());
    }

    filterUsersWithCurrentMatch(withCurrentMatch: boolean) {
        this.filteredUsers = this.users
            .filter((user: User) => withCurrentMatch ? user.currentMatch : !user.currentMatch);
    }

    filterConfirmed(confirmed) {
        this.filteredUsers = this.users
            .filter((user: User) => confirmed ? user.matchConfirmed : !user.matchConfirmed);
    }

    filterInactiveUsers() {
        this.filteredUsers = this.users.filter((user: User) => !user.isActive());
    }

    matchAllUsers() {
        this.users.forEach((user: User) => this.matchUser(user));
    }

    matchUser(user: User) {
        if (user.currentMatch) {
            const oldMatch: User = this.getUserById(user.currentMatch);
            user.currentMatch = null;
            user.match(this.users);
            oldMatch.currentMatch = null;
        } else {
            user.match(this.users);
        }
    }

    unmatchUser(user: User) {
        this.getUserById(user.currentMatch).currentMatch = null;
        user.currentMatch = null;
    }

    confirmAllMatches() {
        this.users.forEach((user: User) => this.confirmMatch(user));
    }

    confirmMatch(userLeft: User) {
        if (userLeft.currentMatch) {
            const userRight = this.getUserById(userLeft.currentMatch);
            this.db.object('/users/' + userLeft.$key).update({ 'matchConfirmed': true, 'currentMatch': userRight.$key });
            this.db.object('/users/' + userRight.$key).update({ 'matchConfirmed': true, 'currentMatch': userLeft.$key });
        }
    }

    settleAllMatches() {
        this.users.forEach((user: User) => this.settleMatch(user));
    }

    settleMatch(userLeft: User) {
        if (userLeft.currentMatch && userLeft.matchConfirmed) {
            const userRight = this.getUserById(userLeft.currentMatch);
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
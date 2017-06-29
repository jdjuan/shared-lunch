import { User } from './user';
import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {

    template: string;
    users: User[];
    filter: string[];
    cachedUsers: { [id: string]: User } = {};
    columns = ['#', 'Name', 'ID', 'Location', 'Match', 'Matches', 'Options'];

    constructor(private db: AngularFireDatabase, private http: Http, private angularFireAuth: AngularFireAuth) {
        this.fetchUsers().subscribe((users: User[]) => {
            this.users = users;
            if (!this.filter) {
                this.filter = Object.keys(this.cachedUsers);
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

    sendUsersLunches(leftUser: User) {
        this.angularFireAuth.auth.currentUser.getToken().then(token => {
            console.log('token',token);
            const bodyHttp = {
                'userLeft': 'juan.herrera@yuxiglobal.com',
                'userRight': 'david.juanherrera@gmail.com',
                'subject': 'soy un subject',
                'text': '<h1>soy el titulo de la cabecera </h1> <p> harlen 👻 😞 </p>',
                'uid': token
            };
            this.http.post(
                'http://localhost:3000/api/validtoken',
                bodyHttp
            ).subscribe(
                success => console.log(success),
                err => console.log(err),
                () => console.log('Request Complete'));
        }).catch(function (error) {
            console.log('couldnt get user token');
        });
    }
    generateTemplate(leftUser: User) {
        const rightUser: User = this.getUserById(leftUser.currentMatch);
        this.template = `
¡Nuevo Almuerzo Compartido!
Hola ${leftUser.firstName} y ${rightUser.firstName},

¡Ustedes tendrán un almuerzo compartido! Woohoo!

En Almuerzo Compartido nos gusta conocer al otro, comprender quién es esa persona que viene a trabajar al mismo lugar que tú. Pueden conversar de cualquier cosa: el Giro d'Italia, los carros que se conducen solos o su libro favorito.
Toma tú la iniciativa y saluda primero:    

${leftUser.email} 
${rightUser.email}

A partir de este momento quedan en contacto para ir a almorzar juntos.

PD: Recuerda que si llegaste a Yuxi en el último mes, tú y tu pareja tendrán un almuerzo GRATUITO!. Si aplicas déjanoslo saber para explicarte las condiciones.

¡Un saludo!
Juan Herrera
Con el Apoyo de Yuxi Global`;
    }

    isIn(user: User): boolean {
        return this.filter.includes(user.$key);
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
        } else if (userLeft.currentMatch) {
            const userRight: User = this.getUserById(userLeft.currentMatch);
            this.db.object('/users/' + userLeft.$key).update({ 'currentMatch': '' });
            this.db.object('/users/' + userRight.$key).update({ 'currentMatch': '' });
        }
    }

    confirmAllMatches() {
        this.users.forEach((user: User) => this.confirmMatch(user));
    }

    confirmMatch(userLeft: User) {
        const userRight: User = this.getUserById(userLeft.currentMatch);
        if (userLeft.currentMatch && !userLeft.matchConfirmed) {
            this.db.object('/users/' + userLeft.$key).update({ 'matchConfirmed': true });
            this.db.object('/users/' + userRight.$key).update({ 'matchConfirmed': true });
        } else if (userLeft.currentMatch && userLeft.matchConfirmed) {
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

    changeUserState(user: User) {
        this.db.object('/users/' + user.$key).update({ 'active': !user.active });
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
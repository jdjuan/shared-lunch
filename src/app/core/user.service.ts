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

    addUsers() {
        const users = this.db.list('/users');
        users.push({
            'active': true,
            'currentMatch': '',
            'email': 'milena.mora@yuxiglobal.com',
            'firstName': 'Milena',
            'lastName': 'Mora',
            'location': 1,
            'matchConfirmed': false,
            'matches': ''});
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
            const rightUser = this.getUserById(leftUser.currentMatch);
            const bodyHttp = {
                'userLeft': leftUser.email,
                'userRight': rightUser.email,
                'subject': '🎉🎉 ¡Nuevo Almuerzo Compartido! 🎉🎉',
                'text': this.getTemplate(leftUser, rightUser),
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

    getTemplate(leftUser: User, rightUser: User) {
        return `<h1>🎈 ¡Tienes un nuevo almuerzo compartido! 🎈</h1>
            <p>
            Hola ${leftUser.firstName} y ${rightUser.firstName}, <br><br>

            ¡Ustedes tendrán un almuerzo compartido! Ésta es su oportunidad de conocer al otro, saber cuál es su labor en Yuxi, de dónde es, o qué música le gusta 😊 A veces somos tímidos o simplemente no tenemos tiempo. Con Almuerzo Compartido tendrás una excusa para compartir 😃<br><br>

            Pueden hablar de muchos temas, por ejemplo el conflicto entre Corea del Norte y Estados Unidos, este maravilloso <a href="https://vimeo.com/225045336">corto</a> sobre los secretos de pareja o su música favorita. 😄
            </p>
            <h2>Toma tú la iniciativa y saluda primero:</h2>

            <h3>${leftUser.email}</h3>
            <h3>${rightUser.email}</h3>
    
            <p>
            A partir de este momento quedan en contacto para ir a almorzar juntos. Pueden ir cualquier día, pero no dejes que pase mucho tiempo! 😲<br><br>

            PD: Recuerda que si llegaste a Yuxi en el último mes, tú y tu pareja tendrán un almuerzo GRATUITO! Si aplicas déjanoslo saber para explicarte las condiciones.<br><br>

            ¡Un saludo!<br>
            Juan Herrera<br><br>
            Con el Apoyo de Yuxi Global
            </p>`;
    }

    generateTemplate(leftUser: User) {
        const rightUser: User = this.getUserById(leftUser.currentMatch);
        this.template = ``;
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
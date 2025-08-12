import { Injectable } from '@angular/core';
import {
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {BehaviorSubject, from, Observable} from 'rxjs';
import {app} from '../../../firebaseConfig';

const auth = getAuth(app);

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);

  constructor() {
    onAuthStateChanged(auth, (user) => {
      this.userSubject.next(user);
    });
  }

  loginUser(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(auth, email, password));
  }

  logoutUser(): Observable<void> {
    return from(signOut(auth));
  }

  registerUser(email: string, password: string) {
    return from(createUserWithEmailAndPassword(auth, email, password));
  }

  isLoggedIn(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          observer.next(true);
        } else {
          observer.next(false);
        }
        observer.complete();
      });
    });
  }

  getCurrentUser(): Observable<User | null> {
    return this.userSubject.asObservable();
  }
}

import { Injectable } from '@angular/core';
import {
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  User,
  updatePassword
} from 'firebase/auth';
import {BehaviorSubject, from, map, Observable} from 'rxjs';
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
    return this.userSubject.asObservable().pipe(
      map(user => !!user)
    );
  }

  getCurrentUser(): Observable<User | null> {
    return this.userSubject.asObservable();
  }

  updatePassword(newPassword: string): Observable<void> {
    const user = this.userSubject.getValue();
    if (user) {
      return from(updatePassword(user, newPassword));
    } else {
      return from(Promise.reject('No user is currently logged in.'));
    }
  }
}

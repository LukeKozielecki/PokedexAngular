import { Injectable } from '@angular/core';
import {
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
  getAuth,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { from, Observable } from 'rxjs';
import {app} from '../../../firebaseConfig';

const auth = getAuth(app);

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  loginUser(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(auth, email, password));
  }

  logoutUser(): Observable<void> {
    return from(signOut(auth));
  }

  registerUser(email: string, password: string) {
    return from(createUserWithEmailAndPassword(auth, email, password));
  }
}

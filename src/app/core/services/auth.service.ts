import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, user } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser$;
  constructor(private auth: Auth, private router: Router) {
      this.currentUser$ = user(this.auth);

  }

  // Register with Email & Password
  async register(email: string, password: string) {
    const result = await createUserWithEmailAndPassword(this.auth, email, password);
    await this.router.navigate(['/dashboard']);
    return result;
  }

  // Login with Email & Password
  async login(email: string, password: string) {
    const result = await signInWithEmailAndPassword(this.auth, email, password);
    await this.router.navigate(['/dashboard']);
    return result;
  }

  // Google Sign In
  async googleSignIn() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(this.auth, provider);
    await this.router.navigate(['/dashboard']);
    return result;
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }
}
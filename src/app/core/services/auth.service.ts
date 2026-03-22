import { Injectable } from '@angular/core';
import {
  Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, signOut, user, updateProfile
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { signInAnonymously } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser$;

  constructor(
    private auth: Auth,
    private router: Router,
    private snackBar: MatSnackBar,
    private title: Title,
    private firestore: Firestore
  ) {
    this.currentUser$ = user(this.auth);
  }

  public showError(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar']
    });
  }

  public showSuccess(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['success-snackbar']
    });
  }

 private getErrorMessage(error: any): string {
  const code = error?.code || error?.message || '';

  switch (code) {
    // Register Errors
    case 'auth/email-already-in-use':
    case 'EMAIL_EXISTS':
      return 'This email is already registered. Please login instead.';

    case 'auth/weak-password':
      return 'Password is too weak. Use at least 6 characters.';

    // Login Errors
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Invalid email or password. Please check and try again.';

    case 'auth/invalid-credential':
    case 'auth/invalid-email':
      return 'Invalid email or password. Please try again.';

    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please wait a few minutes and try again.';

    case 'auth/popup-closed-by-user':
      return 'Sign in was cancelled.';

    case 'auth/network-request-failed':
    case 'auth/timeout':
      return 'Network error. Please check your internet connection and try again.';

    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';

    // Google / Microsoft / OAuth specific
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with the same email but different sign-in method. Try signing in with Google or Email.';

    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled. Please contact the app owner.';

    default:
      // Clean up Firebase message
      let msg = error?.message || 'Something went wrong. Please try again.';
      msg = msg.replace('Firebase: ', '').replace(/\(auth\/.*?\)/, '').trim();
      return msg || 'An unexpected error occurred. Please try again.';
  }
}

  async register(email: string, password: string, fullName: string) {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password,);

      // Update user profile with full name
      await updateProfile(result.user, {
        displayName: fullName
      });

      // Save complete user info to Firestore
      const userRef = doc(this.firestore, 'users', result.user.uid);
      await setDoc(userRef, {
        uid: result.user.uid,
        email: result.user.email,
        fullName: fullName,
        displayName: fullName,
        photoURL: result.user.photoURL || '',
        provider: 'email',
        createdAt: new Date(),
        lastLogin: new Date()
      });

      this.showSuccess('Account created successfully! 🎉');
      await this.router.navigate(['/app/dashboard']);
      return result;
    } catch (error: any) {
      const message = this.getErrorMessage(error);
      this.showError(message);
      console.error('Register error:', error);
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      this.showSuccess('Welcome back! 👋');
      await this.router.navigate(['/app/dashboard']);
      return result;
    } catch (error: any) {
      const message = this.getErrorMessage(error);
      this.showError(message);
      throw error;
    }
  }

  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);

      // Save full name from Google
      const fullName = result.user.displayName || 'User';

      const userRef = doc(this.firestore, 'users', result.user.uid);
      await setDoc(userRef, {
        uid: result.user.uid,
        email: result.user.email,
        fullName: fullName,
        displayName: fullName,
        photoURL: result.user.photoURL || '',
        provider: 'google',
        createdAt: new Date(),
        lastLogin: new Date()
      }, { merge: true });

      this.showSuccess('Signed in with Google successfully!');
      await this.router.navigate(['/app/dashboard']);
      return result;
    } catch (error: any) {
      debugger
      const message = this.getErrorMessage(error);
      this.showError(message);
      throw error;
    }
  }

  async signInAsGuest() {
    try {
      const result = await signInAnonymously(this.auth);
      const userRef = doc(this.firestore, 'users', result.user.uid);
      await setDoc(userRef, {
        uid: result.user.uid,
        email: null,
        fullName: 'Guest User',
        displayName: 'Guest',
        provider: 'anonymous',
        createdAt: new Date(),
        lastLogin: new Date(),
        isGuest: true
      }, { merge: true });

      this.showSuccess('Welcome Guest! You can upload and view photos temporarily.');
      await this.router.navigate(['/app/dashboard']);
      return result;
    } catch (error: any) {
      const message = this.getErrorMessage(error);
      this.showError(message);
      throw error;
    }
  }
  async signInWithFacebook() {
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(this.auth, provider);

      // Save full name from Facebook
      const fullName = result.user.displayName || 'User';

      const userRef = doc(this.firestore, 'users', result.user.uid);
      await setDoc(userRef, {
        uid: result.user.uid,
        email: result.user.email,
        fullName: fullName,
        displayName: fullName,
        photoURL: result.user.photoURL || '',
        provider: 'facebook',
        createdAt: new Date(),
        lastLogin: new Date()
      }, { merge: true });

      this.showSuccess('Signed in with Facebook successfully!');
      await this.router.navigate(['/app/dashboard']);
      return result;
    } catch (error: any) {
      const message = this.getErrorMessage(error);
      this.showError(message);
      throw error;
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
      this.router.navigate(['/login']);
    } catch (error) {
      this.showError('Failed to logout. Please try again.');
    }
  }

  setTitle(Pagetitle: string) {
    this.title.setTitle(Pagetitle);
  }
}

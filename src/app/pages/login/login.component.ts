import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  showEmailFields = false;
  email = '';
  password = '';
  loading = false;
  constructor(private auth: AuthService) { };

  async onGoogle() {
    this.loading = true;
    try {
      await this.auth.signInWithGoogle();
    } catch (err: any) {
    } finally {
      this.loading = false;
    }
  }

  async onLogin() {
    this.loading = true;

    // Basic Validation
    if (!this.email.trim()) {
      this.auth.showError('Email is required');
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.auth.showError('Please enter a valid email address');
      return;
    }

    if (!this.password) {
      this.auth.showError('Password is required');
      return;
    }

    if (this.password.length < 6) {
      this.auth.showError('Password must be at least 6 characters');
      return;
    }
    try {
      await this.auth.login(this.email.trim(), this.password);
    } catch (err) {
      // Error is already shown via Snackbar in service
    } finally {
      this.loading = false;
    }
  }

  // Simple email validation
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async onGuest() {
    this.loading = true;
    try {
      await this.auth.signInAsGuest();
    } catch (err) {
      // Error handled by Snackbar in service
    } finally {
      this.loading = false;
    }
  }

  showEmail() {
    this.showEmailFields = true;
  }

  backToSocial() {
    this.showEmailFields = false;
  }
}

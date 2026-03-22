import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  showEmailFields = false;
  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';
  loading = false;
  constructor(private auth: AuthService) { };

  ngOnInit(): void {
    this.auth.setTitle('QuickPic | Register');
  }

  async onRegister() {
    if (!this.fullName.trim()) {
      this.auth.showError('Full name is required');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.auth.showError('Passwords do not match');
      return;
    }
    this.loading = true;
    try {
      await this.auth.register(this.email, this.password, this.fullName.trim());
    } catch (err: any) {
    } finally {
      this.loading = false;
    }
  }

  async onGoogle() {
    this.loading = true;
    try {
      await this.auth.signInWithGoogle();
    } catch (err: any) {
    } finally {
      this.loading = false;
    }
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

  async onFacebook() {
    this.loading = true;
    try {
      await this.auth.signInWithFacebook();
    } catch (err: any) {
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

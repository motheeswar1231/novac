import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

import '@lottiefiles/dotlottie-web';
import { AuthSignin } from './auth-signin';


@Component({
  selector: 'app-auth-signin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss']
})
export class AuthSigninComponent {
  
  constructor(private router: Router,private authService : AuthSignin) {}

  showPopup = true;
  termsAccepted = false;
  privacyAccepted = false;
  doctorAccepted = false;
  showPassword = false;
  showSignupPopup = false;

  loginData = {
    username: '',
    password: ''
  };

  doctor = {
    firstName: '',
    lastName: '',
    phone: '',
    department: '',
    username: '',
    password: '',
    confirmPassword: ''
  };

  get canAgree(): boolean {
    return (
      this.termsAccepted &&
      this.privacyAccepted &&
      this.doctorAccepted
    );
  }


  onTermsChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.termsAccepted = checkbox.checked;
  }


  onPrivacyChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.privacyAccepted = checkbox.checked;
  }


  onDoctorChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.doctorAccepted = checkbox.checked;
  }


  agree(): void {

    if (!this.canAgree) {
      return;
    }

    this.showPopup = false;
  }


  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }


  
login(): void {

  if (!this.loginData.username || !this.loginData.password) {

    this.showMessage(
      'Invalid Login Details',
      'Please enter valid details to login.',
      'warning'
    );

    return;
  }

  this.authService.login(
    this.loginData.username,
    this.loginData.password
  ).subscribe({

    next: (response: any) => {

      console.log('Login successful:', response);

      if (response.token) {
        localStorage.setItem('token', response.token);
      }

      if (response.user) {
        localStorage.setItem(
          'user',
          JSON.stringify(response.user)
        );
      }

      this.router.navigate(['/dashboard']);
    },

    error: (error: any) => {

      console.error('Login failed:', error);

      this.showMessage(
        'Login Failed',
        'Please enter valid details to login.',
        'error'
      );
    }
  });
}

  openSignupPopup(): void {
    this.showSignupPopup = true;
  }


  closeSignupPopup(): void {
    this.showSignupPopup = false;
  }

showMessageModal = false;
messageTitle = '';
messageText = '';
messageType: 'success' | 'error' | 'warning' = 'success';
registrationSuccess = false;
showMessage(
  title: string,
  message: string,
  type: 'success' | 'error' | 'warning'
): void {
  this.messageTitle = title;
  this.messageText = message;
  this.messageType = type;
  this.showMessageModal = true;
}

closeMessage(): void {

  this.showMessageModal = false;

  if (this.registrationSuccess) {

    this.registrationSuccess = false;

    this.showSignupPopup = false;

   this.showPopup = false;

    this.loginData = {
      username: '',
      password: ''
    };
  }
}

registerDoctor(): void {

  if (
    !this.doctor.firstName ||
    !this.doctor.lastName ||
    !this.doctor.phone ||
    !this.doctor.department ||
    !this.doctor.username ||
    !this.doctor.password ||
    !this.doctor.confirmPassword
  ) {
    this.showMessage(
      'Missing Information',
      'Please fill in all the required fields.',
      'warning'
    );

    return;
  }

  if (
    this.doctor.password !==
    this.doctor.confirmPassword
  ) {
    this.showMessage(
      'Password Mismatch',
      'Password and confirm password do not match.',
      'warning'
    );

    return;
  }

  const doctorDetails = {
    hospital: 'PSG Hospitals',
    firstName: this.doctor.firstName,
    lastName: this.doctor.lastName,
    phone: this.doctor.phone,
    department: this.doctor.department,
    username: this.doctor.username,
    password: this.doctor.password
  };

  this.authService.register(doctorDetails).subscribe({

    next: (response: any) => {

      console.log('Registration successful:', response);
 this.registrationSuccess = true;
      this.showMessage(
        'Registration Successful',
        'Doctor account has been created successfully.',
        'success'
      );

      this.doctor = {
        firstName: '',
        lastName: '',
        phone: '',
        department: '',
        username: '',
        password: '',
        confirmPassword: ''
      };
    },

    error: (error: any) => {

      console.error('Registration failed:', error);

      this.showMessage(
        'Registration Failed',
        error?.error?.message ||
        'Unable to create the doctor account. Please try again.',
        'error'
      );
    }
  });
}
}
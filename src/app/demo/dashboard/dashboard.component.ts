
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

interface MenuItem {
  label: string;
  icon: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router) {}

  mobileMenuOpen = false;
  showNotifications = false;
  showProfileMenu = false;
  showPatientForm = false;
  showSuccessMessage = false;

  activeItem = 'Dashboard';
  username = 'Doctor';
  department = 'Clinical Department';

  successMessage = '';

  currentStep = 1;

  readonly steps = [
    'Patient Details',
    'Clinical Information',
    'Laboratory & Vitals',
    'Current Medications',
    'Review & Proceed'
  ];

  readonly stepDescriptions = [
    'Enter the patient’s demographic and physical measurements.',
    'Document the clinical diagnosis and relevant medical history.',
    'Record available laboratory results and vital signs.',
    'Document the patient’s current medicines and allergies.',
    'Verify the details before submitting the patient record.'
  ];

   menuItems: MenuItem[] = [
    { label: 'Home', icon: '⌂' },
    { label: 'New Patient', icon: '♙' },
    { label: 'Patient List', icon: '♧' },
    { label: 'NOAC Assessment', icon: '▤' },
    { label: 'Drug Interactions', icon: '⚕' },
    { label: 'Bleeding Risk', icon: '♥' },
    { label: 'Anticoagulant Switching', icon: '⇄' },
    { label: 'Reports', icon: '▥' },
    { label: 'Settings', icon: '⚙' }
  ];
  patient = this.createEmptyPatient();

  private createEmptyPatient() {
    return {
      name: '',
      id: '',
      sex: '',
      height: null as number | null,
      weight: null as number | null,

      diagnosis: '',
      indication: '',
      medicalHistory: '',
      bleedingHistory: '',
      clinicalNotes: '',

      systolicBP: null as number | null,
      diastolicBP: null as number | null,
      pulse: null as number | null,
      temperature: null as number | null,
      creatinine: null as number | null,
      egfr: null as number | null,
      hemoglobin: null as number | null,
      platelets: null as number | null,
      labDate: '',

      medications: '',
      allergies: '',
      allergyDetails: '',
      medicationNotes: '',

      reviewConfirmed: false
    };
  }

  ngOnInit(): void {
    try {
      const savedUser = localStorage.getItem('user');

      if (savedUser) {
        const user = JSON.parse(savedUser);

        this.username =
          user.username ||
          [user.firstName, user.lastName].filter(Boolean).join(' ') ||
          'Doctor';

        this.department =
          user.department || 'Clinical Department';
      }
    } catch (error) {
      console.error('Unable to read saved user details:', error);
    }
  }

  get bmi(): number | null {
    const height = Number(this.patient.height);
    const weight = Number(this.patient.weight);

    if (
      !Number.isFinite(height) ||
      !Number.isFinite(weight) ||
      height <= 0 ||
      weight <= 0
    ) {
      return null;
    }

    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  }

  selectMenu(item: MenuItem): void {
    this.activeItem = item.label;
    this.mobileMenuOpen = false;
    this.showNotifications = false;
    this.showProfileMenu = false;

    if (item.label === 'Dashboard') {
      this.showPatientForm = false;
      return;
    }

    if (item.label === 'Patient List') {
      this.showPatientForm = false;
      // Connect this menu to your Patient List component when available.
      return;
    }

    if (item.label === 'NOAC Assessment') {
      this.showPatientForm = false;
      // Connect this menu to your assessment component when available.
      return;
    }

    if (item.label === 'Drug Interactions') {
      this.showPatientForm = false;
      // Connect this menu to your safety tools component when available.
    }
  }

  selectCard(card: string): void {
    this.mobileMenuOpen = false;

    if (card === 'New Patient') {
      this.patient = this.createEmptyPatient();
      this.currentStep = 1;
      this.activeItem = 'New Patient';
      this.showPatientForm = true;
      this.showSuccessMessage = false;
      return;
    }

    if (card === 'Patient List') {
      this.selectMenu({ label: 'Patient List', icon: '▤' });
      return;
    }

    if (card === 'NOAC Assessment') {
      this.selectMenu({ label: 'NOAC Assessment', icon: '✚' });
      return;
    }

    if (card === 'Drug Interactions') {
      this.selectMenu({ label: 'Drug Interactions', icon: '✓' });
    }
  }

  nextStep(form: NgForm): void {
    if (!form.valid) {
      form.control.markAllAsTouched();
      return;
    }

    if (this.currentStep < 5) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number): void {
    if (step >= 1 && step <= 5) {
      this.currentStep = step;
    }
  }

  cancelPatientForm(): void {
    this.showPatientForm = false;
    this.activeItem = 'Dashboard';
    this.currentStep = 1;
    this.mobileMenuOpen = false;
  }

  submitPatient(): void {
    if (!this.patient.reviewConfirmed) {
      return;
    }

    if (
      !this.patient.name.trim() ||
      !this.patient.id.trim() ||
      !this.patient.sex ||
      this.patient.height === null ||
      this.patient.weight === null ||
      !this.patient.diagnosis.trim() ||
      !this.patient.indication ||
      !this.patient.allergies
    ) {
      this.successMessage =
        'Some required patient information is missing. Please review all five stages.';
      this.showSuccessMessage = true;
      return;
    }

    const patientRecord = {
      ...this.patient,
      bmi: this.bmi,
      hospital: 'PSG Hospitals',
      createdAt: new Date().toISOString()
    };

    // Frontend demonstration only: no database/API save happens here.
    console.log('Patient record prepared:', patientRecord);

    this.successMessage =
      'The patient form has passed the current required-field checks. Connect the backend API to persist this record.';
    this.showSuccessMessage = true;
  }

  finishPatient(): void {
    this.showSuccessMessage = false;
    this.showPatientForm = false;
    this.currentStep = 1;
    this.activeItem = 'Dashboard';
    this.patient = this.createEmptyPatient();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }
}

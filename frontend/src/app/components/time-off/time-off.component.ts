import { Expression } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface PTORequest {
  date: string;
  end: string;
  hours: number;
  included: boolean;
  start: string;
  types: {
    pto: number;
    sick: number;
    unpaid: number;
  };
}

interface User {
  uuid: string;
  name: string;
  requestedPTO: { [date: string]: PTORequest };
}

@Component({
  selector: 'app-time-off',
  templateUrl: './time-off.component.html',
  styleUrls: ['./time-off.component.css']
})
export class TimeOffComponent implements OnInit {
  ptoForm: FormGroup;
  user: User | null = null;
  objectKeys = Object.keys;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.ptoForm = this.fb.group({
      date: ['', Validators.required],
      start: ['08:00', Validators.required],
      end: ['16:00', Validators.required],
      hours: [8, [Validators.required, Validators.min(0)]],
      ptoType: ['pto', Validators.required]
    });
  }

  ngOnInit(): void {
    const userId = 'john-doe-uuid'; // Replace with actual user ID retrieval logic
    this.http.get<{ [date: string]: PTORequest }>(`${environment.rocApiUrl}/time-off/${userId}`).subscribe({
      next: (data) => {
        this.user = {
          uuid: userId,
          name: 'John Doe', // Replace with actual user name retrieval logic
          requestedPTO: data
        };
      },
      error: (error) => {
        console.error('Error fetching PTO data:', error);
      }
    });
  }

  async submitRequest(): Promise<void> {
    if (this.ptoForm.valid && this.user) {
      const formValue = this.ptoForm.value;
      const dateObj = new Date(formValue.date);
      const dateString = `${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getDate().toString().padStart(2, '0')}/${dateObj.getFullYear()}`;

      const newRequest: PTORequest = {
        date: dateString,
        end: formValue.end,
        hours: formValue.hours,
        included: true,
        start: formValue.start,
        types: {
          pto: formValue.ptoType === 'pto' ? formValue.hours : 0,
          sick: formValue.ptoType === 'sick' ? formValue.hours : 0,
          unpaid: formValue.ptoType === 'unpaid' ? formValue.hours : 0
        }
      };

      this.user.requestedPTO[dateString] = newRequest;
      
      this.http.post(`${environment.rocApiUrl}/time-off`, {
          userId: this.user.uuid,
          date: dateString,
          ptoRequest: newRequest
        })
        .subscribe({
          next: () => {
          this.ptoForm.reset({
            start: '08:00',
            end: '16:00',
            hours: 8,
            ptoType: 'pto'
          });
          },
          error: (error) => {
          console.error('Error submitting PTO request:', error);
          }
        });
    }
  }
}
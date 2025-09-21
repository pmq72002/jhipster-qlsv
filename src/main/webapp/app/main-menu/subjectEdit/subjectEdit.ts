import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-subject-edit',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './subjectEdit.html',
  styleUrl: './subjectEdit.css',
})
export class SubjectEditComponent {
  subCode: string = '';
  subName: string = '';
  subNum: number | null = null;

  constructor(private http: HttpClient) {}
}

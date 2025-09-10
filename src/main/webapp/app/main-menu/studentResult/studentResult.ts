import { NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentScores } from 'app/shared/types/student-score';

@Component({
  selector: 'app-student-result',
  imports: [NgClass],
  templateUrl: './studentResult.html',
  styleUrl: './studentResult.css',
})
export class StudentResult implements OnInit {
  studentScore: StudentScores[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const stuCode = this.route.snapshot.paramMap.get('stuCode');
    this.http.get<any>(`api/student/${stuCode}/subject/summary`).subscribe({
      next: res => {
        this.studentScore = res.map((item: { subName: any; processPoint: any; componentPoint: any; summaryScore: any; passSub: any }) => ({
          subName: item.subName,
          processPoint: item.processPoint,
          componentPoint: item.componentPoint,
          summaryScore: item.summaryScore,
          passSub: item.passSub,
        }));
      },
      error: err => {
        console.error('❌ Lỗi kết nối BE:', err);
        this.error = 'Không thể tải dữ liệu sinh viên';
        this.loading = false;
      },
    });
  }
}

import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ParseComponent} from '../parse/parse.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-report-error-on-page-dialog',
  templateUrl: './report-error-on-page-dialog.component.html',
  styleUrls: ['./report-error-on-page-dialog.component.css']
})
export class ReportErrorOnPageDialogComponent implements OnInit {
  reportForm: FormGroup;
  componentAndData: ParseComponent;

  constructor(dialogRef: MatDialogRef<ReportErrorOnPageDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    // this.componentAndData = data.component;
  }

  ngOnInit(): void {
    this.reportForm = new FormGroup({
      email: new FormControl(''), // , [Validators.required, Validators.email]
      message: new FormControl('', Validators.required)
    });
  }

  sendTheReport(): void {
    if (this.reportForm.valid) {
      const whatToSend = {
        message: this.reportForm.controls.message.value,
        component: this.componentAndData
      };


    }
  }
}

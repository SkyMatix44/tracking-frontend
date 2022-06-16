import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-project-config-dialog',
  templateUrl: './project-config-dialog.component.html',
  styleUrls: ['./project-config-dialog.component.scss'],
})
export class ProjectConfigDialogComponent implements OnInit {
  studyNameFormGroup = this._formBuilder.group({
    nameCtrl: ['', Validators.required],
  });
  studyDescriptionFormGroup = this._formBuilder.group({
    descriptionCtrl: ['', Validators.required],
  });
  startdateFormGroup = this._formBuilder.group({
    startdateCtrl: ['', Validators.required],
  });
  enddateFormGroup = this._formBuilder.group({
    enddateCtrl: ['', Validators.required],
  });
  addScientistsFormGroup = this._formBuilder.group({});
  isEditable = true;
  minDate: Date | undefined;
  maxDate: Date | undefined;
  dialogTitle = 'Studie bearbeiten';
  studyName = '';
  studyDescription = '';

  constructor(
    private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ProjectConfigDialogComponent>,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dialogTitle = data.dialogTitle;
    this.studyName = data.studyName;
    this.studyDescription = data.studyDescription;
    this.startdateFormGroup = this._formBuilder.group({
      startdateCtrl: new FormControl(new Date(data.studyStartdate)),
    });
    this.enddateFormGroup = this._formBuilder.group({
      enddateCtrl: new FormControl(new Date(data.studyEnddate)),
    });
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 0, currentMonth, 1);
    this.maxDate = new Date(currentYear + 1, 11, 31);
  }

  ngOnInit() {}

  saveAndClose() {
    this.dialogRef.close();
    this.toastr.success('Änderungen gespeichert.');
  }

  inviteScientist() {
    this.toastr.warning('not implemented yet');
  }
}

import { DatePipe } from '@angular/common';
import { Component, Injectable, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import dateFormat from 'dateformat';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-notes-config-dialog',
  templateUrl: './notes-config-dialog.component.html',
  styleUrls: ['./notes-config-dialog.component.scss'],
})
export class NotesConfigDialogComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<NotesConfigDialogComponent>,
    private toastr: ToastrService,
    public datepipe: DatePipe
  ) {}

  minDate: Date | undefined;
  maxDate: Date | undefined;
  ngOnInit() {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 0, currentMonth, 1);
    this.maxDate = new Date(currentYear + 1, 11, 31);
  }

  /*
    icon: 'fa-clock bg-purple',
    date: '03.07.2022 09:00',
    headline: 'Kickoff event',
    text: 'The Kickoff event will take place at the university.',
  */

  onChangeDate(data: any) {
    this.noteDate = dateFormat(data, 'm d yyyy');
  }

  noteHeadline = '';
  noteDescription = '';
  noteDate = '';
  saveAndClose() {
    if (this.noteDescription != '') {
      this.dialogRef.close({
        noteHeadline: this.noteHeadline,
        noteDescription: this.noteDescription,
        noteDate: this.noteDate,
      });
      this.toastr.success('Changes saved!');
    } else {
      this.toastr.warning('The name is empty!');
    }
  }
}

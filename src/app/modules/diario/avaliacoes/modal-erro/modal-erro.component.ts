import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-modal-erro',
  templateUrl: './modal-erro.component.html',
  styleUrls: ['./modal-erro.component.scss']
})
export class ModalErroComponent implements OnInit, OnDestroy   {

  error: FormControl = new FormControl;

  constructor(
    public dialogRef: MatDialogRef<ModalErroComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.error.setValue(data.error);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }

  close() {
    this.dialogRef.close(null);
  }
  ngOnDestroy(): void { }

  ngOnInit(): void {
  }

}

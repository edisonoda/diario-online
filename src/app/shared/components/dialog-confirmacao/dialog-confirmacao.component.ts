import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'dialog-confirmacao',
    templateUrl: './dialog-confirmacao.component.html',
    styleUrls: ['./dialog-confirmacao.component.css'],
    standalone: true,
    imports: [MatDialogModule, MatInputModule],
})
export class DialogConfirmacao {
    descricao: string;

    constructor(
        private dialogRef: MatDialogRef<DialogConfirmacao>,
        @Inject(MAT_DIALOG_DATA) data: any
    ) {
        this.descricao = data.descricao;
    }

    confirm(): void {
        this.dialogRef.close(true);
    }

    close() {
        this.dialogRef.close(null);
    }
}
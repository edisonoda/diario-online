import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'notNull' })
export class NotNullPipe implements PipeTransform {
  constructor() { }

  transform(value: any, newValue: any = '--'): any {
    return value !== undefined && value !== null && value !== '' ? value : newValue;
  }
}
export interface BusinessDayObject {
  open?: string;
  close?: string;
  closed?: string;
}

export interface BusinessHoursObject {
  [key: string]: BusinessDayObject[];
}

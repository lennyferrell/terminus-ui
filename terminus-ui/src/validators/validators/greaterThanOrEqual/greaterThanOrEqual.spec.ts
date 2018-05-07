// tslint:disable: no-non-null-assertion
import {
  FormControl,
  ValidatorFn,
} from '@angular/forms';

import { greaterThanOrEqualValidator } from './greaterThanOrEqual';


describe(`greaterThanOrEqualValidator`, () => {
  let validatorFn: ValidatorFn;
  let validatorFnNoNumber: ValidatorFn;

  beforeEach(() => {
    validatorFn = greaterThanOrEqualValidator(10);
    validatorFnNoNumber = greaterThanOrEqualValidator();
  });


  test(`should return null if the control is invalid`, () => {
    const values = [undefined, {}];

    for (const val of values) {
      expect(validatorFn(val as any)).toEqual(null);
    }
  });


  test(`should return null if the number is valid`, () => {
    const values = [12, 10, 98.6, 9999];

    for (const val of values) {
      expect(validatorFn(new FormControl(val))).toEqual(null);
    }
  });


  test(`should return the invalid response if the number is NOT valid`, () => {
    const values = [9, -10, 0];

    for (const val of values) {
      const result = validatorFn(new FormControl(val));

      expect(result!.greaterThanOrEqual.valid).toEqual(false);
      expect(result!.greaterThanOrEqual.actual).toEqual(val);
    }
  });


  test(`should default to 0 if no number is passed in`, () => {
    expect(validatorFnNoNumber(new FormControl(0))).toEqual(null);
  });

});
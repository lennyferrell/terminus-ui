// tslint:disable: no-non-null-assertion
import {
  FormControl,
  ValidatorFn,
} from '@angular/forms';

import { lessThanOrEqualValidator } from './lessThanOrEqual';


describe(`lessThanOrEqualValidator`, () => {
  let validatorFn: ValidatorFn;
  let validatorFnNoNumber: ValidatorFn;

  beforeEach(() => {
    validatorFn = lessThanOrEqualValidator(10);
    validatorFnNoNumber = lessThanOrEqualValidator();
  });


  test(`should return null if the control is invalid`, () => {
    const values = [undefined, {}];

    for (const val of values) {
      expect(validatorFn(val as any)).toEqual(null);
    }
  });


  test(`should return null if the number is valid`, () => {
    const values = [9, 0, -1, 10];

    for (const val of values) {
      expect(validatorFn(new FormControl(val))).toEqual(null);
    }
  });


  test(`should return the invalid response if the number is NOT valid`, () => {
    const values = [11, 98.6, 9999];

    for (const val of values) {
      const result = validatorFn(new FormControl(val));

      expect(result!.lessThanOrEqual.valid).toEqual(false);
      expect(result!.lessThanOrEqual.actual).toEqual(val);
    }
  });


  test(`should default to 0 if no number is passed in`, () => {
    const result = validatorFnNoNumber(new FormControl(1));

    expect(result!.lessThanOrEqual.valid).toEqual(false);
    expect(result!.lessThanOrEqual.actual).toEqual(1);
  });

});

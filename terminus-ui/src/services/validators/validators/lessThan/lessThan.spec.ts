import { FormControl } from '@angular/forms';

import { lessThanValidator } from './lessThan';


describe(`lessThanValidator`, () => {

  beforeEach(() => {
    this.validatorFn = lessThanValidator(10);
  });


  describe(`if the control is invalid`, () => {

    test(`should return null`, () => {
      const values = [undefined, {}];

      for (const val of values) {
        expect(this.validatorFn(val)).toEqual(null);
      }
    });

  });


  describe(`if the number is valid`, () => {

    test(`should return null`, () => {
      const values = [9, 0, -1];

      for (const val of values) {
        expect(this.validatorFn(new FormControl(val))).toEqual(null);
      }
    });

  });


  describe(`if the number is NOT valid`, () => {

    test(`should return the invalid response`, () => {
      const values = [10, 11, 98.6, 9999];

      for (const val of values) {
        const result = this.validatorFn(new FormControl(val));

        expect(result.lessThan.valid).toEqual(false);
        expect(result.lessThan.actual).toEqual(val);
      }
    });

  });

});
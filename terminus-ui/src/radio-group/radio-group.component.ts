import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  isDevMode,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import {
  isFunction,
  hasRequiredControl,
  untilComponentDestroyed,
} from '@terminus/ngx-tools';
import { coerceBooleanProperty } from '@terminus/ngx-tools/coercion';
import { DomSanitizer } from '@angular/platform-browser';

import { TsStyleThemeTypes } from './../utilities/types/style-theme.types';
import { TsReactiveFormBaseComponent } from './../utilities/reactive-form-base.component';


/**
 * Define the allowed keys for an item passed to the {@link TsRadioComponent}
 */
export interface TsRadioOption {
  [key: string]: any;

  /**
   * Define if the item is disabled
   */
  disabled?: boolean;

  /**
   * Define the template for the content (used if type is visual)
   */
  template?: string;
}


/**
 * Expose the MatRadioChange event as TsRadioChange. Used by {@link TsRadioGroupComponent}
 */
export class TsRadioChange extends MatRadioChange {}


/**
 * Expose the formatter function type used by {@link TsRadioGroupComponent}
 */
export type TsRadioFormatFn = (v: any) => string;


/**
 * Unique ID for each instance
 */
let nextUniqueId = 0;


/**
 * Custom control value accessor for our component
 * This allows our custom components to access the underlying form validation via the base class
 */
/* tslint:disable:no-use-before-declare */
export const CUSTOM_RADIO_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TsRadioGroupComponent),
  multi: true,
};
/* tslint-enable: no-use-before-declare */


/**
 * This is the radio UI Component
 *
 * #### QA CSS CLASSES
 * - `qa-radio-group`: The primary container
 * - `qa-radio-control`: An individual radio control
 * - `qa-radio-validation-messages`: The validation messages container
 *
 * @example
 * <ts-radio-group
 *              options="myItemsArray | $async"
 *              [formControl]="myForm.get('myRadioGroup')"
 *              isDisabled="true"
 *              theme="primary"
 *              [formatUILabelFn]="myUIFormatter"
 *              [formatUISubLabelFn]="myUISubFormatter"
 *              [formatModelValueFn]="myModelFormatter"
 *              (change)="doSomething($event)"
 * ></ts-radio-group>
 *
 * <example-url>https://goo.gl/ieUPaG</example-url>
 */
@Component({
  selector: 'ts-radio-group',
  templateUrl: './radio-group.component.html',
  styleUrls: ['./radio-group.component.scss'],
  host: {
    class: 'ts-radio-group',
  },
  providers: [CUSTOM_RADIO_CONTROL_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'tsRadioGroup',
})
export class TsRadioGroupComponent extends TsReactiveFormBaseComponent implements OnInit, OnDestroy {
  /**
   * Define the default component ID
   */
  protected _uid = `ts-radio-group-${nextUniqueId++}`;

  /**
   * Define the ripple color.
   * TODO: abstract out to a service or utility function or set as a global default for ripples
   */
  public rippleColor: string = 'rgba(0, 83, 138, .1)';

  // NOTE: Since we are matching standard HTML attributes, we will rename for internal use.
  // tslint:disable: no-input-rename
  /**
   * Used to set the 'aria-label' attribute on the underlying input element.
   */
  @Input('aria-label')
  public ariaLabel: string | undefined;

  /**
   * The 'aria-labelledby' attribute takes precedence as the element's text alternative.
   */
  @Input('aria-labelledby')
  public ariaLabelledby: string | undefined;

  /**
   * The 'aria-describedby' attribute is read after the element's label and field type.
   */
  @Input('aria-describedby')
  public ariaDescribedby: string | undefined;
  // tslint:enable: no-input-rename

  /**
   * Define a function to retrieve the UI value for an option
   */
  @Input()
  public set formatUILabelFn(value: TsRadioFormatFn) {
    if (!value) {
      return;
    }

    if (isFunction(value)) {
      this._formatUILabelFn = value;
    } else {
      // istanbul ignore else
      if (isDevMode()) {
        throw Error(`TsRadioGroupComponent: 'formatUILabelFn' must be passed a 'TsRadioFormatFn'.`);
      }
    }
  }
  public get formatUILabelFn(): TsRadioFormatFn {
    return this._formatUILabelFn;
  }
  private _formatUILabelFn!: TsRadioFormatFn;

  /**
   * Define a function to retrieve the UI value for an option
   */
  @Input()
  public set formatUISubLabelFn(value: TsRadioFormatFn) {
    if (!value) {
      return;
    }

    if (isFunction(value)) {
      this._formatUISubLabelFn = value;
    } else {
      // istanbul ignore else
      if (isDevMode()) {
        throw Error(`TsRadioGroupComponent: 'formatUISubLabelFn' must be passed a 'TsRadioFormatFn'.`);
      }
    }
  }
  public get formatUISubLabelFn(): TsRadioFormatFn {
    return this._formatUISubLabelFn;
  }
  private _formatUISubLabelFn!: TsRadioFormatFn;

  /**
   * Define a function to retrieve the UI value for an option
   */
  @Input()
  public set formatModelValueFn(value: TsRadioFormatFn) {
    if (!value) {
      return;
    }

    if (isFunction(value)) {
      this._formatModelValueFn = value;
    } else {
      // istanbul ignore else
      if (isDevMode()) {
        throw Error(`TsRadioGroupComponent: 'formatModelValueFn' must be passed a 'TsRadioFormatFn'.`);
      }
    }
  }
  public get formatModelValueFn(): TsRadioFormatFn {
    return this._formatModelValueFn;
  }
  private _formatModelValueFn!: TsRadioFormatFn;

  /**
   * Define an ID for the component
   */
  @Input()
  set id(value: string) {
    this._id = value || this._uid;
  }
  get id(): string {
    return this._id;
  }
  protected _id: string = this._uid;

  /**
   * Define if the radio group is disabled
   */
  @Input()
  public isDisabled: boolean = false;

  /**
   * Define if the radio group is visual (boxes) or standard (text)
   */
  @Input()
  public set isVisual(value: boolean) {
    this._isVisual = coerceBooleanProperty(value);
  }
  public get isVisual(): boolean {
    return this._isVisual;
  }
  private _isVisual: boolean = false;

  /**
   * Define a label for the radio group
   */
  @Input()
  public label!: string;

  /**
   * The HTML name attribute applied to radio buttons in this group.
   */
  @Input()
  public set name(value: string) {
    this._name = value ? value : this._uid;
  }
  public get name(): string {
    return this._name;
  }
  private _name: string = this._uid;

  /**
   * Accept an array of radio options in the {@link TsRadioOption} format
   */
  @Input()
  public set options(value: TsRadioOption[]) {
    if (!value) {
      return;
    }

    this._options = value;
  }
  public get options(): TsRadioOption[] {
    return this._options;
  }
  private _options!: TsRadioOption[];

  /**
   * Define if the visual style should be large or small
   */
  @Input()
  public set small(value: boolean) {
    this._small = coerceBooleanProperty(value);
  }
  public get small(): boolean {
    return this._small;
  }
  private _small: boolean = false;

  /**
   * Define the theme. {@link TsStyleThemeTypes}
   */
  @Input()
  public theme: TsStyleThemeTypes = 'primary';

  /**
   * Emit event when a selection occurs. {@link TsRadioChange}
   */
  @Output()
  public change: EventEmitter<TsRadioChange> = new EventEmitter();

  /**
   * Getter to determine if the group is required
   */
  get isRequired(): boolean {
    return hasRequiredControl(this.formControl);
  }


  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    public domSanitizer: DomSanitizer,
  ) {
    super();

    // Force setter to be called in case the ID was not specified.
    this.id = this.id;
  }


  /**
   * Update the change detector if the control value changes
   */
  public ngOnInit(): void {
    // istanbul ignore else
    if (this.formControl) {
      this.formControl.valueChanges
        .pipe(
          untilComponentDestroyed(this),
        )
        .subscribe((v: any) => {
          this.writeValue(v);
          this.changeDetectorRef.markForCheck();
        });
    }
  }


  /**
   * Needed for untilComponentDestroyed
   */
  public ngOnDestroy(): void {}


  /**
   * Retrieve a value determined by the passed in formatter
   *
   * @param option - The radio option
   * @param formatter - The formatter function used to retrieve the value
   * @return The retrieved value
   */
  public retrieveValue(option: TsRadioOption, formatter?: TsRadioFormatFn): TsRadioOption | string {
    return (formatter && formatter(option)) ? formatter(option) : option;
  }


  /**
   * Handle clicks on labels
   *
   * @param option - The selected option
   */
  public labelClick(option: TsRadioOption): void {
    if (this.isDisabled || (option && option.disabled)) {
      return;
    }
    const value = this.retrieveValue(option, this.formatModelValueFn);
    this.value = value;
    this.changeDetectorRef.markForCheck();
  }

}

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  Output,
  ViewEncapsulation,
  EventEmitter
} from '@angular/core';
import { coerceBooleanProperty } from '@terminus/ngx-tools/coercion';


/**
 * Unique ID for each instance
 */
let nextUniqueId = 0;


/**
 * TODO: Fill this section out
 * This is the chip UI Component
 *
 * #### QA CSS CLASSES
 * - `qa-chip`: Placed on the primary container
 *
 * @example
 * <ts-chip
 *              item="Value"
 * ></ts-chip>
 *
 * <example-url>https://goo.gl/ieUPaG</example-url>
 */
@Component({
  selector: 'ts-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
  host: {
    class: 'ts-chip',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'tsChip',
})
export class TsChipComponent {
  /**
   * Define the default component ID
   */
  protected uid = `ts-<%= kebabName %>-${nextUniqueId++}`;

  /**
   * Define an ID for the component
   */
  @Input()
  set id(value: string) {
    this._id = value || this.uid;
  }
  get id(): string {
    return this._id;
  }
  protected _id: string = this.uid;

  /**
   * Define if the chip is disabled
   */
  @Input()
  public set isDisabled(value: boolean) {
    this._isDisabled = coerceBooleanProperty(value);
  }
  public get isDisabled(): boolean {
    return this._isDisabled;
  }
  private _isDisabled: boolean = false;

  /**
   * Define if the chip is removable
   */
  @Input()
  public set removable(value: boolean) {
    this._removable = coerceBooleanProperty(value);
  }
  public get removable(): boolean {
    return this._removable;
  }
  private _removable: boolean = true;

  /**
   * Event to emit when the chip is removed
   */
  @Output()
  public removed: EventEmitter<boolean> = new EventEmitter();

  constructor() {
    // Force setter to be called in case the ID was not specified.
    this.id = this.id;
  }
}

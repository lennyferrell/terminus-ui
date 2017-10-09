import {
  Component,
  Input,
  Output,
  ViewChild,
  OnInit,
  EventEmitter,
  AfterViewInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material';

import {
  TsMenuPositionTypesX,
  TsMenuPositionTypesY,
  TsStyleThemeTypes,
} from './../utilities/types';
import { TsMenuItem } from './../utilities/interfaces/menu-item.interface';


/**
 * A presentational component to render a dropdown menu.
 *
 * -- QA CSS CLASSES
 *
 * qa-menu : Placed on the md-menu element which contains the menu
 *
 * qa-menu-item : Placed on the button element which represents each menu item
 *
 * qa-menu-trigger : Placed on the {@link TsButtonComponent} which displays the menu when clicked
 *
 * @example
 * <ts-menu
 *              menuItems="[{},{},{}]"
 *              menuPositionX="20px"
 *              menuPositionY="20px"
 *              isDisabled="false"
 *              (selected)="myMethod($event)"
 * >Select Item</ts-menu>
 */
@Component({
  selector: 'ts-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TsMenuComponent implements OnInit, AfterViewInit {
  /**
   * Define if there is at least one icon
   */
  public hasIcons: boolean = false;

  /**
   * Define if the menu should overlap the trigger
   */
  public shouldOverlapTrigger: boolean = false;

  /**
   * @private Provide access to the trigger
   */
  @ViewChild(MatMenuTrigger)
  trigger: MatMenuTrigger;

  /**
   * @private Define if the menu should be opened by default
   */
  @Input()
  defaultOpened: boolean = false;

  /**
   * Define if the menu should be disabled
   */
  @Input()
  public isDisabled: boolean = false;

  /**
   * Accept an array of menu items to display
   */
  @Input()
  public menuItems: TsMenuItem[];

  /**
   * Define the X menu position
   */
  @Input()
  public menuPositionX: TsMenuPositionTypesX = 'after';

  /**
   * Define the Y menu position
   */
  @Input()
  public menuPositionY: TsMenuPositionTypesY = 'below';

  /**
   * Define the menu theme
   */
  @Input()
  public theme: TsStyleThemeTypes = 'primary';

  /**
   * Output a selection event with the item payload
   */
  @Output()
  public selected: EventEmitter<TsMenuItem> = new EventEmitter();


  /**
   * On initialization check to see if at least 1 icon exists in the menu items
   */
  public ngOnInit(): void {
    this.hasIcons = this.hasAtLeastOneIcon(this.menuItems);
  }


  /**
   * After the view has initialized, open the menu if it is defaulted to 'open'
   */
  public ngAfterViewInit(): void {
    if (this.defaultOpened) {
      this.trigger.openMenu();
    }
  }


  /**
   * @private Determine if at least one item has a non-null icon
   *
   * @param {Array} items The collection of items to look through
   * @return {Boolean} hasIcon Value that represents if at least one icon is present
   */
  hasAtLeastOneIcon(items: TsMenuItem[]): boolean {
    if (!items || items.length < 1) {
      return false;
    }

    const found: any = items.find((item: TsMenuItem) => {
      return item.icon ? true : false;
    });

    return found ? true : false;
  }
}


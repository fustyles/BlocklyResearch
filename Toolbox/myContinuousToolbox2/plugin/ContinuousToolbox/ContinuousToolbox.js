/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Toolbox that uses a continuous scrolling flyout.
 */

class ContinuousToolbox extends Blockly.Toolbox {
  /** @override */
  constructor(workspace) {	  
    super(workspace);
	
	workspace.eventHistory = [];	

    workspace.addChangeListener((event) => {
		let eventWorkspace = Blockly.Workspace.getById(event.workspaceId);
		eventWorkspace.eventHistory.push([event.type, event.oldJson || null, event.blockId || null]);
		var continuousFlyout = eventWorkspace.getToolbox().getFlyout();
		if (continuousFlyout.autoClose) {
			if (event.type == "toolbox_item_select" && continuousFlyout.visible == false&&event.newItem) {
				continuousFlyout.setVisible(true);
				eventWorkspace.resize();
			} else if (event.type == "toolbox_item_select" && (!event.newItem) && continuousFlyout.visible == true) {
				continuousFlyout.setVisible(false);
				eventWorkspace.resize();
				continuousFlyout.getParentToolbox_().clearSelection();
			}	
		}			
    });
	
  }

  /** @override */
  init() {  
    super.init();
	
    // Populate the flyout with all blocks and show it immediately.
    const flyout = this.getFlyout();
    flyout.show(this.getInitialFlyoutContents_());
    flyout.recordScrollPositions();
	
	if(flyout.autoClose)
		flyout.setVisible(false);
	
	this.workspace_.eventHistory = [];	

    this.workspace_.addChangeListener((event) => {
		if (event.type === Blockly.Events.BLOCK_CREATE||event.type === Blockly.Events.BLOCK_DELETE||event.type === Blockly.Events.BLOCK_CHANGE||event.type === Blockly.Events.VAR_CREATE||event.type === Blockly.Events.VAR_RENAME||event.type === Blockly.Events.VAR_DELETE) {
			this.refreshSelection();
		}  
    });
  }

  /** @override */
  getFlyout() {	  
    return /** @type {ContinuousFlyout} */ (super.getFlyout());
  }

  /**
   * Gets the contents that should be shown in the flyout immediately.
   * This includes all blocks and labels for each category of block.
   * @return {!Blockly.utils.toolbox.FlyoutItemInfoArray} Flyout contents.
   * @private
   */
  getInitialFlyoutContents_() {  
    /** @type {!Blockly.utils.toolbox.FlyoutItemInfoArray} */
    let contents = [];
    for (const toolboxItemDef_ of this.toolboxDef_.contents) {
      if (toolboxItemDef_.kind=="CATEGORY") {
		if (toolboxItemDef_.elementname === undefined) {
			// Create a label node to go at the top of the category
			contents.push({kind: 'LABEL', text: toolboxItemDef_.name});
			/**
			 * @type {string|Blockly.utils.toolbox.FlyoutItemInfoArray|
			 *    Blockly.utils.toolbox.FlyoutItemInfo}
			 */	 		 
			let itemContents = toolboxItemDef_.contents;

			// Handle custom categories (e.g. variables and functions)
			if (toolboxItemDef_.custom) {
			  itemContents =
				/** @type {!Blockly.utils.toolbox.DynamicCategoryInfo} */ ({
				  custom: toolboxItemDef_.custom,
				  kind: 'CATEGORY',
				});
			}
			contents = contents.concat(itemContents);
		}
      }
    }
    return contents;
  }

  /** @override */
  refreshSelection() {
	  if (this.refreshDebouncer) {
		clearTimeout(this.refreshDebouncer);
	  }
	  this.refreshDebouncer = setTimeout(() => {
		this.getFlyout().show(this.getInitialFlyoutContents_());
	  }, 100);
  }

  /** @override */
  updateFlyout_(_oldItem, newItem) {	  
    if (newItem) {
	  if (newItem.toolboxItemDef_.elementname === undefined) {
		  if (this.getFlyout().getCategoryScrollPosition(newItem.name_)) {
			  const target = this.getFlyout().getCategoryScrollPosition(newItem.name_).y;
			  this.getFlyout().scrollTo(target);
		  }
	  }
    }
  }

  /** @override */
  shouldDeselectItem_(oldItem, newItem) {	  
    // Should not deselect if the same category is clicked again.
    return (oldItem && oldItem !== newItem);
  }

  /**
   * Gets a category by name.
   * @param {string} name Name of category to get.
   * @return {?Blockly.ToolboxCategory} Category, or null if not
   *    found.
   * @package
	   */
	getCategoryByName(name) {
		let category = null;
		let contents = this.contents;
		if (contents instanceof Map) {
			contents = Array.from(contents.values());
		}
		for (const item of contents) {
			if (!(item instanceof Blockly.ToolboxCategory)) continue;
			if (!item.isSelectable()) continue;
			if (name === item.getName()) {
				category = item;
				break;
			}
		}
		return category || null;
	}

  /**
   * Selects the category with the given name.
   * Similar to setSelectedItem, but importantly, does not call updateFlyout
   * because this is called while the flyout is being scrolled.
   * @param {string} name Name of category to select.
   * @package
   */
  selectCategoryByName(name) {	  
    const newItem = this.getCategoryByName(name);
    if (!newItem) {
      return;
    }
    const oldItem = this.selectedItem_;

    if (this.shouldDeselectItem_(oldItem, newItem)) {
      this.deselectItem_(oldItem);
    }

    if (this.shouldSelectItem_(oldItem, newItem)) {
      this.selectItem_(oldItem, newItem);
    }
  }

  /** @override */
  getClientRect() {	  
    // If the flyout never closes, it should be the deletable area.
    const flyout = this.getFlyout();
    if (flyout && !flyout.autoClose) {
      return flyout.getClientRect();
    }
    return super.getClientRect();
  }
}


Blockly.Css.register([
  `.categoryBubble {
      margin: 0 auto 0.125rem;
      border-radius: 100%;
      border: 1px solid;
      width: 1.25rem;
      height: 1.25rem;
    }
    .blocklyTreeLabel {
      margin: auto;
    }
	/* Makes our label white. */
	.blocklyTreeLabel {
	  color: white;
	}
	/* Adds padding around the group of categories and separators. */
	.blocklyToolboxContents {
	  padding: .5em;
	}
	/* Adds space between the categories, rounds the corners and adds space around the label. */
	.blocklyTreeRow {
	  padding: 3px;
	  margin-bottom: .5em;
	  border-radius: 4px;
	}
	/* Changes color of the icon to white. */
	.customIcon {
	  color: white;
	}
	/* Stacks the icon on top of the label. */
	.blocklyTreeRowContentContainer {
	  display: flex;
	  flex-direction: row;
	  align-items: center;
	  height: 100%;	  
	}
	.blocklyTreeRow {
	  height: initial;
	}
	.blocklyToolboxCategory {
		padding-top: 15px !important; 
		padding-bottom: 15px !important;
		padding-left: 10px !important; 
		padding-right: 10px !important;
	}
	`
]);
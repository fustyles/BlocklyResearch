/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview The toolbox category built during the custom toolbox codelab, in es6.
 * @author aschmiedt@google.com (Abby Schmiedt)
 */

class CustomCategory extends Blockly.ToolboxCategory {
  /**
   * Constructor for a custom category.
   * @override
   */
  constructor(categoryDef, toolbox, opt_parent) {
    super(categoryDef, toolbox, opt_parent);
  }

  /**
   * Adds the colour to the toolbox.
   * This is called on category creation and whenever the theme changes.
   * @override
   */
  addColourBorder_(colour){
	if (colour)
		this.rowDiv_.style.backgroundColor = colour;
	else {
		this.rowDiv_.style.backgroundColor = "#5b80a5";
		this.colour_ = "#5b80a5";
	}
  }

  /**
   * Sets the style for the category when it is selected or deselected.
   * @param {boolean} isSelected True if the category has been selected,
   *     false otherwise.
   * @override
   */
  setSelected(isSelected){
	if (this.toolboxItemDef_.categorystyle=="element_category")
		return;
	
    // We do not store the label span on the category, so use getElementsByClassName.
    var labelDom = this.rowDiv_.getElementsByClassName('blocklyToolboxCategoryLabel')[0];
    if (isSelected) {
      // Change the background color of the div to white.
      this.rowDiv_.style.backgroundColor = 'white';
      // Set the colour of the text to the colour of the category.
      labelDom.style.color = this.colour_;
      this.iconDom_.style.color = this.colour_;
    } else {
      // Set the background back to the original colour.
      this.rowDiv_.style.backgroundColor = this.colour_;
      // Set the text back to white.
      labelDom.style.color = 'white';
      this.iconDom_.style.color = 'white';
    }
    // This is used for accessibility purposes.
    Blockly.utils.aria.setState(/** @type {!Element} */ (this.htmlDiv_),
        Blockly.utils.aria.State.SELECTED, isSelected);
  }

  /**
   * Creates the dom used for the icon.
   * @return {HTMLElement} The element for the icon.
   * @override
   */
  createIconDom_() {
	if (this.toolboxItemDef_.elementname !== undefined) {
		if (this.toolboxItemDef_.elementname=="autoclose") {
			const iconCheckbox = document.createElement('input');
			iconCheckbox.type = 'checkbox';
			iconCheckbox.checked = true;
			iconCheckbox.style.width = '20px';
			iconCheckbox.style.height = '20px';
			iconCheckbox.style.pointerEvents = 'auto';
			
			iconCheckbox.addEventListener('change', (event) => {
				if (event.target.checked) {
					this.parentToolbox_.flyout.autoClose = true;
					if (this.parentToolbox_.flyout.visible==true) {
						this.parentToolbox_.flyout.setVisible(false);
						this.parentToolbox_.clearSelection();
					}
				} else {
					this.parentToolbox_.flyout.autoClose = false;
					if (this.parentToolbox_.flyout.visible==false) {
						this.parentToolbox_.flyout.setVisible(true);
						const firstItem = this.parentToolbox_.getToolboxItems()[0];
						this.parentToolbox_.setSelectedItem(firstItem);
					}
				}
				
				this.workspace_.resize();
			});	
			
			return iconCheckbox;
		}
	}
	
	const iconImg = document.createElement('img');
	if (this.toolboxItemDef_.categorystyle) {
		iconImg.src = 'png/'+this.toolboxItemDef_.categorystyle+'.png';
		iconImg.width = '40';
	} else {
		iconImg.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';
		iconImg.width = '1';
	}		
	
	iconImg.height = '40';	
    iconImg.alt = '';

    return iconImg;
  }
}

Blockly.registry.register(
    Blockly.registry.Type.TOOLBOX_ITEM,
    Blockly.ToolboxCategory.registrationName,
    CustomCategory, true);




/*
class ContinuousCategory extends Blockly.ToolboxCategory {
  constructor(categoryDef, toolbox) {  
    super(categoryDef, toolbox);
  }

  createLabelDom_(name) {	  
    const label = document.createElement('div');
    label.setAttribute('id', this.getId() + '.label');
    label.textContent = name;
    label.classList.add(this.cssConfig_['label']);
    return label;
  }

  createIconDom_() {  
    const icon = document.createElement('div');
    icon.classList.add('categoryBubble');
    icon.style.backgroundColor = this.colour_;
    return icon;
  }

  addColourBorder_() {
  }

  setSelected(isSelected) {	  
    if (isSelected) {
      this.rowDiv_.style.backgroundColor = 'gray';
      Blockly.utils.dom.addClass(this.rowDiv_, this.cssConfig_['selected']);
    } else {
      this.rowDiv_.style.backgroundColor = '';
      Blockly.utils.dom.removeClass(this.rowDiv_, this.cssConfig_['selected']);
    }
    Blockly.utils.aria.setState((this.htmlDiv_),
        Blockly.utils.aria.State.SELECTED, isSelected);
  }
}

Blockly.registry.register(
    Blockly.registry.Type.TOOLBOX_ITEM,
    Blockly.ToolboxCategory.registrationName,
    ContinuousCategory,
    true);
*/

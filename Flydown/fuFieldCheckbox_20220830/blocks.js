/**
 * @license
 * Copyright 2021 Taiwan (ChungYi Fu)
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Field Checkbox.
 * @author https://www.facebook.com/francefu/
 * @Update 1/1/2022 09:00 (Taiwan Standard Time)
 */
 
 /*
 //blocks.js
 
Blockly.Blocks["test"] = {
  init: function() {
	this.options1 = [
		['aaa','a'],
		['bbb','b'],
		['ccc','c']
	];
	this.options2 = [
		['ddd','d'],
		['eee','e'],
		['fff','f']
	];
	
	this.appendDummyInput()
		.appendField('Checkbox1')	
		.appendField(new fuCheckboxField.CheckboxField('', this.options1, this.id+"_1"), 'chk1');		
	this.appendDummyInput()
		.appendField('Checkbox2')		
		.appendField(new fuCheckboxField.CheckboxField('', this.options2, this.id+"_2"), 'chk2');
		
	etc...
  }
};
 */

document.addEventListener('DOMContentLoaded', function() {
		
	var fuCheckboxField = {};

	fuCheckboxField.CheckboxField = function(text, options, id, opt_validate) {
	  fuCheckboxField.CheckboxField.superClass_.constructor.call(this, text, opt_validate);
	  this.id = id;
	  this.list = options;
	  this.listChecked = [];

	  this.setSpellcheck(false);
	  this.clickWrapper_ = null;
	  this.downWrapper_ = null;	
	};
	Blockly.utils.object.inherits(fuCheckboxField.CheckboxField, Blockly.FieldTextInput);

	fuCheckboxField.CheckboxField.fromJson = function(options) {
	  return new fuCheckboxField.CheckboxField(options['CheckboxField']);
	};

	fuCheckboxField.CheckboxField.prototype.showEditor_ = function() {
	  fuCheckboxField.CheckboxField.superClass_.showEditor_.call(this);

	  var div = Blockly.WidgetDiv.DIV;
	  if (!div.firstChild) {
		return;
	  }
	  var editor = this.dropdownCreate_();
	  Blockly.DropDownDiv.getContentDiv().appendChild(editor);

	  Blockly.DropDownDiv.setColour(this.sourceBlock_.style.colourPrimary,this.sourceBlock_.style.colourTertiary);

	  Blockly.DropDownDiv.showPositionedByField(
		  this, this.dropdownDispose_.bind(this));

	  this.clickWrapper_ =
		  Blockly.bindEvent_(this.imageElement_, 'click', this,
			  this.onMouseDown);
	  this.downWrapper_ =
		  Blockly.bindEvent_(this.imageElement_, 'mousedown', this,
			  this.onMouseDown);
			  
	  this.updateGraph_();
	};

	fuCheckboxField.CheckboxField.prototype.dropdownCreate_ = function() {
	  this.imageElement_ = document.createElement('div');
	  this.imageElement_.id = 'CheckboxField';
	  var height = 24.4 * this.list.length;
	  this.imageElement_.style = 'border: 1px solid #ccc;height: '+height+'px;width: 150px;size: 12px;padding: 0px';  
	  for (var i=0;i<this.list.length;i++) {
		  this.imageElement_.innerHTML += "<input type='checkbox' name='"+this.id+"' value='"+this.list[i][1]+"' " + (this.listChecked?this.listChecked[i]:"") +">"+this.list[i][0]+"<br>";
	  }
	  return this.imageElement_;
	};

	fuCheckboxField.CheckboxField.prototype.dropdownDispose_ = function() {
	  if (this.clickWrapper_) {
		Blockly.unbindEvent_(this.clickWrapper_);
		this.clickWrapper_ = null;
	  }
	  if (this.downWrapper_) {
		Blockly.unbindEvent_(this.downWrapper_);
		this.downWrapper_ = null;
	  }  
	  this.imageElement_ = null;
	};

	fuCheckboxField.CheckboxField.prototype.hide_ = function() {
	  Blockly.WidgetDiv.hide();
	  Blockly.DropDownDiv.hideWithoutAnimation();
	};

	fuCheckboxField.CheckboxField.prototype.onMouseDown = function(e) {
	  var result = "";
	  this.listChecked = [];
	  var myCheckboxs = document.getElementsByName(this.id);
	  for (var i=0;i<myCheckboxs.length;i++) {
		result += myCheckboxs[i].checked?(myCheckboxs[i].value+" "):"";
		this.listChecked.push(myCheckboxs[i].checked?"checked":"");
	  }
	  this.setEditorValue_(result.trim());
	};

	fuCheckboxField.CheckboxField.prototype.getText_ = function() {
	  if (this.isBeingEdited_) {
		return fuCheckboxField.CheckboxField.superClass_.getText_.call(this);
	  }
	  return this.getValue() || null;
	};

	fuCheckboxField.CheckboxField.prototype.getEditorText_ = function(value) {
	  return value;
	};

	fuCheckboxField.CheckboxField.prototype.getValueFromEditorText_ = function(text) {
	  return text;
	};

	fuCheckboxField.CheckboxField.prototype.render_ = function() {
	  fuCheckboxField.CheckboxField.superClass_.render_.call(this);
	  this.updateGraph_();
	};

	fuCheckboxField.CheckboxField.prototype.updateGraph_ = function() {
	  if (!this.imageElement_) {
		return;
	  }
	};

	fuCheckboxField.CheckboxField.prototype.doClassValidation_ = function(opt_newValue) {
	  if (opt_newValue === null || opt_newValue === undefined) {
		return null;
	  }
	  return opt_newValue;
	};





	Blockly.Blocks["test"] = {
	  init: function() {
		this.options1 = [
			['aaa','a'],
			['bbb','b'],
			['ccc','c']
		];
		this.options2 = [
			['ddd','d'],
			['eee','e'],
			['fff','f']
		];
		
		this.appendDummyInput()
			.appendField('Checkbox1')	
			.appendField(new fuCheckboxField.CheckboxField('', this.options1, this.id+"_1"), 'chk1');		
		this.appendDummyInput()
			.appendField('Checkbox2')		
			.appendField(new fuCheckboxField.CheckboxField('', this.options2, this.id+"_2"), 'chk2');
		  
		this.setInputsInline(true);		
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(100);
	  }
	};

	Blockly.JavaScript['test'] = function(block) {
	  return '';
	};
	
})
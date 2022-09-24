/**
 * @license
 * Copyright 2013 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */


/**
 * @license
 * Copyright 2021 Taiwan (ChungYi Fu)
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Field Filter.
 * @author https://www.facebook.com/francefu/
 * @Update 12/20/2021 00:00 (Taiwan Standard Time)
 */
 
 /*
 //blocks.js
 
	Blockly.Blocks["test"] = {
	  init: function() {
		this.options = [
			['','','',''],	
			['France','fr','Paris','CDG'],
			['France','fr','Laon','XLN'],
			['France','fr','Nice','NCE'],		
			['Taiwan','tw','Taipei','TPE'],
			['Taiwan','tw','Taichung','RMQ'],		
			['Taiwan','tw','Kaohsiung','KH']
		];
		
		this.field = new fuFieldsFilter2Level.FieldFilter('', this.getFirstOptions(this.options), this.validate1);
		this.appendDummyInput()
			.appendField(this.field, 'FILTER1');
		this.appendDummyInput()
			.appendField('', 'VALUE1');		
			
		this.field2 = new fuFieldsFilter2Level.FieldFilter('', [], this.validate2);
		this.appendDummyInput('zone')
			.appendField(this.field2, 'FILTER2');	
		this.appendDummyInput()
			.appendField('', 'VALUE2');	

		//etc...
	  },
	  validate1: function(newValue) {
		const block = this.sourceBlock_;
		if (newValue=="") {
			if (block.field.WORDS) {
				if (block.field.WORDS.length>0) {
					block.options.forEach(function(element1) {
						if (element1[0]==block.field.WORDS[0]) {
							block.setFieldValue(element1[1], 'VALUE1');
							block.zoneOptions(element1);
						}
					})				
				}
			}
			else {
				block.setFieldValue('', 'VALUE1');
				block.setFieldValue('', 'VALUE2');
			}
		}
		else {
			block.options.forEach(function(element1) {
				if (element1[0]==block.field.WORDS[Number(newValue)]) {
					block.setFieldValue(element1[1], 'VALUE1');
					block.zoneOptions(element1);
				}
			})
		}
	  },
	  validate2: function(newValue) {
		const block = this.sourceBlock_;
		if (newValue=="") {
			if (block.field2.WORDS) {
				if (block.field2.WORDS.length>0) {
					block.options.forEach(function(element) {
						if (element[2]==block.field2.WORDS[0]) {
							block.setFieldValue(element[3], 'VALUE2');						
						}
					})				
				}
			}
			else {
				block.setFieldValue('', 'VALUE2');
			}
		}
		else {
			block.options.forEach(function(element) {
				if (element[2]==block.field2.WORDS[Number(newValue)]) {
					block.setFieldValue(element[3], 'VALUE2');
				}
			})
		}
	  },
	  zoneOptions: function(element1) {
			var options2 = [];
			this.options.forEach(function(element2) {
				if (element1[0]==element2[0])
					options2.push(element2[2])
			})
			this.field2 = new fuFieldsFilter2Level.FieldFilter('', options2, this.validate2);
			if (this.getField("FILTER2"))
				this.getInput("zone").removeField("FILTER2");
			this.getInput("zone").appendField(this.field2, 'FILTER2');
			this.setFieldValue('', 'VALUE2');
	  },
	  getFirstOptions: function(options) {
		var opt = [];
		options.forEach(function(element) {
			if (!opt.includes(element[0]))
				opt.push(element[0])
		}); 
		return opt;
	  }
	};
 */

document.addEventListener('DOMContentLoaded', function() {
	
	Blockly.Flyout.prototype.updateDisplay_=function(){
		var a=this.containerVisible_?this.isVisible():!1;
		this.svgGroup_.style.display=a?"block":"none";
		if (this.workspace_.scrollbar)
			this.workspace_.scrollbar.setContainerVisible(a)
	};

	Blockly.Flyout.prototype.clearOldBlocks_=function(){
		for(var a=this.workspace_.getTopBlocks(!1),b=0,c;c=a[b];b++)
			this.blockIsRecyclable_(c)?this.recycleBlock_(c):c.dispose(!1,!1);
		for(a=0;a<this.mats_.length;a++)
			if(b=this.mats_[a])(0,Blockly.Tooltip.unbindMouseEvents)(b),(0,Blockly.utils.dom.removeNode)(b);
		for(a=this.mats_.length=0;b=this.buttons_[a];a++)
			b.dispose();
		this.buttons_.length=0;
		if (this.workspace_.getPotentialVariableMap())
			this.workspace_.getPotentialVariableMap().clear()
	};
	
	
	
	

	
	var fuFieldsFilter2Level = fuFieldsFilter2Level||{};

	fuFieldsFilter2Level.FieldFilter = function(text, options, opt_validate) {
	  fuFieldsFilter2Level.FieldFilter.superClass_.constructor.call(this, text, opt_validate);
	  this.INITWORDS = options;
	  this.WORDS = this.IINITWORDS;

	  this.setSpellcheck(false);
	  this.clickWrapper_ = null;
	  this.moveWrapper_ = null;
	  this.downWrapper_ = null;	
	};
	Blockly.utils.object.inherits(fuFieldsFilter2Level.FieldFilter, Blockly.FieldTextInput);

	fuFieldsFilter2Level.FieldFilter.fromJson = function(options) {
	  return new fuFieldsFilter2Level.FieldFilter(options['fieldFilter']);
	};

	fuFieldsFilter2Level.FieldFilter.prototype.showEditor_ = function() {
	  fuFieldsFilter2Level.FieldFilter.superClass_.showEditor_.call(this);

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
			  this.hide_);
	  this.moveWrapper_ =
		  Blockly.bindEvent_(this.imageElement_, 'mousemove', this,
			  this.onMouseMove);
	  this.downWrapper_ =
		  Blockly.bindEvent_(this.imageElement_, 'mousedown', this,
			  this.onMouseDown);
			  
	  this.updateGraph_();
	};

	fuFieldsFilter2Level.FieldFilter.prototype.dropdownCreate_ = function() {
	  this.imageElement_ = document.createElement('div');
	  this.imageElement_.id = 'fieldFilter';
	  this.WORDS = this.INITWORDS;
	  var optionsLength = this.WORDS.length;
	  var height = 24.4 * optionsLength;
	  this.imageElement_.style = 'border: 1px solid #ccc;height: '+height+'px;width: 150px;size: 12px;padding: 0px';
	  this.imageElement_.innerHTML = this.WORDS.join("<br>");
	  return this.imageElement_;
	};

	fuFieldsFilter2Level.FieldFilter.prototype.dropdownDispose_ = function() {
	  if (this.clickWrapper_) {
		Blockly.unbindEvent_(this.clickWrapper_);
		this.clickWrapper_ = null;
	  }
	  if (this.moveWrapper_) {
		Blockly.unbindEvent_(this.moveWrapper_);
		this.moveWrapper_ = null;
	  }
	  if (this.downWrapper_) {
		Blockly.unbindEvent_(this.downWrapper_);
		this.downWrapper_ = null;
	  }  
	  this.imageElement_ = null;
	};

	fuFieldsFilter2Level.FieldFilter.prototype.hide_ = function() {
	  Blockly.WidgetDiv.hide();
	  Blockly.DropDownDiv.hideWithoutAnimation();
	};

	fuFieldsFilter2Level.FieldFilter.prototype.onMouseMove = function(e) {
	  var bBox = this.imageElement_.getBoundingClientRect();
	  var dy = e.clientY - bBox.top;
	  
	  var highLight = Array.from(this.WORDS);
	  var note = (Math.round((dy-5)/24.5)<highLight.length)?Math.round((dy-5)/24.5):-1;
	  if (note!=-1)
		highLight[note] = "<font color='white'>" + highLight[note] + "</font>";
	  this.imageElement_.innerHTML = highLight.join("<br>");
	};

	fuFieldsFilter2Level.FieldFilter.prototype.onMouseDown = function(e) {
	  var bBox = this.imageElement_.getBoundingClientRect();
	  var dy = e.clientY - bBox.top;
	  var highLight = Array.from(this.WORDS);
	  var note = (Math.round((dy-5)/24.5)<highLight.length)?Math.round((dy-5)/24.5):-1;
	  this.setEditorValue_(note);
	};

	fuFieldsFilter2Level.FieldFilter.prototype.valueToNote = function(value) {
	  if (this.WORDS)
		  return this.WORDS[Number(value)];
	  else
		  return "";
	};

	fuFieldsFilter2Level.FieldFilter.prototype.noteToValue = function(text) {
	  var normalizedText = text.trim();
	  var i = this.WORDS.indexOf(normalizedText);
	  this.WORDS = [];
	  var words = this.WORDS;
	  var initwords = this.INITWORDS;
	  for (var j=0;j<initwords.length;j++) {
		if (initwords[j].toUpperCase().indexOf(normalizedText.toUpperCase())!=-1||normalizedText=="")
			words.push(initwords[j]);
	  }
	  if (this.WORDS.length==0) 
			words.push([""]);
	  var optionsLength = this.WORDS.length;
	  var height = 24.4 * optionsLength;
	  this.imageElement_.style = 'border: 1px solid #ccc;height: '+height+'px;width: 150px;;size: 12px;padding: 0px';
	  this.imageElement_.innerHTML = this.WORDS.join("<br>");
	  return i > -1? 0 : -1;
	};

	fuFieldsFilter2Level.FieldFilter.prototype.getText_ = function() {
	  if (this.isBeingEdited_) {
		return fuFieldsFilter2Level.FieldFilter.superClass_.getText_.call(this);
	  }
	  return this.valueToNote(this.getValue()) || null;
	};

	fuFieldsFilter2Level.FieldFilter.prototype.getEditorText_ = function(value) {
	  return this.valueToNote(value);
	};

	fuFieldsFilter2Level.FieldFilter.prototype.getValueFromEditorText_ = function(text) {
	  return this.noteToValue(text);
	};

	fuFieldsFilter2Level.FieldFilter.prototype.render_ = function() {
	  fuFieldsFilter2Level.FieldFilter.superClass_.render_.call(this);
	  this.updateGraph_();
	};

	fuFieldsFilter2Level.FieldFilter.prototype.updateGraph_ = function() {
	  if (!this.imageElement_) {
		return;
	  }
	};

	fuFieldsFilter2Level.FieldFilter.prototype.doClassValidation_ = function(opt_newValue) {
	  if (opt_newValue === null || opt_newValue === undefined) {
		return null;
	  }
	  var note = this.valueToNote(opt_newValue); 
	  if (note) {
		return opt_newValue;
	  }
	  return "";
	};









	Blockly.Blocks["test"] = {
	  init: function() {
		this.options = [
			['','','',''],	
			['France','fr','Paris','CDG'],
			['France','fr','Laon','XLN'],
			['France','fr','Nice','NCE'],		
			['Taiwan','tw','Taipei','TPE'],
			['Taiwan','tw','Taichung','RMQ'],		
			['Taiwan','tw','Kaohsiung','KH']
		];
		
		this.field = new fuFieldsFilter2Level.FieldFilter('', this.getFirstOptions(this.options), this.validate1);
		this.appendDummyInput()
			.appendField(this.field, 'FILTER1');
		this.appendDummyInput()
			.appendField('', 'VALUE1');		
			
		this.field2 = new fuFieldsFilter2Level.FieldFilter('', [], this.validate2);
		this.appendDummyInput('zone')
			.appendField(this.field2, 'FILTER2');	
		this.appendDummyInput()
			.appendField('', 'VALUE2');		

		this.setInputsInline(true);		
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(100);	
	  },
	  validate1: function(newValue) {
		const block = this.sourceBlock_;
		if (newValue=="") {
			if (block.field.WORDS) {
				if (block.field.WORDS.length>0) {
					block.options.forEach(function(element1) {
						if (element1[0]==block.field.WORDS[0]) {
							block.setFieldValue(element1[1], 'VALUE1');
							block.zoneOptions(element1);
						}
					})				
				}
			}
			else {
				block.setFieldValue('', 'VALUE1');
				block.setFieldValue('', 'VALUE2');
			}
		}
		else {
			block.options.forEach(function(element1) {
				if (element1[0]==block.field.WORDS[Number(newValue)]) {
					block.setFieldValue(element1[1], 'VALUE1');
					block.zoneOptions(element1);
				}
			})
		}
	  },
	  validate2: function(newValue) {
		const block = this.sourceBlock_;
		if (newValue=="") {
			if (block.field2.WORDS) {
				if (block.field2.WORDS.length>0) {
					block.options.forEach(function(element) {
						if (element[2]==block.field2.WORDS[0]) {
							block.setFieldValue(element[3], 'VALUE2');						
						}
					})				
				}
			}
			else {
				block.setFieldValue('', 'VALUE2');
			}
		}
		else {
			block.options.forEach(function(element) {
				if (element[2]==block.field2.WORDS[Number(newValue)]) {
					block.setFieldValue(element[3], 'VALUE2');
				}
			})
		}
	  },
	  zoneOptions: function(element1) {
			var options2 = [];
			this.options.forEach(function(element2) {
				if (element1[0]==element2[0])
					options2.push(element2[2])
			})
			this.field2 = new fuFieldsFilter2Level.FieldFilter('', options2, this.validate2);
			if (this.getField("FILTER2"))
				this.getInput("zone").removeField("FILTER2");
			this.getInput("zone").appendField(this.field2, 'FILTER2');
			this.setFieldValue('', 'VALUE2');
	  },
	  getFirstOptions: function(options) {
		var opt = [];
		options.forEach(function(element) {
			if (!opt.includes(element[0]))
				opt.push(element[0])
		}); 
		return opt;
	  }
	};

	Blockly.JavaScript['test'] = function(block) {
	  return this.getFieldValue('VALUE1')+","+this.getFieldValue('VALUE2');
	};
	
})	

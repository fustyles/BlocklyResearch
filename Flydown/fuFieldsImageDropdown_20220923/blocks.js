/**
 * @license
 * Copyright 2013 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */


/**
 * @license
 * Copyright 2022 Taiwan (ChungYi Fu)
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Field FieldsImageDropdown.
 * @author https://www.facebook.com/francefu/
 * @Update 9/27/2022 00:00 (Taiwan Standard Time)
 */
 
 /*
 //blocks.js
 
	Blockly.Blocks["test"] = {
	  init: function() {
	  
		// Option Type 1:  [value] 
		// Option Type 2:  [value, imageSrc]
		// Option Type 3:  [name, imageSrc, value]
		var options = [
			['CLOUDY', "https://imgur.com/Hi33BEx.png"],
			['PARTLY CLOUDY', "https://imgur.com/rX0np7I.png"],
			['MOON', "https://imgur.com/ulJIWW4.png"],
			['RAIN', "https://imgur.com/wRwu4pZ.png"],
			['STAR', "https://imgur.com/KMWOcGf.png"]
		];
		
		var dropdownWidth = 200;
		var dropdownHeight = 100;		  
		  
		var imageField = new Blockly.FieldImage(options[0][1], 18, 18, { alt: "*", flipRtl: "FALSE" });
		
		var field = new fuFieldsImageDropdown.eventparam('', options, this.validate, dropdownWidth, dropdownHeight, imageField);
		//var field = new fuFieldsImageDropdown.eventparam('', options);
		
		this.appendDummyInput()
			.appendField(imageField, "image");
		this.appendDummyInput()
			.appendField(field, 'imageDropdown');
						
		this.setInputsInline(true);		
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(100);
		
	  },
	  validate: function(newValue) {
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
	
	
	//************************************************
	

	var fuFieldsImageDropdown = fuFieldsImageDropdown||{};

	fuFieldsImageDropdown.eventparam = function(text, options, opt_validate, opt_width, opt_height, opt_imageField) {
	  fuFieldsImageDropdown.eventparam.superClass_.constructor.call(this, text, opt_validate);
	  this.textSize = 14;
	  this.imageSize = 24;
	  this.divRowHeight = 30.8;    //If you change textSize value or imageSize value, you need to get divRowHeight value by testing.
	  
	  this.divWidth = opt_width||200;
	  this.divHeight = opt_height||100;
	  this.imageField = opt_imageField||null;
	  
	  this.divPadding = 5;
	  this.originList = options;
	  this.showList = [];

	  this.setSpellcheck(false);
	  this.clickWrapper_ = null;
	  this.moveWrapper_ = null;
	  this.downWrapper_ = null;	
	};
	Blockly.utils.object.inherits(fuFieldsImageDropdown.eventparam, Blockly.FieldTextInput);

	fuFieldsImageDropdown.eventparam.fromJson = function(options) {
	  return new fuFieldsImageDropdown.eventparam(options['FieldsImageDropdown']);
	};

	fuFieldsImageDropdown.eventparam.prototype.showEditor_ = function() {
	  fuFieldsImageDropdown.eventparam.superClass_.showEditor_.call(this);

	  var div = Blockly.WidgetDiv.getDiv();
	  if (!div.firstChild) {
		return;
	  }
	  var editor = this.dropdownCreate_();
	  Blockly.DropDownDiv.getContentDiv().appendChild(editor);

	  Blockly.DropDownDiv.setColour(this.sourceBlock_.style.colourPrimary,this.sourceBlock_.style.colourTertiary);

	  Blockly.DropDownDiv.showPositionedByField(
		  this, this.dropdownDispose_.bind(this));

	  this.clickWrapper_ =
		  Blockly.browserEvents.bind(this.imageElement_, 'click', this,
			  this.hide_);
	  this.moveWrapper_ =
		  Blockly.browserEvents.bind(this.imageElement_, 'mousemove', this,
			  this.onMouseMove);
	  this.downWrapper_ =
		  Blockly.browserEvents.bind(this.imageElement_, 'mousedown', this,
			  this.onMouseDown);
			  
	  this.updateGraph_();
	};

	fuFieldsImageDropdown.eventparam.prototype.dropdownCreate_ = function() {
	  this.imageElement_ = document.createElement('div');
	  this.imageElement_.id = 'FieldsImageDropdown';
	  this.imageElement_.style = 'padding: '+this.divPadding+'px '+this.divPadding+'px '+this.divPadding+'px '+this.divPadding+'px; height: '+this.divHeight+'px;width: '+this.divWidth+'px;size: '+this.textSize+'px;white-space:nowrap;';
	  this.showList = [];
	  for (var j=0;j<this.originList.length;j++) {
		this.showList.push('<img src="'+this.originList[j][1]+'" style="width:'+this.imageSize+'px;height:'+this.imageSize+'px;">' + '　' + '<span style="width: 100%;display: inline-block;vertical-align: top;line-height: normal;">' + this.originList[j][0] + '</span>');
	  }	  
	  this.imageElement_.innerHTML = this.showList.join("<br>");
	  return this.imageElement_;
	};

	fuFieldsImageDropdown.eventparam.prototype.dropdownDispose_ = function() {
	  if (this.clickWrapper_) {
		Blockly.browserEvents.unbind(this.clickWrapper_);
		this.clickWrapper_ = null;
	  }
	  if (this.moveWrapper_) {
		Blockly.browserEvents.unbind(this.moveWrapper_);
		this.moveWrapper_ = null;
	  }
	  if (this.downWrapper_) {
		Blockly.browserEvents.unbind(this.downWrapper_);
		this.downWrapper_ = null;
	  }  
	  this.imageElement_ = null;
	};

	fuFieldsImageDropdown.eventparam.prototype.hide_ = function() {
	  Blockly.WidgetDiv.hide();
	  Blockly.DropDownDiv.hideWithoutAnimation();
	};

	fuFieldsImageDropdown.eventparam.prototype.onMouseMove = function(e) {
	  var bBox = this.imageElement_.getBoundingClientRect();
	  var scrolltop = this.imageElement_.firstChild.scrollTop;
	  var dy = e.clientY - bBox.top + scrolltop;
	  
	  var highLight = Array.from(this.showList);
	  var index = (Math.round((dy-this.divPadding)/this.divRowHeight)<highLight.length)?Math.round((dy-this.divPadding)/this.divRowHeight):-1;
	  if (index!=-1)
		highLight[index] = "<font color='white'>" + highLight[index] + "</font>";
	  this.imageElement_.innerHTML = highLight.join("<br>");
	};

	fuFieldsImageDropdown.eventparam.prototype.onMouseDown = function(e) {
	  var bBox = this.imageElement_.getBoundingClientRect();
	  var scrolltop = this.imageElement_.firstChild.scrollTop;
	  var dy = e.clientY - bBox.top + scrolltop;
	  var index = (Math.round((dy-this.divPadding)/this.divRowHeight)<this.showList.length)?Math.round((dy-this.divPadding)/this.divRowHeight):-1;
	  this.setEditorValue_(index);
	};

	fuFieldsImageDropdown.eventparam.prototype.valueToText = function(value) {
	  if (this.showList) {
		  if (this.originList[Number(value)].length>2)
			return this.originList[Number(value)][2];
		  else
			return this.originList[Number(value)][0];
	  }
	  else
		  return "";
	};

	fuFieldsImageDropdown.eventparam.prototype.textToValue = function(text) {		
	  var normalizedText = text.trim();
	  for (var i=0;i< this.originList.length;i++) {
		  if (this.originList[i].length>2)
			var txt = this.originList[i][2];
		  else
			var txt = this.originList[i][0];
		  if (txt.toUpperCase()==text.toUpperCase()) 
			  return i;
	  }
	  return -1;
	};

	fuFieldsImageDropdown.eventparam.prototype.getText_ = function() {
	  if (this.isBeingEdited_) {
		return fuFieldsImageDropdown.eventparam.superClass_.getText_.call(this);
	  }
	  return this.valueToText(this.getValue()) || null;
	};

	fuFieldsImageDropdown.eventparam.prototype.getEditorText_ = function(value) {	
	  return this.valueToText(value);
	};

	fuFieldsImageDropdown.eventparam.prototype.getValueFromEditorText_ = function(text) {		
	  return this.textToValue(text);
	};

	fuFieldsImageDropdown.eventparam.prototype.render_ = function() {
	  fuFieldsImageDropdown.eventparam.superClass_.render_.call(this);
	  this.updateGraph_();
	};

	fuFieldsImageDropdown.eventparam.prototype.updateGraph_ = function() {
	  if (!this.imageElement_) {
		return;
	  }
	};

	fuFieldsImageDropdown.eventparam.prototype.doClassValidation_ = function(opt_newValue) {	
	  if (opt_newValue === null || opt_newValue === undefined || opt_newValue == -1) {
		return null;
	  }
	  var index = this.valueToText(opt_newValue); 
	  if (index) {
		if (this.imageField&&this.originList) {
			this.imageField.setValue(this.originList[opt_newValue][1]);
		}
		return opt_newValue;
	  }
	  return 0;
	};



	//************************************************
		
	Blockly.Blocks["test1"] = {
	  init: function() {
		  
		var options = [
			['CLOUDY', "https://imgur.com/Hi33BEx.png"],
			['PARTLY CLOUDY', "https://imgur.com/rX0np7I.png"],
			['MOON', "https://imgur.com/ulJIWW4.png"],
			['RAIN', "https://imgur.com/wRwu4pZ.png"],
			['STAR', "https://imgur.com/KMWOcGf.png"]
		];
		var dropdownWidth = 200;
		var dropdownHeight = 100;		  
		  
		var imageField = new Blockly.FieldImage(options[0][1], 18, 18, { alt: "*", flipRtl: "FALSE" });
		var field = new fuFieldsImageDropdown.eventparam('', options, this.validate, dropdownWidth, dropdownHeight, imageField);
		
		this.appendDummyInput()
			.appendField(imageField, "image");
		this.appendDummyInput()
			.appendField(field, 'imageDropdown');
						
		this.setInputsInline(true);		
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(100);
		  
	  },
	  validate: function(newValue) {
	  }
	};
	
	Blockly.Blocks["test2"] = {
	  init: function() {
		  
		var options = [
			['CLOUDY', "https://imgur.com/Hi33BEx.png", "ccc"],
			['PARTLY CLOUDY', "https://imgur.com/rX0np7I.png", "ppp"],
			['MOON', "https://imgur.com/ulJIWW4.png", "mmm"],
			['RAIN', "https://imgur.com/wRwu4pZ.png", "rrr"],
			['STAR', "https://imgur.com/KMWOcGf.png", "sss"]
		];
		var dropdownWidth = 200;
		var dropdownHeight = 100;		  
		  
		var imageField = new Blockly.FieldImage(options[0][1], 18, 18, { alt: "*", flipRtl: "FALSE" });
		var field = new fuFieldsImageDropdown.eventparam('', options, this.validate, dropdownWidth, dropdownHeight, imageField);
		
		this.appendDummyInput()
			.appendField(imageField, "image");
		this.appendDummyInput()
			.appendField(field, 'imageDropdown');
						
		this.setInputsInline(true);		
		this.setPreviousStatement(true, null);
		this.setNextStatement(true, null);
		this.setColour(100);
		  
	  },
	  validate: function(newValue) {
	  }
	};
	
	Blockly.JavaScript['test1'] = function(block) {
	  return '';
	};	
	
	Blockly.JavaScript['test2'] = function(block) {
	  return '';
	};
	
})	

'use strict';

const test1 = {
  init: function() {
	this.appendDummyInput()
		.appendField(Blockly.Msg["HELLOWORLD_MSG"]);
	this.appendValueInput("message")
		.setCheck("String");
	this.setInputsInline(!0);
	this.setPreviousStatement(!0);
	this.setNextStatement(!0);		  
	this.setColour(Blockly.Msg["HELLOWORLD_HUE"]);
  }
};
Blockly.common.defineBlocks({test1: test1});

const test2 = {
  init: function() {
	this.appendDummyInput()
		.appendField(Blockly.Msg["HELLOWORLD_GET"]);
	this.setInputsInline(!0);
	this.setOutput(!0);	  
	this.setColour(Blockly.Msg["HELLOWORLD_HUE"]);
  }
};
Blockly.common.defineBlocks({test2: test2});

const test3 = {
  init: function() {
	this.appendDummyInput()
		.appendField(Blockly.Msg["HELLOWORLD_DELAY"]);
	this.appendValueInput("seconds")
		.setCheck("Number");		
	this.setInputsInline(!0);
	this.setPreviousStatement(!0);
	this.setNextStatement(!0);		  
	this.setColour(Blockly.Msg["HELLOWORLD_HUE"]);
  }
};
Blockly.common.defineBlocks({test3: test3});
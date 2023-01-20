/*
Last Update Time : 1/20/2023 00:00 (Taiwan Standard Time)

Author: ChungYi Fu, Taiwan
https://github.com/fustyles
https://www.facebook.com/francefu/


*/

var catMyProcedure ='<category id="catMyProcedure" name="%{BKY_MYPROCEDURE_TITLE}" colour="%{BKY_MYPROCEDURE_HUE}"  custom="MYPROCEDURE"></category>';

Blockly.Msg["MYPROCEDURE_TITLE"] = "myProcedure";
Blockly.Msg["MYPROCEDURE_HUE"] = "120";

Blockly.myProcedure={};
Blockly.myProcedure_CATEGORY_NAME="MYPROCEDURE";
Blockly.myProcedure.NAME_TYPE=Blockly.myProcedure_CATEGORY_NAME;

Blockly.Blocks['test'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("NAME")
        .appendField(new Blockly.FieldTextInput(""), "NAME");
    this.setColour(230);
  }
};

Blockly.JavaScript['test'] = function(block) {
  var text_name = block.getFieldValue('NAME');
  var code = '...;\n';
  return code;
};

Blockly.myProcedure.flyoutCategory=function(workspace){
	var categoryBlocks = [];
	var blocksNAME = [""];
	categoryBlocks.push(Blockly.Xml.textToDom('<block xmlns="https://developers.google.com/blockly/xml" type="test"><field name="NAME"></field></block>'));
	
	var blocks = workspace.getBlocksByType("test", true);
	for (var i=0;i<blocks.length;i++){
		var value = blocks[i].getFieldValue("NAME");
		if (value!=""&&blocksNAME.indexOf(value)==-1) {
			blocksNAME.push(value);
			categoryBlocks.push(Blockly.Xml.textToDom('<block xmlns="https://developers.google.com/blockly/xml" type="test"><field name="NAME">'+value+'</field></block>'));
		}
	}
	return categoryBlocks;
};

var checkMyProcedure = function(){
	if(Blockly.getMainWorkspace() == null){
		setTimeout(checkMyProcedure, 200);
	} else {
		Blockly.myProcedure&&Blockly.myProcedure.flyoutCategory&&(Blockly.getMainWorkspace().registerToolboxCategoryCallback(Blockly.myProcedure_CATEGORY_NAME, Blockly.myProcedure.flyoutCategory));
	}
};
checkMyProcedure();


/**
 * @license
 * Copyright 2022 Taiwan (ChungYi Fu)
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview ImageField Flydown.
 * @author https://www.facebook.com/francefu/
 * @Update 8/21/2022 01:30 (Taiwan Standard Time)
 */

Blockly.Blocks['test'] = {
  init: function() {
	var imageToBase64String = function() {
		var block = this.sourceBlock_;
		var file=document.createElement('input');
		file.type="file";
		var image = document.createElement('img');
		
		image.onload = function (event) {
			block.setFieldValue("", "imageBase64String");
			const canvas = document.createElement('canvas');
			const context = canvas.getContext('2d');
			canvas.width = image.width;
			canvas.height = image.height;
			
			context.fillStyle="#FFFFFF";
			context.fillRect(0, 0, canvas.width, canvas.height);
			context.drawImage(image,0,0,image.width,image.height);
			
			block.setFieldValue(canvas.toDataURL(), "imageBase64String");
			
			const canvas1 = document.createElement('canvas');
			const context1 = canvas1.getContext('2d');
			canvas1.width = canvas.width*30/canvas.height;
			canvas1.height = 30;
			context1.drawImage(canvas,0,0,canvas.width,canvas.height,0,0,canvas1.width,canvas1.height);
			
			block.setFieldValue(canvas1.toDataURL()+" "+canvas1.width+" "+canvas1.height, "previewImageBase64String");
			
			document.body.appendChild(canvas1);
			canvas1.parentNode.removeChild(canvas1);
			document.body.appendChild(canvas);
			canvas.parentNode.removeChild(canvas);
			document.body.appendChild(file);
			file.parentNode.removeChild(file);			
		}
		
		
		file.onchange = function (event) {
			var target = event.target || window.event.srcElement;
			var files = target.files;
			if (FileReader && files && files.length) {
				var fr = new FileReader();
					fr.onload = function () {    
					image.src = fr.result;
				}
				fr.readAsDataURL(files[0]);
				file.parentNode.removeChild(file);
			}
		}
		document.body.appendChild(file);
		file.click();
    };
		
	var field = new Blockly.FieldImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAADyUlEQVRIieXVS0xcVRzH8e85l3nAUBCsaZHUqrDQAsWZdGekj8RXVzR10qUwJERXLtTEREPARle6Nl3AMEljGmnorlZjBNpoWzVAQoFKIRFqB9raymNGZu7ce/8uhiG8hOFRY+JvdW/yP+dz/+feew7836KyKQoGg7k+n++w1vopx3GKtNZ/ish4LBa73NHRMb/jcENDQ7lt281KqRNA3holfwGdjuM0RyKRsR2BQ6HQ+yLyCeDClYvaW4EqfBI8+ZCMITNRZOoGpBIAJvBhOBz+bFtwfX39GaCRHA/6wHEoq0EZ7lV1YpvIaDcyfAmsJMCZcDj8VjawsVanwAfkFaFr3kGVVqN0ukwr8OQoHAEBlDZQu8vQJZXI5ABYiUOBQCDW19d3dVMdh0KhZ0VkmByPWx99L720wO5cRcUTBnvyFEql0btxYfC+zR/zkh48cwe763OwkqbWuqK1tXV0PVgvvXEc52PArQ8cX0TLizTH9ueQsISe2xYXx1L0TFgkLOHY/hzKixamKCxFP/8agFtEmjbqeBEOBoO5SqlaXLlQVrNYUJqvuBa1uR61uRsX5sx0t9ejNteiNvsKljx7+RFweRGRk42NjWv9Bavh/Pz8GsCnSiqXfUg9t20mZp01B0/MOnSNW4v3ynCj91YC5Jmm+WJWMPA0AAtLvNVIQUl6Yq2fyRYuBlBu37Zg5d2VfgCRx7OClVIPAEjGtgWTnMtc3c8KFpFxAJmJbsvNjM/MtyEci8UuA3GZuoHY5tZU20SmhgBiwJWs4IVT5gKpBDLavSVXbn0PqXmAzvb29kRWMIBhGE1AUoYvwcydzaHTv+Pc/BbAXNiI1s2yvbq3t3fa7/cncOxXZHIAvec58BZkhcoPX4AZR0TaI5FIZFMwQH9//49+v78EK3FIJn5CKQVF+xYPimWxTWTkO5xfzmZQWylV5ff7B/r7+39dD17vPH5XRD4F3Li86R2psAQ8uyA5t3AeD2XeqQmEgTcBbyJlpaYTqdNfnz93OuuOM+nr67saCAS+VEoVY1vlMht1y70RZHIAuTcCs5PgWHHgnGEYb7S1tZ0NBAI/z5vWqYmHc+75ZOrowepqbg0p9myq46Wpq6vzAi+R3laLgYfAb8CVlV/vyyeCLXPzZpNIevJin6f5YudXLVuCN5tXTwRbZjbA/3Gpt5Oxm0PdFZVVRtJ2DguQSNlHVi77I4EX8K6KqoOupGXXZPCqF6qjo8ODvbBiA9npfHOh46PCPE+TUgqvy3igE/Hzj9JblddPnnq7trb2sX8V/c/lbwo9q8gJVNowAAAAAElFTkSuQmCC", 30, 30, { alt: "*", flipRtl: "FALSE" });
	field.setOnClickHandler(imageToBase64String);
	
	this.appendDummyInput()
		.appendField(field);
    this.appendDummyInput("previewImage");		
    this.appendDummyInput()
		.appendField(new Blockly.FieldLabelSerializable(""), "imageBase64String");
    this.appendDummyInput()
		.appendField(new Blockly.FieldLabelSerializable(""), "previewImageBase64String");
	this.getField("previewImageBase64String").setVisible(false);
	this.getField("previewImageBase64String").setValidator(this.previewImageChanged);	
		
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(100);
  },
	previewImageChanged: function(newValue) {
		const block = this.sourceBlock_;
		if (newValue!="") {
			var image = newValue.split(" ");
			var previewFieldImage = new Blockly.FieldImage(image[0], image[1]||30, image[2]||30, { alt: "*", flipRtl: "FALSE" });
			if (block.getField("icon"))
				block.getInput("previewImage").removeField("icon");
			block.getInput("previewImage").appendField(previewFieldImage, "icon");
		}	
	}
};

Blockly.JavaScript['test'] = function(block) {
  return '';
};

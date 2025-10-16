/**
 * @license
 * Copyright 2025 Taiwan (ChungYi Fu)
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview FieldZelosLabelBackground field.
 * @author https://www.facebook.com/francefu/
 * @Update 10/16/2025 19:00 (Taiwan Standard Time)
 */

/*
Blockly.Blocks['test'] = {
  init: function() {
    this.appendDummyInput()
		.appendField(new FieldZelosLabelBackground('Taiwan', null, {
			textColor: '#FFFFFF',
			backgroundColor: '#FD6723',
			shapeType: 0
		}));	
    this.appendDummyInput()
		.appendField(new FieldZelosLabelBackground('Hello', null, {
			textColor: '#FFFFFF',
			backgroundColor: '#CC9900',
			shapeType: 1
		}));	
    this.appendDummyInput()
		.appendField(new FieldZelosLabelBackground('World', null, {
			textColor: '#FFFFFF',
			backgroundColor: '#59C059',
			shapeType: 2
		}));
    this.appendDummyInput()
		.appendField(new FieldZelosLabelBackground('OK', null, {
			textColor: '#FFFFFF',
			backgroundColor: '#5CB1D6',
			shapeType: 3
		}));	
    this.setInputsInline(true);	  
	this.setPreviousStatement(0);
	this.setNextStatement(!0);
    this.setStyle('control_blocks');
  }
};
*/
 
'use strict';

document.addEventListener('DOMContentLoaded', function() {

	class FieldZelosLabelBackground extends Blockly.FieldLabelSerializable {
	    static KEY_ = 'field_zelos_label_background';
		
	    static SHAPE_TYPES = {
	        SQUARE: 0,
	        OVAL: 1,
	        HEXAGON: 2,
	        DIAMOND: 3		
	    };	
	
		static getRoundRectPath(x, y, width, height, radius) {
			return `M ${x + radius},${y}
					h ${width - 2 * radius}
					a ${radius},${radius} 0 0 1 ${radius},${radius}
					v ${height - 2 * radius}
					a ${radius},${radius} 0 0 1 -${radius},${radius}
					h -${width - 2 * radius}
					a ${radius},${radius} 0 0 1 -${radius},-${radius}
					v -${height - 2 * radius}
					a ${radius},${radius} 0 0 1 ${radius},-${radius}
					z`;
		}
		
		static getHexagonPath(width, height) {
			const slant = height / 2;
	
			const x = 0;
			const y = 0;
	
			const path = [
				`M ${x + slant},${y}`,
				`l ${width},0`,
				`l ${slant},${height / 2}`,
				`l -${slant},${height / 2}`,
				`l -${width},0`,
				`l -${slant},-${height / 2}`,
			];
	
			return path.join(' ');
		}
	
		static getDiamondPath(width, height) {
	        const halfWidth = width / 2;
	        const halfHeight = height / 2;
	
	        const x = 0;
	        const y = 0;
	
	        const path = [
	            `M ${x + halfWidth},${y}`,
	            `L ${x + width},${y + halfHeight}`,
	            `L ${x + halfWidth},${y + height}`,
	            `L ${x},${y + halfHeight}`,
	            'Z'
	        ];
	
	        return path.join(' ');
	    }
		
	
	    constructor(value, opt_class, opt_config) {
	        super(value || '  ', null, opt_config); 
			
			opt_config = opt_config || {};
			
			this.textColor_ = opt_config.textColor || '#FFFFFF';
			this.backgroundColor_ = opt_config.backgroundColor || '#FD6723';
			this.backgroundStyle_ = opt_config.shapeType || 0;
	    } 
	
	    initView() {
	        super.initView();
	        
	        if (this.fieldBorderRect_) {
	            this.fieldBorderRect_.remove();
	        }
	
	        this.fieldBorderRect_ = Blockly.utils.dom.createSvgElement(
	            Blockly.utils.Svg.PATH,
	            {
	                'class': 'blocklyFieldRect blocklyFieldZelosLabelPath',
	                'fill': '#FFFFFF', 
	                'stroke': '#FFFFFF' 
	            },
	            this.fieldGroup_
	        );
	        
	        this.fieldGroup_.insertBefore(this.fieldBorderRect_, this.textElement_);
	        this.textElement_.style.fill = this.textColor_; 
	        this.applyColour(); 
	    }
	
	    applyColour() {
	        if (!this.fieldBorderRect_) {
	            return;
	        }
			
	        this.fieldBorderRect_.setAttribute('fill', this.backgroundColor_);
	        this.fieldBorderRect_.setAttribute('stroke', this.backgroundColor_);
			
	        if (this.textElement_) {
	             this.textElement_.style.fill = this.textColor_;
	        }		
	    }
	    
	    showEditor_() {
	      
	    }
	
	    updateSize_() {
	        super.updateSize_();
	
	        if (!this.fieldBorderRect_ || !this.sourceBlock_ || !this.sourceBlock_.workspace.getRenderer()) {
	            return;
	        }
	
	        //const renderer = this.sourceBlock_.workspace.getRenderer();
	        //const constants = renderer.getConstants ? renderer.getConstants() : renderer.constants_;
	
			const textWidth = this.textElement_.getComputedTextLength();
			let fieldHeight = 30;
			let cornerRadius = 0;
			let finalWidth = textWidth;
			let finalHeight = fieldHeight
			let gRectPath = "";
			let paddingLeft = 0;
			
			if (this.backgroundStyle_==0) { // Square
				cornerRadius = finalHeight / 6;
				finalWidth = textWidth + cornerRadius*2;
				gRectPath = FieldZelosLabelBackground.getRoundRectPath(
					0, 0, 
					finalWidth, 
					finalHeight, 
					cornerRadius 
				);
				paddingLeft = 5;
			} else if (this.backgroundStyle_==1) { // Oval
				cornerRadius = finalHeight / 2;
				finalWidth = textWidth + cornerRadius*2;
				gRectPath = FieldZelosLabelBackground.getRoundRectPath(
					0, 0, 
					finalWidth, 
					finalHeight, 
					cornerRadius 
				);
				paddingLeft = 14;
			} else if (this.backgroundStyle_==2) { // Hexagon
				finalWidth = textWidth + finalHeight;
				gRectPath = FieldZelosLabelBackground.getHexagonPath(textWidth, finalHeight);
				paddingLeft = 14;
			} else if (this.backgroundStyle_==3) { // Diamond
	            finalWidth = textWidth * 2;
	            gRectPath = FieldZelosLabelBackground.getDiamondPath(
	                finalWidth, 
	                finalHeight
	            );
				paddingLeft = finalWidth / 4;
			}
			
			this.fieldBorderRect_.setAttribute('d', gRectPath);
	
			this.size_.width = finalWidth;		
	        
	        const translateX = 0;
	        const translateY = -4; 
	        
	        this.fieldBorderRect_.setAttribute('transform', `translate(${translateX}, ${translateY})`);
	
	        this.textElement_.setAttribute('x', paddingLeft);
	        
	        this.applyColour();
			
	    } 
	}
	
	Blockly.FieldZelosLabelBackground = FieldZelosLabelBackground;
	
	Blockly.registry.register(
	    Blockly.registry.Type.FIELD,
	    FieldZelosLabelBackground.KEY_,
	    FieldZelosLabelBackground
	);

})




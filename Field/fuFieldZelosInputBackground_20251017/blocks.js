/**
 * @license
 * Copyright 2025 Taiwan (ChungYi Fu)
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview FieldZelosInputBackground field.
 * @author https://www.facebook.com/francefu/
 * @Update 10/17/2025 23:00 (Taiwan Standard Time)
 * @environment Blockly v10.0.0 Zelos renderer
 */

/*
Blockly.Blocks['test'] = {
  init: function() {
    this.appendDummyInput()
		.appendField(new FieldZelosInputBackground('Taiwan', null, {
			textColor: '#FFFFFF',
			backgroundColor: '#FD6723',
			shapeType: 0
		}));	
    this.appendDummyInput()
		.appendField(new FieldZelosInputBackground('Hello', null, {
			textColor: '#FFFFFF',
			backgroundColor: '#CC9900',
			shapeType: 1
		}));	
    this.appendDummyInput()
		.appendField(new FieldZelosInputBackground('World', null, {
			textColor: '#FFFFFF',
			backgroundColor: '#59C059',
			shapeType: 2
		}));
    this.appendDummyInput()
		.appendField(new FieldZelosInputBackground('OK', null, {
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

	class FieldZelosInputBackground extends Blockly.FieldTextInput {
		static KEY_ = 'field_zelos_input_background';
		
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
			super(value || '', null, opt_config);
			
			opt_config = opt_config || {};
			
			this.textColor_ = opt_config.textColor || '#FFFFFF';
			this.backgroundColor_ = opt_config.backgroundColor || '#FD6723';
			this.backgroundStyle_ = opt_config.shapeType || 0;
			
			this.customBackgroundPath_ = null;
		}   

		initView() {
			super.initView();
			
			if (this.borderRect_) {
				const firstClass = this.borderRect_.classList[0];
				
				if (firstClass) {
					this.borderRect_.classList.remove(firstClass);
				}
			}

			this.customBackgroundPath_ = Blockly.utils.dom.createSvgElement(
				Blockly.utils.Svg.PATH,
				{
					'class': 'blocklyFieldRect blocklyFieldZelosLabelPath',
					'fill': '#FFFFFF', 
					'stroke': '#FFFFFF' 
				},
				this.fieldGroup_
			);
			
			this.fieldGroup_.insertBefore(this.customBackgroundPath_, this.textElement_);

			this.borderRect_ = this.customBackgroundPath_;
			
			this.textElement_.style.fill = this.textColor_; 
			this.applyColour(); 
		}

		applyColour() {
			const borderRect = this.customBackgroundPath_;

			if (!borderRect) {
				return;
			}
			
			borderRect.setAttribute('fill', this.backgroundColor_);
			borderRect.setAttribute('stroke', this.backgroundColor_);
			
			if (this.textElement_) {
				 this.textElement_.style.fill = this.textColor_;
			}
			
			if (borderRect.style.stroke !== this.backgroundColor_) {
				 borderRect.setAttribute('stroke', this.backgroundColor_);
			}
		}

		updateSize_() {
			super.updateSize_();

			const borderRect = this.customBackgroundPath_;

			if (!borderRect) {
				return;
			}

			const textWidth = this.textElement_.getComputedTextLength();
			const fieldHeight = 30;
			
			let cornerRadius = 0;
			let finalWidth = textWidth;
			let finalHeight = fieldHeight; 
			let gRectPath = '';
			let paddingLeft = 0;
			
			if (this.backgroundStyle_ === FieldZelosInputBackground.SHAPE_TYPES.SQUARE) {
				cornerRadius = finalHeight / 6;
				finalWidth = textWidth + cornerRadius * 2;
				gRectPath = FieldZelosInputBackground.getRoundRectPath(0, 0, finalWidth, finalHeight, cornerRadius);
				paddingLeft = 5;
			} else if (this.backgroundStyle_ === FieldZelosInputBackground.SHAPE_TYPES.OVAL) {
				cornerRadius = finalHeight / 2;
				finalWidth = textWidth + cornerRadius * 2;
				gRectPath = FieldZelosInputBackground.getRoundRectPath(0, 0, finalWidth, finalHeight, cornerRadius);
				paddingLeft = 14;
			} else if (this.backgroundStyle_ === FieldZelosInputBackground.SHAPE_TYPES.HEXAGON) {
				finalWidth = textWidth + finalHeight; 
				gRectPath = FieldZelosInputBackground.getHexagonPath(textWidth, finalHeight);
				paddingLeft = 14; 
			} else if (this.backgroundStyle_ === FieldZelosInputBackground.SHAPE_TYPES.DIAMOND) {
				finalWidth = textWidth * 2; 
				gRectPath = FieldZelosInputBackground.getDiamondPath(finalWidth, finalHeight);
				paddingLeft = finalWidth / 4; 
			}
			
			borderRect.setAttribute('d', gRectPath);

			this.size_.width = finalWidth;
			this.size_.height = finalHeight; 

			const translateX = 0;
			const translateY = 2;

			borderRect.setAttribute('transform', `translate(${translateX}, ${translateY})`);

			this.textElement_.setAttribute('x', paddingLeft);
			
			this.applyColour();
		}   
	}

	Blockly.FieldZelosInputBackground = FieldZelosInputBackground;

	Blockly.registry.register(
		Blockly.registry.Type.FIELD,
		FieldZelosInputBackground.KEY_,
		FieldZelosInputBackground
	);

})






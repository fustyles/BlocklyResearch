/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Overrides metrics to exclude the flyout from the viewport.
 */
 
class ContinuousMetrics extends Blockly.MetricsManager {
  /** @override */
  constructor(workspace) {
    super(workspace);
  }
  /**
   * Computes the viewport size to not include the toolbox and the flyout.
   * The default viewport includes the flyout.
   * @override
   */
  getViewMetrics(getWorkspaceCoordinates = undefined) {	  
    const scale = getWorkspaceCoordinates ? this.workspace_.scale : 1;
    const svgMetrics = this.getSvgMetrics();
    const toolboxMetrics = this.getToolboxMetrics();
    const flyoutMetrics = this.getFlyoutMetrics(false);
    const toolboxPosition = toolboxMetrics.position;

    if (this.workspace_.getToolbox()) {
      // Note: Not actually supported at this time due to ContinunousToolbox
      // only supporting a vertical flyout. But included for completeness.
      if (toolboxPosition == Blockly.TOOLBOX_AT_TOP ||
          toolboxPosition == Blockly.TOOLBOX_AT_BOTTOM) {
		if (this.workspace_.getToolbox().flyout_&&this.workspace_.getToolbox().flyout_.autoClose)
			svgMetrics.height -= toolboxMetrics.height;
		else			
			//svgMetrics.height -= toolboxMetrics.height + flyoutMetrics.height;
			svgMetrics.height -= toolboxMetrics.height;
      } else if (toolboxPosition == Blockly.TOOLBOX_AT_LEFT ||
          toolboxPosition == Blockly.TOOLBOX_AT_RIGHT) {
		if (this.workspace_.getToolbox().flyout_&&this.workspace_.getToolbox().flyout_.autoClose)
			svgMetrics.width -= toolboxMetrics.width;
		else
			//svgMetrics.width -= toolboxMetrics.width + flyoutMetrics.width;
			svgMetrics.width -= toolboxMetrics.width;
      }
    }
	
    return {
      height: svgMetrics.height / scale,
      width: svgMetrics.width / scale,
      top: -this.workspace_.scrollY / scale,
      left: -this.workspace_.scrollX / scale,
    };
  }

  /**
   * Moves the absoluteLeft and absoluteTop so they no longer include the
   * flyout.
   * @override
   */
  getAbsoluteMetrics() {	  
    const toolboxMetrics = this.getToolboxMetrics();
    const flyoutMetrics = this.getFlyoutMetrics(false);
    const toolboxPosition = toolboxMetrics.position;
    let absoluteLeft = 0;

    if (this.workspace_.getToolbox() && toolboxPosition == Blockly.TOOLBOX_AT_LEFT) {
		if (this.workspace_.getToolbox().flyout_&&this.workspace_.getToolbox().flyout_.autoClose)
			absoluteLeft = toolboxMetrics.width;
		else
			//absoluteLeft = toolboxMetrics.width + flyoutMetrics.width;
			absoluteLeft = toolboxMetrics.width;
    }
    let absoluteTop = 0;
    if (this.workspace_.getToolbox() && toolboxPosition == Blockly.TOOLBOX_AT_TOP) {
		if (this.workspace_.getToolbox().flyout_&&this.workspace_.getToolbox().flyout_.autoClose)
			absoluteTop = toolboxMetrics.height;
		else
			//absoluteTop = toolboxMetrics.height + flyoutMetrics.height;
			absoluteTop = toolboxMetrics.height;
    }
    return {
      top: absoluteTop,
      left: absoluteLeft,
    };
  }
}

Blockly.registry.register(Blockly.registry.Type.METRICS_MANAGER,
    'CustomMetricsManager', ContinuousMetrics);

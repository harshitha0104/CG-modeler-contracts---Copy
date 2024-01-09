"use strict";

///////////////////////////////////////////////////////////////////////////////////////////////
//                 IMPORTANT - DO NOT MODIFY AUTO-GENERATED CODE OR COMMENTS                 //
//Parts of this file are auto-generated and modifications to those sections will be          //
//overwritten. You are allowed to modify:                                                    //
// - the tags in the jsDoc as described in the corresponding section                         //
// - the function name and its parameters                                                    //
// - the function body between the insertion ranges                                          //
//         "Add your customizing javaScript code below / above"                              //
//                                                                                           //
// NOTE:                                                                                     //
// - If you have created PRE and POST functions, they will be executed in the same order     //
//   as before.                                                                              //
// - If you have created a REPLACE to override core function, only the REPLACE function will //
//   be executed. PRE and POST functions will be executed in the same order as before.       //
//                                                                                           //
// - For new customizations, you can directly modify this file. There is no need to use the  //
//   PRE, POST, and REPLACE functions.                                                       //
//                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Use the following jsDoc tags to describe the BL function. Setting these tags will
 * change the runtime behavior in the mobile app. The values specified in the tags determine
 * the name of the contract file. The filename format is “@this . @function .bl.js”.
 * For example, LoVisit.BeforeLoadAsync.bl.js
 * -> function: Name of the businessLogic function.
 * -> this: The LO, BO, or LU object that this function belongs to (and it is part of the filename).
 * -> kind: Type of object this function belongs to. Most common value is "businessobject".
 * -> async: If declared as async then the function should return a promise.
 * -> param: List of parameters the function accepts. Make sure the parameters match the function signature.
 * -> module: Use CORE or CUSTOM. If you are a Salesforce client or an implementation partner, always use CUSTOM to enable a seamless release upgrade.
 * -> extends: Base class of the LO, BO, and LU objects that this function belongs to.
 * -> maxRuntime: Maximum time this function is allowed to run, takes integer value in ms. If the max time is exceeded, error is logged.
 * -> returns: Type and variable name in which the return value is stored.
 * @function getStyledTooltipFunction
 * @this BoChartHelper
 * @kind businessobject
 * @namespace CORE
 * @returns tooltipFunction
 */
function getStyledTooltipFunction(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
    
var tooltipFunction = function (d, defaultTitleFormat, defaultValueFormat, color) {
	var $$ = this,
	config = $$.config,
	titleFormat = config.tooltip_format_title || defaultTitleFormat,
	nameFormat = config.tooltip_format_name || function (name) {
		return name;
	},
	valueFormat = config.tooltip_format_value || defaultValueFormat,
	text,
	i,
	title,
	value,
	name,
	bgcolor;
	for (i = 0; i < d.length; i++) {
		if (!(d[i] && (d[i].value || d[i].value === 0))) {
			continue;
		}

		if (!text) {
			title = titleFormat ? titleFormat(d[i].x) : d[i].x;
			text = "<table class='c3-tooltip'>" + (title || title === 0 ? "<tr><th colspan='2' style='background-color: #666e81'>" + title + "</th></tr>" : "");
		}

		value = valueFormat(d[i].value, d[i].ratio, d[i].id, d[i].index);
		if (value !== undefined) {
			name = nameFormat(d[i].name, d[i].ratio, d[i].id, d[i].index);
			bgcolor = $$.levelColor ? $$.levelColor(d[i].value) : color(d[i].id);

			text += "<tr class='c3-tooltip-name-" + d[i].id + "'>";
			text += "<td class='name' style='background-color: #eeeeee; color: #000000'><span style='background-color:" + bgcolor + "'></span>" + name + "</td>";
			text += "<td class='value' style='color: #000000'>" + value + "</td>";
			text += "</tr>";
		}
	}
	return text + "</table>";
};

		
   
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return tooltipFunction;
}
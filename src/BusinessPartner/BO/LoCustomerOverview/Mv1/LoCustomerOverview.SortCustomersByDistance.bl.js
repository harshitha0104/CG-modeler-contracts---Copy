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
 * @function sortCustomersByDistance
 * @this LoCustomerOverview
 * @kind listobject
 * @namespace CORE
 * @param {String} currentLatitude
 * @param {String} currentLongitude
 */
function sortCustomersByDistance(currentLatitude, currentLongitude){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var customersList = me.getAllItems();
var customerLatitude;
var customerLongitude;
var milesToYardFactor = 1760;
var kmToMeterFactor = 1000;

if(Utils.isDefined(currentLatitude) && Utils.isDefined(currentLongitude)){   
  for (var i = 0; i<customersList.length;i++)  {
    customerLatitude = customersList[i].latitude;
    customerLongitude = customersList[i].longitude; 
	var customerLatAndLongAreUndefined = !(Utils.isDefined(customerLatitude) && Utils.isDefined(customerLongitude));
    var customerLatAndLongAreZero = (customerLatitude === 0.0 && customerLongitude === 0.0);
    if( customerLatAndLongAreZero || customerLatAndLongAreUndefined) {
      //For unknown location - it will display in end of the list      
      customersList[i].grouping1 = '# Unknown'; 
      customersList[i].setSortText(0 +' Miles');
      customersList[i].setDistance(NaN);
    }
    else {
      var distanceUnit = ApplicationContext.get('user').getDistanceUnit();
      //Caluclate the distance between current user's location and customers's location
      var deviation = Utils.distanceBetween(currentLatitude, currentLongitude, customerLatitude, customerLongitude, distanceUnit);      

      if(Utils.isEmptyString(customersList[i].getName().trim())) {
        customersList[i].setDistance(padWithZeros(deviation.toFixed(1), 8));
      }
      else {
        customersList[i].setDistance(deviation.toFixed(8));
      }
      // Set the grouptext and distancetext in order to display the customer list in ascending order.
      // Space is added in group text to sort the group in ascending order.
      switch (distanceUnit) { 
        case 'miles':
          switch (1) {
            case (Math.abs(deviation <= 0.00284091)): 
              customersList[i].grouping1 = '    5 Y';
              customersList[i].setDistanceText((deviation*milesToYardFactor).toFixed(1)+' Y'); 
              break;
            case (Math.abs(deviation > 0.00284091) && Math.abs(deviation <= 0.0284091)): 
              customersList[i].grouping1 = '    50 Y';   
              customersList[i].setDistanceText((deviation*milesToYardFactor).toFixed(1)+' Y');                
              break;
            case (Math.abs(deviation > 0.0284091) && Math.abs(deviation <= 0.284091)): 
              customersList[i].grouping1 = '    500 Y';
              customersList[i].setDistanceText((deviation*milesToYardFactor).toFixed(1)+' Y');
              break;
            case (Math.abs(deviation > 0.284091) && Math.abs(deviation <= 5)):
              //Show the distance value in Yards if it is less than 1 Mile
              if(Math.abs(deviation < 1.0)) {
                customersList[i].setDistanceText((deviation*milesToYardFactor).toFixed(1)+' Y');
              }
              else {
                customersList[i].setDistanceText(deviation.toFixed(1)+' Miles');
              }
              customersList[i].grouping1 = '   5 Miles';               
              break;
            case (Math.abs(deviation > 5) && Math.abs(deviation <= 10)): 
              customersList[i].grouping1 = '  10 Miles';
              customersList[i].setDistanceText(deviation.toFixed(1)+' Miles');
              break;
            case (Math.abs(deviation > 10) && Math.abs(deviation <= 20)):  
              customersList[i].grouping1 = '  20 Miles';
              customersList[i].setDistanceText(deviation.toFixed(1)+' Miles');
              break;
            case (Math.abs(deviation > 20) && Math.abs(deviation <= 30)):  
              customersList[i].grouping1 = '  30 Miles';
              customersList[i].setDistanceText(deviation.toFixed(1)+' Miles');
              break;
            case (Math.abs(deviation > 30) && Math.abs(deviation <= 40)):
              customersList[i].grouping1 = '  40 Miles';
              customersList[i].setDistanceText(deviation.toFixed(1)+' Miles');
              break;
            case (Math.abs(deviation > 40) && Math.abs(deviation <= 50)):  
              customersList[i].grouping1 = '  50 Miles';
              customersList[i].setDistanceText(deviation.toFixed(1)+' Miles');
              break;
            case (Math.abs(deviation > 50) && Math.abs(deviation <= 60)): 
              customersList[i].grouping1 = '  60 Miles';
              customersList[i].setDistanceText(deviation.toFixed(1)+' Miles');
              break;
            case (Math.abs(deviation > 60) && Math.abs(deviation <= 70)):
              customersList[i].grouping1 = '  70 Miles';
              customersList[i].setDistanceText(deviation.toFixed(1)+' Miles');
              break;
            case (Math.abs(deviation > 70) && Math.abs(deviation <= 80)): 
              customersList[i].grouping1 = '  80 Miles';
              customersList[i].setDistanceText(deviation.toFixed(1)+' Miles');
              break;
            case (Math.abs(deviation > 80) && Math.abs(deviation <= 90)):  
              customersList[i].grouping1 = '  90 Miles';
              customersList[i].setDistanceText(deviation.toFixed(1)+' Miles');
              break;
            case (Math.abs(deviation > 90) && Math.abs(deviation <= 100)):  
              customersList[i].grouping1 = ' 100 Miles';
              customersList[i].setDistanceText(deviation.toFixed(1)+' Miles');
              break;
            case (Math.abs(deviation > 100)): 
              customersList[i].grouping1 = ' > 100 Miles';
              customersList[i].setDistanceText(deviation.toFixed(1)+' Miles');
              break;
          }
          break;
        case 'km':
          switch (1) {
            case (Math.abs(deviation <= 0.005)):  
              customersList[i].grouping1 = '    5 M';
              customersList[i].setDistanceText((deviation*kmToMeterFactor).toFixed(1)+' M');
              break;
            case (Math.abs(deviation > 0.005) && Math.abs(deviation <= 0.05)):
              customersList[i].grouping1 = '    50 M';
              customersList[i].setDistanceText((deviation*kmToMeterFactor).toFixed(1) +' M');
              break;
            case (Math.abs(deviation > 0.05) && Math.abs(deviation <= 0.5)):  
              customersList[i].grouping1 = '    500 M';
              customersList[i].setDistanceText((deviation*kmToMeterFactor).toFixed(1)+' M');
              break;
            case (Math.abs(deviation > 0.5) && Math.abs(deviation <= 5)):
              //Show the distance value in Meters if it is less than 1 Km
              if(Math.abs(deviation < 1.0)) {
                customersList[i].setDistanceText((deviation*kmToMeterFactor).toFixed(1)+' M');
              }
              else {
                customersList[i].setDistanceText(deviation.toFixed(1)+' KM');
              }
              customersList[i].grouping1 = '   5 KM';
              customersList[i].setDistanceText(deviation.toFixed(1)+' KM');
              break;
            case (Math.abs(deviation > 5) && Math.abs(deviation <= 10)):
              customersList[i].grouping1 = '  10 KM';
              customersList[i].setDistanceText(deviation.toFixed(1)+' KM');
              break;
            case (Math.abs(deviation > 10) && Math.abs(deviation <= 20)):
              customersList[i].grouping1 = '  20 KM';
              customersList[i].setDistanceText(deviation.toFixed(1)+' KM');
              break;
            case (Math.abs(deviation > 20) && Math.abs(deviation <= 30)):
              customersList[i].grouping1 = '  30 KM';
              customersList[i].setDistanceText(deviation.toFixed(1)+' KM');
              break;
            case (Math.abs(deviation > 30) && Math.abs(deviation <= 40)): 
              customersList[i].grouping1 = '  40 KM';
              customersList[i].setDistanceText(deviation.toFixed(1)+' KM');
              break;
            case (Math.abs(deviation > 40) && Math.abs(deviation.toFixed(1) <= 50)):
              customersList[i].grouping1 = '  50 KM';
              customersList[i].setDistanceText(deviation.toFixed(1)+' KM');
              break;
            case (Math.abs(deviation > 50) && Math.abs(deviation <= 60)):
              customersList[i].grouping1 = '  60 KM';
              customersList[i].setDistanceText(deviation.toFixed(1)+' KM');
              break;
            case (Math.abs(deviation > 60) && Math.abs(deviation <= 70)):
              customersList[i].grouping1 = '  70 KM';
              customersList[i].setDistanceText(deviation.toFixed(1)+' KM');
              break;
            case (Math.abs(deviation > 70) && Math.abs(deviation <= 80)):
              customersList[i].grouping1 = '  80 KM';
              customersList[i].setDistanceText(deviation.toFixed(1)+' KM');
              break;
            case (Math.abs(deviation > 80) && Math.abs(deviation <= 90)):
              customersList[i].grouping1 = '  90 KM';
              customersList[i].setDistanceText(deviation.toFixed(1)+' KM');
              break;
            case (Math.abs(deviation > 90) && Math.abs(deviation <= 100)):
              customersList[i].grouping1 = ' 100 KM';
              customersList[i].setDistanceText(deviation.toFixed(1)+' KM');
              break;
            case (Math.abs(deviation > 100)): 
              customersList[i].grouping1 = ' > 100 KM';
              customersList[i].setDistanceText(deviation.toFixed(1)+' KM');
              break;
          }
      }
    }
  } 
  me.orderBy({'distance' : 'ASC', 'name' : 'ASC'});
}

// Pad leading zeros with distance to show the customer in ascending order.
function padWithZeros(number, length) {
  var str = '' + number;
  while (str.length < length) {
    str = '0' + str;
  }
  return str;

}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}
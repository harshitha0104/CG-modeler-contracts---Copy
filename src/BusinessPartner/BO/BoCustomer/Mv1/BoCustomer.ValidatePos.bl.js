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
 * @function validatePos
 * @this BoCustomer
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {messageCollector} messageCollector
 * @returns promise
 */
function validatePos(messageCollector){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
/*
UC: NGM Customer POS
The system saves and validates the POS
The POS Name must not be empty.
Each mandatory relation must exist for the POS.
POS Relation Valid Thru must be >= ValidFrom
POS Relations with same POS Relation Template must not have overlapping validity period.
*/
var promise;

if (Utils.isDefined(me.getLoCustomerPOSRelation())) {
  var items = me.getLoCustomerPOSRelation().getItemObjects();
  var newError;
  var i;
  for(i = 0; i < items.length; i++) {
    if (!Utils.isDefined(items[i].getValidFrom()) || items[i].getValidFrom() == "null") {
      newError = {"level": "error",
                  "objectClass": "BoCustomer",
                  "messageID": "CasBpaPosFillInAllValues"};
      messageCollector.add(newError);
    }
    else {
      if (!Utils.isDefined(items[i].getValidThru()) || items[i].getValidThru() == "null") {
        newError = {"level": "error",
                    "objectClass": "BoCustomer",
                    "messageID": "CasBpaPosFillInAllValues"};
        messageCollector.add(newError);
      }
      else {
        if (items[i].getValidThru() < items[i].getValidFrom()) {
          newError = {"level": "error",
                      "objectClass": "BoCustomer",
                      "messageID": "CasBpaPosValidFromGreaterValidThru",
                      "messageParams": {"posId":  "'" + items[i].getName() + "'" }};
          messageCollector.add(newError);
        }
      }
    }
  }

  //get all PosIds of current Customer
  var idList = "";
  for(var j = 0; j < items.length; j++) {
    if (idList.indexOf(items[j].getPosId()) == -1) {
      idList += items[j].getPosId() + "','";
    }
  }
  idList = idList.substr(0,idList.length-3);

  //load all PosRelations of all customers for above collected Ids
  var jsonParams = [];
  var jsonQuery = {};
  jsonParams.push( { "field" : "posIdList", "operator" : "EQ", "value" : idList});
  jsonQuery.params=jsonParams;
  promise = BoFactory.loadListAsync("LoCustomerPOSForValidate", jsonQuery).then(
    function(list) {
      var errorList = "";
      var listItems = list.getItems();

      for (i = 0; i < listItems.length; i++) {
        var paramsArrayBefore = [];
        var paramsArrayBetween = [];
        var paramsArrayAfter = [];
        var paramsArrayOver = [];
        var listBefore = [];
        var listBetween = [];
        var listAfter = [];
        var listOver = [];
        //set filter - find all Pos systemwide of same meta and ID and check if they overlap with the validity of the current pos
        //validity of other pos can overlap from before timefrom of actual pos
        paramsArrayBefore = [{"text": listItems[i].getText()}, {"posId": listItems[i].getPosId()}, {"ValidFrom":listItems[i].getValidFrom(),"op":"LE"}, {"ValidThru":listItems[i].getValidFrom(),"op":"GE"}];
        if (Utils.isDefined(paramsArrayBefore)) {
          listBefore = list.getItemsByParamArray(paramsArrayBefore);
        }

        //validity of other pos can be in between timefrom - timethru of actual pos
        paramsArrayBetween = [{"text": listItems[i].getText()}, {"posId": listItems[i].getPosId()}, {"ValidFrom":listItems[i].getValidFrom(),"op":"GE"}, {"ValidThru":listItems[i].getValidThru(),"op":"LE"}];
        if (Utils.isDefined(paramsArrayBetween)) {
          listBetween = list.getItemsByParamArray(paramsArrayBetween);
        }

        //validity of other pos can overlap from after timethru of actual pos
        paramsArrayAfter = [{"text": listItems[i].getText()}, {"posId": listItems[i].getPosId()}, {"ValidFrom":listItems[i].getValidThru(),"op":"LE"}, {"ValidThru":listItems[i].getValidThru(),"op":"GE"}];
        if (Utils.isDefined(paramsArrayAfter)) {
          listAfter = list.getItemsByParamArray(paramsArrayAfter);
        }

        //validity of other pos can overlap from before timethru till after timethru of actual pos
        paramsArrayOver = [{"text": listItems[i].getText()}, {"posId": listItems[i].getPosId()}, {"ValidFrom":listItems[i].getValidFrom(),"op":"LE"}, {"ValidThru":listItems[i].getValidThru(),"op":"GE"}];
        if (Utils.isDefined(paramsArrayOver)) {
          listOver = list.getItemsByParamArray(paramsArrayOver);
        }

        if (listBefore.length > 1 || listBetween.length > 1 || listAfter.length > 1 || listOver.length > 1) {
          if (errorList.indexOf(listItems[i].getPosId() +listItems[i].getText()) == -1) {
            //if not thrown for this id/pos combination before -> throw error
            newError = {
              "level": "error",
              "objectClass": "BoPos",
              "messageID": "CasBpaPOSValidityPeriodMustNotOverlap",
              "messageParams": {"posId": listItems[i].getPosId(), "text": listItems[i].getText()}
            };
            messageCollector.add(newError);
            //if error for this id/meta combination was thrown, store it in list to prevent to throw it multiple times
            errorList += (listItems[i].getPosId() + listItems[i].getText() + ",");
          }
        }
      }
      return messageCollector;
    }
  );
}
else {
  promise = when.resolve(messageCollector);
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}
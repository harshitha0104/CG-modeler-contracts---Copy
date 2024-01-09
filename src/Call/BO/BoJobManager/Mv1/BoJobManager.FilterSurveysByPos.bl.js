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
 * @function filterSurveysByPos
 * @this BoJobManager
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 * @param {DomPKey} posId
 * @param {String} isPromotionFilterSet
 * @param {String} isDiscrepanciesFilterSet
 * @param {Object} boCall
 * @returns posId
 */
function filterSurveysByPos(posId, isPromotionFilterSet, isDiscrepanciesFilterSet, boCall){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var loCurrentPOS = me.getLoPOS().getItemsByParam({"posId" : posId});

if (loCurrentPOS.length > 0) {
  var liCurrentPOS = loCurrentPOS[0];
  me.getLoPOS().setCurrent(liCurrentPOS);

  var loProducts = liCurrentPOS.getSurveyProducts();

  if (!Utils.isDefined(loProducts)) {
    loProducts = BoFactory.instantiateLightweightList("LoJobProducts");
    loProducts.setObjectStatus(STATE.PERSISTED);
    loProducts.setObjectStatusFrozen(true);
    loProducts.orderBy({
      "prdId" : "ASC"
    });
    liCurrentPOS.setSurveyProducts(loProducts);

    // Filter surveyColumns based on measuretype
    // store ==> surveycolumns with measuretype store visible
    // Pos ==> surveyColumns with measureType POS visible

    var currentMeasureType = (posId == " ") ? "Store" : "POS";
    var loSurveyColumns = me.getLoSurveyColumns().getAllItems();
    var liSurveyColumn;
    var idxSurveyColumn;
    var visible;
    var editable;
    var acl = loProducts.getACL();
    var columnName;

    for (idxSurveyColumn = 0; idxSurveyColumn < loSurveyColumns.length; idxSurveyColumn++) {
      liSurveyColumn = loSurveyColumns[idxSurveyColumn];
      visible = (liSurveyColumn.getMeasureType() === currentMeasureType);
      //Retail Process
      if (me.getClbStatus() === "Completed" || me.getClbStatus() === "Abandoned" || me.getReadOnlyBySubstitution() == "1") {
        editable = false;
      }
      else{
        editable = true;
      }

      //DSD
      if(Utils.isDefined(ApplicationContext.get('currentTourPKey')) && !Utils.isEmptyString(ApplicationContext.get('currentTourPKey')) && ApplicationContext.get('currentTourStatus') !== "Running") {
        editable = false;
      }

      columnName = liSurveyColumn.getDisplayColumnName();
      if (visible) {
        acl.addRight(AclObjectType.PROPERTY, columnName, AclPermission.VISIBLE);
      }
      else {
        acl.removeRight(AclObjectType.PROPERTY, columnName, AclPermission.VISIBLE);
      }
      if (editable) {
        acl.addRight(AclObjectType.PROPERTY, columnName, AclPermission.EDIT);
      }
      else {
        acl.removeRight(AclObjectType.PROPERTY, columnName, AclPermission.EDIT);
      }
    }

    if(isPromotionFilterSet == "1") {
      loProducts.setFilter("planned", "1");
    }

    if(isDiscrepanciesFilterSet == "1") {
      loProducts.setFilter("hasDiscrepance", "1");
    }

    loProducts.refreshUI();
    me.setLoCurrentSurveyProducts(loProducts);
    me.addItemChangedEventListener('loCurrentSurveyProducts', me.onSurveyChanged);
  }
  else {
    loProducts.resetAllFilters();

    if(isDiscrepanciesFilterSet == "1") {
      loProducts.setFilter("hasDiscrepance", "1");
    }

    if(isPromotionFilterSet == "1") {
      loProducts.setFilter("planned", "1");
    }

    loProducts.refreshUI();
    me.setLoCurrentSurveyProducts(loProducts);
  }

  if (loProducts.getCount() > 0) {
    loProducts.setCurrent(loProducts.getItems()[0]);
  }
}

if(Utils.isDefined(boCall.getLoProductQuickFilter())) {
  boCall.getLoProductQuickFilter().onTabChange(boCall);
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return posId;
}
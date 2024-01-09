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
 * @function getJobProducts
 * @this BoJobManager
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {String} posId
 * @returns promise
 */
function getJobProducts(posId){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise;
var loCurrentPOS = me.getLoPOS().getItemsByParam({
  "posId" : posId
});

if (loCurrentPOS.length > 0) {
  var liCurrentPOS = loCurrentPOS[0];
  if (liCurrentPOS.getProductsInitialized() !== "1") {

    liCurrentPOS.setProductsInitialized("1");

    // Check and remove invalid existing surveys
    var nonpersistedsurveyitems = liCurrentPOS.getSurveys().getAllItems().filter(function(x){
      if(x.getObjectStatus() != STATE.PERSISTED) {
        return x;
      }
    });
    if (nonpersistedsurveyitems.length > 0) {
      var pkeys = [];
      for (var i = 0; i < nonpersistedsurveyitems.length; i++) {
        pkeys.push(nonpersistedsurveyitems[i].getPKey());
      }
      if (pkeys.length > 0) {
        liCurrentPOS.getSurveys().removeItems(pkeys);
      }
    }
    // START -- Build dictionary of existing surveys
    var existingJobMainSurveys = liCurrentPOS.getSurveys().getItemsByParam({
      "posId" : posId
    });
    existingJobMainSurveys.sort(function (a, b) {
      return (a.getPrdMainPKey() === b.getPrdMainPKey()) ? 0 : ((a.getPrdMainPKey() < b.getPrdMainPKey()) ? -1 : 1);
    });

    var idxExistingJobMainSurveys;
    var lastPrdMainPKey = "";
    var dicExistingJobs = {};
    var currentDicExistingJobsOfProduct;
    var currentSurvey;
    var considerTargetValues = me.getConsiderTargetValues() == "1" && (["Planned"].indexOf(me.getClbStatus()) > -1);

    for (idxExistingJobMainSurveys = 0; idxExistingJobMainSurveys < existingJobMainSurveys.length; idxExistingJobMainSurveys++) {
      currentSurvey = existingJobMainSurveys[idxExistingJobMainSurveys];
      if (currentSurvey.getPrdMainPKey() !== lastPrdMainPKey) {
        lastPrdMainPKey = currentSurvey.getPrdMainPKey();
        currentDicExistingJobsOfProduct = {};
        dicExistingJobs[lastPrdMainPKey] = currentDicExistingJobsOfProduct;
      }

      currentDicExistingJobsOfProduct[currentSurvey.getJobDefinitionMetaPKey()] = { value: currentSurvey.getValue(), clbMainPKey: me.getClbMainPKey() };
    }
    // END -- Build dictionary of existing surveys

    var loSurveyColumns = me.getLoSurveyColumns().getItemsByParam({
      "measureType" : liCurrentPOS.getIsPOS() == "1" ? "POS" : "Store"
    });
    var liSurveyColumn;
    var surveyFound;
    var loProducts = liCurrentPOS.getSurveyProducts();

    if (!Utils.isDefined(loProducts)) {
      loProducts = BoFactory.instantiateLightweightList("LoJobProducts");
      loProducts.setObjectStatus(STATE.PERSISTED);
      loProducts.setObjectStatusFrozen(true);
      loProducts.orderBy({
        "prdId" : "ASC"
      });

      liCurrentPOS.setSurveyProducts(loProducts);
    }
    else {
      if(loProducts.getAllItems().length > 0) {
        loProducts.removeAllItems();
      }
    }

    var jsonQuery = {};
    jsonQuery.params = [
      { "field" : "clbMainPKey", "operator" : "EQ", "value" : me.getClbMainPKey() },
      { "field" : "clbMetaPKey", "operator" : "EQ", "value" : me.getClbMetaPKey() },
      { "field" : "bpaMainPKey", "operator" : "EQ", "value" : me.getBpaMainPKey() },
      { "field" : "validFrom", "operator" : "EQ", "value" : me.getReferenceDate() },
      { "field" : "validThru", "operator" : "EQ", "value" : me.getReferenceDate() },
      { "field" : "isPOS", "operator" : "EQ", "value" : liCurrentPOS.getIsPOS() },
      { "field" : "clbStatus", "operator" : "EQ", "value" : me.getClbStatus() },
      { "field" : "responsiblePKey", "operator" : "EQ", "value" : me.getResponsiblePKey() },
      { "field" : "historicalProducts", "operator" : "EQ", "value" : me.getHistoricalProductConfig() },
      { "field" : "isKubsch", "operator" : "EQ", "value" : liCurrentPOS.getIsKubsch() },
      { "field" : "prdPOSContentPKey", "operator" : "EQ", "value" : liCurrentPOS.getPosContentPKey() },
      { "field" : "posPKey", "operator" : "EQ", "value" : liCurrentPOS.getBpaMainPKey() },
      { "field" : "posId", "operator" : "EQ", "value" : posId },
      { "field" : "considerModule", "operator" : "EQ", "value" : me.getConsiderModule() }
    ];

    promise = Facade.getListAsync("LoJobProducts", jsonQuery).then(
      function (listJobProducts) {
        for (var idxProduct = 0; idxProduct < listJobProducts.length; idxProduct++) {
          var currentJobProduct = listJobProducts[idxProduct];
          var currentProductJDLPKeys = currentJobProduct.jDLPKeys;

          // fill in values from already saved jobs
          currentDicExistingJobsOfProduct = (currentJobProduct.prdMainPKey in dicExistingJobs) ? dicExistingJobs[currentJobProduct.prdMainPKey] : null;

          for (var idxJobDef = 0; idxJobDef < loSurveyColumns.length; idxJobDef++) {
            surveyFound = false;
            liSurveyColumn = loSurveyColumns[idxJobDef];

            if (currentDicExistingJobsOfProduct && currentDicExistingJobsOfProduct[liSurveyColumn.getJobDefinitionMetaPKey()] && (currentDicExistingJobsOfProduct[liSurveyColumn.getJobDefinitionMetaPKey()].clbMainPKey == me.getClbMainPKey() || liSurveyColumn.getPresetting() === "LastValue")) {
              currentJobProduct[liSurveyColumn.getDisplayColumnName()] = (currentDicExistingJobsOfProduct[liSurveyColumn.getJobDefinitionMetaPKey()].value);
              currentJobProduct[liSurveyColumn.getDisplayColumnName() + "LastValue"] = (currentDicExistingJobsOfProduct[liSurveyColumn.getJobDefinitionMetaPKey()].value);

              //Assign the datwarehousePkey from existing jobs
              currentJobProduct[liSurveyColumn.getDisplayColumnName() + "DataWareHouseKey"] = (liSurveyColumn.getDataWareHouseKey() in currentDicExistingJobsOfProduct) ? currentDicExistingJobsOfProduct[liSurveyColumn.getDataWareHouseKey()].value : undefined;
              surveyFound = true;
            }

            // preset survey values only if survey is required for this product
            if (loProducts.isJDLPKeyMatch(liSurveyColumn.getJobDefListPKeys(), currentProductJDLPKeys)) {

              if (!surveyFound) {
                //Initializing Last Value and Target Values
                currentJobProduct[liSurveyColumn.getDisplayColumnName() + "LastValue"]= "";
                currentJobProduct[liSurveyColumn.getDisplayColumnName() + "TargetValue"] = "";

                if (liSurveyColumn.getPresetting() === "TargetValue") {
                  if (considerTargetValues && liSurveyColumn.getTargetValueColumn() !== "0") {
                    currentJobProduct[liSurveyColumn.getDisplayColumnName()] = (currentJobProduct["presetting" + liSurveyColumn.getTargetValueColumn()]);
                  }
                }
                else if (liSurveyColumn.getPresetting() === "LastValue") {
                  //Check Presetting value and set target value to Last value
                  if (liSurveyColumn.getTargetValueColumn() !== "0") {
                    currentJobProduct[liSurveyColumn.getDisplayColumnName()] = (currentJobProduct["presetting" + liSurveyColumn.getTargetValueColumn()]);
                    currentJobProduct[liSurveyColumn.getDisplayColumnName() + "LastValue"]= (currentJobProduct["presetting" + liSurveyColumn.getTargetValueColumn()]);
                  } 
                }
              }

              if (considerTargetValues && liSurveyColumn.getTargetValueColumn() !== "0") {
                currentJobProduct[liSurveyColumn.getDisplayColumnName() + "TargetValue"] = (currentJobProduct["presetting" + liSurveyColumn.getTargetValueColumn()]);
              }

              currentJobProduct[liSurveyColumn.getDisplayColumnName() + "DataWareHouseKey"] = liSurveyColumn.getDataWareHouseKey();
            }
          }

          // Check for Discrepancy
          var hasDiscrepance = "0";

          if (posId === " ") {
            if(currentJobProduct.svyDistributed === "NotDistributed" || currentJobProduct.svyDistributed === "OutOfStock") {
              hasDiscrepance = "1";
            }

            if (liSurveyColumn.getPresetting() === "LastValue") {
              if(valueHasDiscrepance(currentJobProduct.svyFacingsLastValue, currentJobProduct.svyFacings)) {
                hasDiscrepance = "1";
              }
              else if (valueHasDiscrepance(currentJobProduct.svyPriceLastValue, currentJobProduct.svyPrice)) {
                hasDiscrepance = "1";
              }
            }
            else if (liSurveyColumn.getPresetting() === "TargetValue") {
              if(valueHasDiscrepance(currentJobProduct.svyFacingsTargetValue, currentJobProduct.svyFacings)){
                hasDiscrepance = "1";
              }
              else if(valueHasDiscrepance(currentJobProduct.svyPriceTargetValue, currentJobProduct.svyPrice)) {
                hasDiscrepance = "1";
              }
            }
          }
          else {
            if(currentJobProduct.svyPosDistributed === "NotDistributed" || currentJobProduct.svyPosDistributed === "OutOfStock") {
              hasDiscrepance = "1";
            }
            if (liSurveyColumn.getPresetting() === "LastValue") {
              if(valueHasDiscrepance(currentJobProduct.svyPosFacingsLastValue, currentJobProduct.svyPosFacings)){
                hasDiscrepance = "1";
              }
              else if (valueHasDiscrepance(currentJobProduct.svyPosPriceLastValue, currentJobProduct.svyPosPrice)) {
                hasDiscrepance = "1";
              }
            }
            else if (liSurveyColumn.getPresetting() === "TargetValue") {
              if(valueHasDiscrepance(currentJobProduct.svyPosFacingsTargetValue, currentJobProduct.svyPosFacings)){
                hasDiscrepance = "1";
              }
              else if(valueHasDiscrepance(currentJobProduct.svyPosPriceTargetValue !== currentJobProduct.svyPosPrice)) {
                hasDiscrepance = "1";
              }
            }
          }
          currentJobProduct.hasDiscrepance = hasDiscrepance;
        }

        if (listJobProducts.length > 0) {
          loProducts.addItems(listJobProducts);
          loProducts.orderBy({"prdGroupId": "ASC", "prdGroupText" : "ASC", "shortText":"ASC"});
        }
        liCurrentPOS.setSurveyCount(loProducts.getCount());
      });
  }
  else {
    promise = when.resolve(0);
  }
}
else {
  promise = when.resolve(0);
}

function valueHasDiscrepance (value, referenceValue) {
  return Utils.isDefined(value) && value !== "" && value !== referenceValue;
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}
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
 * @function getJobProductsExisting
 * @this BoJobManager
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {String} posId
 * @returns promise
 */
function getJobProductsExisting(posId){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise = when.resolve();

var loCurrentPOS = me.getLoPOS().getItemsByParam({
  "posId" : posId
});

if (loCurrentPOS.length > 0) {
  var liCurrentPOS = loCurrentPOS[0];
  if (liCurrentPOS.getProductsInitialized() !== "1") {
    var jsonParams = {"clbMainPKey":  me.getClbMainPKey(), "posId": posId};

    promise = Facade.selectSQL("DsLoJobProducts", "JobProductsExisting", jsonParams).then(
      function (rawList) {
        var productList = [];
        for (var idxList = 0; idxList < rawList.length; idxList++) {
          productList.push(rawList[idxList]);
        }
        // START -- Build dictionary of existing surveys --
        var existingJobMainSurveys = liCurrentPOS.getSurveys().getAllItems();
        var dicKey = "";
        var dicExistingJobs = Utils.createDictionary();
        var currentSurvey;

        for (var idxExistingJobMainSurveys = 0; idxExistingJobMainSurveys < existingJobMainSurveys.length; idxExistingJobMainSurveys++) {
          currentSurvey = existingJobMainSurveys[idxExistingJobMainSurveys];
          dicKey = currentSurvey.getPrdMainPKey() + currentSurvey.getPosId() + currentSurvey.getJobDefinitionMetaPKey();
          dicExistingJobs.add(dicKey, currentSurvey.getValue());

          //Getting LastValue and TargetValue For Discrepancy check
          dicKey = currentSurvey.getPrdMainPKey() + currentSurvey.getPosId() + currentSurvey.getJobDefinitionMetaPKey() + "LastValue";
          dicExistingJobs.add(dicKey, currentSurvey.getLastValue());
          dicKey = currentSurvey.getPrdMainPKey() + currentSurvey.getPosId() + currentSurvey.getJobDefinitionMetaPKey() + "TargetValue";
          dicExistingJobs.add(dicKey, currentSurvey.getTargetValue());
        }

        var loSurveyColumns = me.getLoSurveyColumns().getAllItems();
        var liSurveyColumn;

        for (var idxProduct = 0; idxProduct < productList.length; idxProduct++) {
          var currentJobProduct = productList[idxProduct];

          for (var idxJobDef = 0; idxJobDef < loSurveyColumns.length; idxJobDef++) {
            liSurveyColumn = loSurveyColumns[idxJobDef];

            dicKey = currentJobProduct.prdMainPKey + currentJobProduct.posId + liSurveyColumn.getJobDefinitionMetaPKey();
            var surveyValue = dicExistingJobs.get(dicKey);
            //Storing LastValue and TargetValue For Discrepancy check
            dicKey = currentJobProduct.prdMainPKey + currentJobProduct.posId + liSurveyColumn.getJobDefinitionMetaPKey() + "LastValue";
            var lastValue = dicExistingJobs.get(dicKey);
            dicKey = currentJobProduct.prdMainPKey + currentJobProduct.posId + liSurveyColumn.getJobDefinitionMetaPKey() + "TargetValue";
            var targetValue = dicExistingJobs.get(dicKey);

            if (Utils.isDefined(surveyValue)) {
              currentJobProduct[liSurveyColumn.getDisplayColumnName()] = surveyValue;
              currentJobProduct[liSurveyColumn.getDisplayColumnName() + "LastValue"] = lastValue;
              currentJobProduct[liSurveyColumn.getDisplayColumnName() + "TargetValue"] = targetValue;
            }
          }

          // Check for Discrepancy
          var hasDiscrepance = "0";
          if (Utils.isDefined(liSurveyColumn)) {
            if (Utils.isEmptyString(posId)) {
              if (currentJobProduct.svyDistributed === "NotDistributed" || currentJobProduct.svyDistributed === "OutOfStock") {
                hasDiscrepance = "1";
              }
              if (liSurveyColumn.getPresetting() === "LastValue") {
                if (currentJobProduct.svyFacingsDataWareHouseKey === "Facings" && valueHasDiscrepance(currentJobProduct.svyFacingsLastValue, currentJobProduct.svyFacings)) {
                  hasDiscrepance = "1";
                }
                else if (currentJobProduct.svyPriceDataWareHouseKey === "PriceSurvey" && valueHasDiscrepance(currentJobProduct.svyPriceLastValue, currentJobProduct.svyPrice)) {
                  hasDiscrepance = "1";
                }
              }
              else if (liSurveyColumn.getPresetting() === "TargetValue") {
                if (currentJobProduct.svyFacingsDataWareHouseKey === "Facings" && valueHasDiscrepance(currentJobProduct.svyFacingsTargetValue !== currentJobProduct.svyFacings)) {
                  hasDiscrepance = "1";
                }
                else if (currentJobProduct.svyPriceDataWareHouseKey === "PriceSurvey" && valueHasDiscrepance(currentJobProduct.svyPriceTargetValue !== currentJobProduct.svyPrice)) {
                  hasDiscrepance = "1";
                }
              }
            }
            else {
              if (currentJobProduct.svyPosDistributed === "NotDistributed" || currentJobProduct.svyPosDistributed === "OutOfStock") {
                hasDiscrepance = "1";
              }
              if (liSurveyColumn.getPresetting() === "LastValue") {
                if (valueHasDiscrepance(currentJobProduct.svyPosFacingsLastValue, currentJobProduct.svyPosFacings)) {
                  hasDiscrepance = "1";
                }
                else if (valueHasDiscrepance(currentJobProduct.svyPosPriceLastValue, currentJobProduct.svyPosPrice)) {
                  hasDiscrepance = "1";
                }
              }
              else if (liSurveyColumn.getPresetting() === "TargetValue") {
                if (valueHasDiscrepance(currentJobProduct.svyPosFacingsTargetValue, currentJobProduct.svyPosFacings)) {
                  hasDiscrepance = "1";
                }
                else if (valueHasDiscrepance(currentJobProduct.svyPosPriceTargetValue, currentJobProduct.svyPosPrice)) {
                  hasDiscrepance = "1";
                }
              }
            }
          }
          currentJobProduct.hasDiscrepance = hasDiscrepance;
        }

        if (productList.length > 0) {
          var loProducts = liCurrentPOS.getSurveyProducts();
          loProducts.addItems(productList);

          loProducts.SLO.orderBy({
            "prdGroupId" : "ASC",
            "prdGroupText" : "ASC",
            "shortText":"ASC"
          });

          loProducts.setCurrent(loProducts.getItems()[0]);
        }
        liCurrentPOS.setSurveyCount(productList.length);
        liCurrentPOS.setProductsInitialized("1");
      }
    );
  }
  else {
    promise = when.resolve(0);
  }
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
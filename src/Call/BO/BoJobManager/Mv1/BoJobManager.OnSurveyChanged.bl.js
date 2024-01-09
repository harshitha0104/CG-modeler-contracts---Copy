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
 * @function onSurveyChanged
 * @this BoJobManager
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} handlerParams
 * @returns promise
 */
function onSurveyChanged(handlerParams){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise = when.resolve();
var addSurvey = false;
var isMatrixSurveyColumn = false;
var surveyColumns;
var surveyColumn;
var listItem = handlerParams.listItem;
var statePersisted = STATE.PERSISTED;

for (var i = 0; i < handlerParams.modified.length; i++) {
  var columnName = handlerParams.modified[i];
  var value = handlerParams.newValues[columnName];
  var oldValue = handlerParams.oldValues[columnName];

  if (columnName === "surveysInitialized") {
    if(Utils.isDefined(Framework.getProcessContext().mainBO) && (Framework.getProcessContext().mainBO.getObjectStatus() === statePersisted || Framework.getProcessContext().mainBO.getObjectStatus() === 1)){
      Framework.getProcessContext().mainBO.setObjectStatus(STATE.DIRTY | STATE.PERSISTED);
    }
    continue;
  }

  //Check if value has changed
  if (value !== oldValue) {
    var prdMainPKey = listItem.getPrdMainPKey();
    var posId = listItem.getPosId();
    var jobDefinitionMetaPKey = "";
    var jobProducts;
    var jobProductItems;
    var idxJobProduct;
    var jobProduct;
    var hasDiscrepance;

    if (handlerParams.listObjectName === "loCurrentSurveyProducts") {
      var measureType = (Utils.isEmptyString(posId)) ? "Store" : "POS";
      surveyColumns = me.getLoSurveyColumns().getItemsByParam({
        "displayColumnName" : columnName,
        "measureType" : measureType
      });

      if (surveyColumns.length > 0) {
        isMatrixSurveyColumn = true;
        surveyColumn = surveyColumns[0];
        //Survey has to be added if it does not exist
        addSurvey = true;
        jobDefinitionMetaPKey = surveyColumn.getJobDefinitionMetaPKey();
        //Load Surveys if not yet initialized
        if (listItem.getSurveysInitialized() !== "1") {
          promise = me.getSurveys(posId, prdMainPKey, listItem.getPKey());
        }

        jobProducts = me.getLoCurrentSurveyProducts();
        jobProductItems = jobProducts.getItemsByParam({
          "prdMainPKey" : prdMainPKey,
          "posId" : posId
        });
        for (idxJobProduct = 0; idxJobProduct < jobProductItems.length; idxJobProduct++) {
          //Set surveyValue to corresponding Product in Matrix
          jobProduct = jobProductItems[idxJobProduct];
          if (surveyColumn.getDisplayColumnNameCapitalized() === "SvyPrice" && value < 0) {
            value = 0;
          }

          jobProduct["set" + surveyColumn.getDisplayColumnNameCapitalized()](value);

          // Check for Discrepancy
          // No datawarehousePkey as Survey column value is blank
          hasDiscrepance = "0";

          if (Utils.isEmptyString(posId)) {
            if(jobProduct.svyDistributed === "NotDistributed" || jobProduct.svyDistributed === "OutOfStock") {
              hasDiscrepance = "1";
            }
            if (surveyColumn.getPresetting() === "LastValue") {
              if(Utils.isDefined(jobProduct.svyFacingsLastValue) &&
                 (!Utils.isEmptyString(jobProduct.svyFacingsLastValue) &&
                  jobProduct.svyFacingsLastValue !== jobProduct.svyFacings)
                ){
                hasDiscrepance = "1";
              } else if(Utils.isDefined(jobProduct.svyPriceLastValue) &&
                        (!Utils.isEmptyString(jobProduct.svyPriceLastValue) &&
                         jobProduct.svyPriceLastValue !== jobProduct.svyPrice.toString())
                       ) {
                hasDiscrepance = "1";
              }
            }else if (surveyColumn.getPresetting() === "TargetValue") {
              if(Utils.isDefined(jobProduct.svyFacingsTargetValue) &&
                 (!Utils.isEmptyString(jobProduct.svyFacingsTargetValue) &&
                  jobProduct.svyFacingsTargetValue !== jobProduct.svyFacings)
                ){
                hasDiscrepance = "1";
              } else if(Utils.isDefined(jobProduct.svyPriceTargetValue.toString()) &&
                        (!Utils.isEmptyString(jobProduct.svyPriceTargetValue.toString()) &&
                         jobProduct.svyPriceTargetValue.toString() !== jobProduct.svyPrice.toString())
                       ) {
                hasDiscrepance = "1";
              }
            }
          }
          else{
            if(jobProduct.svyPosDistributed === "NotDistributed" || jobProduct.svyPosDistributed === "OutOfStock"){
              hasDiscrepance = "1";
            }
            if (surveyColumn.getPresetting() === "LastValue") {
              if(Utils.isDefined(jobProduct.svyPosFacingsLastValue) &&
                 (!Utils.isEmptyString(jobProduct.svyPosFacingsLastValue) &&
                  jobProduct.svyPosFacingsLastValue !== jobProduct.svyPosFacings)
                ){
                hasDiscrepance = "1";
              } else if(Utils.isDefined(jobProduct.svyPosPriceLastValue) &&
                        (!Utils.isEmptyString(jobProduct.svyPosPriceLastValue) &&
                         jobProduct.svyPosPriceLastValue !== jobProduct.svyPosPrice)
                       ) {
                hasDiscrepance = "1";
              }
            }else if (surveyColumn.getPresetting() === "TargetValue") {
              if(Utils.isDefined(jobProduct.svyPosFacingsTargetValue) &&
                 (!Utils.isEmptyString(jobProduct.svyPosFacingsTargetValue) &&
                  jobProduct.svyPosFacingsTargetValue !== jobProduct.svyPosFacings)
                ){
                hasDiscrepance = "1";
              } else if(Utils.isDefined(jobProduct.svyPosPriceTargetValue) &&
                        (!Utils.isEmptyString(jobProduct.svyPosPriceTargetValue) &&
                         jobProduct.svyPosPriceTargetValue !== jobProduct.svyPosPrice)
                       ) {
                hasDiscrepance = "1";
              }
            }
          }
          jobProduct.hasDiscrepance = hasDiscrepance;
        }

      }
    } else if (handlerParams.listObjectName === "loCurrentSurveys") {
      //No SurveyValue Changed -> continue
      if (columnName !== "value") {
        continue;
      }
      jobDefinitionMetaPKey = listItem.getJobDefinitionMetaPKey();
      surveyColumns = me.getLoSurveyColumns().getItemsByParam({
        "jobDefinitionMetaPKey" : jobDefinitionMetaPKey
      });

      if(listItem.getDataType() === "Date") {
        var chosenDate = listItem.getValue();
        if(Utils.isEmptyString(chosenDate) || !Utils.isDefined(chosenDate)){
          chosenDate = Utils.getMinDate();
        }
        if(!(listItem.getMinValue() <= (chosenDate).slice(0,10) && listItem.getMaxValue() >= (chosenDate).slice(0,10))){
          listItem.setValue(oldValue);
          var messageCollector = new MessageCollector();
          var minDatePolicy = listItem.getMinDatePolicy();
          var maxDatePolicy = listItem.getMaxDatePolicy();
          var messageId = " ";
          if(minDatePolicy === "Today" && maxDatePolicy === "Today"){
            messageId = "CasClbDateMustBeTodayDatePolicy";
          } else if (minDatePolicy === "Today" && maxDatePolicy !== "NextYear"){
            messageId = "CasClbDateMustBeOnOrAfterTodayDatePolicy";
          } else if (maxDatePolicy === "Today"){
            messageId = "CasClbDateMustBeOnOrBeforeTodayDatePolicy";
          } else {
            messageId = "CasClbDateMustBeInBetweenMinAndMaxDatePolicy";
          }
          var newError = {
            "level": "error",
            "objectClass" : "BoCall",
            "messageID" : messageId,
            "messageParams" : {
              "minValue" : listItem.getMinValue(),
              "maxValue" : listItem.getMaxValue()
            }
          };
          messageCollector.add(newError);
          var buttonValues = {};
          var messages = messageCollector.getMessages().join("<br>");
          buttonValues[Localization.resolve("OK")] = "ok";
          promise = MessageBox.displayMessage(Localization.resolve("MessageBox_Title_Validation"), messages, buttonValues);
        }
        if(Utils.isEmptyString(listItem.getValue()) || !Utils.isDefined(listItem.getValue())){
          listItem.setValue(Utils.getMinDate());
        }
      }

      listItem.setDone("1");

      //Check if the survey is contained in LoProducts
      if (surveyColumns.length > 0) {
        isMatrixSurveyColumn = true;
        surveyColumn = surveyColumns[0];
        jobProducts = me.getLoCurrentSurveyProducts();
        jobProductItems = jobProducts.getItemsByParam({
          "prdMainPKey" : prdMainPKey,
          "posId" : posId
        });
        for (idxJobProduct = 0; idxJobProduct < jobProductItems.length; idxJobProduct++) {
          //Set surveyValue to corresponding Product in Matrix
          jobProduct = jobProductItems[idxJobProduct];
          if (surveyColumn.getDisplayColumnNameCapitalized() === "SvyPrice" && value < 0) {
            value = 0;
          }

          jobProduct["set" + surveyColumn.getDisplayColumnNameCapitalized()](value);

          // Check for Discrepancy
          // No datawarehousePkey as Survey column value is blank
          hasDiscrepance = "0";

          if (Utils.isEmptyString(posId)) {
            if(jobProduct.svyDistributed === "NotDistributed" || jobProduct.svyDistributed === "OutOfStock") {
              hasDiscrepance = "1";
            }
            if (surveyColumn.getPresetting() === "LastValue") {
              if(Utils.isDefined(jobProduct.svyFacingsLastValue) &&
                 (!Utils.isEmptyString(jobProduct.svyFacingsLastValue) &&
                  jobProduct.svyFacingsLastValue !== jobProduct.svyFacings)
                ){
                hasDiscrepance = "1";
              } else if(Utils.isDefined(jobProduct.svyPriceLastValue) &&
                        (!Utils.isEmptyString(jobProduct.svyPriceLastValue) &&
                         jobProduct.svyPriceLastValue !== jobProduct.svyPrice.toString())
                       ) {
                hasDiscrepance = "1";
              }
            }else if (surveyColumn.getPresetting() === "TargetValue") {
              if(Utils.isDefined(jobProduct.svyFacingsTargetValue) &&
                 (!Utils.isEmptyString(jobProduct.svyFacingsTargetValue) &&
                  jobProduct.svyFacingsTargetValue !== jobProduct.svyFacings)
                ){
                hasDiscrepance = "1";
              } else if(Utils.isDefined(jobProduct.svyPriceTargetValue.toString()) &&
                        (!Utils.isEmptyString(jobProduct.svyPriceTargetValue.toString()) &&
                         jobProduct.svyPriceTargetValue.toString() !== jobProduct.svyPrice.toString())
                       ) {
                hasDiscrepance = "1";
              }
            }
          }
          else{
            if(jobProduct.svyPosDistributed === "NotDistributed" || jobProduct.svyPosDistributed === "OutOfStock"){
              hasDiscrepance = "1";
            }
            if (surveyColumn.getPresetting() === "LastValue") {
              if(Utils.isDefined(jobProduct.svyPosFacingsLastValue) &&
                 (!Utils.isEmptyString(jobProduct.svyPosFacingsLastValue) &&
                  jobProduct.svyPosFacingsLastValue !== jobProduct.svyPosFacings)
                ){
                hasDiscrepance = "1";
              } else if(Utils.isDefined(jobProduct.svyPosPriceLastValue) &&
                        (!Utils.isEmptyString(jobProduct.svyPosPriceLastValue) &&
                         jobProduct.svyPosPriceLastValue !== jobProduct.svyPosPrice)
                       ) {
                hasDiscrepance = "1";
              }
            }else if (surveyColumn.getPresetting() === "TargetValue") {
              if(Utils.isDefined(jobProduct.svyPosFacingsTargetValue) &&
                 (!Utils.isEmptyString(jobProduct.svyPosFacingsTargetValue) &&
                  jobProduct.svyPosFacingsTargetValue !== jobProduct.svyPosFacings)
                ){
                hasDiscrepance = "1";
              } else if(Utils.isDefined(jobProduct.svyPosPriceTargetValue) &&
                        (!Utils.isEmptyString(jobProduct.svyPosPriceTargetValue) &&
                         jobProduct.svyPosPriceTargetValue !== jobProduct.svyPosPrice)
                       ) {
                hasDiscrepance = "1";
              }
            }
          }
          jobProduct.hasDiscrepance = hasDiscrepance;
        }
      }
    }

    if(Utils.isDefined(Framework.getProcessContext().mainBO) && (Framework.getProcessContext().mainBO.getObjectStatus() === statePersisted || Framework.getProcessContext().mainBO.getObjectStatus() === 1)){
      Framework.getProcessContext().mainBO.setObjectStatus(STATE.DIRTY | STATE.PERSISTED);
    }

    if (isMatrixSurveyColumn) {
      //Get all Surveys for that JobDefMeta,Product and POS
      var loSurveyItems = me.getLoPOS().getCurrent().getSurveys().getItemsByParam({
        "jobDefinitionMetaPKey" : jobDefinitionMetaPKey,
        "prdMainPKey" : prdMainPKey,
      });
      var productList = me.getLoCurrentSurveyProducts().getItemsByParam({"prdMainPKey" : prdMainPKey, "posId" : posId});
      var posList = me.getLoPOS().getItemsByParam({"posId" : posId});

      if (loSurveyItems.length > 0) {
        //Set Done Flage and Value for all identical Surveys
        for (var idxSurvey = 0; idxSurvey < loSurveyItems.length; idxSurvey++) {
          var survey = loSurveyItems[idxSurvey];
          var isSurveyFromLastCall = (survey.getClbMainPKey() !== me.getClbMainPKey());

          //Assimilate Survey for LastValue
          if (isSurveyFromLastCall && productList.length > 0 && posList.length > 0) {
            var product = productList[0];
            var pos = posList[0];
            var listed = (product.getListedPlanned().indexOf("L")) === -1 ? "0" : "1";
            var planned = (product.getListedPlanned().indexOf("P")) === -1 ? "0" : "1";
            var prdPOSContentPKey = pos.getPosContentPKey();
            me.assimilateSurvey(survey, listed, planned, prdPOSContentPKey);
          }

          survey.setDone("1");
          survey.setValue(value);
          //Check if Survey is MatrixSurvey and set to unmodified, to not save it
          var isManualSurvey = loSurveyItems[idxSurvey].getManual() === "0" || productList[0].getIsProductAddedManually() == "1";
          if (isManualSurvey && Utils.isEmptyString(loSurveyItems[idxSurvey].getJobDefinitionPKey())) {
            loSurveyItems[idxSurvey].setObjectStatus(STATE.PERSISTED);
          }
        }
      } else {
        if (addSurvey) {
          //survey does not exisist = > create manual survey
          me.addSurvey(prdMainPKey, posId, surveyColumn.getJobDefinitionMetaPKey(), surveyColumn, value);
        }
      }
    }
  }
  addSurvey = false;
  isMatrixSurveyColumn = false;
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}
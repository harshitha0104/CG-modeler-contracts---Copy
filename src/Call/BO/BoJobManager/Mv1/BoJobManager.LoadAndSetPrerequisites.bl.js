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
 * @function loadAndSetPrerequisites
 * @this BoJobManager
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {String} loadType
 * @param {Object} boCall
 * @returns promise
 */
function loadAndSetPrerequisites(loadType, boCall){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var jsonQuery = {};

jsonQuery.params = [{
  "field": "clbMainPKey",
  "operator": "EQ",
  "value": me.getClbMainPKey()
},{
  "field": "clbMetaPKey",
  "operator": "EQ",
  "value": me.getClbMetaPKey()
},{
  "field": "bpaMainPKey",
  "operator": "EQ",
  "value": me.getBpaMainPKey()
},{
  "field": "validFrom",
  "operator": "EQ",
  "value":  Utils.convertForDBParam(me.getReferenceDate(), "DomDate")  
},{
  "field": "validThru",
  "operator": "EQ",
  "value": Utils.convertForDBParam(me.getReferenceDate(), "DomDate")
},{
  "field": "timeFrom",
  "operator": "EQ",
  "value": me.getTimeFrom()
},{
  "field": "clbManualQuestionGroupName",
  "operator": "EQ",
  "value": Localization.resolve("ClbManualQuestionGroupName")
},{
  "field": "responsiblePKey",
  "operator": "EQ",
  "value": me.getResponsiblePKey()
},{
  "field": "ownerPKey",
  "operator": "EQ",
  "value": me.getOwnerPKey()
}];

var deferreds = [];
var sLoadType = loadType;
var isLoPOSReloadRequired = true;
var bJobRelevant = (loadType === "Surveys") || (loadType === "Questions") || (loadType === "SavePresetting") || (loadType === "SavePresettingQuestions") || (loadType === "SavePresettingSurveys") || (loadType === "SavePresettingPreparation");
var bLoadJobDefs = bJobRelevant || (loadType === "ActivityPerformance") || (loadType === "Magnetization") || (loadType === "Remagnetization") || (loadType === "StatusChange_Delete") || (loadType === "StatusChange_Complete") || (loadType === "AnswerToQuestionHurdle");
var bLoadQuestions = (loadType === "Questions") || (loadType === "ActivityPerformance") || (loadType === "StatusChange_Delete") || (loadType === "StatusChange_Complete") || (loadType === "SavePresetting") || (loadType === "SavePresettingQuestions") || (loadType === "AnswerToQuestionHurdle");
var bLoadSurveys = (loadType === "Surveys") || (loadType === "StatusChange_Delete") || (loadType === "StatusChange_Complete") || (loadType === "SavePresetting") || (loadType === "SavePresettingSurveys") || (loadType === "ExceptionCard");
var bLoadPOS = bJobRelevant || (loadType === "StatusChange_Delete") || (loadType === "StatusChange_Complete") || (loadType === "ExceptionCard");
var bLoPosInvalidated = Utils.isDefined(me.getLoPOS()) && me.getLoPOSInvalidated() == "1";
//when consider pos check is disabled and we enter surveys then we need to reload LoPOS and assign survey related data to it
var posReloadRequired = me.getConsiderPOSCheck() == "0" && bLoadSurveys;
me.setLoPOSInvalidated("0");

//show store tab for questions and surveys in all cases
var POSlist = [];
var liPOSStore = {
  "bpaMainPKey": me.getBpaMainPKey(),
  "posId": " ",
  "name": Localization.resolve("ImageSelector_StoreLabel"),
  "count": 0,
  "questionCount": 0,
  "surveyCount": 0,
  "questionsInitialized": "0",
  "productsInitialized": "0",
  "isPOS": "0",
  "imageId": "StoreGrey24",
  "posContentPKey": " ",
  "posContentProductCount": 0,
  "objectStatus": STATE.PERSISTED
};
POSlist.push(liPOSStore);

//load LoPOS only if LoPOS is not defined and products are not initialised
if(Utils.isDefined(me.getLoPOS())) {
  var productsIniaitlizedLoPOS = me.getLoPOS().getItemsByParam(
    {
      "productsInitialized": "0" 
    });
    isLoPOSReloadRequired = productsIniaitlizedLoPOS.length > 0;
}
if ((((bLoadPOS && !Utils.isDefined(me.getLoPOS()) || bLoPosInvalidated) && me.getConsiderPOSCheck() == "1") || posReloadRequired) && isLoPOSReloadRequired) {
  deferreds.push(BoFactory.loadListAsync("LoPOS", jsonQuery).then(
    function (list) {

      var listItems = list.getAllItems();
      var idx = 0;
      var lastItem;
      var currentItem;
      var bPosCheck = false;

      if (listItems.length > 0) {
        lastItem = listItems[0];

        //This if case is only needed in onPrem
        //In CGCloud is no POS-Check table. No need for creating POS-Checks
        if (listItems.length === 1 && !Utils.isSfBackend()) {

          if (lastItem.getIsPOSCheck() === "0") {
            lastItem.setObjectStatus(STATE.NEW | STATE.DIRTY);
            lastItem.setPKey(PKey.next());
            lastItem.setPosId(lastItem.getPKey());
            POSlist.push(lastItem);
          }
        } else if (!Utils.isSfBackend()) {
          lastItem = listItems[0];

          for (idx = 1; idx < listItems.length; idx++) {
            currentItem = listItems[idx];

            if (currentItem.getBpaMainPKey() === lastItem.getBpaMainPKey()) {

              if ((currentItem.getIsPOSCheck() == "1") && (lastItem.getIsPOSCheck() === "0")) {
                currentItem.setObjectStatus(STATE.DIRTY);
                POSlist.push(currentItem);
                bPosCheck = true;

              } else if ((lastItem.getIsPOSCheck() == "1") && (currentItem.getIsPOSCheck() === "0")) {
                lastItem.setObjectStatus(STATE.DIRTY);
                POSlist.push(lastItem);
                bPosCheck = true;
              }
            } else {
              if ((bPosCheck === false) && (lastItem.getIsPOSCheck() === "0")) {
                lastItem.setObjectStatus(STATE.NEW | STATE.DIRTY);
                lastItem.setPKey(PKey.next());
                lastItem.setPosId(lastItem.getPKey());
                POSlist.push(lastItem);
              }
              if ((idx === listItems.length - 1) && (currentItem.getIsPOSCheck() === "0")) {
                currentItem.setObjectStatus(STATE.NEW | STATE.DIRTY);
                currentItem.setPKey(PKey.next());
                currentItem.setPosId(currentItem.getPKey());
                POSlist.push(currentItem);
              }

              bPosCheck = false;
            }

            lastItem = currentItem;
          }
        } else {
          POSlist = POSlist.concat(listItems);
        }
      }

      if (bLoPosInvalidated) {
        // if POS list is reloaded then keep the initialized flags of the correlated lists
        var dicPosInitialized = Utils.createDictionary();
        var dicPos = Utils.createDictionary();
        var existingLoPOSItems = me.getLoPOS().getAllItems();
        var idxPos = existingLoPOSItems.length;
        var liPOS;

        while (idxPos--) {
          liPOS = existingLoPOSItems[idxPos];
          //Workaround for CW
          dicPosInitialized.add(liPOS.bpaMainPKey, [liPOS.questionsInitialized, liPOS.productsInitialized, liPOS.posId]);
          dicPos.add(liPOS.posId, liPOS);
        }

        // set the flags on the new items
        idxPos = POSlist.length;
        var dicItem;
        while (idxPos--) {
          liPOS = POSlist[idxPos];
          dicItem = dicPosInitialized.get(liPOS.bpaMainPKey);

          if (dicItem) {
            liPOS.questionsInitialized = dicItem[0];
            liPOS.productsInitialized = dicItem[1];
            liPOS.posId = dicItem[2];

            if (liPOS.productsInitialized == "1") {
              var filterPOS = dicPos.get(liPOS.posId);
              if (Utils.isDefined(filterPOS)) {
                liPOS.surveyCount = filterPOS.getSurveyCount();
                liPOS.questionCount = filterPOS.getQuestionCount();
                liPOS.surveyProducts = filterPOS.getSurveyProducts();
                liPOS.surveys = filterPOS.getSurveys();
              }
            }
          }
        }
      }

      var loPOS = BoFactory.instantiate("LoPOS");
      loPOS.addListItems(POSlist);
      me.setLoPOS(loPOS);

      // if a pos is preselected, no items will be shown for questions and surveys, so we set it to undefined
      me.getLoPOS().setCurrent(undefined); 
    }
  ));
} else if(me.getConsiderPOSCheck() == "0" && (!Utils.isDefined(me.getLoPOS()))){
  var loPOS = BoFactory.instantiate("LoPOS");
  loPOS.addListItems(POSlist);
  me.setLoPOS(loPOS);
}

var updateSurveyColumnRequired = false;
var magnetizationUpdateRequired = false;

if (bLoadJobDefs && (!Utils.isDefined(me.getLoJobDefinitions()) || loadType === "Remagnetization")) {

  deferreds.push(BoFactory.loadLightweightListAsync("LoJobDefinitions", jsonQuery).then(
    function (list) {
      list.setObjectStatus(STATE.PERSISTED);
      list.setObjectStatusFrozen(true);
      me.setLoJobDefinitions(list);
    }
  ));

  /* ---------------------------------------------------------------- */
  /* Determine already magnetized JobList infos */
  /* ---------------------------------------------------------------- */
  deferreds.push(BoFactory.loadLightweightListAsync("LoMagnetizedJobList", jsonQuery).then(
    function (list) {
      me.setLoMagnetizedJobList(list);
    }
  ));
  magnetizationUpdateRequired = true;

  /* ---------------------------------------------------------------- */
  /* Determine matrix survey columns */
  /* ---------------------------------------------------------------- */
  deferreds.push(BoFactory.loadListAsync("LoSurveyColumns", {}).then(
    function (list) {
      list.setObjectStatus(STATE.PERSISTED);
      list.setObjectStatusFrozen(true);
      me.setLoSurveyColumns(list);
    }
  ));
  updateSurveyColumnRequired = true;
}

if (bJobRelevant && !Utils.isDefined(me.getLoExistingJobListJobs())) {
  deferreds.push(BoFactory.loadLightweightListAsync("LoJobListJobs", jsonQuery).then(
    function (list) {
      me.setLoExistingJobListJobs(list);
    }
  ));
}

var promise = when.all(deferreds).then(
  function () {
    var deferreds2 = [];
    if (updateSurveyColumnRequired) {
      me.getLoJobDefinitions().synchronizeSurveyInfo(me.getLoSurveyColumns());
    }

    if (magnetizationUpdateRequired) {
      /* ---------------------------------------------------------------- */
      /* Get all Non Standard Jobs and Magnetize them */
      /* ---------------------------------------------------------------- */

      // Determine list only if call has original status 'Planned' and magnetize only if call is planned or in the process of being completed
      if (me.getOriginalClbStatus() === "Planned") {

        var LoMJL = me.getLoMagnetizedJobList();
        var aMagnetizedJobList = LoMJL.getAllItems();
        var idxMagnetizedJobList;
        var currentMagnetizedJobList;
        var bSaveNeeded = false;

        if (sLoadType !== "Remagnetization") {

          // Demagnetize JobLists that have become invalid for some reason
          // Only relevant during Load - not reload- due to unsaved Jobs
          for (idxMagnetizedJobList = 0; idxMagnetizedJobList < aMagnetizedJobList.length; idxMagnetizedJobList++) {
            currentMagnetizedJobList = aMagnetizedJobList[idxMagnetizedJobList];

            if (!(currentMagnetizedJobList.getValidFrom() <= me.getReferenceDate() && currentMagnetizedJobList.getValidThru() >= me.getReferenceDate()) && currentMagnetizedJobList.getJobExists() === "0") {
              currentMagnetizedJobList.setDemagnetizeOnSave("1");
              bSaveNeeded = true;
            }
          }
        }

        var NonStandardJobList = me.getLoJobDefinitions().getItemsByParamArray([{ "standardJobs": "0" }], [{ "jobListPKey": "ASC" }]);

        if (NonStandardJobList.length > 0) {
          var bMagnetizeJobLists = (me.getClbStatus() === "Planned" || me.getClbStatus() === "Completed");
          var lastJobListPKey = "";
          var magnetizedJobList = [];
          var liMagnetizedJobList;
          var count;
          idxMagnetizedJobList = 0;
          var bEntryExists = false;

          for (count = 0; count < NonStandardJobList.length; count++) {
            if (lastJobListPKey !== NonStandardJobList[count].getJobListPKey()) {
              lastJobListPKey = NonStandardJobList[count].getJobListPKey();
              bEntryExists = false;

              // check if magnetized joblist entry exists and create it if necessary
              for (idxMagnetizedJobList = 0; idxMagnetizedJobList < aMagnetizedJobList.length; idxMagnetizedJobList++) {
                if (aMagnetizedJobList[idxMagnetizedJobList].getPKey() === lastJobListPKey) {
                  bEntryExists = true;
                  break;
                }
              }
              if (!bEntryExists) {
                liMagnetizedJobList = {
                  "pKey": lastJobListPKey,
                  "clbMainPKey": " ",
                  "validFrom": NonStandardJobList[count].getValidFrom(),
                  "validThru": NonStandardJobList[count].getValidThru(),
                  "magnetizeOnSave": " ",
                  "demagnetizeOnSave": " ",
                  "done": " ",
                  "jobExists": " ",
                  "objectStatus": STATE.PERSISTED
                };

                if (bMagnetizeJobLists && NonStandardJobList[count].getClbMainPKey() !== me.getClbMainPKey()) {
                  liMagnetizedJobList.magnetizeOnSave = "1";
                  liMagnetizedJobList.objectStatus = STATE.DIRTY;
                  bSaveNeeded = true;
                }
                magnetizedJobList.push(liMagnetizedJobList);
              }
            }
          }
          LoMJL.addItems(magnetizedJobList);
        }

        if (bSaveNeeded) {
          LoMJL.setObjectStatus(STATE.DIRTY);
        }
      }
      /* ----------------------------------------------------- */
    }

    if(bLoadQuestions && !Utils.isDefined(me.getLoQuestions())){
      jsonQuery.params.push({
        "field": "boJobManager",
        "operator": "EQ",
        "value": me
      });
      jsonQuery.params.push({
        "field": "cameraIconCond",
        "operator": "EQ",
        "value": (Utils.isDefined(boCall) && boCall.isReadOnly()) ? 'PictureDetailwithPicturesForList' : 'CapturePictureIcon'
      });
      jsonQuery.params.push({
        "field": "considerPOSCheck",
        "operator": "EQ",
        "value": me.getConsiderPOSCheck()
      });

      deferreds2.push(BoFactory.loadLightweightListAsync("LoQuestions", jsonQuery).then(
        function (list) {
          list.setObjectStatus(STATE.PERSISTED);
          me.setLoQuestions(list);
          me.getLoQuestions().orderBy({
            "sort": "ASC"
          });
          me.addItemChangedEventListener('loQuestions', me.onQuestionChanged);
        }
      ));
    }

    if (bLoadSurveys && (sLoadType === "StatusChange_Delete" || sLoadType === "StatusChange_Complete" || sLoadType === "ExceptionCard")) {
      // only used when deleting the call
      jsonQuery.params.push({
        "field": "boJobManager",
        "operator": "EQ",
        "value": me
      });
      jsonQuery.params.push({
        "field": "pushToPOSListAfterLoad",
        "operator": "EQ",
        "value": true
      });
      jsonQuery.params.push({
        "field": "skipPresettingJobs",
        "operator": "EQ",
        "value": sLoadType === "ExceptionCard"
      });

      deferreds2.push(BoFactory.loadLightweightListAsync("LoSurveys", jsonQuery).then(
        function (list) {
          me.setLoCurrentSurveys(list);
        }
      ));
    }

    return when.all(deferreds2);
  }
);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}
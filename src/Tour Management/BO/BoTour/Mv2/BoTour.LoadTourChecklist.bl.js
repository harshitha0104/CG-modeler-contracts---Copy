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
 * @function loadTourChecklist
 * @this BoTour
 * @kind businessobject
 * @async
 * @namespace CORE
 * @returns promise
 */
function loadTourChecklist(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise;
var questionlist = [];

// CreateTourCheckQuestionList
var createTourCheckQtn = function(tmgTourPKey, tmgCheckPKey, usage, sort) {
  var jsonQuery = {};
  var tourCheckType;
  var tourText;
  var tourCheckTypeDefText;
  var sortTextUI;

  jsonQuery.params = [{ "field" : "pKey", "value" : tmgCheckPKey }];
  
  return BoFactory.loadObjectByParamsAsync("LuTourCheck", jsonQuery).then(
    function(luTourCheck) {

      //Get Tour check-CheckType, Text
      if(Utils.isDefined(luTourCheck)){
        tourCheckType = luTourCheck.getCheckType();
        tourText = luTourCheck.getText();
      }

      // Get Tour Check Type Definitions
      if(usage == "S" && tourCheckType == "SecurityCheck"){
        tourCheckTypeDefText = Localization.resolve("BoTour_StartOfDaySecurityCheck");
        sortTextUI = "1";
      }
      if(usage == "S" && tourCheckType == "VehicleCheck"){
        tourCheckTypeDefText = Localization.resolve("BoTour_StartOfDayVehicleCheck");
        sortTextUI = "2";
      }
      if(usage == "E" && tourCheckType == "SecurityCheck"){
        tourCheckTypeDefText = Localization.resolve("BoTour_EndOfDaySecurityCheck");
        sortTextUI = "3";
      }
      if(usage == "E" && tourCheckType == "VehicleCheck"){
        tourCheckTypeDefText = Localization.resolve("BoTour_EndOfDayVehicleCheck");
        sortTextUI = "4";
      }
      //Build dictionary on PKey for repeated questions.
      var questionitem = {
        "pKey" : PKey.next(),
        "tmgTourPKey" : tmgTourPKey,
        "tmgCheckPKey" : tmgCheckPKey,
        "value" : "0",
        "usage" :  usage,
        "checkType" : tourCheckType,
        "text" : tourText,
        "sort" : sort,
        "checkDefinitionText" : tourCheckTypeDefText,
        "sortTextUI" : sortTextUI,
        "objectStatus": STATE.NEW | STATE.DIRTY
      };
      questionlist.push(questionitem);
    }
  );
};

//New Tour - Tour Check Questions.
if(me.getLoTourChecks() === undefined || me.getLoTourChecks().getAllItems().length === 0) {
  var stateNewDirty = STATE.NEW | STATE.DIRTY;
  if(me.getObjectStatus() == stateNewDirty){
    
    promise = BoFactory.loadObjectByParamsAsync("LoTmgMetaCheckRel",{"tmgMetaPKey" : me.getTmgMetaPKey()}).then(
      function (loTmgMetaCheckRel) {
        
        var createTourChkQtnPromise=[];
        if(Utils.isDefined(loTmgMetaCheckRel)){
          var liTourCheckRelItems = loTmgMetaCheckRel.getAllItems();
          if(liTourCheckRelItems.length > 0){
            for (var i = 0; i < liTourCheckRelItems.length; i++){ 
              createTourChkQtnPromise.push(createTourCheckQtn(me.getPKey(), liTourCheckRelItems[i].getTmgCheckPKey(),liTourCheckRelItems[i].getUsage(),liTourCheckRelItems[i].getSort()));
            }
          }
        }

        return when.all(createTourChkQtnPromise).then(
          function () {
            //check on questionlist
            if(questionlist.length > 0){
              var loQuestions= me.getLoTourChecks();
              loQuestions.addObjectItems(questionlist);
              me.setLoTourChecks(loQuestions);
              if( me.getLoTourChecks().getAllItems().length > 0){
                for (var i = 0; i < me.getLoTourChecks().getAllItems().length; i++) {
                  // Set DataType and ToggleId for enabling checkbox on UI
                  me.getLoTourChecks().getAllItems()[i].setDataType("Toggle");
                  me.getLoTourChecks().getAllItems()[i].setToggleId("Bool");
                }
              }
              me.getLoTourChecks().setEARights(me.getTmgStatus());
              me.addItemChangedEventListener('loTourChecks', me.onQuestionChanged);
              me.getLoTourChecks().orderBy({
                "sortTextUI" : "ASC",
                "sort" : "ASC"
              });
            }
          }
        );
      }
    );
  } else { // Load TruckCheckList
    var jqueryQuery = {};
    jqueryQuery.params = [{ "field" : "tmgMainPKey", "value" : me.getPKey() }];

    promise = BoFactory.loadObjectByParamsAsync("LoTourChecks", jqueryQuery).then(
      function (loTourChecks) {
        // Set DataType and ToggleId for enabling checkbox on UI
        if(Utils.isDefined(loTourChecks)){
          if(loTourChecks.getAllItems().length > 0){
            for (var i = 0; i < loTourChecks.getAllItems().length; i++) {
              loTourChecks.getAllItems()[i].setDataType("Toggle");
              loTourChecks.getAllItems()[i].setToggleId("Bool");
            }
          }
        }
        me.setLoTourChecks(loTourChecks);
        me.getLoTourChecks().setEARights(me.getTmgStatus());
        me.addItemChangedEventListener('loTourChecks', me.onQuestionChanged);
        me.getLoTourChecks().orderBy({
          "sortTextUI" : "ASC",
          "sort" : "ASC"
        });
      }
    );
  }
} else {

  for (var i = 0; i < me.getLoTourChecks().getAllItems().length; i++) {
    // Set DataType and ToggleId for enabling checkbox on UI
    me.getLoTourChecks().getAllItems()[i].setDataType("Toggle");
    me.getLoTourChecks().getAllItems()[i].setToggleId("Bool");
  }

  me.getLoTourChecks().setEARights(me.getTmgStatus());
  me.addItemChangedEventListener('loTourChecks', me.onQuestionChanged);
  me.getLoTourChecks().orderBy({
    "sortTextUI" : "ASC",
    "sort" : "ASC"
  });
  
  promise = when.resolve();
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}
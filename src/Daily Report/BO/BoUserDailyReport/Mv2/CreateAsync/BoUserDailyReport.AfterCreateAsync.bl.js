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
 * @function afterCreateAsync
 * @this BoUserDailyReport
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} result
 * @param {Object} context
 * @returns promise
 */
function afterCreateAsync(result, context){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var jParams;
var jQuery;     
var user = ApplicationContext.get('user');       
var newActivityItems = [];
var dicActivityUpdate = Utils.createDictionary();

var pKey = PKey.next();
me.setPKey(pKey);

//will be replaced by generated ID, when number generator is available:
me.setId(pKey);

me.setSalesOrg(user.getBoUserSales().getSalesOrg());
me.setPhase('Initial');
me.setInitiationDate(Utils.createDateToday());
me.setOwnerUsrMainPKey(user.getPKey());
me.setResponsiblePKey(user.getPKey());
me.setUser(user.getName());

me.updateProperties(context.jsonQuery);  //UsrDocMetaPKey + dateFrom

//Date without time
var dateFrom2 = Utils.convertAnsiDate2Date(me.getDateFrom());
dateFrom2.setHours(0,0,0,0);
me.setDateFrom(Utils.convertFullDate2Ansi(dateFrom2));

//########################
//### Load UsrDocMeta
//########################
var promise = BoFactory.loadObjectByParamsAsync(BO_USERDOCMETA, me.getQueryBy("pKey", me.getUsrDocMetaPKey())).then(
  function (boUserDocMeta) {
    me.setBoUserDocMeta(boUserDocMeta);
    me.setWfeWorkflowPKey(boUserDocMeta.getWfeWorkflowPKey());
    me.setType(boUserDocMeta.getType());
    // if it's a timecard -> set pkey to appCtx:
    if(boUserDocMeta.getUiGroup()==="TimeCard"){
      me.setWorkTimeFrom("00:00");
      me.setWorkTimeThru("00:00");
      ApplicationContext.set('openTimeCardPKey', me.getPKey());
      ApplicationContext.set('openTimeCardBreakMetaPKey', me.getBoUserDocMeta().getBreakUsrTimeEntryMetaPKey());
      ApplicationContext.get('user').startReminderRuleTimers();
    }else{
      me.setWorkTimeFrom("00:00");
      me.setWorkTimeThru("00:00");
    }
    //########################
    //### Create UsrAnnotation
    //########################
    jParams = [];
    jQuery = {};

    // Prepare creation of BoUserExpense           
    jParams.push({ "field" : "language", "value" : user.getLanguageSpoken()});
    jParams.push({ "field" : "text", "value" : ' '});         
    jParams.push({ "field" : "usage", "value" : 'Doc'});
    jParams.push({ "field" : "referencePKey", "value" : me.getPKey()});
    jQuery.params = jParams;

    return BoFactory.loadObjectByParamsAsync(LU_USER, me.getQueryBy("pKey", me.getResponsiblePKey()));
  }).then(
  function (luUser){
    me.setResponsible(luUser.getName());

    return BoFactory.loadObjectByParamsAsync(LU_USER, me.getQueryBy("pKey", me.getOwnerUsrMainPKey()));
  }).then(
  function (luUser){
    me.setUser(luUser.getName());

    return BoFactory.createObjectAsync(BO_USERDRANNOTATION, jQuery); 
  }).then(
  function (boUserDRAnnotation) {

    //Do not Save UserAnnotation if no comment was entered
    boUserDRAnnotation.setObjectStatus(this.self.STATE_NEW_DIRTY);
    me.setBoUserDRAnnotation(boUserDRAnnotation);

    //########################
    //### Load UserDocCalls
    //########################
    var callParams = [];
    var callQuery = {};
    var dateFrom;
    if(Utils.isSfBackend()) {
      dateFrom = Utils.convertForDBParam(me.getDateFrom(), "DomDate");
    }
    else {
      dateFrom = me.getDateFrom();
    }
    callParams.push({ "field" : "dateFrom", "value" : dateFrom});
    callParams.push({ "field" : "usrDocMetaPKey", "value" :  me.getUsrDocMetaPKey()});
    callParams.push({ "field" : "ownerPKey", "value" :  me.getOwnerUsrMainPKey()});
    callQuery.params = callParams;
    return BoFactory.loadObjectByParamsAsync(LO_USERDRCALLSTATISTIC, callQuery); 
  }).then(
  function (loUserDRCallStatistic) {

    var callStatisticItems = loUserDRCallStatistic.getAllItems();

    //###############################################################################################
    //### Create UserDoc Activities dictionary for summing up "standard" calls and all day calls
    //###############################################################################################
    //loop over new call items from db
    for ( var i = 0, len = callStatisticItems.length; i < len; i++) {
      if(!dicActivityUpdate.containsKey(callStatisticItems[i].getClbMetaPKey())){
        var activityItem = {
          "hours" : parseInt(callStatisticItems[i].getHours(), 10),
          "minutes" : parseInt(callStatisticItems[i].getMinutes(), 10),
          "clbMetaPKey" : callStatisticItems[i].getClbMetaPKey(),
          "clbText" : callStatisticItems[i].getClbText(),
          "callType" : callStatisticItems[i].getCallType()
        };
        dicActivityUpdate.add(callStatisticItems[i].getClbMetaPKey(), activityItem);
      }else{
        dicActivityUpdate.get(callStatisticItems[i].getClbMetaPKey()).hours =  dicActivityUpdate.get(callStatisticItems[i].getClbMetaPKey()).hours + parseInt(callStatisticItems[i].getHours(), 10);
        dicActivityUpdate.get(callStatisticItems[i].getClbMetaPKey()).minutes =  dicActivityUpdate.get(callStatisticItems[i].getClbMetaPKey()).minutes + parseInt(callStatisticItems[i].getMinutes(), 10);
      }
    }

    //loop over dic
    var currentDicItem;
    var key;
    var currentActivityItem;
    var duration = 0;
    for ( var j = 0, lenj = dicActivityUpdate.keys().length; j < lenj; j++) {
      key = dicActivityUpdate.keys()[j];
      duration = 0;
      currentDicItem = dicActivityUpdate.get(key);

      //Create List Item
      duration += currentDicItem.minutes;
      duration += currentDicItem.hours * 60;

      var newliUserDocActivity = {
        "pKey" : PKey.next(),
        "usrDocPKey" : me.getPKey(),
        "duration" : duration.toString(),
        "hours" : Math.floor(duration/60),
        "minutes" : (duration % 60).toString(),
        "clbMetaPKey" : currentDicItem.clbMetaPKey,
        "clbText" : currentDicItem.clbText,
        "callType" : currentDicItem.callType,
        "objectStatus" : STATE.NEW | STATE.DIRTY
      };

      newActivityItems.push(newliUserDocActivity);
    }

    //########################
    //### Load Workflow BO###
    //########################
    var wfejsonQuery = {};
    wfejsonQuery.params = [{ "field":"pKey", "value" : me.getWfeWorkflowPKey() }];
    return BoFactory.loadObjectByParamsAsync(BO_WORKFLOW, wfejsonQuery);
  }).then(
  function (boWorkflow) {
    me.setBoWorkflow(boWorkflow);        
    var wfeStateJsonQuery = boWorkflow.getInitialState();

    if(Utils.isDefined(wfeStateJsonQuery)){
      me.setPhase(wfeStateJsonQuery.stateType);
      me.setActualStatePKey(wfeStateJsonQuery.toStatePKey);
      me.setNextStatePKey(me.getActualStatePKey());
    }

    //################################################
    //### Create Recent State for workflow history ###
    //################################################
    return BoFactory.createObjectAsync(LO_USERDRRECENTSTATE, {});
  }).then(
  function (loUserDRRecentState){

    me.setLoUserDRRecentState(loUserDRRecentState);

    return BoFactory.loadListAsync(LO_USRTIMEENTRYBYVISITTYPE,  me.getQueryBy("UsrDailyReportPKey", me.getPKey()));
  }).then(
  function (loUsrTimeEntryByVisitType) {

    me.setLoUsrTimeEntryByVisitType(loUsrTimeEntryByVisitType);                
    return BoFactory.loadListAsync(LO_USRTIMEENTRY,  me.getQueryBy("UsrDailyReportPKey", me.getPKey()));
  }).then(
  function (loUsrTimeEntry){

    me.setLoUsrTimeEntry(loUsrTimeEntry);
    var now = Utils.createDateNow();
    var time = ApplicationContext.get("dateTimeHelper").getFormattedTimeString(now.getHours() * 60 + now.getMinutes());
    if(!(Utils.isDefined(ApplicationContext.get('currentTourPKey')) && !Utils.isEmptyString(ApplicationContext.get('currentTourPKey')) && ApplicationContext.get('currentTourStatus') == "Running") && !Utils.isEmptyString(me.getBoUserDocMeta().getWorkUsrTimeEntryMetaPKey())){
      me.createTimeEntry(me.getBoUserDocMeta().getWorkUsrTimeEntryMetaPKey(), " ", " ", " ", Utils.convertFullDate2Ansi(now), "1800-01-01", time, "00:00", " ", " ", "0");
    }

    return BoFactory.createObjectAsync(LO_USRDRACTIVITY, {});  
  }).then(
  function (loUsrDRActivity) {

    loUsrDRActivity.addListItems(newActivityItems);

    //Adding callType icons on creation
    for (var i = 0; i < newActivityItems.length; i++){
      var callType = newActivityItems[i].getCallType();
      var imageId = 'ClbTypeStatus_' + callType + '_Planned';
      newActivityItems[i].setClbTypeStatus(imageId);
    }

    loUsrDRActivity.setObjectStatus(this.self.STATE_NEW_DIRTY);

    me.setLoUsrDRActivity(loUsrDRActivity);
    me.addItemChangedEventListener('loUsrDRActivity', me.onDRActivityItemChanged);

    //Calculate Duration
    me.calculateTotalActivityDuration();

    //Set State
    me.setObjectStatus(this.self.STATE_NEW_DIRTY);

    //set edit and acces rights
    me.setEARights();

    return me;
  }
);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}
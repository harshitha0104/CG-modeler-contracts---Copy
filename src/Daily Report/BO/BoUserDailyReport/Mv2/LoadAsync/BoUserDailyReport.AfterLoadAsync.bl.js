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
 * @function afterLoadAsync
 * @this BoUserDailyReport
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} result
 * @param {Object} context
 * @returns promise
 */
function afterLoadAsync(result, context){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var user = ApplicationContext.get('user');
var bAnnotationAdded = false;

//#########################
//### Load Daily Report ###
//#########################

var promise = Facade.getObjectAsync(BO_USERDAILYREPORT, context.jsonQuery).then(
  function (boUserDailyReport) {
    me.setProperties(boUserDailyReport);

    //##########################
    //### Load User Doc Meta ###
    //##########################
    return BoFactory.loadObjectByParamsAsync(BO_USERDOCMETA, me.getQueryBy("pKey", me.getUsrDocMetaPKey()));
  }).then(
  function (boUserDocMeta) {
    me.setBoUserDocMeta(boUserDocMeta);

    if(Utils.isEmptyString(me.getWorkTimeFrom())){me.setWorkTimeFrom("00:00");}
    if(Utils.isEmptyString(me.getWorkTimeThru())){me.setWorkTimeThru("00:00");}

    var wfejsonQuery = {};
    wfejsonQuery.params = [{ "field":"pKey", "value" : me.getWfeWorkflowPKey() }];

    //########################
    //### Load Workflow BO ###
    //########################
    return BoFactory.loadObjectByParamsAsync(BO_WORKFLOW, wfejsonQuery);
  }).then(
  function (boWorkflow) {
    me.setBoWorkflow(boWorkflow);

    //#############################
    //### Load Responsible Name ###
    //#############################
    return BoFactory.loadObjectByParamsAsync(LU_USER, me.getQueryBy("pKey", me.getResponsiblePKey()));
  }).then(
  function (luUser){
    me.setResponsible(luUser.getName());
    me.setUser(luUser.getName());

    //##########################
    //### Load UsrAnnotation ###
    //########################## 
    return BoFactory.loadObjectByParamsAsync(BO_USERDRANNOTATION,  me.getQueryBy("usrDocPKey", me.getPKey()));
  }).then(
  function (boUserAnnotation) {

    //if no Annotation was loaded create one
    if(Utils.isEmptyString(boUserAnnotation.getPKey())){
      bAnnotationAdded = true;
      boUserAnnotation.setPKey(PKey.next());
      boUserAnnotation.setLanguage(user.getLanguageSpoken());
      boUserAnnotation.initText();
      boUserAnnotation.setUsage("Doc");
      boUserAnnotation.setReferencePKey(me.getPKey());
    }
    me.setBoUserDRAnnotation(boUserAnnotation);

    //#############################
    //### Load UsrDocActivities ###
    //############################# 
    return BoFactory.loadListAsync(LO_USRDRACTIVITY,  me.getQueryBy("usrDocPKey", me.getPKey()));
  }).then(
  function (loUserDocActivity) {
    me.setLoUsrDRActivity(loUserDocActivity);
    me.addItemChangedEventListener('loUsrDRActivity', me.onDRActivityItemChanged);

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
    return BoFactory.loadListAsync(LO_USRTIMEENTRY,  me.getQueryBy("usrDailyReportPKey", me.getPKey()));
  }).then(
  function (loUsrTimeEntry){                        
    me.setLoUsrTimeEntry(loUsrTimeEntry);
    //Calculate Duration
    me.calculateTotalActivityDuration();
  }).then(
  function(){

    //Lookup for Owner only if Owner <> Repsonsible
    if(me.getResponsiblePKey() !== me.getOwnerUsrMainPKey()){
      return BoFactory.loadObjectByParamsAsync(LU_USER, me.getQueryBy("pKey", me.getOwnerUsrMainPKey())).then(
        function (luUser){
          me.setUser(luUser.getName());

          if (!bAnnotationAdded){
            //Reset dirty flag
            me.setObjectStatus(me.self.STATE_UNMODIFIED); 
          }

          //set edit and access rights
          me.setEARights();

          return me;
        }
      );  
    }else{
      if (!bAnnotationAdded){
        //Reset dirty flag
        me.setObjectStatus(me.self.STATE_UNMODIFIED); 
      }

      //set edit and access rights
      me.setEARights();

      return me;
    }  
  }
);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}
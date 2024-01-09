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
 * @function beforeSaveAsync
 * @this BoTour
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} context
 * @returns promise
 */
function beforeSaveAsync(context){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
/********************************************************************************************************
  *  1 CGCloud table / 2 onPrem tables                                                                       *
  *                                                                                                       *
  *  CGCloud:    -Description is part of Tour__c                                                             *
  *           -TourObjectRelation are mapped differently.                                                 *
  *            In some cases objectMetaPKey is mapped to call template in other cases to order template.  *
  *            No "ObjectKey" concept                                                                     *
  *  onPrem:  -Separate table for description                                                             *
  *            "ObjectKey" concept. No dynamic mapping of object key                                      *
  *********************************************************************************************************/

var deferreds = [];
var changeType;
var data;
var mapping;

if(Utils.isDefined(me.getLoTourRelatedCalls()) && me.getTmgStatus()==="Open") {
  if (me.getLoTourRelatedCalls().getObjectStatus() != STATE.PERSISTED) {
    deferreds.push(Facade.saveListAsync(me.getLoTourRelatedCalls()));
  }}

if(!Utils.isEmptyString(me.getEtpVehicleTruckPKey()) && Utils.isDefined(me.getLuTruck())) {
  me.setTruckId(me.getLuTruck().getTruckId());
}
if(!Utils.isEmptyString(me.getEtpVehicleTrailer1PKey()) && Utils.isDefined(me.getLuTrailer1())) {
  me.setTrailerId(me.getLuTrailer1().getTruckId());
}
if(!Utils.isEmptyString(me.getEtpVehicleTrailer2PKey()) && Utils.isDefined(me.getLuTrailer2())) {
  me.setTrailerId2(me.getLuTrailer2().getTruckId());
}

// SF/CASDIF: General Dif
// If the backend is SalesForce, Description is part of Tour__c
if (Utils.isSfBackend()) {
  if(Utils.isDefined(me.getLoTmgTourObjectRelations())) {
    if (me.getLoTmgTourObjectRelations().getObjectStatus() != STATE.PERSISTED) {
      // Determine type of change
      if ((me.getLoTmgTourObjectRelations().getObjectStatus() & STATE.DELETED) > 0) {
        changeType = "D";
      }
      else if ((me.getLoTmgTourObjectRelations().getObjectStatus() & STATE.NEW) > 0) {
        changeType = "N";
      }
      else {
        changeType = "U";
      }

      var datasourceTourObjects = AppManager.getDataSource("LoTmgTourObjectRelations");
      var tourObjectReferences = me.getLoTmgTourObjectRelations().getAllItems();
      var CallTemplateField = "Visit_Template__c";
      var OrderTemplateField = "Order_Template__c";

      for(var i = 0; i < tourObjectReferences.length; i++) {
        var ObjectMetaPKey =  tourObjectReferences[i].getObjectMetaPKey();
        data =  tourObjectReferences[i].getData();
        mapping = Utils.clone(datasourceTourObjects.attributeToColumnMapping);

        if(tourObjectReferences[i].getUsage().indexOf("ClbMeta") >= 0) {
          mapping.objectMetaPKey = CallTemplateField;
        }
        else {
          mapping.objectMetaPKey = OrderTemplateField;
        }
        deferreds.push(Facade.putTrackedObjectInTransaction({
          name: datasourceTourObjects.objectName,
          idAttribute: datasourceTourObjects.idAttribute,
          idProperty: datasourceTourObjects.idProperty,
          mapping: mapping,
          changeType: changeType,
          data: data,
        }));
      }
    }
  }
}

if (Utils.isCasBackend()) {
  if(Utils.isDefined(me.getLoTmgTourObjectRelations())) {
    deferreds.push(Facade.saveListAsync(me.getLoTmgTourObjectRelations()));
  }
  if(Utils.isDefined(me.getLoTmgTourCheckRelations())) {
    deferreds.push(Facade.saveListAsync(me.getLoTmgTourCheckRelations()));
  }

  if(Utils.isDefined(me.getBoTruckLoad())) {
    deferreds.push(me.getBoTruckLoad().saveAsync());
  }
}

// SF/CASDIF: General Dif
// If the backend is SalesForce, Description is part of Tour__c
if (Utils.isSfBackend()) {
  // Determine type of change
  if ((me.getObjectStatus() & STATE.DELETED) > 0) {
    changeType = "D";
  }
  else if ((me.getObjectStatus() & STATE.NEW) > 0) {
    changeType = "N";
  }
  else {
    changeType = "U";
  }

  var datasource = AppManager.getDataSource("BoTour");
  var DescriptionField = "Description_" + ApplicationContext.get('user').sfLanguagePostfix + "__c";
  var Description =  me.getLoTourDescription().getAllItems()[0].getText();
  data =  me.getData();
  data.text = Description;

  //in case of normal save dateFrom/DateThru is a ANSI Datestring
  //in case od drag and drop of the call in the agenda date from is a javascript date
  if (data.dateFrom instanceof Date) {
    data.dateFrom = Utils.convertDate2Ansi(data.dateFrom);
  }
  if (data.dateThru instanceof Date) {
    data.dateThru = Utils.convertDate2Ansi(data.dateThru);
  }
  var endDate = Utils.convertAnsiDate2Date(data.dateThru.substr(0,10) + " " + data.timeThru + ":00").getTime();
  var maxDate = Utils.convertAnsiDate2Date(Utils.getMaxDate()).getTime();

  data.sf_startDateTime = Utils.convertAnsiDate2Date(data.dateFrom.substr(0,10) + " " + data.timeFrom + ":00").getTime();
  data.sf_endDateTime = (endDate > maxDate) ? maxDate:endDate;
  data.sf_startReleaseTime = Utils.unixepochToTicks(Utils.convertForDB(data.startReleaseTime, "DomDateTime"));
  data.sf_completionReleaseTime = Utils.unixepochToTicks(Utils.convertForDB(data.completionReleaseTime, "DomDateTime"));

  mapping = Utils.clone(datasource.attributeToColumnMapping);
  mapping.text = DescriptionField;
  mapping.sf_startDateTime = "Start_Date_Time__c";
  mapping.sf_endDateTime = "End_Date_Time__c";
  mapping.sf_startReleaseTime = "Start_Release_Time__c";
  mapping.sf_completionReleaseTime = "Completion_Release_Time__c";

  deferreds.push(Facade.saveTrackedObject({
    name: datasource.objectName,
    idAttribute: datasource.idAttribute,
    idProperty: datasource.idProperty,
    mapping: mapping,
    changeType: changeType,
    data: data
  }));
}
else {
  if(Utils.isDefined(me.getLoTourDescription())) {
    deferreds.push(Facade.saveListAsync(me.getLoTourDescription()));
  }
  deferreds.push(Facade.saveObjectAsync(me));
}

var promise = when.all(deferreds);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}
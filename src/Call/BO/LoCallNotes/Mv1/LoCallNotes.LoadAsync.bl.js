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
 * @function loadAsync
 * @this LoCallNotes
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} jsonQuery
 * @returns promise
 */
function loadAsync(jsonQuery){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise = Facade.getListAsync(LO_CALLNOTES, jsonQuery).then(
  function (notes) {
    var clbMainPKey;
    var bpaMainPKey;
    var dateFrom;
    var timeFrom;
    var responsibleName;
    var responsiblePKey;

    for (var index in jsonQuery.params) {
      switch (jsonQuery.params[index].field) {
        case "clbMainPKey":
          clbMainPKey = jsonQuery.params[index].value;
          break;
        case "bpaMainPKey":
          bpaMainPKey = jsonQuery.params[index].value;
          break;
        case "dateFrom":
          dateFrom = jsonQuery.params[index].value;
          break;
        case "timeFrom":
          timeFrom = jsonQuery.params[index].value;
          break;
        case "responsiblePKey":
          responsiblePKey = jsonQuery.params[index].value;
          break;
        case "responsibleName":
          responsibleName = jsonQuery.params[index].value;
          break;
      }
    }

    var currentNoteExists = false;
    for (var i=0; i<notes.length; i++) {
      notes[i].noteDate = Localization.localize(notes[i].noteDate, "default");
      notes[i].shortText = notes[i].text.substr(0, 100);
      if (notes[i].text.length > 100) {
        notes[i].shortText += "...";
      }
      if (notes[i].pKey === clbMainPKey) {
        currentNoteExists = true;
      }
    }

    if (!currentNoteExists && Utils.isDefined(dateFrom)) {
      var note = {
        "pKey": clbMainPKey,
        "bpaMainPKey": bpaMainPKey,
        "noteDate": dateFrom.substr(0,10) + " " + timeFrom + ":00",
        "responsiblePKey": responsiblePKey,
        "responsibleName": responsibleName,
        "text": " ",
        "shortText": " "};
      notes.push(note);
    }

    notes.sort(function(a,b){return (a.noteDate === b.noteDate) ? 0 : ((a.noteDate > b.noteDate) ? -1 : 1);});
    me.addItems(notes, jsonQuery.params);

    //set EA rights
    var allNotes = me.getAllItems();
    for (var j=0; j<allNotes.length; j++) {
      if (allNotes[j].getPKey() !== clbMainPKey) {
        allNotes[j].getACL().removeRight(AclObjectType.PROPERTY, "text", AclPermission.EDIT);
      }
    }

    me.orderBy({"noteDate": "DESC"});
    var boCall = Framework.getProcessContext().mainBO;
    
    //clean call notes list
    me.setObjectStatus(STATE.PERSISTED);
    
    boCall.setObjectStatusFrozen(true);
    boCall.setLoNotes(me);
    boCall.setObjectStatusFrozen(false);
    
    boCall.addItemChangedEventListener('loNotes', boCall.onNotesChanged);
    return me;
  });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}
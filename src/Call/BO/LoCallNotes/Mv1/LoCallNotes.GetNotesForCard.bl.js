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
 * @function getNotesForCard
 * @this LoCallNotes
 * @kind listobject
 * @namespace CORE
 * @param {DomInteger} numberOfListItems
 * @param {DomPKey} clbMainPKey
 * @param {Object} loNotes
 * @param {String} callDate
 * @returns me
 */
function getNotesForCard(numberOfListItems, clbMainPKey, loNotes, callDate){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var i;
var numberVisibleCalls;
if(!Utils.isDefined(numberOfListItems)) {
  if(Utils.isPhone()) {
    numberVisibleCalls = 3;
  }
  else {
    numberVisibleCalls = 5;
  }
}
else {
  numberVisibleCalls = numberOfListItems;
}
//Refresh notes card logic starts
var currentNoteExists = false;
var counter = 0;
var notesList = [];
var notes = loNotes.getAllItems();
var loCallnote = BoFactory.instantiate("LoCallNotes");

for(i=0;i<notes.length;i++){
  if(notes[i].pKey === clbMainPKey && Utils.isEmptyString(notes[i].text)){
    currentNoteExists = true;
  }
  var liCallnote = {
    "pKey": notes[i].pKey,
    "bpaMainPKey": notes[i].bpaMainPKey,
    "noteDate": notes[i].noteDate,
    "text": notes[i].text,
    "shortText": notes[i].shortText,
    "responsiblePKey": notes[i].responsiblePKey,
    "responsibleName": notes[i].responsibleName,
    "noteSubText": notes[i].noteSubText
  };
  loCallnote.addListItems([liCallnote]);
}

//Refresh notes card logic ends
notesList = loCallnote.getAllItems();
notesList.sort(function(a,b){return (a.noteDate === b.noteDate) ? 0 : ((a.noteDate > b.noteDate) ? -1 : 1);});
if(currentNoteExists) {
  me.cardItemCount = notesList.length-1;
  numberOfListItems += 1;
}
else {
  me.cardItemCount = notesList.length;
}
notesList = notesList.splice(0, numberOfListItems);

for(i=0;i<notesList.length;i++) {
  if(!Utils.isPhone()) {
    if(notesList[i].shortText.length > 75) {
      notesList[i].shortText= notesList[i].shortText.substr(0, 75);
      notesList[i].shortText+= "...";
    }
  }
  else {
    if(notesList[i].shortText.length > 70) {
      notesList[i].shortText= notesList[i].shortText.substr(0, 70);
      notesList[i].shortText+= "...";
    }
  }
  var currentDate = Utils.convertDate2Ansi(Utils.createDateToday());
  notesList[i].noteSubText = Localization.localize(notesList[i].noteDate, "date");

  if (Localization.localize(currentDate, "date") === Localization.localize(callDate, "date")) {
    if(Localization.localize(notesList[i].noteDate, "date") === Localization.localize(currentDate, "date")) {
      notesList[i].noteSubText = Localization.resolve("CardVisitNotes_CreatedToday");
    }
    else if(Localization.localize(notesList[i].noteDate, "date") === Localization.localize(Utils.addDays2AnsiFullDate(currentDate, -1), "date")) {
      notesList[i].noteSubText = Localization.resolve("CardVisitNotes_CreatedYesterday");
    }
    else if(Localization.localize(notesList[i].noteDate, "date") === Localization.localize(Utils.addDays2AnsiFullDate(currentDate, 1), "date")) {
      notesList[i].noteSubText = Localization.resolve("CardVisitNotes_DueTommorrow");
    }
  }

  if(ApplicationContext.get('user').getPKey() == notesList[i].responsiblePKey) {
    notesList[i].noteSubText = notesList[i].noteSubText + " - You";
  }
  else {
    notesList[i].noteSubText = notesList[i].noteSubText + " - " + notesList[i].responsibleName;
  }
}
me.removeAllItems();
me.addItems(notesList);
me.resetFilter("pKey");

if(currentNoteExists) {
  me.setFilter("pKey", clbMainPKey, "NE");
}

me.setObjectStatus(STATE.PERSISTED);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return me;
}
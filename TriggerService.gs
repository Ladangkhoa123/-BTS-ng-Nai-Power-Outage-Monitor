function createDailyTrigger() {
  ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === 'syncOutages').forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('syncOutages').timeBased().everyDays(1).atHour(5).create();
}

Ext.ns('Rwiki');

Rwiki.rootFolderName = '.';

/**
 * Log the event names to the console of any observable object.
 */
Rwiki.captureEvents = function(observable) {
  Ext.util.Observable.capture(observable, function(eventName) {
    if (console === undefined) return;
    console.log(eventName);
  });
};

Rwiki.init = function() {
  Rwiki.nodeManager = new Rwiki.Node();
  Rwiki.captureEvents(Rwiki.nodeManager);

  var treePanel = new Rwiki.TreePanel();
  treePanel.relayEvents(Rwiki.nodeManager,
    ['folderCreated', 'pageCreated', 'nodeRenamed', 'nodeDeleted']);

  var tabPanel = new Rwiki.TabPanel();
  tabPanel.relayEvents(Rwiki.nodeManager,
    ['pageLoaded', 'folderCreated', 'pageCreated', 'pageSaved', 'nodeRenamed', 'nodeDeleted']);

  var editorPanel = new Rwiki.EditorPanel();
  editorPanel.relayEvents(Rwiki.nodeManager,
    ['pageLoaded', 'nodeRenamed', 'nodeDeleted']);

  // Create layout

  var sidePanel = new Ext.Panel({
    region: 'west',
    id: 'west-panel',
    title: 'Pages',
    split: true,
    width: 265,
    minSize: 265,
    maxSize: 500,
    collapsible: true,
    autoScroll: true,
    margins: '0 0 5 5',
    cmargins: '0 0 0 0',
    items: [treePanel]
  });

  var mainPanel = new Ext.Panel({
    region: 'center',
    layout: 'border',
    items: [tabPanel, editorPanel]
  });

  var app = new Rwiki.Viewport({
    items: [sidePanel, mainPanel],
    renderTo: Ext.getBody()
  });

  app.show();
};

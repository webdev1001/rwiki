Ext.ns('Rwiki');

Rwiki.EditorWindow = Ext.extend(Ext.Window, {
  constructor: function(editorPanel) {
    Ext.apply(this, {
      maximizable: true,
      modal: true,
      width: 750,
      height: 500,
      minWidth: 300,
      minHeight: 200,
      layout: 'fit',
      plain: true,
      bodyStyle: 'padding: 5px;',
      buttonAlign: 'center',
      items: editorPanel,
      buttons: [
        {
          text: 'Save',
          scope: this,
          handler: this.onSaveButton
        },
        {
          text: 'Save and continue',
          scope: this,
          handler: this.onSaveAndContinueButton
        },
        {
          text: 'Cancel',
          scope: this,
          handler: this.onCancelButton
        }
      ]
    });

    Rwiki.EditorWindow.superclass.constructor.apply(this, arguments);
    this.editorPanel = editorPanel;
  },

  setPagePath: function(path) {
    this.pagePath = path;
    this.setTitle('Editing page ' + path);
  },

  show: function() {
    Rwiki.NodeManager.getInstance().loadPage(this.pagePath);
    Rwiki.EditorWindow.superclass.show.apply(this, arguments);
  },

  onSaveButton: function() {
    Rwiki.NodeManager.getInstance().savePage(this.pagePath, this.editorPanel.getRawContent());
    this.hide();
  },

  onSaveAndContinueButton: function() {
    Rwiki.NodeManager.getInstance().savePage(this.pagePath, this.editorPanel.getRawContent());
  },

  onCancelButton: function() {
    this.hide();
  },

  close: function() {
    this.hide();
  }
});

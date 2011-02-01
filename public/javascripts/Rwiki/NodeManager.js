Ext.ns('Rwiki');

Rwiki.NodeManager = Ext.extend(Ext.util.Observable, {
  constructor: function() {
    if (Rwiki.NodeManager.caller != Rwiki.NodeManager.getInstance) {
      throw new Error("There is no public constructor for Rwiki.NodeManager");
    }

    this.initEvents();
  },

  initEvents: function() {
    this.addEvents(
      'rwiki:beforePageLoad',
      'rwiki:pageLoaded',
      'rwiki:nodeDeleted',
      'rwiki:folderCreated',
      'rwiki:pageCreated',
      'rwiki:pageSaved',
      'rwiki:nodeRenamed',
      'rwiki:lastPageClosed'
    );
  },

  loadPage: function(path) {
    var page = new Rwiki.Node({ path: path });
    this.fireEvent('rwiki:beforePageLoad', page);

    Ext.Ajax.request({
      url: '/node',
      method: 'GET',
      params: { path: path },
      scope: this,
      success: function(response) {
        var data = Ext.decode(response.responseText);
        var page = new Rwiki.Node(data);
        this.fireEvent('rwiki:pageLoaded', page);
      }
    });
  },

  createFolder: function(parentPath, name) {
    this._createNode(parentPath, name, true);
  },
  
  createPage: function(parentPath, name) {
    this._createNode(parentPath, name, false);
  },

  _createNode: function(parentPath, name, isFolder) {
    Ext.Ajax.request({
      url: '/node',
      type: 'POST',
      params: {
        parentPath: parentPath,
        name: name,
        isFolder: isFolder
      },
      scope: this,
      success: function(response) {
        var data = Ext.decode(response.responseText);
        var page = new Rwiki.Node(data);

        if (isFolder) {
          this.fireEvent('rwiki:folderCreated', page);
        } else {
          this.fireEvent('rwiki:pageCreated', page);
        }
      }
    });
  },

  savePage: function(path, rawContent) {
    Ext.Ajax.request({
      url: '/node',
      method: 'PUT',
      params: {
        path: path,
        rawContent: rawContent
      },
      scope: this,
      success: function(response) {
        var data = Ext.decode(response.responseText);
        var page = new Rwiki.Node(data);
        this.fireEvent('rwiki:pageSaved', page);
      }
    });
  },

  renameNode: function(oldPath, newName) {
    Ext.Ajax.request({
      url: '/node/rename',
      method: 'POST',
      params: {
        path: oldPath,
        newName: newName
      },
      scope: this,
      success: function(response) {
        var data = Ext.decode(response.responseText);
        var page = new Rwiki.Node(data);
        this.fireEvent('rwiki:nodeRenamed', page);
      }
    });
  },

  deleteNode: function(path) {
    Ext.Ajax.request({
      url: '/node',
      method: 'DELETE',
      params: { path: path },
      scope: this,
      success: function(response) {
        var data = Ext.decode(response.responseText);
        this.fireEvent('rwiki:nodeDeleted', data);
      }
    });
  },

  moveNode: function(path, newParentPath) {
    var self = this;
    var result = $.ajax({
      type: 'PUT',
      url: '/node/move',
      dataType: 'json',
      async: false,
      data: {
        path: path,
        newParentPath: newParentPath
      },
      success: function(data) {
        var page = new Rwiki.Node(data);
        self.fireEvent('rwiki:nodeRenamed', page);
      }
    });

    return Ext.util.JSON.decode(result.responseText);
  },

  isParent: function(parentPath, path) {
    var parentParts = parentPath.split('/');
    var pathParts = path.split('/');

    var result = true;
    var n = Math.min(parentParts.length, pathParts.length);
    for (var i = 0; i < n; i++) {
      if (parentParts[i] != pathParts[i]) {
        result = false;
        break;
      }
    }

    return result;
  }
});

Rwiki.NodeManager._instance = null;

Rwiki.NodeManager.getInstance = function() {
  if (this._instance == null) {
    this._instance = new Rwiki.NodeManager();
  }

  return this._instance;
};

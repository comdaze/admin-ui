
function BuildpacksTab(id)
{
    Tab.call(this, id, Constants.URL__BUILDPACKS_VIEW_MODEL);
}

BuildpacksTab.prototype = new Tab();

BuildpacksTab.prototype.constructor = BuildpacksTab;

BuildpacksTab.prototype.getInitialSort = function()
{
    return [[1, "asc"]];
};

BuildpacksTab.prototype.getColumns = function()
{
    return [
               {
                   "sTitle":    "&nbsp;",
                   "sWidth":    "2px",
                   "sClass":    "cellCenterAlign",
                   "bSortable": false,
                   "mRender":   function(value, type, item)
                   {
                       return Tab.prototype.formatCheckbox(item[1], value);
                   }
               },
               {
                   "sTitle":  "Name",
                   "sWidth":  "200px",
                   "mRender": Format.formatBuildpackName
               },
               {
                   "sTitle": "GUID",
                   "sWidth": "200px",
                   "mRender": Format.formatString
               },
               {
                   "sTitle":  "Created",
                   "sWidth":  "180px",
                   "mRender": Format.formatString
               },
               {
                   "sTitle":  "Updated",
                   "sWidth":  "180px",
                   "mRender": Format.formatString
               },
               {
                   "sTitle":  "Position",
                   "sWidth":  "70px",
                   "sClass":  "cellRightAlign",
                   "mRender": Format.formatNumber
               },
               {
                   "sTitle":  "Enabled",
                   "sWidth":  "80px",
                   "mRender": Format.formatBoolean
               },
               {
                   "sTitle":  "Locked",
                   "sWidth":  "80px",
                   "mRender": Format.formatBoolean
               }
           ];
};

BuildpacksTab.prototype.getActions = function()
{
    return [
               {
                   text: "Rename",
                   click: $.proxy(function()
                   {
                       this.renameSingleChecked("Rename Buildpack",
                                                "Managing Buildpacks",
                                                Constants.URL__BUILDPACKS);
                   }, 
                   this)
               },
               {
                   text: "Enable",
                   click: $.proxy(function() 
                   {
                       this.updateChecked("Managing Buildpacks",
                                          Constants.URL__BUILDPACKS,
                                          '{"enabled":true}');
                   }, 
                   this)
               },
               {
                   text: "Disable",
                   click: $.proxy(function() 
                   {
                       this.updateChecked("Managing Buildpacks",
                                          Constants.URL__BUILDPACKS,
                                          '{"enabled":false}');
                   }, 
                   this)
               },
               {
                   text: "Lock",
                   click: $.proxy(function() 
                   {
                       this.updateChecked("Managing Buildpacks",
                                          Constants.URL__BUILDPACKS,
                                          '{"locked":true}');
                   }, 
                   this)
               },
               {
                   text: "Unlock",
                   click: $.proxy(function() 
                   {
                       this.updateChecked("Managing Buildpacks",
                                          Constants.URL__BUILDPACKS,
                                          '{"locked":false}');
                   }, 
                   this)
               },
               {
                   text: "Delete",
                   click: $.proxy(function()
                   {
                       this.deleteChecked("Are you sure you want to delete the selected buildpacks?",
                                          "Delete",
                                          "Deleting Buildpacks",
                                          Constants.URL__BUILDPACKS,
                                          "");
                   },
                   this)
               }
           ];
};

BuildpacksTab.prototype.clickHandler = function()
{
    this.itemClicked(-1, 2);
};

BuildpacksTab.prototype.showDetails = function(table, buildpack, row)
{
    this.addJSONDetailsLinkRow(table, "Name", Format.formatString(buildpack.name), buildpack, true);
    this.addPropertyRow(table, "GUID", Format.formatString(buildpack.guid));
    this.addPropertyRow(table, "Created", Format.formatDateString(buildpack.created_at));
    this.addRowIfValue(this.addPropertyRow, table, "Updated", Format.formatDateString, buildpack.updated_at);
    
    // Initially used priority, then renamed to position
    this.addRowIfValue(this.addPropertyRow, table, "Priority", Format.formatNumber, buildpack.priority);
    this.addRowIfValue(this.addPropertyRow, table, "Position", Format.formatNumber, buildpack.position);
    
    this.addRowIfValue(this.addPropertyRow, table, "Enabled", Format.formatBoolean, buildpack.enabled);
    this.addRowIfValue(this.addPropertyRow, table, "Locked", Format.formatBoolean, buildpack.locked);
    this.addRowIfValue(this.addPropertyRow, table, "Key", Format.formatString, buildpack.key);
    this.addRowIfValue(this.addPropertyRow, table, "Filename", Format.formatString, buildpack.filename);
};
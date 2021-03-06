function RoutesTab(id)
{
    Tab.call(this, id, Constants.FILENAME__ROUTES, Constants.URL__ROUTES_VIEW_MODEL);
}

RoutesTab.prototype = new Tab();

RoutesTab.prototype.constructor = RoutesTab;

RoutesTab.prototype.getInitialSort = function()
{
    return [[1, "asc"]];
};

RoutesTab.prototype.getColumns = function()
{
    return [
               {
                   "title":     Tab.prototype.formatCheckboxHeader(this.id),
                   "type":      "html",
                   "width":     "2px",
                   "orderable": false,
                   "render":    $.proxy(function(value, type, item)
                   {
                       var name = item[1];
                       if (item[4] != null)
                       {
                           if (name.length > 0)
                           {
                               name += ".";
                           }
                           
                           name += item[4];
                       }
                       
                       if (item[2] != null)
                       {
                           name += item[2];
                       }
                       
                       return this.formatCheckbox(name, value);
                   },
                   this),
               },
               {
                   "title":  "Host",
                   "width":  "200px",
                   "render": Format.formatRouteString
               },
               {
                   "title":  "Path",
                   "width":  "200px",
                   "render": Format.formatRouteString
               },
               {
                   "title":  "GUID",
                   "width":  "200px",
                   "render": Format.formatString
               },
               {
                   "title":  "Domain",
                   "width":  "200px",
                   "render": Format.formatDomainName
               },
               {
                   "title":  "Created",
                   "width":  "180px",
                   "render": Format.formatString
               },
               {
                   "title":  "Updated",
                   "width":  "180px",
                   "render": Format.formatString
               },
               {
                   "title":     "Events",
                   "width":     "70px",
                   "className": "cellRightAlign",
                   "render":    Format.formatNumber
               },
               {
                   "title":     "Applications",
                   "width":     "70px",
                   "className": "cellRightAlign",
                   "render":    Format.formatNumber
               },
               {
                   "title":  "Target",
                   "width":  "200px",
                   "render": Format.formatTarget
               }
           ];
};

RoutesTab.prototype.getActions = function()
{
    return [
               {
                   text: "Delete",
                   click: $.proxy(function()
                   {
                       this.deleteChecked("Are you sure you want to delete the selected routes?",
                                          "Delete",
                                          "Deleting Routes",
                                          Constants.URL__ROUTES,
                                          "");
                   }, 
                   this)
               },
               {
                   text: "Delete Recursive",
                   click: $.proxy(function()
                   {
                       this.deleteChecked("Are you sure you want to delete the selected routes and their associated route bindings?",
                                          "Delete Recursive",
                                          "Deleting Routes and Associated Route Bindings",
                                          Constants.URL__ROUTES,
                                          "?recursive=true");
                   },
                   this)
               }
           ];
};

RoutesTab.prototype.clickHandler = function()
{
    this.itemClicked(-1, 3);
};

RoutesTab.prototype.showDetails = function(table, objects, row)
{
    var domain       = objects.domain;
    var organization = objects.organization;
    var route        = objects.route;
    var space        = objects.space;

    var first = true;
    
    if (route.host != null && route.host !== "")
    {
        this.addPropertyRow(table, "Host", Format.formatString(route.host), first);
        first = false;
    }
    
    if (route.path != null && route.path !== "")
    {
        this.addPropertyRow(table, "Path", Format.formatString(route.path), first);
        first = false;
    }
    
    this.addJSONDetailsLinkRow(table, "GUID", Format.formatString(route.guid), objects, first);
    
    if (domain != null)
    {
        this.addFilterRow(table, "Domain", Format.formatStringCleansed(domain.name), domain.guid, AdminUI.showDomains);
    }

    this.addPropertyRow(table, "Created", Format.formatDateString(route.created_at));
    this.addRowIfValue(this.addPropertyRow, table, "Updated", Format.formatDateString, route.updated_at);

    if (row[7] != null)
    {
        this.addFilterRow(table, "Events", Format.formatNumber(row[7]), route.guid, AdminUI.showEvents);
    }
    
    if ((domain != null) && (row[8] != null))
    {
        var fqdn = Format.formatString(domain.name);
        if (route.host.length > 0)
        {
            fqdn = Format.formatString(route.host) + "." + fqdn;
        }    
        
        if (route.path != null)
        {
            fqdn += Format.formatString(route.path);
        }
        
        this.addFilterRow(table, "Applications", Format.formatNumber(row[8]), fqdn, AdminUI.showApplications);
    }

    if (space != null)
    {
        this.addFilterRow(table, "Space", Format.formatStringCleansed(space.name), space.guid, AdminUI.showSpaces);
    }

    if (organization != null)
    {
        this.addFilterRow(table, "Organization", Format.formatStringCleansed(organization.name), organization.guid, AdminUI.showOrganizations);
    }
};

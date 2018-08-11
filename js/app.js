'use strict';

/**
 * @namespace
 * @property {intiger} groupColumn Column to Group By
 * @property {object}  table       DataTables Object
 */
const dt = {
    table:null,
    groupColumn: 3,
    /**
     * Setup page when the Document is ready
     */
    windowLoad: () => {
        $('body').on( 'change', '#file_platform', () => {
            dt.table.draw();
        });

        if ($('#file_table').length) {
            dt.table = $('#file_table').DataTable({
                ajax: "data.txt",
                columns: [
                    {data: null, class: 'action-column', title: 'Action'},
                    {data: 'name', class: '', title: 'File Name'},
                    {data: 'region', class: '', title: 'Region'},
                    {data: 'platform', class: '', title: 'Platform', visible: false},
                    {data: 'tags', class: 'tags-column', title: 'Tags'},
                    {data: 'file_size', class: '', title: 'File Size'},
                    {data: 'download_count', class: '', title: 'Downloads'},
                    {data: 'created_dttm', class: 'date-column', title: 'Date', visible: false},
                    {data: 'created_user', class: 'user-column', title: 'User', visible: false}
                ],
                pageLength: 5,
                lengthMenu: [ 5, 10, 25, 50, 75, 100 ],
                dom: 'lfBrtip',
                stateSave: true,
                buttons: [
                    'colvis'
                ],
                fixedHeader: true,
                colReorder: true,
                responsive: true,
                rowGroup: {dataSrc: 'platform'},
                orderFixed: [[dt.groupColumn, 'asc']],
                rowCallback: dt.formatRow,
                drawCallback: dt.tableDone
            });
        }
        dt.search();
    },
    /**
     * DataTables Specific: Fires while calculating each row and formats the data [columns].
     * @param {element} row  The row currently being calculated.
     * @param {object}  data The data [columns] being passed in to that row.
     */
    formatRow: (row, data) => {
        let edit = $('<span>', {class:'fas fa-edit'});
        let select = $('<span>', {class:'far fa-square'});
        let download = $('<span>', {class:'fas fa-download'});
        $('.action-column', row).html([select, download, edit]);
        
        $('.tags-column', row).html("");
        $.each(data.tags, (key, value) => {
            let badge = $('<span>', {class: 'badge badge-pill badge-secondary', text: value})
            $('.tags-column', row).append(badge);
        });
        $('.tags-column', row).html();
        if (data.modified_dttm !== "") {
            $('.date-column', row).html(data.modified_dttm);
        }
        if (data.modified_user !== "") {
            $('.user-column', row).html(data.modified_user);
        }
    },
    /**
     * DataTables Specific: Fires AFTER the table is done being calculated.
     * @param {object} settings Specific settings.
     */
    tableDone: settings => {
    },
    /**
     * DataTables Specific: Adds 'Platform' as a search criteria.
     */
    search: () => {
        $.fn.dataTable.ext.search.push(
            (settings, data) => {
                let platform = $('#file_platform').val();
                let system = data[dt.groupColumn].toLowerCase() || 0;
        
                if (platform == system || platform == 0)
                {
                    return true;
                }
                return false;
            }
        );
    }
}

/**
 * @namespace
 */
const file_system = {
    windowLoad: () => {
    }
}

/**
 * @namespace
 */
const uploader = {
    /**
     * initialize a modal using bootstrap modals
     */
    init: () => {
        let modal = $('<div>', {class: 'modal fade bd-example-modal-lg', tabindex: "-1", role: 'dialog', 'aria-labelledby':'myLargeModalLabel', 'aria-hidden':'true'}).appendTo('body');
        let dialog = $('<div>', {class: 'modal-dialog modal-dialog-centered modal-lg'}).appendTo(modal);
        let content = $('<div>', {class: 'modal-content'}).appendTo(dialog);
        let header = $('<div>', {class: 'modal-header'}).appendTo(content);
        $('<h5>', {class: 'modal-title', id: '', text: 'Add a file'}).appendTo(header);
        let button = $('<button>', {type: 'button', class:'close', 'data-dismiss': 'modal', 'aria-label':'Close'}).appendTo(header);
        $('<span>', {'aria-hidden': 'true', text: `×`}).appendTo(button);

        let body = $('<div>', {class: 'modal-body'}).appendTo(content);

        let footer = $('<div>', {class: 'modal-footer'}).appendTo(content);
        $('<button>', {type: 'button', class:'btn btn-secondary', 'data-dismiss':'modal', text: 'Close'}).appendTo(footer);
        $('<button>', {type: 'button', class: 'btn btn-primary', text: 'Add'}).appendTo(footer);

        let form = $('<form>', {class: 'form-horizontal'}).appendTo(body);
        let fieldset = $('<fieldset>').appendTo(form);
        $('<legend>', {text: 'File Upload'}).appendTo(fieldset);
        let form_group = $('<div>', {class: 'form-group'}).appendTo(fieldset);
        $('<label>', {class: 'control-label', for: 'new_file_name', text: 'Name'}).appendTo(form_group);
        $('<input>', {class: 'form-control', id: 'new_file_name'}).appendTo(form_group);

        form_group = $('<div>', {class: 'form-group'}).appendTo(fieldset);
        $('<label>', {class: 'control-label', for: 'new_file_platform', text: 'Platform'}).appendTo(form_group);
        let select = $('<select>', {class: 'form-control', id: 'new_file_region'}).appendTo(form_group);
        let platforms = ["NES", "SNES", "GameBoy", "PlayStation", "Genesis/MegaDrive"];
        $.each(platforms, (key, value) => {
            $('<option>', {value: value, text: value}).appendTo(select);
        });

        form_group = $('<div>', {class: 'form-group'}).appendTo(fieldset);
        $('<label>', {for: 'new_file', class: 'control-label', text: 'File'}).appendTo(form_group);
        $('<input>', {type: 'file', class: 'form-control-file', id: 'new_file'}).appendTo(form_group);

        form_group = $('<div>', {class: 'form-group'}).appendTo(fieldset);
        $('<label>', {class: 'control-label', for: 'new_file_region', text: 'Region'}).appendTo(form_group);
        select = $('<select>', {class: 'form-control', id: 'new_file_region'}).appendTo(form_group);
        let regions = ["NTSC-U", "NTSC-J", "NTSC-C", "PAL-A", "PAL-B"];
        $.each(regions, (key, value) => {
            $('<option>', {value: value, text: value}).appendTo(select);
        });

        form_group = $('<div>', {class: 'form-group'}).appendTo(fieldset);
        $('<label>', {class: 'control-label', for: 'new_file_tags', text: 'Region'}).appendTo(form_group);
        select = $('<select>', {class: 'form-control', id: 'new_file_tags', multiple: true}).appendTo(form_group);
        let tags = ["popular", "rare", "danger-fav", "translated"];
        $.each(tags, (key, value) => {
            $('<option>', {value: value, text: value}).appendTo(select);
        });
    },
    /**
     * clear the model data
     */
    clear: () => {}
}

/**
 * @namespace
 */
const alert = {
    /**
     * create an alert using bootstrap alerts
     * @param {object} ui Object of data
     * Object.level ['primary', 'secondary', 'success', 'danger' 'warning', 'info', 'light', 'dark']
     * Object.heading [optional] "string of text"
     * Object.message "string of Text"
     */
    create: (ui) => {
        let alert = $('<div>', {class: `alert alert-${ui.level} alert-dismissible fade show`, role:'alert'}).prependTo('body');
        if (ui.heading) {
            $('<strong>', {text: `${ui.heading} `}).appendTo(alert);
        }
        alert.append(ui.message);
        let dismiss = $('<button>', {type: 'button', class: 'close', 'data-dismiss': 'alert', 'aria-label': 'close'}).appendTo(alert);
        $('<span>', {'aria-hidden': 'true', text: `×`}).appendTo(dismiss);
        $(alert).alert();
    }
}

$(document).ready(() => {
    file_system.windowLoad(); 
    dt.windowLoad();
    uploader.init();
});
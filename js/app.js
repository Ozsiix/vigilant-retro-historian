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
    create: () => {
    },
    add: () => {}
}

/**
 * @namespace
 */
const alert = {
    create: () => {
    },
    add: () => {},
    remove: () => {}
}

$(document).ready(() => {
    file_system.windowLoad(); 
    dt.windowLoad();
});
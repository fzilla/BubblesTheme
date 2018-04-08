

let options = [
    {
        "type": "head",
        "title": "Mouse"
    },
    {
        "type": "option",
        "name": "Left Click",
        "key": ["mouse_down", "1"],
        "click_position": true
    },
    {
        "type": "option",
        "name": "Middle Click",
        "key": ["mouse_down", "2"],
        "click_position": true
    },
    {
        "type": "option",
        "name": "Right Click",
        "key": ["mouse_down", "3"],
        "click_position": true
    },
    {
        "type": "option",
        "name": "Scroll",
        "key": ["wheel"]
    },
    {
        "type": "option",
        "name": "Drag",
        "key": ["drag"],
        "click_position": true
    },
    {
        "type": "head",
        "title": "Keys"
    },
    {
        "type": "option",
        "name": "Enter",
        "key": ["key_down", "13"]
    },
    {
        "type": "option",
        "name": "Tab",
        "key": ["key_down", "9"]
    },
    {
        "type": "option",
        "name": "Space",
        "key": ["key_down", "32"]
    },
    {
        "type": "option",
        "name": "BackSpace",
        "key": ["key_down", "8"]
    },
    {
        "type": "option",
        "name": "Page Up",
        "key": ["key_down", "33"]
    },
    {
        "type": "option",
        "name": "Page Down",
        "key": ["key_down", "34"]
    },
    {
        "type": "option",
        "name": "Left Arrow",
        "key": ["key_down", "37"]
    },
    {
        "type": "option",
        "name": "Right Arrow",
        "key": ["key_down", "39"]
    },
    {
        "type": "option",
        "name": "Up Arrow",
        "key": ["key_down", "38"]
    },
    {
        "type": "option",
        "name": "Down Arrow",
        "key": ["key_down", "40"]
    },
    {
        "type": "option",
        "name": "Others",
        "key": ["key_down", 'default']
    },
/*    {
        'type': 'Head',
        'name': 'Tab'
    },
    {
        "type": "option",
        "name": "Others",
        "key": ["tab", 'default']
    },*/
];

let tbody = $('.tbody');

$.each(options, function (i, v) {
    if (v.type === 'head') {
        tbody.append(`<tr class="head"><td colspan="5">${v.title}</td></tr>`)
    }
    else if (v.type === 'option') {
        tbody.append(getOptionTrDom(v));
    }
});


function getOptionTrDom(obj) {
    let key_str = obj.key.toString();
    let tr = $('<tr></tr>')
        .attr('data-key-str', key_str)
        .data('key', obj.key)
        .append(`<td class="opt_name">${obj.name}</td>`)
        .append(getActionSelectDom(obj))
        .append(getCountInputDom(obj))
        .append(getOptionDom(obj))
        .append(getPreviewButtonDom(obj));

    return tr;
}

function getActionSelectDom(obj) {
    let td = $('<td class="opt_action"></td>');
    let select = $('<select name="action" class="form-control"></select>');
    let options = {
        'none' : 'None',
        'at_position': 'At Position',
        'move': 'Move',
        'random': 'Random',
        'burst': 'Burst'
    };

    $.each(options, function (i, v) {
        select.append(`<option value="${i}">${v}</option>`)
    });
    return td.html(select);
}

function getCountInputDom(obj) {
    let td = $('<td class="opt_count"></td>');
    let input = $('<input type="number" name="count" class="form-control">');
    return td.html(input);
}

function getOptionDom(obj) {
    let td = $('<td class="opt_span"></td>');
    return td.append(getAtPositionOptionDom(obj)).append(getMoveOptionDom(obj));
}

function getAtPositionOptionDom(obj) {
    let position_opt = {
        'mouse_position' : 'Mouse Position',
        'center' : 'Center',
        'left': 'Left',
        'right': 'Right'
    };

    if (!obj.click_position) {
        delete position_opt['mouse_position'];
    }

    let div = $('<div class="form-inline" data-name="at_pos_opt"></div>');
    $.each(position_opt, function (i, v) {
        div.append(`<label style="display: inline"><input type="checkbox" style="display: inline" name="at_pos_opt" class="form-control" value="${i}"> ${v}</label>`)
    });

    return div;
}

function getMoveOptionDom(obj) {
    let div = $('<div style="display: none" class="form-inline" data-name="move_opt"></div>');
    let options = {
        '':'',
        'mouse_position': 'Mouse Position',
        'left': 'Left',
        'right': "Right",
        'center': "Center"
    };

    if (!obj.click_position) {
        delete options['mouse_position'];
    }

    let select = $('<select class="form-control"></select>');
    $.each(options, function (i, v) {
        select.append(`<option value="${i}">${v}</option>`)
    });

    let select_from_1 = select.clone();
    let select_from_2 = select.clone();
    let select_to_1 = select.clone();
    let select_to_2 = select.clone();

    select_from_1.attr('name', 'from_1');
    select_from_2.attr('name', 'from_2');
    select_to_1.attr('name', 'to_1');
    select_to_2.attr('name', 'to_2');

    return div.append(select_from_1)
        .append('<span class="opt_span_to">to</span>')
        .append(select_to_1)
        .append('<span class="opt_span_and">And</span>')
        .append(select_from_2)
        .append('<span class="opt_span_to">to</span>')
        .append(select_to_2)
}

function getPreviewButtonDom() {
    return $('<td class="opt_preview"><button type="button" class="btn btn-default preview">Preview</td>')
}


$('[name="action"]').on('change', function (e) {
    let val = $(this).val();
    $(this).closest('tr').find('[data-name]').hide();
    if (val === 'at_position') {
        $(this).closest('tr').find('[data-name="at_pos_opt"]').show();
    }
    else if (val === 'move') {
        $(this).closest('tr').find('[data-name="move_opt"]').show();
    }
}).trigger('change');


$('[name="count"]').on('change', function (e) {
    let val = Number($(this).val());
    if (isNaN(val) || val <= 0 || val >= 50) {
        alert('Count must be between 1 and 50');
        $(this).val(5);
    }
}).val(10);

$('.preview').on('click', function (e) {
    let row = $(this).closest('tr');
    let obj = {
        'action': row.find('[name="action"]').val(),
        'count': Number(row.find('[name="count"]').val()),
    };

    if (obj.action === 'at_position') {
        obj.span = row.find('[name="at_pos_opt"]:checked').map(function(){
            return $(this).val();
        }).get();

        if (!obj.span[0]) {
            return;
        }
    }
    else if (obj.action === 'move') {
        let from_1 = row.find('[name="from_1"]').val();
        let to_1 = row.find('[name="to_1"]').val();
        let from_2 = row.find('[name="from_2"]').val();
        let to_2 = row.find('[name="to_2"]').val();


        obj.span = [];
        if (from_1 !== to_1 && from_1 && to_1) {
            obj.span.push({from: from_1, to: to_1})
        }


        if (from_2 !== to_2 && (to_1 !== to_2 && from_1 !== to_2) && from_2 && to_2) {
            obj.span.push({from: from_2, to: to_2})
        }

        if (!obj.span[0]) {
            return;
        }
    }

    if (!obj.count || !obj.action) {
        return;
    }

    browser.runtime.sendMessage({event: "preview", data: obj, x: e.pageX});
});

$('.reset').on('click', function (e) {
    e.preventDefault();
    let r = confirm('Reset to Defaults?');
    if (!r) return;

    browser.runtime.sendMessage({event: "reset_options"}).then(function (data) {
        events = data;
        _loadOptions();
    });
});


$('.save_btn').on('click', function (e) {
    let opt = $('[data-key-str]');

    $.each(opt, function (i, v) {
        let row = $(v);

        let obj = {
            'action': row.find('[name="action"]').val(),
            'count': Number(row.find('[name="count"]').val()),
        };

        let key = $(this).data('key');

        if (obj.action === 'at_position') {
            obj.span = row.find('[name="at_pos_opt"]:checked').map(function(){
                return $(this).val();
            }).get();

            if (!obj.span[0]) {
                return;
            }
        }
        else if (obj.action === 'move') {
            let from_1 = row.find('[name="from_1"]').val();
            let to_1 = row.find('[name="to_1"]').val();
            let from_2 = row.find('[name="from_2"]').val();
            let to_2 = row.find('[name="to_2"]').val();


            obj.span = [];
            if (from_1 !== to_1 && from_1 && to_1) {
                obj.span.push({from: from_1, to: to_1})
            }


            if (from_2 !== to_2 && (to_1 !== to_2 && from_1 !== to_2) && from_2 && to_2) {
                obj.span.push({from: from_2, to: to_2})
            }

            if (!obj.span[0]) {
                return;
            }
        }

        if (!obj.action || !obj.count) {
            return;
        }

        if (key[1]) {
            events[key[0]][key[1]] = obj;
        }
        else {
            events[key[0]] = obj;
        }
    });

    browser.storage.local.set({settings: events}).then(function () {
        browser.runtime.sendMessage({event: "reload"});
        loadOptions();
        alert('Settings Saved Successfully');

    }, function () {
        alert('Unexpected Error');
    });
});

let events;


function loadOptions() {
    browser.storage.local.get('settings').then(function (value) {
        events = value['settings'];
        _loadOptions();
    });
}

function _loadOptions() {
    $.each(events, function (index, value) {
        if (index === 'mouse_down' || index === 'key_down') {
            $.each(value, function (i, v) {
                setOption([index, i].toString(), v);
            })
        }
        else {
            setOption([index].toString(), value);
        }
    });
}

loadOptions();

function setOption(key, opt) {
    let tr = $(`tr[data-key-str="${key}"]`);
    tr.find('[name="action"]').val(opt.action).trigger('change');
    tr.find('[name="count"]').val(opt.count).trigger('change');

    if (opt.action === 'at_position') {
        $.each(opt.span, function (i, v) {
            tr.find(`[name="at_pos_opt"][value="${v}"]`).prop('checked', true);
        })
    }
    else if (opt.action === 'move') {
        $.each(opt.span, function (i, v) {
            tr.find(`[name="from_${i + 1}"]`).val(v.from);
            tr.find(`[name="to_${i + 1}"]`).val(v.to);
        })
    }
}

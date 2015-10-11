'use strict';

var phoneBook = [];
var space = ' ';
var dashes = '─';

module.exports.add = function add(name, phone, email) {
    addContacts(name, phone, email);
};

function addContacts(name, phone, email) {
    if (isCheckName(name) && isCheckPhone(phone) && isCheckEmail(email)) {
        phoneBook.push(new Person(name, phone, email));
        console.log('Добавлен контакт: ' + name + ' ' + phone + ' ' + email);
    } else {
        console.log('Не возможно добавить данные, не соотвествующие шаблону: ' + name + ' ' +
                  phone + ' ' + email);
    }
}

function Person(name, phone, email) {
    this.name = name;
    this.phone = phone;
    this.email = email;
}

function isCheckName(name) {
    return (name.trim().length > 0);
}

function isCheckPhone(phone) {
    return (/^((\d+|\+(\d+))[\- ]?)?(\(?\d{3}|\(\d{3}\)\)?[\- ]?)+?[\d\- ]{7,10}$/).test(phone);
}

function isCheckEmail(email) {
    return (/^([a-z0-9_\-]+\.)*[a-z0-9_\-]+@([a-z0-9][a-z0-9\-]*[a-z0-9]\.)+[a-z]{2,6}$/i)
            .test(email);
}

module.exports.find = function find(query) {
    var findContactList = findContacts(query);
    if (findContactList.length > 0) {
        show(findContactList);
    } else {
        show();
    }
};

function findContacts(query) {
    var findContactList = [];
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].name.indexOf(query) + 1) {
            findContactList.push(phoneBook[i]);
        } else {
            if (phoneBook[i].phone.indexOf(query) + 1) {
                findContactList.push(phoneBook[i]);
            } else {
                if (phoneBook[i].email.indexOf(query) + 1) {
                    findContactList.push(phoneBook[i]);
                }
            }
        }
    }
    return findContactList;
}

module.exports.remove = function remove(query) {
    var findContactList = findContacts(query);
    if (findContactList.length > 0) {
        for (var i = 0; i < findContactList.length; i++) {
            delete phoneBook[phoneBook.indexOf(findContactList[i])];
        }
    }
    console.log('Удален ' + findContactList.length + ' контакт');
};

module.exports.importFromCsv = function importFromCsv(filename) {
    var data = require('fs').readFileSync(filename, 'utf-8');
    var dataToAdd = data.split('\n');
    for (var i = 0; i < dataToAdd.length; i++) {
        var tmp = dataToAdd[i].split(';');
        if (tmp.length === 3) {
            addContacts(tmp[0], tmp[1], tmp[2]);
        }
    }
};

module.exports.showTable = function showTable() {
    show();
};

function show(output) {
    var phoneBookList = output || phoneBook;
    var padding = {
        name: 4,
        phone: 8,
        email: 6
    };
    phoneBookList.forEach(function (item, i, arr) {
        if (item.name.length > padding.name) {
            padding.name = item.name.length;
        }
        if (item.phone.length > padding.phone) {
            padding.phone = item.phone.length;
        }
        if (item.email.length > padding.email) {
            padding.email = item.email.length;
        }
    });
    padding.name -= 3;
    padding.phone -= 7;
    padding.email -= 5;
    console.log('┌────' + createString(padding.name, dashes) + '┬────────' +
              createString(padding.phone, dashes) + '╥──────' +
              createString(padding.email, dashes) + '┐');
    console.log('│ Имя' + createString(padding.name, space) + '│ Телефон' +
              createString(padding.phone, space) + '║ email' + createString(padding.email, space) +
              '│');
    console.log('├────' + createString(padding.name, dashes) + '┼────────' +
              createString(padding.phone, dashes) + '╫──────' +
              createString(padding.email, dashes) + '┤');
    phoneBookList.forEach(function (item, i, arr) {
        console.log('│ ' + item.name + createString(padding.name - item.name.length + 3, space) +
                  '│ ' + item.phone + createString(padding.phone - item.phone.length + 7, space) +
                  '║ ' + item.email + createString(padding.email - item.email.length + 5, space) +
                  '│');
    });
    console.log('└────' + createString(padding.name, dashes) + '┴────────' +
              createString(padding.phone, dashes) + '╨──────' +
              createString(padding.email, dashes) + '┘');
}

function createString(len, sym) {
    var res = '';
    for (var i = 0; i < len; i++) {
        res += sym;
    }
    return res;
}

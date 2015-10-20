'use strict';

var fs = require('fs');
var phoneBook = [];
var space = ' ';
var dashes = '─';
var captionTable = {
    name: 'Имя',
    phone: 'Телефон',
    email: 'email'
};
var padding = {
    name: captionTable.name.length,
    phone: captionTable.phone.length,
    email: captionTable.email.length
};

module.exports.add = function add(name, phone, email) {
    addContacts(name, phone, email);
};

function addContacts(name, phone, email) {
    if (isCorrectName(name) && isCorrectPhone(phone) && isCorrectEmail(email)) {
        phoneBook.push(new Person(name, phone, email));
        countPaddingToOutput(name, phone, email);
        console.log('Добавлен контакт: ' + name + ' ' + phone + ' ' + email);
    } else {
        console.log('Не возможно добавить данные, не соотвествующие шаблону: ' + name + ' ' +
            phone + ' ' + email);
    }
}

function isCorrectName(name) {
    return (name.trim().length > 0);
}

function isCorrectPhone(phone) {
    return (/^((\d+|\+(\d+))[\- ]?)?((\d{3})|\(\d{3}\)[\- ]?)+?[\d\- ]{7,10}$/).test(phone);
}

function isCorrectEmail(email) {
    return (/^([a-zа-я0-9_\-]+\.)*[a-zа-я0-9_\-]+@([a-zа-я0-9][a-zа-я0-9\-]*[a-zа-я0-9]\.)+[a-zа-я]{2,6}$/i)
        .test(email);
}

function Person(name, phone, email) {
    this.name = name;
    this.phone = phone;
    this.email = email;
}

function countPaddingToOutput(name, phone, email) {
    if (name.length > padding.name) {
        padding.name = name.length;
    }
    if (phone.length > padding.phone) {
        padding.phone = phone.length;
    }
    if (email.length > padding.email) {
        padding.email = email.length;
    }
}

module.exports.find = function find(query) {
    var findContactList = findContacts(query);
    if (query) {
        if (findContactList.length > 0) {
            findContactList.forEach(function (item, i, arr) {
                console.log(phoneBook[item].name + ', ' + phoneBook[item].phone + ', ' +
                    phoneBook[item].email);
            });
            console.log('Найдено ' + findContactList.length + ' записи');
        } else {
            console.log('Поданному запросу ничего не найдено');
        }
    } else {
        phoneBook.forEach(function (item, i, arr) {
            console.log(item.name + ', ' + item.phone + ', ' + item.email);
        });
    }
};

function findContacts(query) {
    if (!query) {
        return [];
    }
    var findContactList = [];
    var queryToLowerCase = query.toLowerCase();
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].name.toLowerCase().indexOf(queryToLowerCase) > -1 ||
            phoneBook[i].phone.toLowerCase().indexOf(queryToLowerCase) > -1 ||
            phoneBook[i].email.toLowerCase().indexOf(queryToLowerCase) > -1) {
            findContactList.push(i);
        }
    }
    return findContactList;
}

module.exports.remove = function remove(query) {
    query = query || '';
    var findContactList = findContacts(query);
    if (findContactList.length > 0) {
        findContactList.reverse();
        for (var i = 0; i < findContactList.length; i++) {
            phoneBook.splice(findContactList[i], 1);
        }
    }
    console.log('Удален ' + findContactList.length + ' контакт');
};

module.exports.importFromCsv = function importFromCsv(filename) {
    var data = fs.readFileSync(filename, 'utf-8');
    var dataToAdd = data.split('\n');
    for (var i = 0; i < dataToAdd.length; i++) {
        var tmp = dataToAdd[i].split(';');
        if (tmp.length === 3) {
            addContacts(tmp[0], tmp[1], tmp[2]);
        }
    }
};

module.exports.showTable = function showTable() {
    var borderPadding = {
        name: padding.name - captionTable.name.length,
        phone: padding.phone - captionTable.phone.length,
        email: padding.email - captionTable.email.length
    };
    var result = '┌────' + repeatString(borderPadding.name, dashes) + '┬────────' +
        repeatString(borderPadding.phone, dashes) + '╥──────' +
        repeatString(borderPadding.email, dashes) + '┐' + '\n' + '│ ' + captionTable.name +
        repeatString(borderPadding.name, space) + '│ ' + captionTable.phone +
        repeatString(borderPadding.phone, space) + '║ ' + captionTable.email +
        repeatString(borderPadding.email, space) + '│' + '\n' + '├────' +
        repeatString(borderPadding.name, dashes) + '┼────────' +
        repeatString(borderPadding.phone, dashes) + '╫──────' +
        repeatString(borderPadding.email, dashes) + '┤' + '\n';
    phoneBook.forEach(function (item, i, arr) {
        result += '│ ' + item.name + repeatString(padding.name - item.name.length, space) + '│ ' +
        item.phone + repeatString(padding.phone - item.phone.length, space) + '║ ' + item.email +
        repeatString(padding.email - item.email.length, space) + '│' + '\n';
    });
    result += '└────' + repeatString(borderPadding.name, dashes) + '┴────────' +
        repeatString(borderPadding.phone, dashes) + '╨──────' +
        repeatString(borderPadding.email, dashes) + '┘' + '\n';
    console.log(result);
};

function repeatString(len, sym) {
    var res = '';
    for (var i = 0; i < len; i++) {
        res += sym;
    }
    return res;
}

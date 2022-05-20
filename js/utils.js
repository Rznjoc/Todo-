var utils = {};

utils.constants = {
    notAllowedChars: {
        '<': true,
        '>': true,
        '$': true,
        '/': true,
    }
}

utils.sanitize = function (strInput) {
    var i = strInput.length;
    var a =[];
    try {
        while (i--) {
            var iC = strInput[i];
            if (utils.constants.notAllowedChars[iC.trim()]) {
                a[i] = '&#' + iC.charCodeAt() + ';';
            } else {
                a[i] = strInput[i];
            }
        }
        return a.join('');
    } catch {
        return strInput;
    }
}
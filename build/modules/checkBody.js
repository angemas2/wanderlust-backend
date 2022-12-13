"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function checkBody(body, keys) {
    let isValid = true;
    for (const field of keys) {
        if (!body[field] || body[field] === '') {
            isValid = false;
        }
    }
    return isValid;
}
exports.default = checkBody;

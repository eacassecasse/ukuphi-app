"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate6DigitsNumber = generate6DigitsNumber;
function generate6DigitsNumber() {
    return Math.floor(100000 + Math.random() * 900000);
}

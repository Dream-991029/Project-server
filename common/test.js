// String.prototype.trim = function (char, type) {
//   if (char) {
//     if (type == 'left') {
//       return this.replace(new RegExp('^\\'+char+'+', 'g'), '');
//     } else if (type == 'right') {
//       return this.replace(new RegExp('\\'+char+'+$', 'g'), '');
//     }
//     return this.replace(new RegExp('^\\'+char+'+|\\'+char+'+$', 'g'), '');
//   }
//   return this.replace(/^\s+|\s+$/g, '');
// };
// const questionReg = /^答案/
// console.log(questionReg.test('答:213123'));
var a = '答案:   11111    '.match(/答案(.*)/)
// console.log(a[1].trim(':').trim());
console.log('///156156156'.trim('1', ''));
var b = 'A.保护人员		B.被救者		C.辅助人员		D.施救者'
console.log(b.split(/\s+/))
// console.log('acsdskmadsffds'.indexOf('a'));
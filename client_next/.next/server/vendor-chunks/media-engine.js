/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/media-engine";
exports.ids = ["vendor-chunks/media-engine"];
exports.modules = {

/***/ "(ssr)/./node_modules/media-engine/src/index.js":
/*!************************************************!*\
  !*** ./node_modules/media-engine/src/index.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var Parser = __webpack_require__(/*! ./parser */ \"(ssr)/./node_modules/media-engine/src/parser.js\");\n\nmodule.exports = function(queries, options) {\n  var result = {};\n\n  Object.keys(queries).forEach(function(query) {\n    if (Parser.parse(query).match(options)) {\n      Object.assign(result, queries[query]);\n    }\n  });\n\n  return result;\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbWVkaWEtZW5naW5lL3NyYy9pbmRleC5qcyIsIm1hcHBpbmdzIjoiQUFBQSxhQUFhLG1CQUFPLENBQUMsaUVBQVU7O0FBRS9CO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYW5jZXJfYXBwLy4vbm9kZV9tb2R1bGVzL21lZGlhLWVuZ2luZS9zcmMvaW5kZXguanM/NjZkMSJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgUGFyc2VyID0gcmVxdWlyZSgnLi9wYXJzZXInKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihxdWVyaWVzLCBvcHRpb25zKSB7XG4gIHZhciByZXN1bHQgPSB7fTtcblxuICBPYmplY3Qua2V5cyhxdWVyaWVzKS5mb3JFYWNoKGZ1bmN0aW9uKHF1ZXJ5KSB7XG4gICAgaWYgKFBhcnNlci5wYXJzZShxdWVyeSkubWF0Y2gob3B0aW9ucykpIHtcbiAgICAgIE9iamVjdC5hc3NpZ24ocmVzdWx0LCBxdWVyaWVzW3F1ZXJ5XSk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gcmVzdWx0O1xufTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/media-engine/src/index.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/media-engine/src/operators.js":
/*!****************************************************!*\
  !*** ./node_modules/media-engine/src/operators.js ***!
  \****************************************************/
/***/ ((module) => {

eval("function And(left, right) {\n  this.left = left;\n  this.right = right;\n\n  this.match = function(options) {\n    return left.match(options) && right.match(options);\n  };\n}\n\nfunction Or(left, right) {\n  this.left = left;\n  this.right = right;\n\n  this.match = function(options) {\n    return left.match(options) || right.match(options);\n  };\n}\n\nmodule.exports = function Operator(type, left, right) {\n  switch (type) {\n    case 'and':\n      return new And(left, right);\n    case ',':\n      return new Or(left, right);\n    default:\n      throw new Error(value);\n  }\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbWVkaWEtZW5naW5lL3NyYy9vcGVyYXRvcnMuanMiLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2NhbmNlcl9hcHAvLi9ub2RlX21vZHVsZXMvbWVkaWEtZW5naW5lL3NyYy9vcGVyYXRvcnMuanM/OGM1NSJdLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBBbmQobGVmdCwgcmlnaHQpIHtcbiAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgdGhpcy5yaWdodCA9IHJpZ2h0O1xuXG4gIHRoaXMubWF0Y2ggPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgcmV0dXJuIGxlZnQubWF0Y2gob3B0aW9ucykgJiYgcmlnaHQubWF0Y2gob3B0aW9ucyk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIE9yKGxlZnQsIHJpZ2h0KSB7XG4gIHRoaXMubGVmdCA9IGxlZnQ7XG4gIHRoaXMucmlnaHQgPSByaWdodDtcblxuICB0aGlzLm1hdGNoID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHJldHVybiBsZWZ0Lm1hdGNoKG9wdGlvbnMpIHx8IHJpZ2h0Lm1hdGNoKG9wdGlvbnMpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIE9wZXJhdG9yKHR5cGUsIGxlZnQsIHJpZ2h0KSB7XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgJ2FuZCc6XG4gICAgICByZXR1cm4gbmV3IEFuZChsZWZ0LCByaWdodCk7XG4gICAgY2FzZSAnLCc6XG4gICAgICByZXR1cm4gbmV3IE9yKGxlZnQsIHJpZ2h0KTtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKHZhbHVlKTtcbiAgfVxufTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/media-engine/src/operators.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/media-engine/src/parser.js":
/*!*************************************************!*\
  !*** ./node_modules/media-engine/src/parser.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var Query = __webpack_require__(/*! ./queries */ \"(ssr)/./node_modules/media-engine/src/queries.js\");\nvar Operator = __webpack_require__(/*! ./operators */ \"(ssr)/./node_modules/media-engine/src/operators.js\");\n\nvar NUMBERS = /[0-9]/;\nvar LETTERS = /[a-z|\\-]/i;\nvar WHITESPACE = /\\s/;\nvar COLON = /:/;\nvar COMMA = /,/;\nvar AND = /and$/;\nvar AT = /@/;\n\nfunction tokenizer(input) {\n  var current = 0;\n  var tokens = [];\n\n  while (current < input.length) {\n    var char = input[current];\n\n    if (AT.test(char)) {\n      char = input[++current];\n      while (LETTERS.test(char) && char !== undefined) {\n        char = input[++current];\n      }\n    }\n\n    if (WHITESPACE.test(char) || char === ')' || char === '(') {\n      current++;\n      continue;\n    }\n\n    if (COLON.test(char) || COMMA.test(char)) {\n      current++;\n      tokens.push({ type: 'operator', value: char });\n      continue;\n    }\n\n    if (NUMBERS.test(char)) {\n      var value = '';\n      while (NUMBERS.test(char)) {\n        value += char;\n        char = input[++current];\n      }\n\n      tokens.push({ type: 'number', value: value });\n      continue;\n    }\n\n    if (LETTERS.test(char)) {\n      var value = '';\n      while (LETTERS.test(char) && char !== undefined) {\n        value += char;\n        char = input[++current];\n      }\n      if (AND.test(value)) {\n        tokens.push({ type: 'operator', value: value });\n      } else {\n        tokens.push({ type: 'literal', value: value });\n      }\n\n      continue;\n    }\n\n    throw new TypeError(\n      'Tokenizer: I dont know what this character is: ' + char\n    );\n  }\n\n  return tokens;\n}\n\nfunction parser(tokens) {\n  var output = [];\n  var stack = [];\n\n  while (tokens.length > 0) {\n    var token = tokens.shift();\n\n    if (token.type === 'number' || token.type === 'literal') {\n      output.push(token);\n      continue;\n    }\n\n    if (token.type === 'operator') {\n      if (COLON.test(token.value)) {\n        token = { type: 'query', key: output.pop(), value: tokens.shift() };\n        output.push(token);\n        continue;\n      }\n\n      while (stack.length > 0) {\n        output.unshift(stack.pop());\n      }\n      stack.push(token);\n    }\n  }\n\n  while (stack.length > 0) {\n    output.unshift(stack.pop());\n  }\n\n  function walk() {\n    var head = output.shift();\n\n    if (head.type === 'number') {\n      return parseInt(head.value);\n    }\n\n    if (head.type === 'literal') {\n      return head.value;\n    }\n\n    if (head.type === 'operator') {\n      var l = walk();\n      var r = walk();\n\n      return Operator(head.value, l, r);\n    }\n\n    if (head.type === 'query') {\n      var l = head.key.value;\n      var r = head.value.value;\n\n      return Query(l, r);\n    }\n  }\n\n  return walk();\n}\n\nmodule.exports = {\n  parse: function(query) {\n    var tokens = tokenizer(query);\n    var ast = parser(tokens);\n    return ast;\n  }\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbWVkaWEtZW5naW5lL3NyYy9wYXJzZXIuanMiLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxtQkFBTyxDQUFDLG1FQUFXO0FBQy9CLGVBQWUsbUJBQU8sQ0FBQyx1RUFBYTs7QUFFcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQkFBb0IsK0JBQStCO0FBQ25EO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG9CQUFvQiw4QkFBOEI7QUFDbEQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixnQ0FBZ0M7QUFDdEQsUUFBUTtBQUNSLHNCQUFzQiwrQkFBK0I7QUFDckQ7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2NhbmNlcl9hcHAvLi9ub2RlX21vZHVsZXMvbWVkaWEtZW5naW5lL3NyYy9wYXJzZXIuanM/NzQ4ZSJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgUXVlcnkgPSByZXF1aXJlKCcuL3F1ZXJpZXMnKTtcbnZhciBPcGVyYXRvciA9IHJlcXVpcmUoJy4vb3BlcmF0b3JzJyk7XG5cbnZhciBOVU1CRVJTID0gL1swLTldLztcbnZhciBMRVRURVJTID0gL1thLXp8XFwtXS9pO1xudmFyIFdISVRFU1BBQ0UgPSAvXFxzLztcbnZhciBDT0xPTiA9IC86LztcbnZhciBDT01NQSA9IC8sLztcbnZhciBBTkQgPSAvYW5kJC87XG52YXIgQVQgPSAvQC87XG5cbmZ1bmN0aW9uIHRva2VuaXplcihpbnB1dCkge1xuICB2YXIgY3VycmVudCA9IDA7XG4gIHZhciB0b2tlbnMgPSBbXTtcblxuICB3aGlsZSAoY3VycmVudCA8IGlucHV0Lmxlbmd0aCkge1xuICAgIHZhciBjaGFyID0gaW5wdXRbY3VycmVudF07XG5cbiAgICBpZiAoQVQudGVzdChjaGFyKSkge1xuICAgICAgY2hhciA9IGlucHV0WysrY3VycmVudF07XG4gICAgICB3aGlsZSAoTEVUVEVSUy50ZXN0KGNoYXIpICYmIGNoYXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjaGFyID0gaW5wdXRbKytjdXJyZW50XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoV0hJVEVTUEFDRS50ZXN0KGNoYXIpIHx8IGNoYXIgPT09ICcpJyB8fCBjaGFyID09PSAnKCcpIHtcbiAgICAgIGN1cnJlbnQrKztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChDT0xPTi50ZXN0KGNoYXIpIHx8IENPTU1BLnRlc3QoY2hhcikpIHtcbiAgICAgIGN1cnJlbnQrKztcbiAgICAgIHRva2Vucy5wdXNoKHsgdHlwZTogJ29wZXJhdG9yJywgdmFsdWU6IGNoYXIgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAoTlVNQkVSUy50ZXN0KGNoYXIpKSB7XG4gICAgICB2YXIgdmFsdWUgPSAnJztcbiAgICAgIHdoaWxlIChOVU1CRVJTLnRlc3QoY2hhcikpIHtcbiAgICAgICAgdmFsdWUgKz0gY2hhcjtcbiAgICAgICAgY2hhciA9IGlucHV0WysrY3VycmVudF07XG4gICAgICB9XG5cbiAgICAgIHRva2Vucy5wdXNoKHsgdHlwZTogJ251bWJlcicsIHZhbHVlOiB2YWx1ZSB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChMRVRURVJTLnRlc3QoY2hhcikpIHtcbiAgICAgIHZhciB2YWx1ZSA9ICcnO1xuICAgICAgd2hpbGUgKExFVFRFUlMudGVzdChjaGFyKSAmJiBjaGFyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdmFsdWUgKz0gY2hhcjtcbiAgICAgICAgY2hhciA9IGlucHV0WysrY3VycmVudF07XG4gICAgICB9XG4gICAgICBpZiAoQU5ELnRlc3QodmFsdWUpKSB7XG4gICAgICAgIHRva2Vucy5wdXNoKHsgdHlwZTogJ29wZXJhdG9yJywgdmFsdWU6IHZhbHVlIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdG9rZW5zLnB1c2goeyB0eXBlOiAnbGl0ZXJhbCcsIHZhbHVlOiB2YWx1ZSB9KTtcbiAgICAgIH1cblxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICdUb2tlbml6ZXI6IEkgZG9udCBrbm93IHdoYXQgdGhpcyBjaGFyYWN0ZXIgaXM6ICcgKyBjaGFyXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiB0b2tlbnM7XG59XG5cbmZ1bmN0aW9uIHBhcnNlcih0b2tlbnMpIHtcbiAgdmFyIG91dHB1dCA9IFtdO1xuICB2YXIgc3RhY2sgPSBbXTtcblxuICB3aGlsZSAodG9rZW5zLmxlbmd0aCA+IDApIHtcbiAgICB2YXIgdG9rZW4gPSB0b2tlbnMuc2hpZnQoKTtcblxuICAgIGlmICh0b2tlbi50eXBlID09PSAnbnVtYmVyJyB8fCB0b2tlbi50eXBlID09PSAnbGl0ZXJhbCcpIHtcbiAgICAgIG91dHB1dC5wdXNoKHRva2VuKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmICh0b2tlbi50eXBlID09PSAnb3BlcmF0b3InKSB7XG4gICAgICBpZiAoQ09MT04udGVzdCh0b2tlbi52YWx1ZSkpIHtcbiAgICAgICAgdG9rZW4gPSB7IHR5cGU6ICdxdWVyeScsIGtleTogb3V0cHV0LnBvcCgpLCB2YWx1ZTogdG9rZW5zLnNoaWZ0KCkgfTtcbiAgICAgICAgb3V0cHV0LnB1c2godG9rZW4pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgd2hpbGUgKHN0YWNrLmxlbmd0aCA+IDApIHtcbiAgICAgICAgb3V0cHV0LnVuc2hpZnQoc3RhY2sucG9wKCkpO1xuICAgICAgfVxuICAgICAgc3RhY2sucHVzaCh0b2tlbik7XG4gICAgfVxuICB9XG5cbiAgd2hpbGUgKHN0YWNrLmxlbmd0aCA+IDApIHtcbiAgICBvdXRwdXQudW5zaGlmdChzdGFjay5wb3AoKSk7XG4gIH1cblxuICBmdW5jdGlvbiB3YWxrKCkge1xuICAgIHZhciBoZWFkID0gb3V0cHV0LnNoaWZ0KCk7XG5cbiAgICBpZiAoaGVhZC50eXBlID09PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuIHBhcnNlSW50KGhlYWQudmFsdWUpO1xuICAgIH1cblxuICAgIGlmIChoZWFkLnR5cGUgPT09ICdsaXRlcmFsJykge1xuICAgICAgcmV0dXJuIGhlYWQudmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKGhlYWQudHlwZSA9PT0gJ29wZXJhdG9yJykge1xuICAgICAgdmFyIGwgPSB3YWxrKCk7XG4gICAgICB2YXIgciA9IHdhbGsoKTtcblxuICAgICAgcmV0dXJuIE9wZXJhdG9yKGhlYWQudmFsdWUsIGwsIHIpO1xuICAgIH1cblxuICAgIGlmIChoZWFkLnR5cGUgPT09ICdxdWVyeScpIHtcbiAgICAgIHZhciBsID0gaGVhZC5rZXkudmFsdWU7XG4gICAgICB2YXIgciA9IGhlYWQudmFsdWUudmFsdWU7XG5cbiAgICAgIHJldHVybiBRdWVyeShsLCByKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gd2FsaygpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgcGFyc2U6IGZ1bmN0aW9uKHF1ZXJ5KSB7XG4gICAgdmFyIHRva2VucyA9IHRva2VuaXplcihxdWVyeSk7XG4gICAgdmFyIGFzdCA9IHBhcnNlcih0b2tlbnMpO1xuICAgIHJldHVybiBhc3Q7XG4gIH1cbn07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/media-engine/src/parser.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/media-engine/src/queries.js":
/*!**************************************************!*\
  !*** ./node_modules/media-engine/src/queries.js ***!
  \**************************************************/
/***/ ((module) => {

eval("function MaxHeight(value) {\n  this.value = value;\n\n  this.match = function(options) {\n    return this.value >= options.height;\n  };\n}\n\nfunction MinHeight(value) {\n  this.value = value;\n\n  this.match = function(options) {\n    return this.value < options.height;\n  };\n}\n\nfunction MaxWidth(value) {\n  this.value = value;\n\n  this.match = function(options) {\n    return this.value >= options.width;\n  };\n}\n\nfunction MinWidth(value) {\n  this.value = value;\n\n  this.match = function(options) {\n    return this.value < options.width;\n  };\n}\n\nfunction Orientation(value) {\n  this.value = value;\n\n  this.match = function(options) {\n    return this.value === options.orientation;\n  };\n}\n\nmodule.exports = function Query(type, value) {\n  switch (type) {\n    case 'max-height':\n      return new MaxHeight(value);\n    case 'min-height':\n      return new MinHeight(value);\n    case 'max-width':\n      return new MaxWidth(value);\n    case 'min-width':\n      return new MinWidth(value);\n    case 'orientation':\n      return new Orientation(value);\n    default:\n      throw new Error(value);\n  }\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbWVkaWEtZW5naW5lL3NyYy9xdWVyaWVzLmpzIiwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2NhbmNlcl9hcHAvLi9ub2RlX21vZHVsZXMvbWVkaWEtZW5naW5lL3NyYy9xdWVyaWVzLmpzPzhkNGQiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gTWF4SGVpZ2h0KHZhbHVlKSB7XG4gIHRoaXMudmFsdWUgPSB2YWx1ZTtcblxuICB0aGlzLm1hdGNoID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLnZhbHVlID49IG9wdGlvbnMuaGVpZ2h0O1xuICB9O1xufVxuXG5mdW5jdGlvbiBNaW5IZWlnaHQodmFsdWUpIHtcbiAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuXG4gIHRoaXMubWF0Y2ggPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWUgPCBvcHRpb25zLmhlaWdodDtcbiAgfTtcbn1cblxuZnVuY3Rpb24gTWF4V2lkdGgodmFsdWUpIHtcbiAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuXG4gIHRoaXMubWF0Y2ggPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWUgPj0gb3B0aW9ucy53aWR0aDtcbiAgfTtcbn1cblxuZnVuY3Rpb24gTWluV2lkdGgodmFsdWUpIHtcbiAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuXG4gIHRoaXMubWF0Y2ggPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWUgPCBvcHRpb25zLndpZHRoO1xuICB9O1xufVxuXG5mdW5jdGlvbiBPcmllbnRhdGlvbih2YWx1ZSkge1xuICB0aGlzLnZhbHVlID0gdmFsdWU7XG5cbiAgdGhpcy5tYXRjaCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZSA9PT0gb3B0aW9ucy5vcmllbnRhdGlvbjtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBRdWVyeSh0eXBlLCB2YWx1ZSkge1xuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlICdtYXgtaGVpZ2h0JzpcbiAgICAgIHJldHVybiBuZXcgTWF4SGVpZ2h0KHZhbHVlKTtcbiAgICBjYXNlICdtaW4taGVpZ2h0JzpcbiAgICAgIHJldHVybiBuZXcgTWluSGVpZ2h0KHZhbHVlKTtcbiAgICBjYXNlICdtYXgtd2lkdGgnOlxuICAgICAgcmV0dXJuIG5ldyBNYXhXaWR0aCh2YWx1ZSk7XG4gICAgY2FzZSAnbWluLXdpZHRoJzpcbiAgICAgIHJldHVybiBuZXcgTWluV2lkdGgodmFsdWUpO1xuICAgIGNhc2UgJ29yaWVudGF0aW9uJzpcbiAgICAgIHJldHVybiBuZXcgT3JpZW50YXRpb24odmFsdWUpO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IodmFsdWUpO1xuICB9XG59O1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/media-engine/src/queries.js\n");

/***/ })

};
;
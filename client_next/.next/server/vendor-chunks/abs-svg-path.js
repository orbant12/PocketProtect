/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/abs-svg-path";
exports.ids = ["vendor-chunks/abs-svg-path"];
exports.modules = {

/***/ "(ssr)/./node_modules/abs-svg-path/index.js":
/*!********************************************!*\
  !*** ./node_modules/abs-svg-path/index.js ***!
  \********************************************/
/***/ ((module) => {

eval("\nmodule.exports = absolutize\n\n/**\n * redefine `path` with absolute coordinates\n *\n * @param {Array} path\n * @return {Array}\n */\n\nfunction absolutize(path){\n\tvar startX = 0\n\tvar startY = 0\n\tvar x = 0\n\tvar y = 0\n\n\treturn path.map(function(seg){\n\t\tseg = seg.slice()\n\t\tvar type = seg[0]\n\t\tvar command = type.toUpperCase()\n\n\t\t// is relative\n\t\tif (type != command) {\n\t\t\tseg[0] = command\n\t\t\tswitch (type) {\n\t\t\t\tcase 'a':\n\t\t\t\t\tseg[6] += x\n\t\t\t\t\tseg[7] += y\n\t\t\t\t\tbreak\n\t\t\t\tcase 'v':\n\t\t\t\t\tseg[1] += y\n\t\t\t\t\tbreak\n\t\t\t\tcase 'h':\n\t\t\t\t\tseg[1] += x\n\t\t\t\t\tbreak\n\t\t\t\tdefault:\n\t\t\t\t\tfor (var i = 1; i < seg.length;) {\n\t\t\t\t\t\tseg[i++] += x\n\t\t\t\t\t\tseg[i++] += y\n\t\t\t\t\t}\n\t\t\t}\n\t\t}\n\n\t\t// update cursor state\n\t\tswitch (command) {\n\t\t\tcase 'Z':\n\t\t\t\tx = startX\n\t\t\t\ty = startY\n\t\t\t\tbreak\n\t\t\tcase 'H':\n\t\t\t\tx = seg[1]\n\t\t\t\tbreak\n\t\t\tcase 'V':\n\t\t\t\ty = seg[1]\n\t\t\t\tbreak\n\t\t\tcase 'M':\n\t\t\t\tx = startX = seg[1]\n\t\t\t\ty = startY = seg[2]\n\t\t\t\tbreak\n\t\t\tdefault:\n\t\t\t\tx = seg[seg.length - 2]\n\t\t\t\ty = seg[seg.length - 1]\n\t\t}\n\n\t\treturn seg\n\t})\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvYWJzLXN2Zy1wYXRoL2luZGV4LmpzIiwibWFwcGluZ3MiOiI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsWUFBWTtBQUNaOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLGVBQWU7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsRUFBRTtBQUNGIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2FuY2VyX2FwcC8uL25vZGVfbW9kdWxlcy9hYnMtc3ZnLXBhdGgvaW5kZXguanM/ZDRkNyJdLCJzb3VyY2VzQ29udGVudCI6WyJcbm1vZHVsZS5leHBvcnRzID0gYWJzb2x1dGl6ZVxuXG4vKipcbiAqIHJlZGVmaW5lIGBwYXRoYCB3aXRoIGFic29sdXRlIGNvb3JkaW5hdGVzXG4gKlxuICogQHBhcmFtIHtBcnJheX0gcGF0aFxuICogQHJldHVybiB7QXJyYXl9XG4gKi9cblxuZnVuY3Rpb24gYWJzb2x1dGl6ZShwYXRoKXtcblx0dmFyIHN0YXJ0WCA9IDBcblx0dmFyIHN0YXJ0WSA9IDBcblx0dmFyIHggPSAwXG5cdHZhciB5ID0gMFxuXG5cdHJldHVybiBwYXRoLm1hcChmdW5jdGlvbihzZWcpe1xuXHRcdHNlZyA9IHNlZy5zbGljZSgpXG5cdFx0dmFyIHR5cGUgPSBzZWdbMF1cblx0XHR2YXIgY29tbWFuZCA9IHR5cGUudG9VcHBlckNhc2UoKVxuXG5cdFx0Ly8gaXMgcmVsYXRpdmVcblx0XHRpZiAodHlwZSAhPSBjb21tYW5kKSB7XG5cdFx0XHRzZWdbMF0gPSBjb21tYW5kXG5cdFx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdFx0Y2FzZSAnYSc6XG5cdFx0XHRcdFx0c2VnWzZdICs9IHhcblx0XHRcdFx0XHRzZWdbN10gKz0geVxuXHRcdFx0XHRcdGJyZWFrXG5cdFx0XHRcdGNhc2UgJ3YnOlxuXHRcdFx0XHRcdHNlZ1sxXSArPSB5XG5cdFx0XHRcdFx0YnJlYWtcblx0XHRcdFx0Y2FzZSAnaCc6XG5cdFx0XHRcdFx0c2VnWzFdICs9IHhcblx0XHRcdFx0XHRicmVha1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAxOyBpIDwgc2VnLmxlbmd0aDspIHtcblx0XHRcdFx0XHRcdHNlZ1tpKytdICs9IHhcblx0XHRcdFx0XHRcdHNlZ1tpKytdICs9IHlcblx0XHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gdXBkYXRlIGN1cnNvciBzdGF0ZVxuXHRcdHN3aXRjaCAoY29tbWFuZCkge1xuXHRcdFx0Y2FzZSAnWic6XG5cdFx0XHRcdHggPSBzdGFydFhcblx0XHRcdFx0eSA9IHN0YXJ0WVxuXHRcdFx0XHRicmVha1xuXHRcdFx0Y2FzZSAnSCc6XG5cdFx0XHRcdHggPSBzZWdbMV1cblx0XHRcdFx0YnJlYWtcblx0XHRcdGNhc2UgJ1YnOlxuXHRcdFx0XHR5ID0gc2VnWzFdXG5cdFx0XHRcdGJyZWFrXG5cdFx0XHRjYXNlICdNJzpcblx0XHRcdFx0eCA9IHN0YXJ0WCA9IHNlZ1sxXVxuXHRcdFx0XHR5ID0gc3RhcnRZID0gc2VnWzJdXG5cdFx0XHRcdGJyZWFrXG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHR4ID0gc2VnW3NlZy5sZW5ndGggLSAyXVxuXHRcdFx0XHR5ID0gc2VnW3NlZy5sZW5ndGggLSAxXVxuXHRcdH1cblxuXHRcdHJldHVybiBzZWdcblx0fSlcbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/abs-svg-path/index.js\n");

/***/ })

};
;
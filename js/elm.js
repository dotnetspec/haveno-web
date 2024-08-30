(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.v$.jy === region.U.jy)
	{
		return 'on line ' + region.v$.jy;
	}
	return 'on lines ' + region.v$.jy + ' through ' + region.U.jy;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.ul,
		impl.wx,
		impl.v6,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS
//
// For some reason, tabs can appear in href protocols and it still works.
// So '\tjava\tSCRIPT:alert("!!!")' and 'javascript:alert("!!!")' are the same
// in practice. That is why _VirtualDom_RE_js and _VirtualDom_RE_js_html look
// so freaky.
//
// Pulling the regular expressions out to the top level gives a slight speed
// boost in small benchmarks (4-10%) but hoisting values to reduce allocation
// can be unpredictable in large programs where JIT may have a harder time with
// functions are not fully self-contained. The benefit is more that the js and
// js_html ones are so weird that I prefer to see them near each other.


var _VirtualDom_RE_script = /^script$/i;
var _VirtualDom_RE_on_formAction = /^(on|formAction$)/i;
var _VirtualDom_RE_js = /^\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/i;
var _VirtualDom_RE_js_html = /^\s*(j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:|d\s*a\s*t\s*a\s*:\s*t\s*e\s*x\s*t\s*\/\s*h\s*t\s*m\s*l\s*(,|;))/i;


function _VirtualDom_noScript(tag)
{
	return _VirtualDom_RE_script.test(tag) ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return _VirtualDom_RE_on_formAction.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return _VirtualDom_RE_js.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return _VirtualDom_RE_js_html.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlJson(value)
{
	return (typeof _Json_unwrap(value) === 'string' && _VirtualDom_RE_js_html.test(_Json_unwrap(value)))
		? _Json_wrap(
			/**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		) : value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		uL: func(record.uL),
		oc: record.oc,
		n7: record.n7
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.uL;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.oc;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.n7) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.ul,
		impl.wx,
		impl.v6,
		function(sendToApp, initialModel) {
			var view = impl.wA;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.ul,
		impl.wx,
		impl.v6,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.es && impl.es(sendToApp)
			var view = impl.wA;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.sV);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.wp) && (_VirtualDom_doc.title = title = doc.wp);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.u3;
	var onUrlRequest = impl.u4;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		es: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.ni === next.ni
							&& curr.fr === next.fr
							&& curr.ku.a === next.ku.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		ul: function(flags)
		{
			return A3(impl.ul, flags, _Browser_getUrl(), key);
		},
		wA: impl.wA,
		wx: impl.wx,
		v6: impl.v6
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { t9: 'hidden', s5: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { t9: 'mozHidden', s5: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { t9: 'msHidden', s5: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { t9: 'webkitHidden', s5: 'webkitvisibilitychange' }
		: { t9: 'hidden', s5: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		rq: _Browser_getScene(),
		se: {
			so: _Browser_window.pageXOffset,
			sq: _Browser_window.pageYOffset,
			dn: _Browser_doc.documentElement.clientWidth,
			iR: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		dn: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		iR: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			rq: {
				dn: node.scrollWidth,
				iR: node.scrollHeight
			},
			se: {
				so: node.scrollLeft,
				sq: node.scrollTop,
				dn: node.clientWidth,
				iR: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			rq: _Browser_getScene(),
			se: {
				so: x,
				sq: y,
				dn: _Browser_doc.documentElement.clientWidth,
				iR: _Browser_doc.documentElement.clientHeight
			},
			dq: {
				so: x + rect.left,
				sq: y + rect.top,
				dn: rect.width,
				iR: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}


// CREATE

var _Regex_never = /.^/;

var _Regex_fromStringWith = F2(function(options, string)
{
	var flags = 'g';
	if (options.uS) { flags += 'm'; }
	if (options.s2) { flags += 'i'; }

	try
	{
		return $elm$core$Maybe$Just(new RegExp(string, flags));
	}
	catch(error)
	{
		return $elm$core$Maybe$Nothing;
	}
});


// USE

var _Regex_contains = F2(function(re, string)
{
	return string.match(re) !== null;
});


var _Regex_findAtMost = F3(function(n, re, str)
{
	var out = [];
	var number = 0;
	var string = str;
	var lastIndex = re.lastIndex;
	var prevLastIndex = -1;
	var result;
	while (number++ < n && (result = re.exec(string)))
	{
		if (prevLastIndex == re.lastIndex) break;
		var i = result.length - 1;
		var subs = new Array(i);
		while (i > 0)
		{
			var submatch = result[i];
			subs[--i] = submatch
				? $elm$core$Maybe$Just(submatch)
				: $elm$core$Maybe$Nothing;
		}
		out.push(A4($elm$regex$Regex$Match, result[0], result.index, number, _List_fromArray(subs)));
		prevLastIndex = re.lastIndex;
	}
	re.lastIndex = lastIndex;
	return _List_fromArray(out);
});


var _Regex_replaceAtMost = F4(function(n, re, replacer, string)
{
	var count = 0;
	function jsReplacer(match)
	{
		if (count++ >= n)
		{
			return match;
		}
		var i = arguments.length - 3;
		var submatches = new Array(i);
		while (i > 0)
		{
			var submatch = arguments[i];
			submatches[--i] = submatch
				? $elm$core$Maybe$Just(submatch)
				: $elm$core$Maybe$Nothing;
		}
		return replacer(A4($elm$regex$Regex$Match, match, arguments[arguments.length - 2], count, _List_fromArray(submatches)));
	}
	return string.replace(re, jsReplacer);
});

var _Regex_splitAtMost = F3(function(n, re, str)
{
	var string = str;
	var out = [];
	var start = re.lastIndex;
	var restoreLastIndex = re.lastIndex;
	while (n--)
	{
		var result = re.exec(string);
		if (!result) break;
		out.push(string.slice(start, result.index));
		start = re.lastIndex;
	}
	out.push(string.slice(start));
	re.lastIndex = restoreLastIndex;
	return _List_fromArray(out);
});

var _Regex_infinity = Infinity;


function _Url_percentEncode(string)
{
	return encodeURIComponent(string);
}

function _Url_percentDecode(string)
{
	try
	{
		return $elm$core$Maybe$Just(decodeURIComponent(string));
	}
	catch (e)
	{
		return $elm$core$Maybe$Nothing;
	}
}


// SEND REQUEST

var _Http_toTask = F3(function(router, toTask, request)
{
	return _Scheduler_binding(function(callback)
	{
		function done(response) {
			callback(toTask(request.m2.a(response)));
		}

		var xhr = new XMLHttpRequest();
		xhr.addEventListener('error', function() { done($elm$http$Http$NetworkError_); });
		xhr.addEventListener('timeout', function() { done($elm$http$Http$Timeout_); });
		xhr.addEventListener('load', function() { done(_Http_toResponse(request.m2.b, xhr)); });
		$elm$core$Maybe$isJust(request.wu) && _Http_track(router, xhr, request.wu.a);

		try {
			xhr.open(request.uM, request.bF, true);
		} catch (e) {
			return done($elm$http$Http$BadUrl_(request.bF));
		}

		_Http_configureRequest(xhr, request);

		request.sV.a && xhr.setRequestHeader('Content-Type', request.sV.a);
		xhr.send(request.sV.b);

		return function() { xhr.c = true; xhr.abort(); };
	});
});


// CONFIGURE

function _Http_configureRequest(xhr, request)
{
	for (var headers = request.t7; headers.b; headers = headers.b) // WHILE_CONS
	{
		xhr.setRequestHeader(headers.a.a, headers.a.b);
	}
	xhr.timeout = request.wo.a || 0;
	xhr.responseType = request.m2.d;
	xhr.withCredentials = request.sF;
}


// RESPONSES

function _Http_toResponse(toBody, xhr)
{
	return A2(
		200 <= xhr.status && xhr.status < 300 ? $elm$http$Http$GoodStatus_ : $elm$http$Http$BadStatus_,
		_Http_toMetadata(xhr),
		toBody(xhr.response)
	);
}


// METADATA

function _Http_toMetadata(xhr)
{
	return {
		bF: xhr.responseURL,
		v0: xhr.status,
		v1: xhr.statusText,
		t7: _Http_parseHeaders(xhr.getAllResponseHeaders())
	};
}


// HEADERS

function _Http_parseHeaders(rawHeaders)
{
	if (!rawHeaders)
	{
		return $elm$core$Dict$empty;
	}

	var headers = $elm$core$Dict$empty;
	var headerPairs = rawHeaders.split('\r\n');
	for (var i = headerPairs.length; i--; )
	{
		var headerPair = headerPairs[i];
		var index = headerPair.indexOf(': ');
		if (index > 0)
		{
			var key = headerPair.substring(0, index);
			var value = headerPair.substring(index + 2);

			headers = A3($elm$core$Dict$update, key, function(oldValue) {
				return $elm$core$Maybe$Just($elm$core$Maybe$isJust(oldValue)
					? value + ', ' + oldValue.a
					: value
				);
			}, headers);
		}
	}
	return headers;
}


// EXPECT

var _Http_expect = F3(function(type, toBody, toValue)
{
	return {
		$: 0,
		d: type,
		b: toBody,
		a: toValue
	};
});

var _Http_mapExpect = F2(function(func, expect)
{
	return {
		$: 0,
		d: expect.d,
		b: expect.b,
		a: function(x) { return func(expect.a(x)); }
	};
});

function _Http_toDataView(arrayBuffer)
{
	return new DataView(arrayBuffer);
}


// BODY and PARTS

var _Http_emptyBody = { $: 0 };
var _Http_pair = F2(function(a, b) { return { $: 0, a: a, b: b }; });

function _Http_toFormData(parts)
{
	for (var formData = new FormData(); parts.b; parts = parts.b) // WHILE_CONS
	{
		var part = parts.a;
		formData.append(part.a, part.b);
	}
	return formData;
}

var _Http_bytesToBlob = F2(function(mime, bytes)
{
	return new Blob([bytes], { type: mime });
});


// PROGRESS

function _Http_track(router, xhr, tracker)
{
	// TODO check out lengthComputable on loadstart event

	xhr.upload.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Sending({
			vQ: event.loaded,
			vV: event.total
		}))));
	});
	xhr.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Receiving({
			vq: event.loaded,
			vV: event.lengthComputable ? $elm$core$Maybe$Just(event.total) : $elm$core$Maybe$Nothing
		}))));
	});
}

// BYTES

function _Bytes_width(bytes)
{
	return bytes.byteLength;
}

var _Bytes_getHostEndianness = F2(function(le, be)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(new Uint8Array(new Uint32Array([1]))[0] === 1 ? le : be));
	});
});


// ENCODERS

function _Bytes_encode(encoder)
{
	var mutableBytes = new DataView(new ArrayBuffer($elm$bytes$Bytes$Encode$getWidth(encoder)));
	$elm$bytes$Bytes$Encode$write(encoder)(mutableBytes)(0);
	return mutableBytes;
}


// SIGNED INTEGERS

var _Bytes_write_i8  = F3(function(mb, i, n) { mb.setInt8(i, n); return i + 1; });
var _Bytes_write_i16 = F4(function(mb, i, n, isLE) { mb.setInt16(i, n, isLE); return i + 2; });
var _Bytes_write_i32 = F4(function(mb, i, n, isLE) { mb.setInt32(i, n, isLE); return i + 4; });


// UNSIGNED INTEGERS

var _Bytes_write_u8  = F3(function(mb, i, n) { mb.setUint8(i, n); return i + 1 ;});
var _Bytes_write_u16 = F4(function(mb, i, n, isLE) { mb.setUint16(i, n, isLE); return i + 2; });
var _Bytes_write_u32 = F4(function(mb, i, n, isLE) { mb.setUint32(i, n, isLE); return i + 4; });


// FLOATS

var _Bytes_write_f32 = F4(function(mb, i, n, isLE) { mb.setFloat32(i, n, isLE); return i + 4; });
var _Bytes_write_f64 = F4(function(mb, i, n, isLE) { mb.setFloat64(i, n, isLE); return i + 8; });


// BYTES

var _Bytes_write_bytes = F3(function(mb, offset, bytes)
{
	for (var i = 0, len = bytes.byteLength, limit = len - 4; i <= limit; i += 4)
	{
		mb.setUint32(offset + i, bytes.getUint32(i));
	}
	for (; i < len; i++)
	{
		mb.setUint8(offset + i, bytes.getUint8(i));
	}
	return offset + len;
});


// STRINGS

function _Bytes_getStringWidth(string)
{
	for (var width = 0, i = 0; i < string.length; i++)
	{
		var code = string.charCodeAt(i);
		width +=
			(code < 0x80) ? 1 :
			(code < 0x800) ? 2 :
			(code < 0xD800 || 0xDBFF < code) ? 3 : (i++, 4);
	}
	return width;
}

var _Bytes_write_string = F3(function(mb, offset, string)
{
	for (var i = 0; i < string.length; i++)
	{
		var code = string.charCodeAt(i);
		offset +=
			(code < 0x80)
				? (mb.setUint8(offset, code)
				, 1
				)
				:
			(code < 0x800)
				? (mb.setUint16(offset, 0xC080 /* 0b1100000010000000 */
					| (code >>> 6 & 0x1F /* 0b00011111 */) << 8
					| code & 0x3F /* 0b00111111 */)
				, 2
				)
				:
			(code < 0xD800 || 0xDBFF < code)
				? (mb.setUint16(offset, 0xE080 /* 0b1110000010000000 */
					| (code >>> 12 & 0xF /* 0b00001111 */) << 8
					| code >>> 6 & 0x3F /* 0b00111111 */)
				, mb.setUint8(offset + 2, 0x80 /* 0b10000000 */
					| code & 0x3F /* 0b00111111 */)
				, 3
				)
				:
			(code = (code - 0xD800) * 0x400 + string.charCodeAt(++i) - 0xDC00 + 0x10000
			, mb.setUint32(offset, 0xF0808080 /* 0b11110000100000001000000010000000 */
				| (code >>> 18 & 0x7 /* 0b00000111 */) << 24
				| (code >>> 12 & 0x3F /* 0b00111111 */) << 16
				| (code >>> 6 & 0x3F /* 0b00111111 */) << 8
				| code & 0x3F /* 0b00111111 */)
			, 4
			);
	}
	return offset;
});


// DECODER

var _Bytes_decode = F2(function(decoder, bytes)
{
	try {
		return $elm$core$Maybe$Just(A2(decoder, bytes, 0).b);
	} catch(e) {
		return $elm$core$Maybe$Nothing;
	}
});

var _Bytes_read_i8  = F2(function(      bytes, offset) { return _Utils_Tuple2(offset + 1, bytes.getInt8(offset)); });
var _Bytes_read_i16 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 2, bytes.getInt16(offset, isLE)); });
var _Bytes_read_i32 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 4, bytes.getInt32(offset, isLE)); });
var _Bytes_read_u8  = F2(function(      bytes, offset) { return _Utils_Tuple2(offset + 1, bytes.getUint8(offset)); });
var _Bytes_read_u16 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 2, bytes.getUint16(offset, isLE)); });
var _Bytes_read_u32 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 4, bytes.getUint32(offset, isLE)); });
var _Bytes_read_f32 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 4, bytes.getFloat32(offset, isLE)); });
var _Bytes_read_f64 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 8, bytes.getFloat64(offset, isLE)); });

var _Bytes_read_bytes = F3(function(len, bytes, offset)
{
	return _Utils_Tuple2(offset + len, new DataView(bytes.buffer, bytes.byteOffset + offset, len));
});

var _Bytes_read_string = F3(function(len, bytes, offset)
{
	var string = '';
	var end = offset + len;
	for (; offset < end;)
	{
		var byte = bytes.getUint8(offset++);
		string +=
			(byte < 128)
				? String.fromCharCode(byte)
				:
			((byte & 0xE0 /* 0b11100000 */) === 0xC0 /* 0b11000000 */)
				? String.fromCharCode((byte & 0x1F /* 0b00011111 */) << 6 | bytes.getUint8(offset++) & 0x3F /* 0b00111111 */)
				:
			((byte & 0xF0 /* 0b11110000 */) === 0xE0 /* 0b11100000 */)
				? String.fromCharCode(
					(byte & 0xF /* 0b00001111 */) << 12
					| (bytes.getUint8(offset++) & 0x3F /* 0b00111111 */) << 6
					| bytes.getUint8(offset++) & 0x3F /* 0b00111111 */
				)
				:
				(byte =
					((byte & 0x7 /* 0b00000111 */) << 18
						| (bytes.getUint8(offset++) & 0x3F /* 0b00111111 */) << 12
						| (bytes.getUint8(offset++) & 0x3F /* 0b00111111 */) << 6
						| bytes.getUint8(offset++) & 0x3F /* 0b00111111 */
					) - 0x10000
				, String.fromCharCode(Math.floor(byte / 0x400) + 0xD800, byte % 0x400 + 0xDC00)
				);
	}
	return _Utils_Tuple2(offset, string);
});

var _Bytes_decodeFailure = F2(function() { throw 0; });



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});



function _Time_now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

var _Time_setInterval = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

function _Time_here()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2($elm$time$Time$customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}


function _Time_getZoneName()
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = $elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = $elm$time$Time$Offset(new Date().getTimezoneOffset());
		}
		callback(_Scheduler_succeed(name));
	});
}
var $author$project$Main$ChangedUrl = function (a) {
	return {$: 10, a: a};
};
var $author$project$Main$ClickedLink = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.am) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.as),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.as);
		} else {
			var treeLen = builder.am * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.au) : builder.au;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.am);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.as) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.as);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{au: nodeList, am: (len / $elm$core$Array$branchFactor) | 0, as: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {tT: fragment, fr: host, f3: path, ku: port_, ni: protocol, vp: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$application = _Browser_application;
var $author$project$Main$NotFound = {$: 9};
var $elm$json$Json$Decode$decodeString = _Json_runOnString;
var $elm$time$Time$Posix = $elm$core$Basics$identity;
var $elm$time$Time$millisToPosix = $elm$core$Basics$identity;
var $elm$browser$Browser$Navigation$pushUrl = _Browser_pushUrl;
var $elm$url$Url$addPort = F2(
	function (maybePort, starter) {
		if (maybePort.$ === 1) {
			return starter;
		} else {
			var port_ = maybePort.a;
			return starter + (':' + $elm$core$String$fromInt(port_));
		}
	});
var $elm$url$Url$addPrefixed = F3(
	function (prefix, maybeSegment, starter) {
		if (maybeSegment.$ === 1) {
			return starter;
		} else {
			var segment = maybeSegment.a;
			return _Utils_ap(
				starter,
				_Utils_ap(prefix, segment));
		}
	});
var $elm$url$Url$toString = function (url) {
	var http = function () {
		var _v0 = url.ni;
		if (!_v0) {
			return 'http://';
		} else {
			return 'https://';
		}
	}();
	return A3(
		$elm$url$Url$addPrefixed,
		'#',
		url.tT,
		A3(
			$elm$url$Url$addPrefixed,
			'?',
			url.vp,
			_Utils_ap(
				A2(
					$elm$url$Url$addPort,
					url.ku,
					_Utils_ap(http, url.fr)),
				url.f3)));
};
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $RomanErnst$erl$Erl$getQueryValuesForKey = F2(
	function (key, url) {
		return A2(
			$elm$core$List$map,
			$elm$core$Tuple$second,
			A2(
				$elm$core$List$filter,
				function (_v0) {
					var k = _v0.a;
					return _Utils_eq(k, key);
				},
				url.vp));
	});
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $RomanErnst$erl$Erl$extractProtocol = function (str) {
	var parts = A2($elm$core$String$split, '://', str);
	var _v0 = $elm$core$List$length(parts);
	if (_v0 === 1) {
		return '';
	} else {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			$elm$core$List$head(parts));
	}
};
var $elm$regex$Regex$Match = F4(
	function (match, index, number, submatches) {
		return {i_: index, qf: match, W: number, v5: submatches};
	});
var $elm$regex$Regex$findAtMost = _Regex_findAtMost;
var $elm$regex$Regex$fromStringWith = _Regex_fromStringWith;
var $elm$regex$Regex$fromString = function (string) {
	return A2(
		$elm$regex$Regex$fromStringWith,
		{s2: false, uS: false},
		string);
};
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $RomanErnst$erl$Erl$extractPort = function (str) {
	var res = A2(
		$elm$core$Maybe$withDefault,
		_List_Nil,
		A2(
			$elm$core$Maybe$map,
			function (rx) {
				return A3($elm$regex$Regex$findAtMost, 1, rx, str);
			},
			$elm$regex$Regex$fromString(':\\d+')));
	return function (result) {
		if (!result.$) {
			var port_ = result.a;
			return port_;
		} else {
			var _v1 = $RomanErnst$erl$Erl$extractProtocol(str);
			switch (_v1) {
				case 'http':
					return 80;
				case 'https':
					return 443;
				case 'ftp':
					return 21;
				case 'sftp':
					return 22;
				default:
					return 0;
			}
		}
	}(
		$elm$core$String$toInt(
			A2(
				$elm$core$String$dropLeft,
				1,
				A2(
					$elm$core$Maybe$withDefault,
					'',
					$elm$core$List$head(
						A2(
							$elm$core$List$map,
							function ($) {
								return $.qf;
							},
							res))))));
};
var $elm$regex$Regex$contains = _Regex_contains;
var $RomanErnst$erl$Erl$leftFromOrSame = F2(
	function (delimiter, str) {
		var parts = A2($elm$core$String$split, delimiter, str);
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			$elm$core$List$head(parts));
	});
var $RomanErnst$erl$Erl$rightFromOrSame = F2(
	function (delimiter, str) {
		var parts = A2($elm$core$String$split, delimiter, str);
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			$elm$core$List$head(
				$elm$core$List$reverse(parts)));
	});
var $RomanErnst$erl$Erl$extractHost = function (str) {
	if (A2($elm$core$String$contains, '//', str)) {
		return A2(
			$RomanErnst$erl$Erl$leftFromOrSame,
			':',
			A2(
				$RomanErnst$erl$Erl$leftFromOrSame,
				'/',
				A2($RomanErnst$erl$Erl$rightFromOrSame, '//', str)));
	} else {
		var matches = function (s) {
			return A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				A2(
					$elm$core$Maybe$map,
					function (rx) {
						return A3($elm$regex$Regex$findAtMost, 1, rx, s);
					},
					$elm$regex$Regex$fromString('((\\w|-)+\\.)+(\\w|-)+')));
		};
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2(
				$elm$core$Maybe$map,
				function ($) {
					return $.qf;
				},
				$elm$core$List$head(
					matches(
						A2(
							$RomanErnst$erl$Erl$leftFromOrSame,
							'/',
							A2($RomanErnst$erl$Erl$rightFromOrSame, '//', str))))));
	}
};
var $elm$regex$Regex$replaceAtMost = _Regex_replaceAtMost;
var $RomanErnst$erl$Erl$extractPath = function (str) {
	var replace = F2(
		function (maybeRegex, s) {
			return A2(
				$elm$core$Maybe$withDefault,
				s,
				A2(
					$elm$core$Maybe$map,
					function (rx) {
						return A4(
							$elm$regex$Regex$replaceAtMost,
							1,
							rx,
							function (_v0) {
								return '';
							},
							s);
					},
					maybeRegex));
		});
	var host_ = $RomanErnst$erl$Erl$extractHost(str);
	return A2(
		replace,
		$elm$regex$Regex$fromString(':\\d+'),
		A2(
			replace,
			$elm$regex$Regex$fromString(host_),
			A2(
				$RomanErnst$erl$Erl$leftFromOrSame,
				'#',
				A2(
					$RomanErnst$erl$Erl$leftFromOrSame,
					'?',
					A2($RomanErnst$erl$Erl$rightFromOrSame, '//', str)))));
};
var $RomanErnst$erl$Erl$hasLeadingSlashFromAll = function (str) {
	return A2(
		$elm$core$Maybe$withDefault,
		false,
		A2(
			$elm$core$Maybe$map,
			function (rx) {
				return A2(
					$elm$regex$Regex$contains,
					rx,
					$RomanErnst$erl$Erl$extractPath(str));
			},
			$elm$regex$Regex$fromString('^/')));
};
var $RomanErnst$erl$Erl$hasTrailingSlashFromAll = function (str) {
	return A2(
		$elm$core$Maybe$withDefault,
		false,
		A2(
			$elm$core$Maybe$map,
			function (rx) {
				return A2(
					$elm$regex$Regex$contains,
					rx,
					$RomanErnst$erl$Erl$extractPath(str));
			},
			$elm$regex$Regex$fromString('/$')));
};
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $RomanErnst$erl$Erl$extractHash = function (str) {
	return A2(
		$elm$core$Maybe$withDefault,
		'',
		$elm$core$List$head(
			A2(
				$elm$core$List$drop,
				1,
				A2($elm$core$String$split, '#', str))));
};
var $RomanErnst$erl$Erl$hashFromAll = function (str) {
	return $RomanErnst$erl$Erl$extractHash(str);
};
var $RomanErnst$erl$Erl$parseHost = function (str) {
	return A2($elm$core$String$split, '.', str);
};
var $RomanErnst$erl$Erl$host = function (str) {
	return $RomanErnst$erl$Erl$parseHost(
		$RomanErnst$erl$Erl$extractHost(str));
};
var $elm$core$Basics$not = _Basics_not;
var $RomanErnst$erl$Erl$notEmpty = function (str) {
	return !$elm$core$String$isEmpty(str);
};
var $elm$url$Url$percentDecode = _Url_percentDecode;
var $RomanErnst$erl$Erl$parsePath = function (str) {
	return A2(
		$elm$core$List$map,
		$elm$core$Maybe$withDefault(''),
		A2(
			$elm$core$List$map,
			$elm$url$Url$percentDecode,
			A2(
				$elm$core$List$filter,
				$RomanErnst$erl$Erl$notEmpty,
				A2($elm$core$String$split, '/', str))));
};
var $RomanErnst$erl$Erl$pathFromAll = function (str) {
	return $RomanErnst$erl$Erl$parsePath(
		$RomanErnst$erl$Erl$extractPath(str));
};
var $RomanErnst$erl$Erl$extractQuery = function (str) {
	return A2(
		$elm$core$Maybe$withDefault,
		'',
		$elm$core$List$head(
			A2(
				$elm$core$String$split,
				'#',
				A2(
					$elm$core$Maybe$withDefault,
					'',
					$elm$core$List$head(
						A2(
							$elm$core$List$drop,
							1,
							A2($elm$core$String$split, '?', str)))))));
};
var $RomanErnst$erl$Erl$queryStringElementToTuple = function (element) {
	var splitted = A2($elm$core$String$split, '=', element);
	var second = A2(
		$elm$core$Maybe$withDefault,
		'',
		$elm$core$List$head(
			A2($elm$core$List$drop, 1, splitted)));
	var secondDecoded = A2(
		$elm$core$Maybe$withDefault,
		'',
		$elm$url$Url$percentDecode(second));
	var first = A2(
		$elm$core$Maybe$withDefault,
		'',
		$elm$core$List$head(splitted));
	var firstDecoded = A2(
		$elm$core$Maybe$withDefault,
		'',
		$elm$url$Url$percentDecode(first));
	return _Utils_Tuple2(firstDecoded, secondDecoded);
};
var $RomanErnst$erl$Erl$parseQuery = function (queryString) {
	var splitted = A2($elm$core$String$split, '&', queryString);
	return $elm$core$String$isEmpty(queryString) ? _List_Nil : A2($elm$core$List$map, $RomanErnst$erl$Erl$queryStringElementToTuple, splitted);
};
var $RomanErnst$erl$Erl$queryFromAll = function (all) {
	return $RomanErnst$erl$Erl$parseQuery(
		$RomanErnst$erl$Erl$extractQuery(all));
};
var $RomanErnst$erl$Erl$parse = function (str) {
	return {
		m4: $RomanErnst$erl$Erl$hasLeadingSlashFromAll(str),
		m5: $RomanErnst$erl$Erl$hasTrailingSlashFromAll(str),
		ae: $RomanErnst$erl$Erl$hashFromAll(str),
		fr: $RomanErnst$erl$Erl$host(str),
		n4: '',
		f3: $RomanErnst$erl$Erl$pathFromAll(str),
		ku: $RomanErnst$erl$Erl$extractPort(str),
		ni: $RomanErnst$erl$Erl$extractProtocol(str),
		vp: $RomanErnst$erl$Erl$queryFromAll(str),
		a6: ''
	};
};
var $author$project$Main$gotCodeFromUrl = function (url) {
	return $elm$core$Maybe$Just(
		A2(
			$elm$core$String$join,
			'',
			A2(
				$RomanErnst$erl$Erl$getQueryValuesForKey,
				'code',
				$RomanErnst$erl$Erl$parse(
					$elm$url$Url$toString(url)))));
};
var $author$project$Pages$Buy$Buy = $elm$core$Basics$identity;
var $author$project$Pages$Buy$Loading = 0;
var $author$project$Pages$Buy$initialModel = {
	rh: {fR: 'Loading...'},
	rL: 0,
	wp: 'Buy'
};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Pages$Buy$init = function (_v0) {
	return _Utils_Tuple2(
		_Utils_update(
			$author$project$Pages$Buy$initialModel,
			{wp: 'Haveno-Web Buy'}),
		$elm$core$Platform$Cmd$none);
};
var $author$project$Pages$Dashboard$Dashboard = $elm$core$Basics$identity;
var $author$project$Pages$Dashboard$HavenoAPKHttpRequest = F6(
	function (method, headers, url, body, timeout, tracker) {
		return {sV: body, t7: headers, uM: method, wo: timeout, wu: tracker, bF: url};
	});
var $author$project$Pages$Dashboard$Loading = 0;
var $author$project$Pages$Dashboard$Model = F8(
	function (status, title, root, balance, flagUrl, havenoAPKHttpRequest, version, errors) {
		return {sO: balance, d$: errors, iI: flagUrl, pK: havenoAPKHttpRequest, rh: root, rL: status, wp: title, ez: version};
	});
var $elm$http$Http$BadStatus_ = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$http$Http$BadUrl_ = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$GoodStatus_ = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $elm$http$Http$NetworkError_ = {$: 2};
var $elm$http$Http$Receiving = function (a) {
	return {$: 1, a: a};
};
var $elm$http$Http$Sending = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$Timeout_ = {$: 1};
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Maybe$isJust = function (maybe) {
	if (!maybe.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === -1) && (dict.d.$ === -1)) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.e.d.$ === -1) && (!dict.e.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.d.d.$ === -1) && (!dict.d.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === -1) && (!left.a)) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === -1) && (right.a === 1)) {
					if (right.d.$ === -1) {
						if (right.d.a === 1) {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === -1) && (dict.d.$ === -1)) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor === 1) {
			if ((lLeft.$ === -1) && (!lLeft.a)) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === -1) {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === -1) && (left.a === 1)) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === -1) && (!lLeft.a)) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === -1) {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === -1) {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === -1) {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (!_v0.$) {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $elm$http$Http$emptyBody = _Http_emptyBody;
var $author$project$Extras$Constants$localorproductionServerAutoCheck = 'haveno-web.squashpassion';
var $author$project$Extras$Constants$middleWarePath = '/middleware';
var $author$project$Extras$Constants$post = 'POST';
var $author$project$Extras$Constants$productionProxyConfig = '/proxy/';
var $author$project$Pages$Dashboard$GotVersion = function (a) {
	return {$: 2, a: a};
};
var $anmolitor$elm_grpc$Grpc$InternalRpcRequest = $elm$core$Basics$identity;
var $elm$http$Http$Header = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$http$Http$header = $elm$http$Http$Header;
var $anmolitor$elm_grpc$Grpc$addHeader = F3(
	function (key, value, _v0) {
		var req = _v0;
		return _Utils_update(
			req,
			{
				t7: A2(
					$elm$core$List$cons,
					A2($elm$http$Http$header, key, value),
					req.t7)
			});
	});
var $anmolitor$elm_grpc$Grpc$Internal$Rpc = $elm$core$Basics$identity;
var $author$project$Proto$Io$Haveno$Protobuffer$Internals_$defaultProto__Io__Haveno__Protobuffer__GetVersionReply = {ez: ''};
var $eriktim$elm_protocol_buffers$Protobuf$Decode$Decoder = $elm$core$Basics$identity;
var $elm$bytes$Bytes$Encode$getWidth = function (builder) {
	switch (builder.$) {
		case 0:
			return 1;
		case 1:
			return 2;
		case 2:
			return 4;
		case 3:
			return 1;
		case 4:
			return 2;
		case 5:
			return 4;
		case 6:
			return 4;
		case 7:
			return 8;
		case 8:
			var w = builder.a;
			return w;
		case 9:
			var w = builder.a;
			return w;
		default:
			var bs = builder.a;
			return _Bytes_width(bs);
	}
};
var $elm$bytes$Bytes$LE = 0;
var $elm$bytes$Bytes$Encode$write = F3(
	function (builder, mb, offset) {
		switch (builder.$) {
			case 0:
				var n = builder.a;
				return A3(_Bytes_write_i8, mb, offset, n);
			case 1:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_i16, mb, offset, n, !e);
			case 2:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_i32, mb, offset, n, !e);
			case 3:
				var n = builder.a;
				return A3(_Bytes_write_u8, mb, offset, n);
			case 4:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_u16, mb, offset, n, !e);
			case 5:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_u32, mb, offset, n, !e);
			case 6:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_f32, mb, offset, n, !e);
			case 7:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_f64, mb, offset, n, !e);
			case 8:
				var bs = builder.b;
				return A3($elm$bytes$Bytes$Encode$writeSequence, bs, mb, offset);
			case 9:
				var s = builder.b;
				return A3(_Bytes_write_string, mb, offset, s);
			default:
				var bs = builder.a;
				return A3(_Bytes_write_bytes, mb, offset, bs);
		}
	});
var $elm$bytes$Bytes$Encode$writeSequence = F3(
	function (builders, mb, offset) {
		writeSequence:
		while (true) {
			if (!builders.b) {
				return offset;
			} else {
				var b = builders.a;
				var bs = builders.b;
				var $temp$builders = bs,
					$temp$mb = mb,
					$temp$offset = A3($elm$bytes$Bytes$Encode$write, b, mb, offset);
				builders = $temp$builders;
				mb = $temp$mb;
				offset = $temp$offset;
				continue writeSequence;
			}
		}
	});
var $elm$bytes$Bytes$Decode$Decoder = $elm$core$Basics$identity;
var $elm$bytes$Bytes$Decode$fail = _Bytes_decodeFailure;
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$core$Set$Set_elm_builtin = $elm$core$Basics$identity;
var $elm$core$Set$empty = $elm$core$Dict$empty;
var $elm$core$Set$insert = F2(
	function (key, _v0) {
		var dict = _v0;
		return A3($elm$core$Dict$insert, key, 0, dict);
	});
var $elm$core$Set$fromList = function (list) {
	return A3($elm$core$List$foldl, $elm$core$Set$insert, $elm$core$Set$empty, list);
};
var $elm$bytes$Bytes$Decode$loopHelp = F4(
	function (state, callback, bites, offset) {
		loopHelp:
		while (true) {
			var _v0 = callback(state);
			var decoder = _v0;
			var _v1 = A2(decoder, bites, offset);
			var newOffset = _v1.a;
			var step = _v1.b;
			if (!step.$) {
				var newState = step.a;
				var $temp$state = newState,
					$temp$callback = callback,
					$temp$bites = bites,
					$temp$offset = newOffset;
				state = $temp$state;
				callback = $temp$callback;
				bites = $temp$bites;
				offset = $temp$offset;
				continue loopHelp;
			} else {
				var result = step.a;
				return _Utils_Tuple2(newOffset, result);
			}
		}
	});
var $elm$bytes$Bytes$Decode$loop = F2(
	function (state, callback) {
		return A2($elm$bytes$Bytes$Decode$loopHelp, state, callback);
	});
var $elm$core$Tuple$mapFirst = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			func(x),
			y);
	});
var $elm$core$Tuple$mapSecond = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			x,
			func(y));
	});
var $elm$bytes$Bytes$Decode$Done = function (a) {
	return {$: 1, a: a};
};
var $elm$bytes$Bytes$Decode$Loop = function (a) {
	return {$: 0, a: a};
};
var $elm$bytes$Bytes$Decode$andThen = F2(
	function (callback, _v0) {
		var decodeA = _v0;
		return F2(
			function (bites, offset) {
				var _v1 = A2(decodeA, bites, offset);
				var newOffset = _v1.a;
				var a = _v1.b;
				var _v2 = callback(a);
				var decodeB = _v2;
				return A2(decodeB, bites, newOffset);
			});
	});
var $elm$core$Dict$isEmpty = function (dict) {
	if (dict.$ === -2) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Set$isEmpty = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$isEmpty(dict);
};
var $elm$bytes$Bytes$Decode$map = F2(
	function (func, _v0) {
		var decodeA = _v0;
		return F2(
			function (bites, offset) {
				var _v1 = A2(decodeA, bites, offset);
				var aOffset = _v1.a;
				var a = _v1.b;
				return _Utils_Tuple2(
					aOffset,
					func(a));
			});
	});
var $elm$core$Set$remove = F2(
	function (key, _v0) {
		var dict = _v0;
		return A2($elm$core$Dict$remove, key, dict);
	});
var $elm$bytes$Bytes$Decode$succeed = function (a) {
	return F2(
		function (_v0, offset) {
			return _Utils_Tuple2(offset, a);
		});
};
var $eriktim$elm_protocol_buffers$Internal$Protobuf$Bit32 = {$: 5};
var $eriktim$elm_protocol_buffers$Internal$Protobuf$Bit64 = {$: 1};
var $eriktim$elm_protocol_buffers$Internal$Protobuf$EndGroup = {$: 4};
var $eriktim$elm_protocol_buffers$Internal$Protobuf$LengthDelimited = function (a) {
	return {$: 2, a: a};
};
var $eriktim$elm_protocol_buffers$Internal$Protobuf$StartGroup = {$: 3};
var $eriktim$elm_protocol_buffers$Internal$Protobuf$VarInt = {$: 0};
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Basics$pow = _Basics_pow;
var $eriktim$elm_protocol_buffers$Internal$Int32$fromSigned = function (value) {
	return (value < 0) ? (value + A2($elm$core$Basics$pow, 2, 32)) : value;
};
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$core$Bitwise$xor = _Bitwise_xor;
var $eriktim$elm_protocol_buffers$Internal$Int32$fromZigZag = function (value) {
	return (value >>> 1) ^ ((-1) * (1 & value));
};
var $eriktim$elm_protocol_buffers$Internal$Int32$popBase128 = function (value) {
	var higherBits = value >>> 7;
	var base128 = 127 & value;
	return _Utils_Tuple2(base128, higherBits);
};
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $eriktim$elm_protocol_buffers$Internal$Int32$pushBase128 = F2(
	function (base128, _int) {
		return base128 + (_int << 7);
	});
var $elm$core$Basics$ge = _Utils_ge;
var $eriktim$elm_protocol_buffers$Internal$Int32$toSigned = function (value) {
	return (_Utils_cmp(
		value,
		A2($elm$core$Basics$pow, 2, 31)) > -1) ? (value - A2($elm$core$Basics$pow, 2, 32)) : value;
};
var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var $eriktim$elm_protocol_buffers$Internal$Int32$toZigZag = function (value) {
	return (value >> 31) ^ (value << 1);
};
var $eriktim$elm_protocol_buffers$Internal$Int32$operations = {tU: $elm$core$Basics$identity, tV: $eriktim$elm_protocol_buffers$Internal$Int32$fromSigned, tW: $eriktim$elm_protocol_buffers$Internal$Int32$fromZigZag, vi: $eriktim$elm_protocol_buffers$Internal$Int32$popBase128, vo: $eriktim$elm_protocol_buffers$Internal$Int32$pushBase128, wq: $eriktim$elm_protocol_buffers$Internal$Int32$toSigned, wr: $eriktim$elm_protocol_buffers$Internal$Int32$toZigZag};
var $elm$bytes$Bytes$Decode$unsignedInt8 = _Bytes_read_u8;
var $eriktim$elm_protocol_buffers$Protobuf$Decode$varIntDecoder = function (config) {
	return A2(
		$elm$bytes$Bytes$Decode$andThen,
		function (octet) {
			return ((128 & octet) === 128) ? A2(
				$elm$bytes$Bytes$Decode$map,
				function (_v0) {
					var usedBytes = _v0.a;
					var value = _v0.b;
					return _Utils_Tuple2(
						usedBytes + 1,
						A2(config.vo, 127 & octet, value));
				},
				$eriktim$elm_protocol_buffers$Protobuf$Decode$varIntDecoder(config)) : $elm$bytes$Bytes$Decode$succeed(
				_Utils_Tuple2(
					1,
					config.tU(octet)));
		},
		$elm$bytes$Bytes$Decode$unsignedInt8);
};
var $eriktim$elm_protocol_buffers$Protobuf$Decode$tagDecoder = A2(
	$elm$bytes$Bytes$Decode$andThen,
	function (_v0) {
		var usedBytes = _v0.a;
		var value = _v0.b;
		var fieldNumber = value >>> 3;
		return A2(
			$elm$bytes$Bytes$Decode$map,
			function (_v1) {
				var n = _v1.a;
				var wireType = _v1.b;
				return _Utils_Tuple2(
					usedBytes + n,
					_Utils_Tuple2(fieldNumber, wireType));
			},
			function () {
				var _v2 = 7 & value;
				switch (_v2) {
					case 0:
						return $elm$bytes$Bytes$Decode$succeed(
							_Utils_Tuple2(0, $eriktim$elm_protocol_buffers$Internal$Protobuf$VarInt));
					case 1:
						return $elm$bytes$Bytes$Decode$succeed(
							_Utils_Tuple2(0, $eriktim$elm_protocol_buffers$Internal$Protobuf$Bit64));
					case 2:
						return A2(
							$elm$bytes$Bytes$Decode$map,
							$elm$core$Tuple$mapSecond($eriktim$elm_protocol_buffers$Internal$Protobuf$LengthDelimited),
							$eriktim$elm_protocol_buffers$Protobuf$Decode$varIntDecoder($eriktim$elm_protocol_buffers$Internal$Int32$operations));
					case 3:
						return $elm$bytes$Bytes$Decode$succeed(
							_Utils_Tuple2(0, $eriktim$elm_protocol_buffers$Internal$Protobuf$StartGroup));
					case 4:
						return $elm$bytes$Bytes$Decode$succeed(
							_Utils_Tuple2(0, $eriktim$elm_protocol_buffers$Internal$Protobuf$EndGroup));
					case 5:
						return $elm$bytes$Bytes$Decode$succeed(
							_Utils_Tuple2(0, $eriktim$elm_protocol_buffers$Internal$Protobuf$Bit32));
					default:
						return $elm$bytes$Bytes$Decode$fail;
				}
			}());
	},
	$eriktim$elm_protocol_buffers$Protobuf$Decode$varIntDecoder($eriktim$elm_protocol_buffers$Internal$Int32$operations));
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $elm$bytes$Bytes$Decode$bytes = function (n) {
	return _Bytes_read_bytes(n);
};
var $eriktim$elm_protocol_buffers$Protobuf$Decode$unknownFieldDecoder = function (wireType) {
	switch (wireType.$) {
		case 0:
			return A2(
				$elm$bytes$Bytes$Decode$map,
				$elm$core$Tuple$first,
				$eriktim$elm_protocol_buffers$Protobuf$Decode$varIntDecoder($eriktim$elm_protocol_buffers$Internal$Int32$operations));
		case 1:
			return A2(
				$elm$bytes$Bytes$Decode$map,
				$elm$core$Basics$always(8),
				$elm$bytes$Bytes$Decode$bytes(8));
		case 2:
			var width = wireType.a;
			return A2(
				$elm$bytes$Bytes$Decode$map,
				$elm$core$Basics$always(width),
				$elm$bytes$Bytes$Decode$bytes(width));
		case 3:
			return $elm$bytes$Bytes$Decode$fail;
		case 4:
			return $elm$bytes$Bytes$Decode$fail;
		default:
			return A2(
				$elm$bytes$Bytes$Decode$map,
				$elm$core$Basics$always(4),
				$elm$bytes$Bytes$Decode$bytes(4));
	}
};
var $eriktim$elm_protocol_buffers$Protobuf$Decode$stepMessage = F2(
	function (width, state) {
		return (state.dn <= 0) ? ($elm$core$Set$isEmpty(state.kQ) ? $elm$bytes$Bytes$Decode$succeed(
			$elm$bytes$Bytes$Decode$Done(
				_Utils_Tuple2(width, state.uQ))) : $elm$bytes$Bytes$Decode$fail) : A2(
			$elm$bytes$Bytes$Decode$andThen,
			function (_v0) {
				var usedBytes = _v0.a;
				var _v1 = _v0.b;
				var fieldNumber = _v1.a;
				var wireType = _v1.b;
				var _v2 = A2($elm$core$Dict$get, fieldNumber, state.nJ);
				if (!_v2.$) {
					var decoder = _v2.a;
					return A2(
						$elm$bytes$Bytes$Decode$map,
						function (_v3) {
							var n = _v3.a;
							var fn = _v3.b;
							return $elm$bytes$Bytes$Decode$Loop(
								_Utils_update(
									state,
									{
										uQ: fn(state.uQ),
										kQ: A2($elm$core$Set$remove, fieldNumber, state.kQ),
										dn: (state.dn - usedBytes) - n
									}));
						},
						decoder(wireType));
				} else {
					return A2(
						$elm$bytes$Bytes$Decode$map,
						function (n) {
							return $elm$bytes$Bytes$Decode$Loop(
								_Utils_update(
									state,
									{dn: (state.dn - usedBytes) - n}));
						},
						$eriktim$elm_protocol_buffers$Protobuf$Decode$unknownFieldDecoder(wireType));
				}
			},
			$eriktim$elm_protocol_buffers$Protobuf$Decode$tagDecoder);
	});
var $eriktim$elm_protocol_buffers$Protobuf$Decode$message = F2(
	function (v, fieldDecoders) {
		var _v0 = A2(
			$elm$core$Tuple$mapSecond,
			$elm$core$Dict$fromList,
			A2(
				$elm$core$Tuple$mapFirst,
				$elm$core$Set$fromList,
				A3(
					$elm$core$List$foldr,
					F2(
						function (_v1, _v2) {
							var isRequired = _v1.a;
							var items = _v1.b;
							var numbers = _v2.a;
							var decoders = _v2.b;
							var numbers_ = isRequired ? _Utils_ap(
								numbers,
								A2($elm$core$List$map, $elm$core$Tuple$first, items)) : numbers;
							return _Utils_Tuple2(
								numbers_,
								_Utils_ap(items, decoders));
						}),
					_Utils_Tuple2(_List_Nil, _List_Nil),
					fieldDecoders)));
		var requiredSet = _v0.a;
		var dict = _v0.b;
		return function (wireType) {
			if (wireType.$ === 2) {
				var width = wireType.a;
				return A2(
					$elm$bytes$Bytes$Decode$loop,
					{nJ: dict, uQ: v, kQ: requiredSet, dn: width},
					$eriktim$elm_protocol_buffers$Protobuf$Decode$stepMessage(width));
			} else {
				return $elm$bytes$Bytes$Decode$fail;
			}
		};
	});
var $eriktim$elm_protocol_buffers$Protobuf$Decode$FieldDecoder = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $eriktim$elm_protocol_buffers$Protobuf$Decode$map = F2(
	function (fn, _v0) {
		var decoder = _v0;
		return function (wireType) {
			return A2(
				$elm$bytes$Bytes$Decode$map,
				$elm$core$Tuple$mapSecond(fn),
				decoder(wireType));
		};
	});
var $eriktim$elm_protocol_buffers$Protobuf$Decode$optional = F3(
	function (fieldNumber, decoder, set) {
		return A2(
			$eriktim$elm_protocol_buffers$Protobuf$Decode$FieldDecoder,
			false,
			_List_fromArray(
				[
					_Utils_Tuple2(
					fieldNumber,
					A2($eriktim$elm_protocol_buffers$Protobuf$Decode$map, set, decoder))
				]));
	});
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $eriktim$elm_protocol_buffers$Protobuf$Decode$lengthDelimitedDecoder = function (decoder) {
	return function (wireType) {
		if (wireType.$ === 2) {
			var width = wireType.a;
			return A2(
				$elm$bytes$Bytes$Decode$map,
				$elm$core$Tuple$pair(width),
				decoder(width));
		} else {
			return $elm$bytes$Bytes$Decode$fail;
		}
	};
};
var $elm$bytes$Bytes$Decode$string = function (n) {
	return _Bytes_read_string(n);
};
var $eriktim$elm_protocol_buffers$Protobuf$Decode$string = $eriktim$elm_protocol_buffers$Protobuf$Decode$lengthDelimitedDecoder($elm$bytes$Bytes$Decode$string);
var $author$project$Proto$Io$Haveno$Protobuffer$Internals_$decodeProto__Io__Haveno__Protobuffer__GetVersionReply = A2(
	$eriktim$elm_protocol_buffers$Protobuf$Decode$message,
	$author$project$Proto$Io$Haveno$Protobuffer$Internals_$defaultProto__Io__Haveno__Protobuffer__GetVersionReply,
	_List_fromArray(
		[
			A3(
			$eriktim$elm_protocol_buffers$Protobuf$Decode$optional,
			1,
			$eriktim$elm_protocol_buffers$Protobuf$Decode$string,
			F2(
				function (a, r) {
					return _Utils_update(
						r,
						{ez: a});
				}))
		]));
var $author$project$Proto$Io$Haveno$Protobuffer$decodeGetVersionReply = $author$project$Proto$Io$Haveno$Protobuffer$Internals_$decodeProto__Io__Haveno__Protobuffer__GetVersionReply;
var $eriktim$elm_protocol_buffers$Protobuf$Encode$Encoder = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$bytes$Bytes$Encode$Seq = F2(
	function (a, b) {
		return {$: 8, a: a, b: b};
	});
var $elm$bytes$Bytes$Encode$getWidths = F2(
	function (width, builders) {
		getWidths:
		while (true) {
			if (!builders.b) {
				return width;
			} else {
				var b = builders.a;
				var bs = builders.b;
				var $temp$width = width + $elm$bytes$Bytes$Encode$getWidth(b),
					$temp$builders = bs;
				width = $temp$width;
				builders = $temp$builders;
				continue getWidths;
			}
		}
	});
var $elm$bytes$Bytes$Encode$sequence = function (builders) {
	return A2(
		$elm$bytes$Bytes$Encode$Seq,
		A2($elm$bytes$Bytes$Encode$getWidths, 0, builders),
		builders);
};
var $elm$core$List$sum = function (numbers) {
	return A3($elm$core$List$foldl, $elm$core$Basics$add, 0, numbers);
};
var $eriktim$elm_protocol_buffers$Protobuf$Encode$sequence = function (items) {
	var width = $elm$core$List$sum(
		A2($elm$core$List$map, $elm$core$Tuple$first, items));
	return _Utils_Tuple2(
		width,
		$elm$bytes$Bytes$Encode$sequence(
			A2($elm$core$List$map, $elm$core$Tuple$second, items)));
};
var $elm$core$List$sortBy = _List_sortBy;
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$core$Bitwise$or = _Bitwise_or;
var $elm$bytes$Bytes$Encode$U8 = function (a) {
	return {$: 3, a: a};
};
var $elm$bytes$Bytes$Encode$unsignedInt8 = $elm$bytes$Bytes$Encode$U8;
var $eriktim$elm_protocol_buffers$Protobuf$Encode$toVarIntEncoders = F2(
	function (config, value) {
		var _v0 = config.vi(value);
		var base128 = _v0.a;
		var higherBits = _v0.b;
		return _Utils_eq(
			higherBits,
			config.tU(0)) ? _List_fromArray(
			[
				$elm$bytes$Bytes$Encode$unsignedInt8(base128)
			]) : A2(
			$elm$core$List$cons,
			$elm$bytes$Bytes$Encode$unsignedInt8(128 | base128),
			A2($eriktim$elm_protocol_buffers$Protobuf$Encode$toVarIntEncoders, config, higherBits));
	});
var $eriktim$elm_protocol_buffers$Protobuf$Encode$varInt = F2(
	function (config, value) {
		var encoders = A2($eriktim$elm_protocol_buffers$Protobuf$Encode$toVarIntEncoders, config, value);
		return _Utils_Tuple2(
			$elm$core$List$length(encoders),
			$elm$bytes$Bytes$Encode$sequence(encoders));
	});
var $eriktim$elm_protocol_buffers$Protobuf$Encode$varInt32 = $eriktim$elm_protocol_buffers$Protobuf$Encode$varInt($eriktim$elm_protocol_buffers$Internal$Int32$operations);
var $eriktim$elm_protocol_buffers$Protobuf$Encode$tag = F2(
	function (fieldNumber, wireType) {
		var encodeTag = function (base4) {
			return $eriktim$elm_protocol_buffers$Protobuf$Encode$varInt32((fieldNumber << 3) | base4);
		};
		switch (wireType.$) {
			case 0:
				return encodeTag(0);
			case 1:
				return encodeTag(1);
			case 2:
				var width = wireType.a;
				return $eriktim$elm_protocol_buffers$Protobuf$Encode$sequence(
					_List_fromArray(
						[
							encodeTag(2),
							$eriktim$elm_protocol_buffers$Protobuf$Encode$varInt32(width)
						]));
			case 3:
				return encodeTag(3);
			case 4:
				return encodeTag(4);
			default:
				return encodeTag(5);
		}
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (!_v0.$) {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $eriktim$elm_protocol_buffers$Protobuf$Encode$unwrap = function (encoder) {
	if (!encoder.$) {
		var encoder_ = encoder.b;
		return $elm$core$Maybe$Just(encoder_);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $eriktim$elm_protocol_buffers$Protobuf$Encode$toPackedEncoder = function (encoders) {
	if (encoders.b && (!encoders.a.$)) {
		var _v1 = encoders.a;
		var wireType = _v1.a;
		var encoder = _v1.b;
		var others = encoders.b;
		if (wireType.$ === 2) {
			return $elm$core$Maybe$Nothing;
		} else {
			return $elm$core$Maybe$Just(
				$eriktim$elm_protocol_buffers$Protobuf$Encode$sequence(
					A2(
						$elm$core$List$cons,
						encoder,
						A2($elm$core$List$filterMap, $eriktim$elm_protocol_buffers$Protobuf$Encode$unwrap, others))));
		}
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $eriktim$elm_protocol_buffers$Protobuf$Encode$toKeyValuePairEncoder = function (_v0) {
	var fieldNumber = _v0.a;
	var encoder = _v0.b;
	switch (encoder.$) {
		case 0:
			var wireType = encoder.a;
			var encoder_ = encoder.b;
			return $eriktim$elm_protocol_buffers$Protobuf$Encode$sequence(
				_List_fromArray(
					[
						A2($eriktim$elm_protocol_buffers$Protobuf$Encode$tag, fieldNumber, wireType),
						encoder_
					]));
		case 1:
			var encoders = encoder.a;
			var _v2 = $eriktim$elm_protocol_buffers$Protobuf$Encode$toPackedEncoder(encoders);
			if (!_v2.$) {
				var encoder_ = _v2.a;
				return $eriktim$elm_protocol_buffers$Protobuf$Encode$sequence(
					_List_fromArray(
						[
							A2(
							$eriktim$elm_protocol_buffers$Protobuf$Encode$tag,
							fieldNumber,
							$eriktim$elm_protocol_buffers$Internal$Protobuf$LengthDelimited(encoder_.a)),
							encoder_
						]));
			} else {
				return $eriktim$elm_protocol_buffers$Protobuf$Encode$sequence(
					A2(
						$elm$core$List$map,
						A2(
							$elm$core$Basics$composeL,
							$eriktim$elm_protocol_buffers$Protobuf$Encode$toKeyValuePairEncoder,
							$elm$core$Tuple$pair(fieldNumber)),
						encoders));
			}
		default:
			return $eriktim$elm_protocol_buffers$Protobuf$Encode$sequence(_List_Nil);
	}
};
var $eriktim$elm_protocol_buffers$Protobuf$Encode$message = function (items) {
	return function (e) {
		return A2(
			$eriktim$elm_protocol_buffers$Protobuf$Encode$Encoder,
			$eriktim$elm_protocol_buffers$Internal$Protobuf$LengthDelimited(e.a),
			e);
	}(
		$eriktim$elm_protocol_buffers$Protobuf$Encode$sequence(
			A2(
				$elm$core$List$map,
				$eriktim$elm_protocol_buffers$Protobuf$Encode$toKeyValuePairEncoder,
				A2($elm$core$List$sortBy, $elm$core$Tuple$first, items))));
};
var $author$project$Proto$Io$Haveno$Protobuffer$Internals_$encodeProto__Io__Haveno__Protobuffer__GetVersionRequest = function (_v0) {
	return $eriktim$elm_protocol_buffers$Protobuf$Encode$message(_List_Nil);
};
var $author$project$Proto$Io$Haveno$Protobuffer$encodeGetVersionRequest = $author$project$Proto$Io$Haveno$Protobuffer$Internals_$encodeProto__Io__Haveno__Protobuffer__GetVersionRequest;
var $author$project$Proto$Io$Haveno$Protobuffer$GetVersion$getVersion = {tu: $author$project$Proto$Io$Haveno$Protobuffer$decodeGetVersionReply, tJ: $author$project$Proto$Io$Haveno$Protobuffer$encodeGetVersionRequest, vc: 'io.haveno.protobuffer', vF: 'GetVersion', vR: 'GetVersion'};
var $anmolitor$elm_grpc$Grpc$grpcContentType = 'application/grpc-web+proto';
var $anmolitor$elm_grpc$Grpc$new = F2(
	function (rpc, req) {
		return {
			sV: req,
			t7: _List_fromArray(
				[
					A2($elm$http$Http$header, 'accept', $anmolitor$elm_grpc$Grpc$grpcContentType)
				]),
			fr: '',
			nk: false,
			kY: rpc,
			wo: $elm$core$Maybe$Nothing,
			wu: $elm$core$Maybe$Nothing
		};
	});
var $anmolitor$elm_grpc$Grpc$setHost = F2(
	function (host, _v0) {
		var req = _v0;
		return _Utils_update(
			req,
			{fr: host});
	});
var $elm$http$Http$bytesBody = _Http_pair;
var $elm$bytes$Bytes$Encode$Bytes = function (a) {
	return {$: 10, a: a};
};
var $elm$bytes$Bytes$Encode$bytes = $elm$bytes$Bytes$Encode$Bytes;
var $elm$bytes$Bytes$Encode$encode = _Bytes_encode;
var $eriktim$elm_protocol_buffers$Protobuf$Encode$encode = function (encoder) {
	switch (encoder.$) {
		case 0:
			var _v1 = encoder.b;
			var encoder_ = _v1.b;
			return $elm$bytes$Bytes$Encode$encode(encoder_);
		case 1:
			var encoders = encoder.a;
			return $elm$bytes$Bytes$Encode$encode(
				$elm$bytes$Bytes$Encode$sequence(
					A2(
						$elm$core$List$map,
						A2($elm$core$Basics$composeL, $elm$bytes$Bytes$Encode$bytes, $eriktim$elm_protocol_buffers$Protobuf$Encode$encode),
						encoders)));
		default:
			return $elm$bytes$Bytes$Encode$encode(
				$elm$bytes$Bytes$Encode$sequence(_List_Nil));
	}
};
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$http$Http$expectBytesResponse = F2(
	function (toMsg, toResult) {
		return A3(
			_Http_expect,
			'arraybuffer',
			_Http_toDataView,
			A2($elm$core$Basics$composeR, toResult, toMsg));
	});
var $elm$bytes$Bytes$BE = 1;
var $elm$bytes$Bytes$Encode$U32 = F2(
	function (a, b) {
		return {$: 5, a: a, b: b};
	});
var $elm$bytes$Bytes$Encode$unsignedInt32 = $elm$bytes$Bytes$Encode$U32;
var $elm$bytes$Bytes$width = _Bytes_width;
var $anmolitor$elm_grpc$Grpc$requestEncoder = function (message) {
	var messageLength = $elm$bytes$Bytes$width(message);
	return $elm$bytes$Bytes$Encode$sequence(
		_List_fromArray(
			[
				$elm$bytes$Bytes$Encode$unsignedInt8(0),
				A2($elm$bytes$Bytes$Encode$unsignedInt32, 1, messageLength),
				$elm$bytes$Bytes$Encode$bytes(message)
			]));
};
var $anmolitor$elm_grpc$Grpc$frameRequest = function (binaryData) {
	return $elm$bytes$Bytes$Encode$encode(
		$anmolitor$elm_grpc$Grpc$requestEncoder(binaryData));
};
var $anmolitor$elm_grpc$Grpc$BadBody = function (a) {
	return {$: 4, a: a};
};
var $anmolitor$elm_grpc$Grpc$BadStatus = function (a) {
	return {$: 3, a: a};
};
var $anmolitor$elm_grpc$Grpc$BadUrl = function (a) {
	return {$: 0, a: a};
};
var $anmolitor$elm_grpc$Grpc$NetworkError = {$: 2};
var $anmolitor$elm_grpc$Grpc$Ok_ = 0;
var $anmolitor$elm_grpc$Grpc$Timeout = {$: 1};
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (!maybeValue.$) {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$bytes$Bytes$Decode$decode = F2(
	function (_v0, bs) {
		var decoder = _v0;
		return A2(_Bytes_decode, decoder, bs);
	});
var $eriktim$elm_protocol_buffers$Protobuf$Decode$decode = F2(
	function (_v0, bs) {
		var decoder = _v0;
		var wireType = $eriktim$elm_protocol_buffers$Internal$Protobuf$LengthDelimited(
			$elm$bytes$Bytes$width(bs));
		return A2(
			$elm$core$Maybe$map,
			$elm$core$Tuple$second,
			A2(
				$elm$bytes$Bytes$Decode$decode,
				decoder(wireType),
				bs));
	});
var $anmolitor$elm_grpc$Grpc$Aborted = 10;
var $anmolitor$elm_grpc$Grpc$AlreadyExists = 6;
var $anmolitor$elm_grpc$Grpc$Cancelled = 1;
var $anmolitor$elm_grpc$Grpc$DataLoss = 15;
var $anmolitor$elm_grpc$Grpc$DeadlineExceeded = 4;
var $anmolitor$elm_grpc$Grpc$FailedPrecondition = 9;
var $anmolitor$elm_grpc$Grpc$Internal = 13;
var $anmolitor$elm_grpc$Grpc$InvalidArgument = 3;
var $anmolitor$elm_grpc$Grpc$NotFound = 5;
var $anmolitor$elm_grpc$Grpc$OutOfRange = 11;
var $anmolitor$elm_grpc$Grpc$PermissionDenied = 7;
var $anmolitor$elm_grpc$Grpc$ResourceExhausted = 8;
var $anmolitor$elm_grpc$Grpc$Unauthenticated = 16;
var $anmolitor$elm_grpc$Grpc$Unavailable = 14;
var $anmolitor$elm_grpc$Grpc$Unimplemented = 12;
var $anmolitor$elm_grpc$Grpc$Unknown = 2;
var $anmolitor$elm_grpc$Grpc$errCodeFromInt = function (n) {
	switch (n) {
		case 0:
			return $elm$core$Maybe$Just(0);
		case 1:
			return $elm$core$Maybe$Just(1);
		case 2:
			return $elm$core$Maybe$Just(2);
		case 3:
			return $elm$core$Maybe$Just(3);
		case 4:
			return $elm$core$Maybe$Just(4);
		case 5:
			return $elm$core$Maybe$Just(5);
		case 6:
			return $elm$core$Maybe$Just(6);
		case 7:
			return $elm$core$Maybe$Just(7);
		case 8:
			return $elm$core$Maybe$Just(8);
		case 9:
			return $elm$core$Maybe$Just(9);
		case 10:
			return $elm$core$Maybe$Just(10);
		case 11:
			return $elm$core$Maybe$Just(11);
		case 12:
			return $elm$core$Maybe$Just(12);
		case 13:
			return $elm$core$Maybe$Just(13);
		case 14:
			return $elm$core$Maybe$Just(14);
		case 15:
			return $elm$core$Maybe$Just(15);
		case 16:
			return $elm$core$Maybe$Just(16);
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$Result$fromMaybe = F2(
	function (err, maybe) {
		if (!maybe.$) {
			var v = maybe.a;
			return $elm$core$Result$Ok(v);
		} else {
			return $elm$core$Result$Err(err);
		}
	});
var $anmolitor$elm_grpc$Grpc$httpBadStatusToGrpcStatus = function (statusCode) {
	switch (statusCode) {
		case 400:
			return 13;
		case 401:
			return 16;
		case 403:
			return 7;
		case 404:
			return 12;
		case 429:
			return 14;
		case 502:
			return 14;
		case 503:
			return 14;
		case 504:
			return 14;
		default:
			return 2;
	}
};
var $anmolitor$elm_grpc$Grpc$Response = function (message) {
	return {uL: message};
};
var $elm$bytes$Bytes$Decode$map2 = F3(
	function (func, _v0, _v1) {
		var decodeA = _v0;
		var decodeB = _v1;
		return F2(
			function (bites, offset) {
				var _v2 = A2(decodeA, bites, offset);
				var aOffset = _v2.a;
				var a = _v2.b;
				var _v3 = A2(decodeB, bites, aOffset);
				var bOffset = _v3.a;
				var b = _v3.b;
				return _Utils_Tuple2(
					bOffset,
					A2(func, a, b));
			});
	});
var $elm$bytes$Bytes$Decode$unsignedInt32 = function (endianness) {
	return _Bytes_read_u32(!endianness);
};
var $anmolitor$elm_grpc$Grpc$responseDecoder = A3(
	$elm$bytes$Bytes$Decode$map2,
	function (_v0) {
		return $anmolitor$elm_grpc$Grpc$Response;
	},
	$elm$bytes$Bytes$Decode$bytes(1),
	A2(
		$elm$bytes$Bytes$Decode$andThen,
		$elm$bytes$Bytes$Decode$bytes,
		$elm$bytes$Bytes$Decode$unsignedInt32(1)));
var $anmolitor$elm_grpc$Grpc$handleResponse = F2(
	function (decoder, httpResponse) {
		var parseResponse = F3(
			function (isGoodStatus, metadata, bytes) {
				var defaultGrpcStatus = isGoodStatus ? 0 : $anmolitor$elm_grpc$Grpc$httpBadStatusToGrpcStatus(metadata.v0);
				var grpcStatus = A2(
					$elm$core$Maybe$withDefault,
					defaultGrpcStatus,
					A2(
						$elm$core$Maybe$andThen,
						$anmolitor$elm_grpc$Grpc$errCodeFromInt,
						A2(
							$elm$core$Maybe$andThen,
							$elm$core$String$toInt,
							A2($elm$core$Dict$get, 'grpc-status', metadata.t7))));
				if (!grpcStatus) {
					return A2(
						$elm$core$Result$fromMaybe,
						$anmolitor$elm_grpc$Grpc$BadBody(bytes),
						A2(
							$elm$core$Maybe$andThen,
							function (response) {
								return A2($eriktim$elm_protocol_buffers$Protobuf$Decode$decode, decoder, response.uL);
							},
							A2($elm$bytes$Bytes$Decode$decode, $anmolitor$elm_grpc$Grpc$responseDecoder, bytes)));
				} else {
					var errMessage = A2(
						$elm$core$Maybe$withDefault,
						metadata.v1,
						A2($elm$core$Dict$get, 'grpc-message', metadata.t7));
					return $elm$core$Result$Err(
						$anmolitor$elm_grpc$Grpc$BadStatus(
							{tK: errMessage, cz: metadata, vy: bytes, rL: grpcStatus}));
				}
			});
		switch (httpResponse.$) {
			case 4:
				var metadata = httpResponse.a;
				var bytes = httpResponse.b;
				return A3(parseResponse, true, metadata, bytes);
			case 0:
				var badUrl = httpResponse.a;
				return $elm$core$Result$Err(
					$anmolitor$elm_grpc$Grpc$BadUrl(badUrl));
			case 1:
				return $elm$core$Result$Err($anmolitor$elm_grpc$Grpc$Timeout);
			case 2:
				return $elm$core$Result$Err($anmolitor$elm_grpc$Grpc$NetworkError);
			default:
				var metadata = httpResponse.a;
				var bytes = httpResponse.b;
				return A3(parseResponse, false, metadata, bytes);
		}
	});
var $elm$http$Http$Request = function (a) {
	return {$: 1, a: a};
};
var $elm$http$Http$State = F2(
	function (reqs, subs) {
		return {rc: reqs, rQ: subs};
	});
var $elm$http$Http$init = $elm$core$Task$succeed(
	A2($elm$http$Http$State, $elm$core$Dict$empty, _List_Nil));
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$http$Http$updateReqs = F3(
	function (router, cmds, reqs) {
		updateReqs:
		while (true) {
			if (!cmds.b) {
				return $elm$core$Task$succeed(reqs);
			} else {
				var cmd = cmds.a;
				var otherCmds = cmds.b;
				if (!cmd.$) {
					var tracker = cmd.a;
					var _v2 = A2($elm$core$Dict$get, tracker, reqs);
					if (_v2.$ === 1) {
						var $temp$router = router,
							$temp$cmds = otherCmds,
							$temp$reqs = reqs;
						router = $temp$router;
						cmds = $temp$cmds;
						reqs = $temp$reqs;
						continue updateReqs;
					} else {
						var pid = _v2.a;
						return A2(
							$elm$core$Task$andThen,
							function (_v3) {
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A2($elm$core$Dict$remove, tracker, reqs));
							},
							$elm$core$Process$kill(pid));
					}
				} else {
					var req = cmd.a;
					return A2(
						$elm$core$Task$andThen,
						function (pid) {
							var _v4 = req.wu;
							if (_v4.$ === 1) {
								return A3($elm$http$Http$updateReqs, router, otherCmds, reqs);
							} else {
								var tracker = _v4.a;
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A3($elm$core$Dict$insert, tracker, pid, reqs));
							}
						},
						$elm$core$Process$spawn(
							A3(
								_Http_toTask,
								router,
								$elm$core$Platform$sendToApp(router),
								req)));
				}
			}
		}
	});
var $elm$http$Http$onEffects = F4(
	function (router, cmds, subs, state) {
		return A2(
			$elm$core$Task$andThen,
			function (reqs) {
				return $elm$core$Task$succeed(
					A2($elm$http$Http$State, reqs, subs));
			},
			A3($elm$http$Http$updateReqs, router, cmds, state.rc));
	});
var $elm$http$Http$maybeSend = F4(
	function (router, desiredTracker, progress, _v0) {
		var actualTracker = _v0.a;
		var toMsg = _v0.b;
		return _Utils_eq(desiredTracker, actualTracker) ? $elm$core$Maybe$Just(
			A2(
				$elm$core$Platform$sendToApp,
				router,
				toMsg(progress))) : $elm$core$Maybe$Nothing;
	});
var $elm$http$Http$onSelfMsg = F3(
	function (router, _v0, state) {
		var tracker = _v0.a;
		var progress = _v0.b;
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$filterMap,
					A3($elm$http$Http$maybeSend, router, tracker, progress),
					state.rQ)));
	});
var $elm$http$Http$Cancel = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$cmdMap = F2(
	function (func, cmd) {
		if (!cmd.$) {
			var tracker = cmd.a;
			return $elm$http$Http$Cancel(tracker);
		} else {
			var r = cmd.a;
			return $elm$http$Http$Request(
				{
					sF: r.sF,
					sV: r.sV,
					m2: A2(_Http_mapExpect, func, r.m2),
					t7: r.t7,
					uM: r.uM,
					wo: r.wo,
					wu: r.wu,
					bF: r.bF
				});
		}
	});
var $elm$http$Http$MySub = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$http$Http$subMap = F2(
	function (func, _v0) {
		var tracker = _v0.a;
		var toMsg = _v0.b;
		return A2(
			$elm$http$Http$MySub,
			tracker,
			A2($elm$core$Basics$composeR, toMsg, func));
	});
_Platform_effectManagers['Http'] = _Platform_createManager($elm$http$Http$init, $elm$http$Http$onEffects, $elm$http$Http$onSelfMsg, $elm$http$Http$cmdMap, $elm$http$Http$subMap);
var $elm$http$Http$command = _Platform_leaf('Http');
var $elm$http$Http$subscription = _Platform_leaf('Http');
var $elm$http$Http$request = function (r) {
	return $elm$http$Http$command(
		$elm$http$Http$Request(
			{sF: false, sV: r.sV, m2: r.m2, t7: r.t7, uM: r.uM, wo: r.wo, wu: r.wu, bF: r.bF}));
};
var $elm$http$Http$riskyRequest = function (r) {
	return $elm$http$Http$command(
		$elm$http$Http$Request(
			{sF: true, sV: r.sV, m2: r.m2, t7: r.t7, uM: r.uM, wo: r.wo, wu: r.wu, bF: r.bF}));
};
var $anmolitor$elm_grpc$Grpc$rpcPath = function (_v0) {
	var service = _v0.vR;
	var _package = _v0.vc;
	var rpcName = _v0.vF;
	return '/' + (($elm$core$String$isEmpty(_package) ? '' : (_package + '.')) + (service + ('/' + rpcName)));
};
var $anmolitor$elm_grpc$Grpc$toCmd = F2(
	function (expect, _v0) {
		var req = _v0;
		var toHttpRequest = req.nk ? $elm$http$Http$riskyRequest : $elm$http$Http$request;
		var _v1 = req.kY;
		var rpc = _v1;
		var body = A2(
			$elm$http$Http$bytesBody,
			$anmolitor$elm_grpc$Grpc$grpcContentType,
			$anmolitor$elm_grpc$Grpc$frameRequest(
				$eriktim$elm_protocol_buffers$Protobuf$Encode$encode(
					rpc.tJ(req.sV))));
		return toHttpRequest(
			{
				sV: body,
				m2: A2(
					$elm$http$Http$expectBytesResponse,
					expect,
					$anmolitor$elm_grpc$Grpc$handleResponse(rpc.tu)),
				t7: req.t7,
				uM: 'POST',
				wo: req.wo,
				wu: req.wu,
				bF: _Utils_ap(
					req.fr,
					$anmolitor$elm_grpc$Grpc$rpcPath(req.kY))
			});
	});
var $author$project$Pages$Dashboard$sendVersionRequest = function (request) {
	var grpcRequest = A2(
		$anmolitor$elm_grpc$Grpc$setHost,
		'http://localhost:8080',
		A3(
			$anmolitor$elm_grpc$Grpc$addHeader,
			'password',
			'apitest',
			A2($anmolitor$elm_grpc$Grpc$new, $author$project$Proto$Io$Haveno$Protobuffer$GetVersion$getVersion, request)));
	return A2($anmolitor$elm_grpc$Grpc$toCmd, $author$project$Pages$Dashboard$GotVersion, grpcRequest);
};
var $author$project$Pages$Dashboard$init = function (fromMainToDashboard) {
	var newModel = A8(
		$author$project$Pages$Dashboard$Model,
		0,
		'Haveno-Web Dashboard',
		{fR: 'Loading...'},
		'0.00',
		fromMainToDashboard.iI,
		$elm$core$Maybe$Just(
			A6($author$project$Pages$Dashboard$HavenoAPKHttpRequest, $author$project$Extras$Constants$post, _List_Nil, '', $elm$http$Http$emptyBody, $elm$core$Maybe$Nothing, $elm$core$Maybe$Nothing)),
		$elm$core$Maybe$Nothing,
		_List_Nil);
	var devOrProdServer = A2($elm$core$String$contains, $author$project$Extras$Constants$localorproductionServerAutoCheck, fromMainToDashboard.iI.fr) ? A6($elm$url$Url$Url, fromMainToDashboard.iI.ni, fromMainToDashboard.iI.fr, $elm$core$Maybe$Nothing, $author$project$Extras$Constants$productionProxyConfig, $elm$core$Maybe$Nothing, $elm$core$Maybe$Nothing) : A6(
		$elm$url$Url$Url,
		fromMainToDashboard.iI.ni,
		fromMainToDashboard.iI.fr,
		$elm$core$Maybe$Just(3000),
		$author$project$Extras$Constants$middleWarePath,
		$elm$core$Maybe$Nothing,
		$elm$core$Maybe$Nothing);
	return _Utils_Tuple2(
		newModel,
		$author$project$Pages$Dashboard$sendVersionRequest(
			{}));
};
var $author$project$Pages$Funds$Funds = $elm$core$Basics$identity;
var $author$project$Pages$Funds$Loading = 0;
var $author$project$Pages$Funds$initialModel = {
	rh: {fR: 'Loading...'},
	rL: 0,
	wp: 'Funds'
};
var $author$project$Pages$Funds$init = function (_v0) {
	return _Utils_Tuple2(
		_Utils_update(
			$author$project$Pages$Funds$initialModel,
			{wp: 'Haveno-Web Funds'}),
		$elm$core$Platform$Cmd$none);
};
var $author$project$Pages$Hardware$Hardware = $elm$core$Basics$identity;
var $author$project$Pages$Hardware$Loaded = 1;
var $author$project$Pages$Hardware$Login = function (a) {
	return {$: 1, a: a};
};
var $author$project$Pages$Hardware$Model = function (status) {
	return function (title) {
		return function (root) {
			return function (flagUrl) {
				return function (datetimeFromMain) {
					return function (humanDateTime) {
						return function (posixTmes) {
							return function (apiSpecifics) {
								return function (queryType) {
									return function (toMongoDBMWConfig) {
										return function (isValidNewAccessToken) {
											return function (isValidBookingResponse) {
												return function (errors) {
													return function (availableSlots) {
														return function (isWaitingForResponse) {
															return function (isReturnUser) {
																return function (emailpassword) {
																	return function (selectedranking) {
																		return function (selectedSingleRank) {
																			return function (user) {
																				return function (result) {
																					return function (searchterm) {
																						return function (searchResults) {
																							return function (objectJSONfromJSPort) {
																								return {at: apiSpecifics, sK: availableSlots, nG: datetimeFromMain, dJ: emailpassword, d$: errors, iI: flagUrl, uf: humanDateTime, nW: isReturnUser, uz: isValidBookingResponse, d8: isValidNewAccessToken, m9: isWaitingForResponse, qC: objectJSONfromJSPort, vj: posixTmes, bJ: queryType, vz: result, rh: root, vL: searchResults, vN: searchterm, oa: selectedSingleRank, er: selectedranking, rL: status, wp: title, gN: toMongoDBMWConfig, dl: user};
																							};
																						};
																					};
																				};
																			};
																		};
																	};
																};
															};
														};
													};
												};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $author$project$Data$Ranking$None = {$: 3};
var $author$project$Pages$Hardware$ToMongoDBMWConfig = F6(
	function (method, headers, url, body, timeout, tracker) {
		return {sV: body, t7: headers, uM: method, wo: timeout, wu: tracker, bF: url};
	});
var $author$project$Data$Ranking$Undecided = 2;
var $author$project$Pages$Hardware$ApiSpecifics = F2(
	function (maxResults, accessToken) {
		return {dR: accessToken, uI: maxResults};
	});
var $author$project$Pages$Hardware$apiSpecsPlaceHolder = A2($author$project$Pages$Hardware$ApiSpecifics, '', $elm$core$Maybe$Nothing);
var $author$project$Extras$Constants$emptyEmailPassword = {nN: '', n4: ''};
var $author$project$Data$Ranking$emptyRank = {
	an: {A: 'String', dw: 'String'},
	aB: {A: 'String', dw: 'String'},
	bC: 0
};
var $author$project$Data$User$Spectator = function (a) {
	return {$: 0, a: a};
};
var $author$project$Data$User$Male = 0;
var $author$project$Data$User$UserInfo = function (userid) {
	return function (password) {
		return function (passwordValidationError) {
			return function (token) {
				return function (nickname) {
					return function (isNameInputFocused) {
						return function (nameValidationError) {
							return function (age) {
								return function (gender) {
									return function (email) {
										return function (isEmailInputFocused) {
											return function (emailValidationError) {
												return function (mobile) {
													return function (isMobileInputFocused) {
														return function (mobileValidationError) {
															return function (datestamp) {
																return function (active) {
																	return function (ownedRankings) {
																		return function (memberRankings) {
																			return function (updatetext) {
																				return function (description) {
																					return function (credits) {
																						return function (addInfo) {
																							return {mO: active, st: addInfo, sw: age, tn: credits, tt: datestamp, dY: description, nN: email, tI: emailValidationError, tZ: gender, uw: isEmailInputFocused, ux: isMobileInputFocused, uy: isNameInputFocused, ea: memberRankings, n_: mobile, uO: mobileValidationError, uT: nameValidationError, dw: nickname, dK: ownedRankings, n4: password, ve: passwordValidationError, ws: token, wy: updatetext, r9: userid};
																						};
																					};
																				};
																			};
																		};
																	};
																};
															};
														};
													};
												};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $author$project$Data$User$emptyDescription = {nF: '', nX: ''};
var $author$project$Data$User$emptyUserInfo = $author$project$Data$User$UserInfo('')('')('')($elm$core$Maybe$Nothing)('')(false)('')(40)(0)($elm$core$Maybe$Nothing)(false)('')($elm$core$Maybe$Nothing)(false)('')(0)(false)(_List_Nil)(_List_Nil)('')($author$project$Data$User$emptyDescription)(0)('');
var $author$project$Data$User$emptySpectator = $author$project$Data$User$Spectator($author$project$Data$User$emptyUserInfo);
var $AdrianRibao$elm_derberos_date$Derberos$Date$Core$DateRecord = F8(
	function (year, month, day, hour, minute, second, millis, zone) {
		return {m0: day, ub: hour, nd: millis, ne: minute, nf: month, no: second, ol: year, nz: zone};
	});
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$utc = A2($elm$time$Time$Zone, 0, _List_Nil);
var $author$project$Pages$Hardware$humandateTimePlaceholder = A8($AdrianRibao$elm_derberos_date$Derberos$Date$Core$DateRecord, 0, 0, 0, 0, 0, 0, 0, $elm$time$Time$utc);
var $author$project$Pages$Hardware$init = function (fromMainToRankings) {
	var updatedFlagUrlToIncludeMongoDBMWSvr = A2($elm$core$String$contains, $author$project$Extras$Constants$localorproductionServerAutoCheck, fromMainToRankings.iI.fr) ? A6($elm$url$Url$Url, fromMainToRankings.iI.ni, fromMainToRankings.iI.fr, $elm$core$Maybe$Nothing, $author$project$Extras$Constants$productionProxyConfig, $elm$core$Maybe$Nothing, $elm$core$Maybe$Nothing) : A6(
		$elm$url$Url$Url,
		fromMainToRankings.iI.ni,
		fromMainToRankings.iI.fr,
		$elm$core$Maybe$Just(3000),
		$author$project$Extras$Constants$middleWarePath,
		$elm$core$Maybe$Nothing,
		$elm$core$Maybe$Nothing);
	return _Utils_Tuple2(
		$author$project$Pages$Hardware$Model(1)('Hardware')(
			{fR: 'Loading...'})(fromMainToRankings.iI)(
			A2(
				$elm$core$Maybe$withDefault,
				$elm$core$Maybe$Nothing,
				$elm$core$Maybe$Just(fromMainToRankings.dE)))($author$project$Pages$Hardware$humandateTimePlaceholder)(_List_Nil)($author$project$Pages$Hardware$apiSpecsPlaceHolder)(
			$author$project$Pages$Hardware$Login($author$project$Extras$Constants$emptyEmailPassword))(
			$elm$core$Maybe$Just(
				A6(
					$author$project$Pages$Hardware$ToMongoDBMWConfig,
					$author$project$Extras$Constants$post,
					_List_Nil,
					$elm$url$Url$toString(updatedFlagUrlToIncludeMongoDBMWSvr),
					$elm$http$Http$emptyBody,
					$elm$core$Maybe$Nothing,
					$elm$core$Maybe$Nothing)))(false)(false)(
			_List_fromArray(
				['']))(
			_List_fromArray(
				[$elm$core$Maybe$Nothing]))(false)(false)(
			{nN: '', n4: ''})($author$project$Data$Ranking$None)($author$project$Data$Ranking$emptyRank)($author$project$Data$User$emptySpectator)(2)('')(_List_Nil)($elm$core$Maybe$Nothing),
		$elm$core$Platform$Cmd$none);
};
var $author$project$Pages$Market$Loading = 0;
var $author$project$Pages$Market$Market = $elm$core$Basics$identity;
var $author$project$Pages$Market$initialModel = {
	rh: {fR: 'Loading...'},
	rL: 0,
	wp: 'Market'
};
var $author$project$Pages$Market$init = function (_v0) {
	return _Utils_Tuple2(
		_Utils_update(
			$author$project$Pages$Market$initialModel,
			{wp: 'Haveno-Web Market'}),
		$elm$core$Platform$Cmd$none);
};
var $author$project$Pages$PingPong$Loading = 0;
var $author$project$Pages$PingPong$PingPong = $elm$core$Basics$identity;
var $author$project$Pages$PingPong$initialModel = {
	rh: {fR: 'Ready...'},
	rL: 0,
	wp: 'PingPong'
};
var $author$project$Pages$PingPong$init = function (_v0) {
	return _Utils_Tuple2(
		_Utils_update(
			$author$project$Pages$PingPong$initialModel,
			{wp: 'Haveno-Web Buy'}),
		$elm$core$Platform$Cmd$none);
};
var $author$project$Pages$Portfolio$Loading = 0;
var $author$project$Pages$Portfolio$Portfolio = $elm$core$Basics$identity;
var $author$project$Pages$Portfolio$initialModel = {
	rh: {fR: 'Loading...'},
	rL: 0,
	wp: 'Portfolio'
};
var $author$project$Pages$Portfolio$init = function (_v0) {
	return _Utils_Tuple2(
		_Utils_update(
			$author$project$Pages$Portfolio$initialModel,
			{wp: 'Haveno-Web Portfolio'}),
		$elm$core$Platform$Cmd$none);
};
var $author$project$Pages$Sell$Loading = 0;
var $author$project$Pages$Sell$Sell = $elm$core$Basics$identity;
var $author$project$Pages$Sell$initialModel = {
	rh: {fR: 'Loading...'},
	rL: 0,
	wp: 'Sell'
};
var $author$project$Pages$Sell$init = function (_v0) {
	return _Utils_Tuple2(
		_Utils_update(
			$author$project$Pages$Sell$initialModel,
			{wp: 'Haveno-Web Sell'}),
		$elm$core$Platform$Cmd$none);
};
var $author$project$Pages$Support$Loading = 0;
var $author$project$Pages$Support$Support = $elm$core$Basics$identity;
var $author$project$Pages$Support$initialModel = {
	rh: {fR: 'Loading...'},
	rL: 0,
	wp: 'Support'
};
var $author$project$Pages$Support$init = function (_v0) {
	return _Utils_Tuple2(
		_Utils_update(
			$author$project$Pages$Support$initialModel,
			{wp: 'Haveno-Web Support'}),
		$elm$core$Platform$Cmd$none);
};
var $elm$url$Url$Parser$State = F5(
	function (visited, unvisited, params, frag, value) {
		return {d5: frag, ei: params, dQ: unvisited, al: value, eA: visited};
	});
var $elm$url$Url$Parser$getFirstMatch = function (states) {
	getFirstMatch:
	while (true) {
		if (!states.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var state = states.a;
			var rest = states.b;
			var _v1 = state.dQ;
			if (!_v1.b) {
				return $elm$core$Maybe$Just(state.al);
			} else {
				if ((_v1.a === '') && (!_v1.b.b)) {
					return $elm$core$Maybe$Just(state.al);
				} else {
					var $temp$states = rest;
					states = $temp$states;
					continue getFirstMatch;
				}
			}
		}
	}
};
var $elm$url$Url$Parser$removeFinalEmpty = function (segments) {
	if (!segments.b) {
		return _List_Nil;
	} else {
		if ((segments.a === '') && (!segments.b.b)) {
			return _List_Nil;
		} else {
			var segment = segments.a;
			var rest = segments.b;
			return A2(
				$elm$core$List$cons,
				segment,
				$elm$url$Url$Parser$removeFinalEmpty(rest));
		}
	}
};
var $elm$url$Url$Parser$preparePath = function (path) {
	var _v0 = A2($elm$core$String$split, '/', path);
	if (_v0.b && (_v0.a === '')) {
		var segments = _v0.b;
		return $elm$url$Url$Parser$removeFinalEmpty(segments);
	} else {
		var segments = _v0;
		return $elm$url$Url$Parser$removeFinalEmpty(segments);
	}
};
var $elm$url$Url$Parser$addToParametersHelp = F2(
	function (value, maybeList) {
		if (maybeList.$ === 1) {
			return $elm$core$Maybe$Just(
				_List_fromArray(
					[value]));
		} else {
			var list = maybeList.a;
			return $elm$core$Maybe$Just(
				A2($elm$core$List$cons, value, list));
		}
	});
var $elm$url$Url$Parser$addParam = F2(
	function (segment, dict) {
		var _v0 = A2($elm$core$String$split, '=', segment);
		if ((_v0.b && _v0.b.b) && (!_v0.b.b.b)) {
			var rawKey = _v0.a;
			var _v1 = _v0.b;
			var rawValue = _v1.a;
			var _v2 = $elm$url$Url$percentDecode(rawKey);
			if (_v2.$ === 1) {
				return dict;
			} else {
				var key = _v2.a;
				var _v3 = $elm$url$Url$percentDecode(rawValue);
				if (_v3.$ === 1) {
					return dict;
				} else {
					var value = _v3.a;
					return A3(
						$elm$core$Dict$update,
						key,
						$elm$url$Url$Parser$addToParametersHelp(value),
						dict);
				}
			}
		} else {
			return dict;
		}
	});
var $elm$url$Url$Parser$prepareQuery = function (maybeQuery) {
	if (maybeQuery.$ === 1) {
		return $elm$core$Dict$empty;
	} else {
		var qry = maybeQuery.a;
		return A3(
			$elm$core$List$foldr,
			$elm$url$Url$Parser$addParam,
			$elm$core$Dict$empty,
			A2($elm$core$String$split, '&', qry));
	}
};
var $elm$url$Url$Parser$parse = F2(
	function (_v0, url) {
		var parser = _v0;
		return $elm$url$Url$Parser$getFirstMatch(
			parser(
				A5(
					$elm$url$Url$Parser$State,
					_List_Nil,
					$elm$url$Url$Parser$preparePath(url.f3),
					$elm$url$Url$Parser$prepareQuery(url.vp),
					url.tT,
					$elm$core$Basics$identity)));
	});
var $author$project$Main$AdjustTimeZone = function (a) {
	return {$: 12, a: a};
};
var $author$project$Main$DashboardPage = function (a) {
	return {$: 0, a: a};
};
var $author$project$Main$GotDashboardMsg = function (a) {
	return {$: 1, a: a};
};
var $elm$time$Time$Name = function (a) {
	return {$: 0, a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 1, a: a};
};
var $elm$time$Time$customZone = $elm$time$Time$Zone;
var $elm$time$Time$here = _Time_here(0);
var $elm$core$Platform$Cmd$map = _Platform_map;
var $author$project$Main$toDashboard = F2(
	function (model, _v0) {
		var dashboard = _v0.a;
		var cmd = _v0.b;
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					u: $author$project$Main$DashboardPage(dashboard)
				}),
			$elm$core$Platform$Cmd$batch(
				_List_fromArray(
					[
						A2($elm$core$Platform$Cmd$map, $author$project$Main$GotDashboardMsg, cmd),
						A2($elm$core$Task$perform, $author$project$Main$AdjustTimeZone, $elm$time$Time$here)
					])));
	});
var $author$project$Main$FundsPage = function (a) {
	return {$: 3, a: a};
};
var $author$project$Main$GotFundsMsg = function (a) {
	return {$: 4, a: a};
};
var $author$project$Main$toFunds = F2(
	function (model, _v0) {
		var funds = _v0.a;
		var cmd = _v0.b;
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					u: $author$project$Main$FundsPage(funds)
				}),
			A2($elm$core$Platform$Cmd$map, $author$project$Main$GotFundsMsg, cmd));
	});
var $author$project$Main$GotHardwareMsg = function (a) {
	return {$: 9, a: a};
};
var $author$project$Main$HardwarePage = function (a) {
	return {$: 8, a: a};
};
var $author$project$Main$toHardware = F2(
	function (model, _v0) {
		var hardware = _v0.a;
		var cmd = _v0.b;
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					u: $author$project$Main$HardwarePage(hardware)
				}),
			A2($elm$core$Platform$Cmd$map, $author$project$Main$GotHardwareMsg, cmd));
	});
var $author$project$Main$GotMarketMsg = function (a) {
	return {$: 8, a: a};
};
var $author$project$Main$MarketPage = function (a) {
	return {$: 7, a: a};
};
var $author$project$Main$toMarket = F2(
	function (model, _v0) {
		var market = _v0.a;
		var cmd = _v0.b;
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					u: $author$project$Main$MarketPage(market)
				}),
			A2($elm$core$Platform$Cmd$map, $author$project$Main$GotMarketMsg, cmd));
	});
var $author$project$Main$GotPingPongMsg = function (a) {
	return {$: 6, a: a};
};
var $author$project$Main$PingPongPage = function (a) {
	return {$: 5, a: a};
};
var $author$project$Main$toPingPong = F2(
	function (model, _v0) {
		var pingpong = _v0.a;
		var cmd = _v0.b;
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					u: $author$project$Main$PingPongPage(pingpong)
				}),
			A2($elm$core$Platform$Cmd$map, $author$project$Main$GotPingPongMsg, cmd));
	});
var $author$project$Main$GotPortfolioMsg = function (a) {
	return {$: 3, a: a};
};
var $author$project$Main$PortfolioPage = function (a) {
	return {$: 2, a: a};
};
var $author$project$Main$toPortfolio = F2(
	function (model, _v0) {
		var portfolio = _v0.a;
		var cmd = _v0.b;
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					u: $author$project$Main$PortfolioPage(portfolio)
				}),
			A2($elm$core$Platform$Cmd$map, $author$project$Main$GotPortfolioMsg, cmd));
	});
var $author$project$Main$BuyPage = function (a) {
	return {$: 6, a: a};
};
var $author$project$Main$GotBuyMsg = function (a) {
	return {$: 7, a: a};
};
var $author$project$Main$toPricing = F2(
	function (model, _v0) {
		var pricing = _v0.a;
		var cmd = _v0.b;
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					u: $author$project$Main$BuyPage(pricing)
				}),
			A2($elm$core$Platform$Cmd$map, $author$project$Main$GotBuyMsg, cmd));
	});
var $author$project$Main$GotSellMsg = function (a) {
	return {$: 2, a: a};
};
var $author$project$Main$SellPage = function (a) {
	return {$: 1, a: a};
};
var $author$project$Main$toSell = F2(
	function (model, _v0) {
		var sell = _v0.a;
		var cmd = _v0.b;
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					u: $author$project$Main$SellPage(sell)
				}),
			A2($elm$core$Platform$Cmd$map, $author$project$Main$GotSellMsg, cmd));
	});
var $author$project$Main$GotSupportMsg = function (a) {
	return {$: 5, a: a};
};
var $author$project$Main$SupportPage = function (a) {
	return {$: 4, a: a};
};
var $author$project$Main$toSupport = F2(
	function (model, _v0) {
		var support = _v0.a;
		var cmd = _v0.b;
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					u: $author$project$Main$SupportPage(support)
				}),
			A2($elm$core$Platform$Cmd$map, $author$project$Main$GotSupportMsg, cmd));
	});
var $author$project$Main$Buy = 6;
var $author$project$Main$Dashboard = 0;
var $author$project$Main$Funds = 3;
var $author$project$Main$Hardware = 8;
var $author$project$Main$Market = 7;
var $author$project$Main$PingPong = 5;
var $author$project$Main$Portfolio = 2;
var $author$project$Main$Sell = 1;
var $author$project$Main$Support = 4;
var $elm$url$Url$Parser$Parser = $elm$core$Basics$identity;
var $elm$url$Url$Parser$mapState = F2(
	function (func, _v0) {
		var visited = _v0.eA;
		var unvisited = _v0.dQ;
		var params = _v0.ei;
		var frag = _v0.d5;
		var value = _v0.al;
		return A5(
			$elm$url$Url$Parser$State,
			visited,
			unvisited,
			params,
			frag,
			func(value));
	});
var $elm$url$Url$Parser$map = F2(
	function (subValue, _v0) {
		var parseArg = _v0;
		return function (_v1) {
			var visited = _v1.eA;
			var unvisited = _v1.dQ;
			var params = _v1.ei;
			var frag = _v1.d5;
			var value = _v1.al;
			return A2(
				$elm$core$List$map,
				$elm$url$Url$Parser$mapState(value),
				parseArg(
					A5($elm$url$Url$Parser$State, visited, unvisited, params, frag, subValue)));
		};
	});
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $elm$url$Url$Parser$oneOf = function (parsers) {
	return function (state) {
		return A2(
			$elm$core$List$concatMap,
			function (_v0) {
				var parser = _v0;
				return parser(state);
			},
			parsers);
	};
};
var $elm$url$Url$Parser$s = function (str) {
	return function (_v0) {
		var visited = _v0.eA;
		var unvisited = _v0.dQ;
		var params = _v0.ei;
		var frag = _v0.d5;
		var value = _v0.al;
		if (!unvisited.b) {
			return _List_Nil;
		} else {
			var next = unvisited.a;
			var rest = unvisited.b;
			return _Utils_eq(next, str) ? _List_fromArray(
				[
					A5(
					$elm$url$Url$Parser$State,
					A2($elm$core$List$cons, next, visited),
					rest,
					params,
					frag,
					value)
				]) : _List_Nil;
		}
	};
};
var $elm$url$Url$Parser$top = function (state) {
	return _List_fromArray(
		[state]);
};
var $author$project$Main$urlAsPageParser = $elm$url$Url$Parser$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$url$Url$Parser$map,
			0,
			$elm$url$Url$Parser$s('index.html')),
			A2($elm$url$Url$Parser$map, 0, $elm$url$Url$Parser$top),
			A2(
			$elm$url$Url$Parser$map,
			1,
			$elm$url$Url$Parser$s('sell')),
			A2(
			$elm$url$Url$Parser$map,
			2,
			$elm$url$Url$Parser$s('portfolio')),
			A2(
			$elm$url$Url$Parser$map,
			3,
			$elm$url$Url$Parser$s('funds')),
			A2(
			$elm$url$Url$Parser$map,
			4,
			$elm$url$Url$Parser$s('support')),
			A2(
			$elm$url$Url$Parser$map,
			5,
			$elm$url$Url$Parser$s('pingpong')),
			A2(
			$elm$url$Url$Parser$map,
			6,
			$elm$url$Url$Parser$s('buy')),
			A2(
			$elm$url$Url$Parser$map,
			7,
			$elm$url$Url$Parser$s('market')),
			A2(
			$elm$url$Url$Parser$map,
			8,
			$elm$url$Url$Parser$s('hardware'))
		]));
var $author$project$Main$updateUrl = F2(
	function (url, model) {
		var urlMinusQueryStr = _Utils_update(
			url,
			{
				vp: $elm$core$Maybe$Just('')
			});
		var oauthCode = $author$project$Main$gotCodeFromUrl(url);
		var _v0 = A2($elm$url$Url$Parser$parse, $author$project$Main$urlAsPageParser, urlMinusQueryStr);
		if (!_v0.$) {
			switch (_v0.a) {
				case 0:
					var _v1 = _v0.a;
					if (oauthCode.$ === 1) {
						return A2(
							$author$project$Main$toDashboard,
							model,
							$author$project$Pages$Dashboard$init(
								{iI: model.d4, dE: $elm$core$Maybe$Nothing}));
					} else {
						if (oauthCode.a === '') {
							return A2(
								$author$project$Main$toDashboard,
								model,
								$author$project$Pages$Dashboard$init(
									{iI: model.d4, dE: $elm$core$Maybe$Nothing}));
						} else {
							return A2(
								$author$project$Main$toDashboard,
								model,
								$author$project$Pages$Dashboard$init(
									{iI: model.d4, dE: $elm$core$Maybe$Nothing}));
						}
					}
				case 1:
					var _v3 = _v0.a;
					return A2(
						$author$project$Main$toSell,
						model,
						$author$project$Pages$Sell$init(0));
				case 2:
					var _v4 = _v0.a;
					return A2(
						$author$project$Main$toPortfolio,
						model,
						$author$project$Pages$Portfolio$init(0));
				case 3:
					var _v5 = _v0.a;
					return A2(
						$author$project$Main$toFunds,
						model,
						$author$project$Pages$Funds$init(0));
				case 4:
					var _v6 = _v0.a;
					return A2(
						$author$project$Main$toSupport,
						model,
						$author$project$Pages$Support$init(0));
				case 5:
					var _v7 = _v0.a;
					return A2(
						$author$project$Main$toPingPong,
						model,
						$author$project$Pages$PingPong$init(0));
				case 6:
					var _v8 = _v0.a;
					return A2(
						$author$project$Main$toPricing,
						model,
						$author$project$Pages$Buy$init(0));
				case 7:
					var _v9 = _v0.a;
					return A2(
						$author$project$Main$toMarket,
						model,
						$author$project$Pages$Market$init(0));
				default:
					var _v10 = _v0.a;
					return A2(
						$author$project$Main$toHardware,
						model,
						$author$project$Pages$Hardware$init(
							{iI: model.d4, dE: $elm$core$Maybe$Nothing}));
			}
		} else {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{u: $author$project$Main$NotFound}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$fail = _Json_fail;
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Main$urlDecoder = A2(
	$elm$json$Json$Decode$andThen,
	function (s) {
		var _v0 = $elm$url$Url$fromString(s);
		if (!_v0.$) {
			var url = _v0.a;
			return $elm$json$Json$Decode$succeed(url);
		} else {
			return $elm$json$Json$Decode$fail('Invalid URL');
		}
	},
	$elm$json$Json$Decode$string);
var $author$project$Main$init = F3(
	function (flag, url, key) {
		var navigate = function (newUrl) {
			return A2(
				$elm$browser$Browser$Navigation$pushUrl,
				key,
				$elm$url$Url$toString(newUrl));
		};
		var decodedJsonFromIndexjs = function () {
			var _v0 = A2($elm$json$Json$Decode$decodeString, $author$project$Main$urlDecoder, flag);
			if (!_v0.$) {
				var urL = _v0.a;
				return urL;
			} else {
				return A6($elm$url$Url$Url, 1, 'haveno-web.squashpassion.com', $elm$core$Maybe$Nothing, '', $elm$core$Maybe$Nothing, $elm$core$Maybe$Nothing);
			}
		}();
		return A2(
			$author$project$Main$updateUrl,
			url,
			{
				d$: _List_fromArray(
					['']),
				d4: decodedJsonFromIndexjs,
				na: navigate,
				u: $author$project$Main$NotFound,
				dE: $elm$time$Time$millisToPosix(0),
				nz: $elm$core$Maybe$Just($elm$time$Time$utc)
			});
	});
var $author$project$Main$Recv = function (a) {
	return {$: 13, a: a};
};
var $author$project$Pages$Hardware$Tick = function (a) {
	return {$: 16, a: a};
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$time$Time$Every = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$State = F2(
	function (taggers, processes) {
		return {q1: processes, rS: taggers};
	});
var $elm$time$Time$init = $elm$core$Task$succeed(
	A2($elm$time$Time$State, $elm$core$Dict$empty, $elm$core$Dict$empty));
var $elm$time$Time$addMySub = F2(
	function (_v0, state) {
		var interval = _v0.a;
		var tagger = _v0.b;
		var _v1 = A2($elm$core$Dict$get, interval, state);
		if (_v1.$ === 1) {
			return A3(
				$elm$core$Dict$insert,
				interval,
				_List_fromArray(
					[tagger]),
				state);
		} else {
			var taggers = _v1.a;
			return A3(
				$elm$core$Dict$insert,
				interval,
				A2($elm$core$List$cons, tagger, taggers),
				state);
		}
	});
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === -2) {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$time$Time$setInterval = _Time_setInterval;
var $elm$time$Time$spawnHelp = F3(
	function (router, intervals, processes) {
		if (!intervals.b) {
			return $elm$core$Task$succeed(processes);
		} else {
			var interval = intervals.a;
			var rest = intervals.b;
			var spawnTimer = $elm$core$Process$spawn(
				A2(
					$elm$time$Time$setInterval,
					interval,
					A2($elm$core$Platform$sendToSelf, router, interval)));
			var spawnRest = function (id) {
				return A3(
					$elm$time$Time$spawnHelp,
					router,
					rest,
					A3($elm$core$Dict$insert, interval, id, processes));
			};
			return A2($elm$core$Task$andThen, spawnRest, spawnTimer);
		}
	});
var $elm$time$Time$onEffects = F3(
	function (router, subs, _v0) {
		var processes = _v0.q1;
		var rightStep = F3(
			function (_v6, id, _v7) {
				var spawns = _v7.a;
				var existing = _v7.b;
				var kills = _v7.c;
				return _Utils_Tuple3(
					spawns,
					existing,
					A2(
						$elm$core$Task$andThen,
						function (_v5) {
							return kills;
						},
						$elm$core$Process$kill(id)));
			});
		var newTaggers = A3($elm$core$List$foldl, $elm$time$Time$addMySub, $elm$core$Dict$empty, subs);
		var leftStep = F3(
			function (interval, taggers, _v4) {
				var spawns = _v4.a;
				var existing = _v4.b;
				var kills = _v4.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, interval, spawns),
					existing,
					kills);
			});
		var bothStep = F4(
			function (interval, taggers, id, _v3) {
				var spawns = _v3.a;
				var existing = _v3.b;
				var kills = _v3.c;
				return _Utils_Tuple3(
					spawns,
					A3($elm$core$Dict$insert, interval, id, existing),
					kills);
			});
		var _v1 = A6(
			$elm$core$Dict$merge,
			leftStep,
			bothStep,
			rightStep,
			newTaggers,
			processes,
			_Utils_Tuple3(
				_List_Nil,
				$elm$core$Dict$empty,
				$elm$core$Task$succeed(0)));
		var spawnList = _v1.a;
		var existingDict = _v1.b;
		var killTask = _v1.c;
		return A2(
			$elm$core$Task$andThen,
			function (newProcesses) {
				return $elm$core$Task$succeed(
					A2($elm$time$Time$State, newTaggers, newProcesses));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$time$Time$spawnHelp, router, spawnList, existingDict);
				},
				killTask));
	});
var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
var $elm$time$Time$onSelfMsg = F3(
	function (router, interval, state) {
		var _v0 = A2($elm$core$Dict$get, interval, state.rS);
		if (_v0.$ === 1) {
			return $elm$core$Task$succeed(state);
		} else {
			var taggers = _v0.a;
			var tellTaggers = function (time) {
				return $elm$core$Task$sequence(
					A2(
						$elm$core$List$map,
						function (tagger) {
							return A2(
								$elm$core$Platform$sendToApp,
								router,
								tagger(time));
						},
						taggers));
			};
			return A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$succeed(state);
				},
				A2($elm$core$Task$andThen, tellTaggers, $elm$time$Time$now));
		}
	});
var $elm$time$Time$subMap = F2(
	function (f, _v0) {
		var interval = _v0.a;
		var tagger = _v0.b;
		return A2(
			$elm$time$Time$Every,
			interval,
			A2($elm$core$Basics$composeL, f, tagger));
	});
_Platform_effectManagers['Time'] = _Platform_createManager($elm$time$Time$init, $elm$time$Time$onEffects, $elm$time$Time$onSelfMsg, 0, $elm$time$Time$subMap);
var $elm$time$Time$subscription = _Platform_leaf('Time');
var $elm$time$Time$every = F2(
	function (interval, tagger) {
		return $elm$time$Time$subscription(
			A2($elm$time$Time$Every, interval, tagger));
	});
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $author$project$Main$messageReceiver = _Platform_incomingPort('messageReceiver', $elm$json$Json$Decode$value);
var $author$project$Main$subscriptions = function (_v0) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				A2(
				$elm$time$Time$every,
				900000,
				function (posixTime) {
					return $author$project$Main$GotHardwareMsg(
						$author$project$Pages$Hardware$Tick(posixTime));
				}),
				$author$project$Main$messageReceiver($author$project$Main$Recv)
			]));
};
var $author$project$Pages$Hardware$LoggedInUser = {$: 4};
var $author$project$Data$Ranking$Member = function (a) {
	return {$: 1, a: a};
};
var $author$project$Pages$Hardware$MemberSelectedView = {$: 7};
var $author$project$Pages$Hardware$OwnedSelectedView = {$: 6};
var $author$project$Pages$Hardware$RegisterUser = function (a) {
	return {$: 3, a: a};
};
var $author$project$Data$User$Registered = function (a) {
	return {$: 1, a: a};
};
var $author$project$Pages$Hardware$ResponseDataFromMain = function (a) {
	return {$: 24, a: a};
};
var $author$project$Data$Ranking$Spectator = function (a) {
	return {$: 2, a: a};
};
var $author$project$Pages$Hardware$SpectatorSelectedView = {$: 8};
var $author$project$Extras$Constants$noCurrentChallengerId = '6353e8b6aedf80653eb34191';
var $author$project$Data$Ranking$noChallengerCurrently = {A: $author$project$Extras$Constants$noCurrentChallengerId, dw: 'No Challenger'};
var $author$project$Data$Ranking$abandonSingleUserChallenge = F2(
	function (userId, ranks) {
		return A2(
			$elm$core$List$map,
			function (rank) {
				return (_Utils_eq(rank.aB.A, userId) || _Utils_eq(rank.an.A, userId)) ? _Utils_update(
					rank,
					{an: $author$project$Data$Ranking$noChallengerCurrently}) : rank;
			},
			ranks);
	});
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $author$project$Data$User$emptyRegisteredUser = $author$project$Data$User$Registered($author$project$Data$User$emptyUserInfo);
var $author$project$Data$User$addNewLadderToMemberRankings = F2(
	function (user, ranking) {
		if (user.$ === 1) {
			var usrInfo = user.a;
			var rankingExists = A2(
				$elm$core$List$any,
				function (r) {
					return _Utils_eq(r.A, ranking.A);
				},
				usrInfo.ea);
			if (rankingExists) {
				return user;
			} else {
				var newRankingList = A2($elm$core$List$cons, ranking, usrInfo.ea);
				return $author$project$Data$User$Registered(
					_Utils_update(
						usrInfo,
						{ea: newRankingList}));
			}
		} else {
			return $author$project$Data$User$emptyRegisteredUser;
		}
	});
var $author$project$Data$Ranking$createSingleUserChallenge = F3(
	function (playerId, newChallenger, ranks) {
		var player1 = A2(
			$elm$core$Maybe$withDefault,
			newChallenger,
			A2(
				$elm$core$Maybe$map,
				function ($) {
					return $.aB;
				},
				$elm$core$List$head(
					A2(
						$elm$core$List$filter,
						function (r) {
							return _Utils_eq(r.aB.A, playerId);
						},
						ranks))));
		return A2(
			$elm$core$List$map,
			function (rank) {
				return _Utils_eq(rank.aB.A, playerId) ? _Utils_update(
					rank,
					{an: newChallenger}) : (_Utils_eq(rank.aB.A, newChallenger.A) ? _Utils_update(
					rank,
					{an: player1}) : rank);
			},
			ranks);
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $author$project$Data$User$deleteRankingFromMemberRankings = F2(
	function (user, rankingid) {
		if (user.$ === 1) {
			var usrInfo = user.a;
			return A2(
				$elm$core$List$filter,
				function (ranking) {
					return !_Utils_eq(ranking.A, rankingid);
				},
				usrInfo.ea);
		} else {
			return _List_Nil;
		}
	});
var $author$project$Data$User$deleteRankingFromOwnedRankings = F2(
	function (user, rankingid) {
		if (user.$ === 1) {
			var usrInfo = user.a;
			var newRankingList = A2(
				$elm$core$List$filter,
				function (ranking) {
					return !_Utils_eq(ranking.A, rankingid);
				},
				usrInfo.dK);
			return $author$project$Data$User$Registered(
				_Utils_update(
					usrInfo,
					{dK: newRankingList}));
		} else {
			return $author$project$Data$User$emptyRegisteredUser;
		}
	});
var $author$project$Data$Ranking$emptyRanking = {
	mO: false,
	dG: {h0: '', lH: ''},
	A: '',
	nb: _List_fromArray(
		[$author$project$Data$Ranking$emptyRank]),
	fR: '',
	f0: '',
	n3: '',
	n6: 0
};
var $author$project$Main$fromJsonToString = function (value) {
	return A2($elm$json$Json$Encode$encode, 0, value);
};
var $author$project$Data$User$gotId = function (user) {
	if (!user.$) {
		return '';
	} else {
		var userInfo = user.a;
		return userInfo.r9;
	}
};
var $author$project$Data$User$gotNickName = function (user) {
	if (!user.$) {
		var userInfo = user.a;
		return userInfo.dw;
	} else {
		var userInfo = user.a;
		return userInfo.dw;
	}
};
var $author$project$Data$Ranking$gotRankBelow = F2(
	function (rank, ranks) {
		var rankBelow = A2(
			$elm$core$List$filter,
			function (r) {
				return _Utils_eq(r.bC, rank.bC + 1);
			},
			ranks);
		if (!rankBelow.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			if (!rankBelow.b.b) {
				var rnk = rankBelow.a;
				return $elm$core$Maybe$Just(rnk);
			} else {
				var head = rankBelow.a;
				var tail = rankBelow.b;
				return $elm$core$Maybe$Just(head);
			}
		}
	});
var $author$project$Data$Ranking$gotRanking = function (ls) {
	switch (ls.$) {
		case 0:
			var ranking = ls.a;
			return ranking;
		case 1:
			var ranking = ls.a;
			return ranking;
		case 2:
			var ranking = ls.a;
			return ranking;
		default:
			return $author$project$Data$Ranking$emptyRanking;
	}
};
var $author$project$Data$Ranking$gotRankingId = function (ranking) {
	return ranking.A;
};
var $author$project$Data$User$gotUserInfo = function (user) {
	if (user.$ === 1) {
		var usrInfo = user.a;
		return usrInfo;
	} else {
		return $author$project$Data$User$emptyUserInfo;
	}
};
var $author$project$Data$Ranking$userLost = F2(
	function (userId, ranks) {
		return A2(
			$elm$core$List$map,
			function (rank) {
				return _Utils_eq(rank.aB.A, userId) ? _Utils_update(
					rank,
					{
						an: {A: $author$project$Extras$Constants$noCurrentChallengerId, dw: 'No Challenger'},
						aB: rank.an
					}) : (_Utils_eq(rank.an.A, userId) ? _Utils_update(
					rank,
					{
						an: {A: $author$project$Extras$Constants$noCurrentChallengerId, dw: 'No Challenger'},
						aB: rank.an
					}) : rank);
			},
			ranks);
	});
var $author$project$Data$Ranking$userWon = F2(
	function (userId, ranks) {
		return A2(
			$elm$core$List$map,
			function (rank) {
				return _Utils_eq(rank.an.A, userId) ? _Utils_update(
					rank,
					{
						an: {A: $author$project$Extras$Constants$noCurrentChallengerId, dw: 'No Challenger'},
						aB: rank.an
					}) : (_Utils_eq(rank.aB.A, userId) ? _Utils_update(
					rank,
					{
						an: {A: $author$project$Extras$Constants$noCurrentChallengerId, dw: 'No Challenger'},
						aB: rank.an
					}) : rank);
			},
			ranks);
	});
var $author$project$Data$Ranking$handleResult = F3(
	function (resultofmatch, userid, lrank) {
		switch (resultofmatch) {
			case 0:
				return A2($author$project$Data$Ranking$userWon, userid, lrank);
			case 1:
				return A2($author$project$Data$Ranking$userLost, userid, lrank);
			default:
				return A2($author$project$Data$Ranking$abandonSingleUserChallenge, userid, lrank);
		}
	});
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(0),
			pairs));
};
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$Data$Ranking$encodeBaseAddress = function (baseaddress) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'street',
				$elm$json$Json$Encode$string(baseaddress.lH)),
				_Utils_Tuple2(
				'city',
				$elm$json$Json$Encode$string(baseaddress.h0))
			]));
};
var $author$project$Data$Ranking$encodeRank = function (rank) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'playerId',
				$elm$json$Json$Encode$string(rank.aB.A)),
				_Utils_Tuple2(
				'challengerId',
				$elm$json$Json$Encode$string(rank.an.A)),
				_Utils_Tuple2(
				'rank',
				$elm$json$Json$Encode$string(
					$elm$core$String$fromInt(rank.bC)))
			]));
};
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(0),
				entries));
	});
var $author$project$Data$Ranking$jsonUpdatedRanking = function (updatedRanking) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'_id',
				$elm$json$Json$Encode$string(updatedRanking.A)),
				_Utils_Tuple2(
				'active',
				$elm$json$Json$Encode$bool(updatedRanking.mO)),
				_Utils_Tuple2(
				'name',
				$elm$json$Json$Encode$string(updatedRanking.fR)),
				_Utils_Tuple2(
				'owner_id',
				$elm$json$Json$Encode$string(updatedRanking.f0)),
				_Utils_Tuple2(
				'baseaddress',
				$author$project$Data$Ranking$encodeBaseAddress(updatedRanking.dG)),
				_Utils_Tuple2(
				'players',
				A2($elm$json$Json$Encode$list, $author$project$Data$Ranking$encodeRank, updatedRanking.nb)),
				_Utils_Tuple2(
				'lastUpdatedBy',
				$elm$json$Json$Encode$string(updatedRanking.f0))
			]));
};
var $elm$browser$Browser$Navigation$load = _Browser_load;
var $author$project$Data$Ranking$removeRank = F2(
	function (playerId, ranks) {
		return A2(
			$elm$core$List$indexedMap,
			F2(
				function (index, rank) {
					return _Utils_update(
						rank,
						{bC: index + 1});
				}),
			A2(
				$elm$core$List$filter,
				function (rank) {
					return !_Utils_eq(rank.aB.A, playerId);
				},
				ranks));
	});
var $author$project$Main$sendMessage = _Platform_outgoingPort('sendMessage', $elm$json$Json$Encode$string);
var $author$project$Pages$Buy$update = F2(
	function (msg, model) {
		var newModel = msg;
		return _Utils_Tuple2(
			_Utils_update(
				newModel,
				{wp: model.wp}),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Extras$Constants$get = 'GET';
var $author$project$Extras$Constants$httpErrorToString = function (err) {
	switch (err.$) {
		case 0:
			var url = err.a;
			return 'Bad URL: ' + url;
		case 1:
			return 'Request timed out';
		case 2:
			return 'Network error occurred';
		case 3:
			var status = err.a;
			return 'Bad status: ' + $elm$core$String$fromInt(status);
		default:
			var body = err.a;
			return 'Bad body: ' + body;
	}
};
var $author$project$Pages$Dashboard$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 2:
				if (!msg.a.$) {
					var versionResp = msg.a.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								ez: $elm$core$Maybe$Just(versionResp)
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{ez: model.ez}),
						$elm$core$Platform$Cmd$none);
				}
			case 0:
				var newModel = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						newModel,
						{wp: model.wp}),
					$elm$core$Platform$Cmd$none);
			default:
				if (!msg.a.$) {
					var auth = msg.a.a;
					var headers = _List_fromArray(
						[
							A2(
							$elm$http$Http$header,
							'Authorization',
							'Bearer ' + A2(
								$elm$core$Maybe$withDefault,
								'No access token 2',
								$elm$core$Maybe$Just(auth.pa)))
						]);
					var flagUrlWithMongoDBMWAndPortUpdate = A2($elm$core$String$contains, $author$project$Extras$Constants$localorproductionServerAutoCheck, model.iI.fr) ? $elm$url$Url$toString(
						A6($elm$url$Url$Url, model.iI.ni, model.iI.fr, $elm$core$Maybe$Nothing, $author$project$Extras$Constants$middleWarePath, $elm$core$Maybe$Nothing, $elm$core$Maybe$Nothing)) : $elm$url$Url$toString(
						A6(
							$elm$url$Url$Url,
							model.iI.ni,
							model.iI.fr,
							$elm$core$Maybe$Just(3000),
							$author$project$Extras$Constants$middleWarePath,
							$elm$core$Maybe$Nothing,
							$elm$core$Maybe$Nothing));
					var newHttpParams = A6($author$project$Pages$Dashboard$HavenoAPKHttpRequest, $author$project$Extras$Constants$get, headers, flagUrlWithMongoDBMWAndPortUpdate, $elm$http$Http$emptyBody, $elm$core$Maybe$Nothing, $elm$core$Maybe$Nothing);
					var newModel = _Utils_update(
						model,
						{
							pK: $elm$core$Maybe$Just(newHttpParams)
						});
					return _Utils_Tuple2(newModel, $elm$core$Platform$Cmd$none);
				} else {
					var responseErr = msg.a.a;
					var respErr = $author$project$Extras$Constants$httpErrorToString(responseErr);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								d$: _Utils_ap(
									model.d$,
									_List_fromArray(
										[respErr]))
							}),
						$elm$core$Platform$Cmd$none);
				}
		}
	});
var $author$project$Pages$Funds$update = F2(
	function (msg, model) {
		var newModel = msg;
		return _Utils_Tuple2(
			_Utils_update(
				newModel,
				{wp: model.wp}),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Pages$Hardware$ConfirmDeleteOwnedRanking = {$: 9};
var $author$project$Pages$Hardware$ConfirmDeleteUserView = {$: 16};
var $author$project$Pages$Hardware$ConfirmJoinMemberView = {$: 14};
var $author$project$Pages$Hardware$ConfirmLeaveMemberView = {$: 15};
var $author$project$Pages$Hardware$CreateChallengeView = F2(
	function (a, b) {
		return {$: 10, a: a, b: b};
	});
var $author$project$Pages$Hardware$CreatingNewLadder = function (a) {
	return {$: 5, a: a};
};
var $author$project$Types$DateType$CurrentDateTime = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Pages$Hardware$JsonData = function (a) {
	return {$: 0, a: a};
};
var $author$project$Pages$Hardware$JsonMsgFromJs = F3(
	function (operationEventMsg, dataFromMongo, additionalDataFromJs) {
		return {nB: additionalDataFromJs, o8: dataFromMongo, fZ: operationEventMsg};
	});
var $author$project$Data$Ranking$Owned = function (a) {
	return {$: 0, a: a};
};
var $author$project$Pages$Hardware$PrepareResult = {$: 12};
var $author$project$Data$Ranking$Rank = F3(
	function (rank, player, challenger) {
		return {an: challenger, aB: player, bC: rank};
	});
var $author$project$Types$DateType$SelectedDateTime = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $author$project$Pages$Hardware$UpdateComment = function (a) {
	return {$: 7, a: a};
};
var $author$project$Pages$Hardware$UpdateEmail = function (a) {
	return {$: 3, a: a};
};
var $author$project$Pages$Hardware$UpdateLevel = function (a) {
	return {$: 6, a: a};
};
var $author$project$Pages$Hardware$UpdateMobile = function (a) {
	return {$: 8, a: a};
};
var $author$project$Pages$Hardware$UpdateNickName = function (a) {
	return {$: 5, a: a};
};
var $author$project$Pages$Hardware$UpdatePassword = function (a) {
	return {$: 4, a: a};
};
var $author$project$Pages$Hardware$UpdatePhone = function (a) {
	return {$: 9, a: a};
};
var $author$project$Data$User$addNewLadderToOwnedRankings = F2(
	function (user, ranking) {
		if (user.$ === 1) {
			var usrInfo = user.a;
			var rankingExists = A2(
				$elm$core$List$any,
				function (r) {
					return _Utils_eq(r.A, ranking.A);
				},
				usrInfo.dK);
			if (rankingExists) {
				return user;
			} else {
				var newRankingList = A2($elm$core$List$cons, ranking, usrInfo.dK);
				return $author$project$Data$User$Registered(
					_Utils_update(
						usrInfo,
						{dK: newRankingList}));
			}
		} else {
			return $author$project$Data$User$emptyRegisteredUser;
		}
	});
var $author$project$Pages$Hardware$CallResponse = function (a) {
	return {$: 64, a: a};
};
var $author$project$Extras$Constants$jsonKeyValue = F2(
	function (key, value) {
		return _Utils_Tuple2(
			key,
			$elm$json$Json$Encode$string(value));
	});
var $author$project$Extras$Constants$numIntObject = function (str) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'$numberInt',
				$elm$json$Json$Encode$string(str))
			]));
};
var $author$project$Extras$Constants$pipelineRequest = A2(
	$elm$json$Json$Encode$list,
	$elm$core$Basics$identity,
	_List_fromArray(
		[
			$elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'$match',
					$elm$json$Json$Encode$object(
						_List_fromArray(
							[
								_Utils_Tuple2(
								'_id',
								$elm$json$Json$Encode$object(
									_List_fromArray(
										[
											A2($author$project$Extras$Constants$jsonKeyValue, '$oid', '651fa006b15a534c69b119ef')
										])))
							])))
				])),
			$elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'$lookup',
					$elm$json$Json$Encode$object(
						_List_fromArray(
							[
								A2($author$project$Extras$Constants$jsonKeyValue, 'from', 'rankings'),
								_Utils_Tuple2(
								'localField',
								$elm$json$Json$Encode$string('ownerOf')),
								_Utils_Tuple2(
								'foreignField',
								$elm$json$Json$Encode$string('_id')),
								_Utils_Tuple2(
								'as',
								$elm$json$Json$Encode$string('ownedRankings'))
							])))
				])),
			$elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'$lookup',
					$elm$json$Json$Encode$object(
						_List_fromArray(
							[
								_Utils_Tuple2(
								'from',
								$elm$json$Json$Encode$string('rankings')),
								_Utils_Tuple2(
								'localField',
								$elm$json$Json$Encode$string('memberOf')),
								_Utils_Tuple2(
								'foreignField',
								$elm$json$Json$Encode$string('_id')),
								_Utils_Tuple2(
								'as',
								$elm$json$Json$Encode$string('memberRankings'))
							])))
				])),
			$elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'$lookup',
					$elm$json$Json$Encode$object(
						_List_fromArray(
							[
								_Utils_Tuple2(
								'from',
								$elm$json$Json$Encode$string('users')),
								_Utils_Tuple2(
								'localField',
								$elm$json$Json$Encode$string('memberRankings.owner_id')),
								_Utils_Tuple2(
								'foreignField',
								$elm$json$Json$Encode$string('_id')),
								_Utils_Tuple2(
								'as',
								$elm$json$Json$Encode$string('memberRankingsWithOwnerName'))
							])))
				])),
			$elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'$project',
					$elm$json$Json$Encode$object(
						_List_fromArray(
							[
								_Utils_Tuple2(
								'_id',
								$author$project$Extras$Constants$numIntObject('1')),
								_Utils_Tuple2(
								'userid',
								$author$project$Extras$Constants$numIntObject('1')),
								_Utils_Tuple2(
								'nickname',
								$author$project$Extras$Constants$numIntObject('1')),
								_Utils_Tuple2(
								'active',
								$author$project$Extras$Constants$numIntObject('1')),
								_Utils_Tuple2(
								'description',
								$author$project$Extras$Constants$numIntObject('1')),
								_Utils_Tuple2(
								'datestamp',
								$author$project$Extras$Constants$numIntObject('1')),
								_Utils_Tuple2(
								'token',
								$author$project$Extras$Constants$numIntObject('1')),
								_Utils_Tuple2(
								'updatetext',
								$author$project$Extras$Constants$numIntObject('1')),
								_Utils_Tuple2(
								'mobile',
								$author$project$Extras$Constants$numIntObject('1')),
								_Utils_Tuple2(
								'credits',
								$author$project$Extras$Constants$numIntObject('1')),
								_Utils_Tuple2(
								'ownedRankings',
								$elm$json$Json$Encode$object(
									_List_fromArray(
										[
											_Utils_Tuple2(
											'_id',
											$author$project$Extras$Constants$numIntObject('1')),
											_Utils_Tuple2(
											'active',
											$author$project$Extras$Constants$numIntObject('1')),
											_Utils_Tuple2(
											'owner_id',
											$author$project$Extras$Constants$numIntObject('1')),
											_Utils_Tuple2(
											'baseaddress',
											$author$project$Extras$Constants$numIntObject('1')),
											_Utils_Tuple2(
											'ranking',
											$author$project$Extras$Constants$numIntObject('1')),
											_Utils_Tuple2(
											'player_count',
											$author$project$Extras$Constants$numIntObject('1')),
											_Utils_Tuple2(
											'name',
											$author$project$Extras$Constants$numIntObject('1')),
											A2($author$project$Extras$Constants$jsonKeyValue, 'owner_name', '$nickname')
										]))),
								_Utils_Tuple2(
								'memberRankings',
								$elm$json$Json$Encode$object(
									_List_fromArray(
										[
											_Utils_Tuple2(
											'_id',
											$author$project$Extras$Constants$numIntObject('1')),
											_Utils_Tuple2(
											'name',
											$author$project$Extras$Constants$numIntObject('1')),
											_Utils_Tuple2(
											'active',
											$author$project$Extras$Constants$numIntObject('1')),
											_Utils_Tuple2(
											'owner_id',
											$author$project$Extras$Constants$numIntObject('1')),
											_Utils_Tuple2(
											'baseaddress',
											$author$project$Extras$Constants$numIntObject('1')),
											_Utils_Tuple2(
											'ranking',
											$author$project$Extras$Constants$numIntObject('1')),
											_Utils_Tuple2(
											'player_count',
											$author$project$Extras$Constants$numIntObject('1')),
											_Utils_Tuple2(
											'owner_name',
											$elm$json$Json$Encode$object(
												_List_fromArray(
													[
														_Utils_Tuple2(
														'owner_name',
														$elm$json$Json$Encode$string('$memberRankingsWithOwnerName.nickname'))
													])))
										]))),
								_Utils_Tuple2(
								'owner_ranking_count',
								$elm$json$Json$Encode$object(
									_List_fromArray(
										[
											_Utils_Tuple2(
											'$size',
											$elm$json$Json$Encode$string('$ownedRankings'))
										]))),
								_Utils_Tuple2(
								'member_ranking_count',
								$elm$json$Json$Encode$object(
									_List_fromArray(
										[
											_Utils_Tuple2(
											'$size',
											$elm$json$Json$Encode$string('$memberRankings'))
										]))),
								_Utils_Tuple2(
								'addInfo',
								$author$project$Extras$Constants$numIntObject('1')),
								_Utils_Tuple2(
								'gender',
								$author$project$Extras$Constants$numIntObject('1')),
								_Utils_Tuple2(
								'age',
								$author$project$Extras$Constants$numIntObject('1'))
							])))
				]))
		]));
var $author$project$Extras$Constants$callRequestJson = $elm$json$Json$Encode$object(
	_List_fromArray(
		[
			_Utils_Tuple2(
			'name',
			$elm$json$Json$Encode$string('aggregate')),
			_Utils_Tuple2(
			'arguments',
			A2(
				$elm$json$Json$Encode$list,
				$elm$core$Basics$identity,
				_List_fromArray(
					[
						$elm$json$Json$Encode$object(
						_List_fromArray(
							[
								_Utils_Tuple2(
								'database',
								$elm$json$Json$Encode$string('sportrank')),
								_Utils_Tuple2(
								'collection',
								$elm$json$Json$Encode$string('users')),
								_Utils_Tuple2('pipeline', $author$project$Extras$Constants$pipelineRequest)
							]))
					]))),
			_Utils_Tuple2(
			'service',
			$elm$json$Json$Encode$string('mongodb-atlas'))
		]));
var $elm$http$Http$expectStringResponse = F2(
	function (toMsg, toResult) {
		return A3(
			_Http_expect,
			'',
			$elm$core$Basics$identity,
			A2($elm$core$Basics$composeR, toResult, toMsg));
	});
var $elm$core$Result$mapError = F2(
	function (f, result) {
		if (!result.$) {
			var v = result.a;
			return $elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return $elm$core$Result$Err(
				f(e));
		}
	});
var $elm$http$Http$BadBody = function (a) {
	return {$: 4, a: a};
};
var $elm$http$Http$BadStatus = function (a) {
	return {$: 3, a: a};
};
var $elm$http$Http$BadUrl = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$NetworkError = {$: 2};
var $elm$http$Http$Timeout = {$: 1};
var $elm$http$Http$resolve = F2(
	function (toResult, response) {
		switch (response.$) {
			case 0:
				var url = response.a;
				return $elm$core$Result$Err(
					$elm$http$Http$BadUrl(url));
			case 1:
				return $elm$core$Result$Err($elm$http$Http$Timeout);
			case 2:
				return $elm$core$Result$Err($elm$http$Http$NetworkError);
			case 3:
				var metadata = response.a;
				return $elm$core$Result$Err(
					$elm$http$Http$BadStatus(metadata.v0));
			default:
				var body = response.b;
				return A2(
					$elm$core$Result$mapError,
					$elm$http$Http$BadBody,
					toResult(body));
		}
	});
var $elm$http$Http$expectJson = F2(
	function (toMsg, decoder) {
		return A2(
			$elm$http$Http$expectStringResponse,
			toMsg,
			$elm$http$Http$resolve(
				function (string) {
					return A2(
						$elm$core$Result$mapError,
						$elm$json$Json$Decode$errorToString,
						A2($elm$json$Json$Decode$decodeString, decoder, string));
				}));
	});
var $elm$json$Json$Decode$index = _Json_decodeIndex;
var $elm$http$Http$jsonBody = function (value) {
	return A2(
		_Http_pair,
		'application/json',
		A2($elm$json$Json$Encode$encode, 0, value));
};
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $author$project$Data$User$Description = F2(
	function (level, comment) {
		return {nF: comment, nX: level};
	});
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom = $elm$json$Json$Decode$map2($elm$core$Basics$apR);
var $elm$json$Json$Decode$field = _Json_decodeField;
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required = F3(
	function (key, valDecoder, decoder) {
		return A2(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
			A2($elm$json$Json$Decode$field, key, valDecoder),
			decoder);
	});
var $author$project$Data$User$descriptionDecoder = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'comment',
	$elm$json$Json$Decode$string,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'level',
		$elm$json$Json$Decode$string,
		$elm$json$Json$Decode$succeed($author$project$Data$User$Description)));
var $author$project$Data$User$Female = 1;
var $author$project$Data$User$genderDecoder = A2(
	$elm$json$Json$Decode$andThen,
	function (str) {
		switch (str) {
			case 'Male':
				return $elm$json$Json$Decode$succeed(0);
			case 'Female':
				return $elm$json$Json$Decode$succeed(1);
			default:
				return $elm$json$Json$Decode$fail('Invalid gender');
		}
	},
	$elm$json$Json$Decode$string);
var $author$project$Data$User$idDecoder = A2($elm$json$Json$Decode$field, '$oid', $elm$json$Json$Decode$string);
var $elm$json$Json$Decode$list = _Json_decodeList;
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $elm$json$Json$Decode$maybe = function (decoder) {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder),
				$elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing)
			]));
};
var $author$project$Data$User$numberDecoder = A2(
	$elm$json$Json$Decode$andThen,
	function (str) {
		var _v0 = $elm$core$String$toInt(str);
		if (!_v0.$) {
			var num = _v0.a;
			return $elm$json$Json$Decode$succeed(num);
		} else {
			return $elm$json$Json$Decode$fail('Expected an integer');
		}
	},
	A2($elm$json$Json$Decode$field, '$numberInt', $elm$json$Json$Decode$string));
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $elm$json$Json$Decode$null = _Json_decodeNull;
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optionalDecoder = F3(
	function (path, valDecoder, fallback) {
		var nullOr = function (decoder) {
			return $elm$json$Json$Decode$oneOf(
				_List_fromArray(
					[
						decoder,
						$elm$json$Json$Decode$null(fallback)
					]));
		};
		var handleResult = function (input) {
			var _v0 = A2(
				$elm$json$Json$Decode$decodeValue,
				A2($elm$json$Json$Decode$at, path, $elm$json$Json$Decode$value),
				input);
			if (!_v0.$) {
				var rawValue = _v0.a;
				var _v1 = A2(
					$elm$json$Json$Decode$decodeValue,
					nullOr(valDecoder),
					rawValue);
				if (!_v1.$) {
					var finalResult = _v1.a;
					return $elm$json$Json$Decode$succeed(finalResult);
				} else {
					return A2(
						$elm$json$Json$Decode$at,
						path,
						nullOr(valDecoder));
				}
			} else {
				return $elm$json$Json$Decode$succeed(fallback);
			}
		};
		return A2($elm$json$Json$Decode$andThen, handleResult, $elm$json$Json$Decode$value);
	});
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional = F4(
	function (key, valDecoder, fallback, decoder) {
		return A2(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optionalDecoder,
				_List_fromArray(
					[key]),
				valDecoder,
				fallback),
			decoder);
	});
var $author$project$Data$Ranking$Ranking = F8(
	function (id, active, name, owner_id, baseaddress, ladder, player_count, owner_name) {
		return {mO: active, dG: baseaddress, A: id, nb: ladder, fR: name, f0: owner_id, n3: owner_name, n6: player_count};
	});
var $author$project$Data$Ranking$BaseAddress = F2(
	function (street, city) {
		return {h0: city, lH: street};
	});
var $author$project$Data$Ranking$baseAddressDecoder = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'city',
	$elm$json$Json$Decode$string,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'street',
		$elm$json$Json$Decode$string,
		$elm$json$Json$Decode$succeed($author$project$Data$Ranking$BaseAddress)));
var $author$project$Data$Ranking$idDecoder = A2($elm$json$Json$Decode$field, '$oid', $elm$json$Json$Decode$string);
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $author$project$Data$Ranking$ownerIdDecoder = A2($elm$json$Json$Decode$field, '$oid', $elm$json$Json$Decode$string);
var $author$project$Data$Ranking$Player = F2(
	function (id, nickname) {
		return {A: id, dw: nickname};
	});
var $author$project$Data$Ranking$playerDecoder = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'nickname',
	$elm$json$Json$Decode$string,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'_id',
		$elm$json$Json$Decode$string,
		$elm$json$Json$Decode$succeed($author$project$Data$Ranking$Player)));
var $author$project$Data$Ranking$rankDecoder = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'challenger',
	$author$project$Data$Ranking$playerDecoder,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'player',
		$author$project$Data$Ranking$playerDecoder,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'rank',
			$elm$json$Json$Decode$int,
			$elm$json$Json$Decode$succeed($author$project$Data$Ranking$Rank))));
var $author$project$Data$Ranking$rankingDecoder = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'owner_name',
	$elm$json$Json$Decode$string,
	A4(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
		'player_count',
		$elm$json$Json$Decode$int,
		1,
		A4(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
			'ranking',
			$elm$json$Json$Decode$list($author$project$Data$Ranking$rankDecoder),
			_List_fromArray(
				[$author$project$Data$Ranking$emptyRank]),
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'baseaddress',
				$author$project$Data$Ranking$baseAddressDecoder,
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'owner_id',
					$author$project$Data$Ranking$ownerIdDecoder,
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'name',
						$elm$json$Json$Decode$string,
						A3(
							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
							'active',
							$elm$json$Json$Decode$bool,
							A3(
								$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
								'_id',
								$author$project$Data$Ranking$idDecoder,
								$elm$json$Json$Decode$succeed($author$project$Data$Ranking$Ranking)))))))));
var $author$project$Data$User$stringToIntDecoder = A2(
	$elm$json$Json$Decode$andThen,
	function (str) {
		var _v0 = $elm$core$String$toInt(str);
		if (!_v0.$) {
			var num = _v0.a;
			return $elm$json$Json$Decode$succeed(num);
		} else {
			return $elm$json$Json$Decode$fail('Expected an integer');
		}
	},
	$elm$json$Json$Decode$string);
var $author$project$Data$User$userInfoDecoder = A4(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
	'addInfo',
	$elm$json$Json$Decode$string,
	'No additional info supplied',
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'credits',
		A2($elm$json$Json$Decode$field, '$numberInt', $author$project$Data$User$stringToIntDecoder),
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'description',
			$author$project$Data$User$descriptionDecoder,
			A4(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
				'updatetext',
				$elm$json$Json$Decode$string,
				'',
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'memberRankings',
					$elm$json$Json$Decode$list($author$project$Data$Ranking$rankingDecoder),
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'ownedRankings',
						$elm$json$Json$Decode$list($author$project$Data$Ranking$rankingDecoder),
						A3(
							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
							'active',
							$elm$json$Json$Decode$bool,
							A3(
								$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
								'datestamp',
								$author$project$Data$User$numberDecoder,
								A4(
									$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
									'mobileValidationError',
									$elm$json$Json$Decode$string,
									'',
									A4(
										$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
										'isMobileInputFocused',
										$elm$json$Json$Decode$bool,
										false,
										A3(
											$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
											'mobile',
											$elm$json$Json$Decode$maybe($elm$json$Json$Decode$string),
											A4(
												$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
												'emailValidationError',
												$elm$json$Json$Decode$string,
												'',
												A4(
													$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
													'isEmailInputFocused',
													$elm$json$Json$Decode$bool,
													false,
													A4(
														$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
														'email',
														$elm$json$Json$Decode$maybe($elm$json$Json$Decode$string),
														$elm$core$Maybe$Nothing,
														A4(
															$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
															'gender',
															$author$project$Data$User$genderDecoder,
															0,
															A4(
																$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
																'age',
																$author$project$Data$User$numberDecoder,
																20,
																A4(
																	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
																	'nameValidationError',
																	$elm$json$Json$Decode$string,
																	'',
																	A4(
																		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
																		'isNameInputFocused',
																		$elm$json$Json$Decode$bool,
																		false,
																		A3(
																			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
																			'nickname',
																			$elm$json$Json$Decode$string,
																			A3(
																				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
																				'token',
																				$elm$json$Json$Decode$maybe($elm$json$Json$Decode$string),
																				A4(
																					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
																					'password',
																					$elm$json$Json$Decode$string,
																					'',
																					A4(
																						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
																						'email',
																						$elm$json$Json$Decode$string,
																						'',
																						A3(
																							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
																							'_id',
																							$author$project$Data$User$idDecoder,
																							$elm$json$Json$Decode$succeed($author$project$Data$User$UserInfo))))))))))))))))))))))));
var $author$project$Pages$Hardware$callRequest = function (model) {
	var headers = _List_fromArray(
		[
			A2(
			$elm$http$Http$header,
			'Authorization',
			'Bearer ' + A2($elm$core$Maybe$withDefault, 'No access token ', model.at.dR))
		]);
	var therequest = $elm$http$Http$request(
		{
			sV: $elm$http$Http$jsonBody($author$project$Extras$Constants$callRequestJson),
			m2: A2(
				$elm$http$Http$expectJson,
				$author$project$Pages$Hardware$CallResponse,
				A2($elm$json$Json$Decode$index, 0, $author$project$Data$User$userInfoDecoder)),
			t7: headers,
			uM: 'POST',
			wo: $elm$core$Maybe$Nothing,
			wu: $elm$core$Maybe$Nothing,
			bF: 'https://ap-southeast-1.aws.realm.mongodb.com/api/client/v2.0/app/sr-espa1-snonq/functions/call'
		});
	return therequest;
};
var $author$project$Pages$Hardware$Change = F4(
	function (operationType, documentKey, updateDescription, fullDocument) {
		return {pg: documentKey, m3: fullDocument, ka: operationType, ny: updateDescription};
	});
var $author$project$Pages$Hardware$DocumentKey = function (id) {
	return {A: id};
};
var $author$project$Pages$Hardware$documentKeyDecoder = A2(
	$elm$json$Json$Decode$map,
	$author$project$Pages$Hardware$DocumentKey,
	A2($elm$json$Json$Decode$field, '_id', $elm$json$Json$Decode$string));
var $author$project$Pages$Hardware$FullDocument = F7(
	function (id, active, name, players, ownerId, baseAddress, lastUpdatedBy) {
		return {mO: active, sP: baseAddress, A: id, p7: lastUpdatedBy, fR: name, vb: ownerId, qV: players};
	});
var $author$project$Pages$Hardware$baseAddressDecoder = A3(
	$elm$json$Json$Decode$map2,
	$author$project$Data$Ranking$BaseAddress,
	A2($elm$json$Json$Decode$field, 'street', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'city', $elm$json$Json$Decode$string));
var $author$project$Pages$Hardware$PlayerFromChangeEvent = F3(
	function (playerId, challengerId, rank) {
		return {s3: challengerId, n5: playerId, bC: rank};
	});
var $elm$json$Json$Decode$map3 = _Json_map3;
var $author$project$Pages$Hardware$playerFromChangeEventDecoder = A4(
	$elm$json$Json$Decode$map3,
	$author$project$Pages$Hardware$PlayerFromChangeEvent,
	A2($elm$json$Json$Decode$field, 'playerId', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'challengerId', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'rank', $elm$json$Json$Decode$int));
var $author$project$Pages$Hardware$decodeApply = $elm$json$Json$Decode$map2($elm$core$Basics$apR);
var $author$project$Pages$Hardware$required = F3(
	function (fieldName, itemDecoder, functionDecoder) {
		return A2(
			$author$project$Pages$Hardware$decodeApply,
			A2($elm$json$Json$Decode$field, fieldName, itemDecoder),
			functionDecoder);
	});
var $author$project$Pages$Hardware$fullDocumentDecoder = A3(
	$author$project$Pages$Hardware$required,
	'lastUpdatedBy',
	$elm$json$Json$Decode$string,
	A3(
		$author$project$Pages$Hardware$required,
		'baseaddress',
		$author$project$Pages$Hardware$baseAddressDecoder,
		A3(
			$author$project$Pages$Hardware$required,
			'owner_id',
			$elm$json$Json$Decode$string,
			A4(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
				'players',
				$elm$json$Json$Decode$maybe(
					$elm$json$Json$Decode$list($author$project$Pages$Hardware$playerFromChangeEventDecoder)),
				$elm$core$Maybe$Nothing,
				A3(
					$author$project$Pages$Hardware$required,
					'name',
					$elm$json$Json$Decode$string,
					A3(
						$author$project$Pages$Hardware$required,
						'active',
						$elm$json$Json$Decode$bool,
						A3(
							$author$project$Pages$Hardware$required,
							'_id',
							$elm$json$Json$Decode$string,
							$elm$json$Json$Decode$succeed($author$project$Pages$Hardware$FullDocument))))))));
var $elm$json$Json$Decode$map4 = _Json_map4;
var $author$project$Pages$Hardware$UpdateDescription = F3(
	function (updatedFields, removedFields, truncatedArrays) {
		return {n9: removedFields, r2: truncatedArrays, of: updatedFields};
	});
var $elm$json$Json$Decode$keyValuePairs = _Json_decodeKeyValuePairs;
var $elm$json$Json$Decode$dict = function (decoder) {
	return A2(
		$elm$json$Json$Decode$map,
		$elm$core$Dict$fromList,
		$elm$json$Json$Decode$keyValuePairs(decoder));
};
var $author$project$Pages$Hardware$updatedFieldDecoder = $elm$json$Json$Decode$oneOf(
	_List_fromArray(
		[
			$elm$json$Json$Decode$list($author$project$Pages$Hardware$playerFromChangeEventDecoder),
			A2(
			$elm$json$Json$Decode$map,
			function (player) {
				return _List_fromArray(
					[player]);
			},
			$author$project$Pages$Hardware$playerFromChangeEventDecoder),
			A2(
			$elm$json$Json$Decode$andThen,
			function (_v0) {
				return $elm$json$Json$Decode$succeed(_List_Nil);
			},
			$elm$json$Json$Decode$string)
		]));
var $author$project$Pages$Hardware$updateDescriptionDecoder = A4(
	$elm$json$Json$Decode$map3,
	$author$project$Pages$Hardware$UpdateDescription,
	A2(
		$elm$json$Json$Decode$field,
		'updatedFields',
		$elm$json$Json$Decode$dict($author$project$Pages$Hardware$updatedFieldDecoder)),
	A2(
		$elm$json$Json$Decode$field,
		'removedFields',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
	A2(
		$elm$json$Json$Decode$field,
		'truncatedArrays',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$string)));
var $author$project$Pages$Hardware$changeDecoder = A5(
	$elm$json$Json$Decode$map4,
	$author$project$Pages$Hardware$Change,
	A2($elm$json$Json$Decode$field, 'operationType', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'documentKey', $author$project$Pages$Hardware$documentKeyDecoder),
	A2($elm$json$Json$Decode$field, 'updateDescription', $author$project$Pages$Hardware$updateDescriptionDecoder),
	A2(
		$elm$json$Json$Decode$field,
		'fullDocument',
		$elm$json$Json$Decode$maybe($author$project$Pages$Hardware$fullDocumentDecoder)));
var $author$project$Pages$Hardware$emptyChange = {
	pg: {A: ''},
	m3: $elm$core$Maybe$Nothing,
	ka: '',
	ny: {n9: _List_Nil, r2: _List_Nil, of: $elm$core$Dict$empty}
};
var $author$project$Pages$Hardware$ensureDataIsJsonObj = function (dataFromMongo) {
	if (!dataFromMongo.$) {
		var value = dataFromMongo.a;
		return value;
	} else {
		var str = dataFromMongo.a;
		var _v1 = A2($elm$json$Json$Decode$decodeString, $elm$json$Json$Decode$value, str);
		if (!_v1.$) {
			var jsonVal = _v1.a;
			return jsonVal;
		} else {
			var err = _v1.a;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'Error :',
						$elm$json$Json$Encode$string('Problem converting string to value'))
					]));
		}
	}
};
var $author$project$Data$Ranking$extractInsertedIdFromString = function (jsonString) {
	var splitString = A2($elm$core$String$split, '\"', jsonString);
	if (((((splitString.b && splitString.b.b) && splitString.b.b.b) && splitString.b.b.b.b) && splitString.b.b.b.b.b) && (!splitString.b.b.b.b.b.b)) {
		var _v1 = splitString.b;
		var _v2 = _v1.b;
		var _v3 = _v2.b;
		var insertedId = _v3.a;
		var _v4 = _v3.b;
		return $elm$core$Maybe$Just(insertedId);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $author$project$Pages$Hardware$filterAndSortRankingsOnLeaving = F3(
	function (userid, rankings, changes) {
		var nochallengersRankings = A2($author$project$Data$Ranking$abandonSingleUserChallenge, userid, rankings);
		var changePlayerIds = A2(
			$elm$core$List$map,
			function ($) {
				return $.n5;
			},
			A2($elm$core$List$concatMap, $elm$core$Tuple$second, changes));
		return A2(
			$elm$core$List$indexedMap,
			F2(
				function (index, rank) {
					return _Utils_update(
						rank,
						{bC: index + 1});
				}),
			A2(
				$elm$core$List$sortBy,
				function ($) {
					return $.bC;
				},
				A2(
					$elm$core$List$filter,
					function (ranking) {
						return A2($elm$core$List$member, ranking.aB.A, changePlayerIds);
					},
					nochallengersRankings)));
	});
var $author$project$Pages$Hardware$handleDecodeRanking = function (rawJsonMessage) {
	return A2($elm$json$Json$Decode$decodeValue, $author$project$Data$Ranking$rankingDecoder, rawJsonMessage);
};
var $author$project$Pages$Hardware$handleDecodeUser = function (rawJsonMessage) {
	var decodedJsonMsg = A2($elm$json$Json$Decode$decodeValue, $author$project$Data$User$userInfoDecoder, rawJsonMessage);
	if (!decodedJsonMsg.$) {
		var decodedUser = decodedJsonMsg.a;
		return decodedUser;
	} else {
		var err = decodedJsonMsg.a;
		return $author$project$Data$User$emptyUserInfo;
	}
};
var $author$project$Data$Ranking$NewlyJoinedRanking = function (id) {
	return {A: id};
};
var $author$project$Data$Ranking$newlyJoinedRankingDecoder = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'_id',
	$elm$json$Json$Decode$value,
	$elm$json$Json$Decode$succeed($author$project$Data$Ranking$NewlyJoinedRanking));
var $author$project$Pages$Hardware$handleNewlyJoinedDecodeRanking = function (jsonObj) {
	return A2($elm$json$Json$Decode$decodeValue, $author$project$Data$Ranking$newlyJoinedRankingDecoder, jsonObj);
};
var $elm$regex$Regex$never = _Regex_never;
var $author$project$Pages$Hardware$is24AlphanumericChars = function (str) {
	var regex = A2(
		$elm$core$Maybe$withDefault,
		$elm$regex$Regex$never,
		$elm$regex$Regex$fromString('^[a-zA-Z0-9]{24}$'));
	return A2($elm$regex$Regex$contains, regex, str);
};
var $author$project$Data$Ranking$isCurrentlyInAChallenge = function (rank) {
	return (_Utils_eq(rank.aB.A, $author$project$Extras$Constants$noCurrentChallengerId) || _Utils_eq(rank.an.A, $author$project$Extras$Constants$noCurrentChallengerId)) ? false : true;
};
var $author$project$Pages$Hardware$AdditionalDataFromJs = F2(
	function (userid, nickname) {
		return {dw: nickname, r9: userid};
	});
var $author$project$Pages$Hardware$additonalDataFromJsDecoder = A3(
	$elm$json$Json$Decode$map2,
	$author$project$Pages$Hardware$AdditionalDataFromJs,
	A2($elm$json$Json$Decode$field, 'userid', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'nickname', $elm$json$Json$Decode$string));
var $author$project$Pages$Hardware$StringData = function (a) {
	return {$: 1, a: a};
};
var $author$project$Pages$Hardware$dataFromMongoDecoder = $elm$json$Json$Decode$oneOf(
	_List_fromArray(
		[
			A2($elm$json$Json$Decode$map, $author$project$Pages$Hardware$JsonData, $elm$json$Json$Decode$value),
			A2($elm$json$Json$Decode$map, $author$project$Pages$Hardware$StringData, $elm$json$Json$Decode$string)
		]));
var $author$project$Pages$Hardware$jsonMsgFromJsDecoder = A4(
	$elm$json$Json$Decode$map3,
	$author$project$Pages$Hardware$JsonMsgFromJs,
	A2($elm$json$Json$Decode$field, 'operationEventMsg', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'dataFromMongo', $author$project$Pages$Hardware$dataFromMongoDecoder),
	A2($elm$json$Json$Decode$field, 'additionalDataFromJs', $author$project$Pages$Hardware$additonalDataFromJsDecoder));
var $author$project$Pages$Hardware$LNSConnectResponse = function (a) {
	return {$: 62, a: a};
};
var $author$project$Pages$Hardware$SuccessfullLNSConnectResult = F5(
	function (_function, date, id, message, transport_type) {
		return {ts: date, tY: _function, A: id, uL: message, wv: transport_type};
	});
var $elm$json$Json$Decode$map5 = _Json_map5;
var $author$project$Pages$Hardware$lnsResponseDecoder = A6(
	$elm$json$Json$Decode$map5,
	$author$project$Pages$Hardware$SuccessfullLNSConnectResult,
	A2(
		$elm$json$Json$Decode$field,
		'context',
		A2($elm$json$Json$Decode$field, 'function', $elm$json$Json$Decode$string)),
	A2($elm$json$Json$Decode$field, 'date', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'id', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'message', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'type', $elm$json$Json$Decode$string));
var $author$project$Pages$Hardware$lnsConnectRequest = function (model) {
	var therequest = $elm$http$Http$request(
		{
			sV: $elm$http$Http$emptyBody,
			m2: A2($elm$http$Http$expectJson, $author$project$Pages$Hardware$LNSConnectResponse, $author$project$Pages$Hardware$lnsResponseDecoder),
			t7: _List_Nil,
			uM: 'POST',
			wo: $elm$core$Maybe$Nothing,
			wu: $elm$core$Maybe$Nothing,
			bF: 'http://localhost:1234/hardware'
		});
	return therequest;
};
var $elm$core$String$dropRight = F2(
	function (n, string) {
		return (n < 1) ? string : A3($elm$core$String$slice, 0, -n, string);
	});
var $elm$core$String$trim = _String_trim;
var $author$project$Data$Ranking$newlyJoinedRankingIdAsValueManipulation = function (newlyJoinedRanking) {
	var jsonEncodedId = $elm$core$String$trim(
		A2($elm$json$Json$Encode$encode, 0, newlyJoinedRanking.A));
	var trimmedId = A2(
		$elm$core$String$dropLeft,
		1,
		A2($elm$core$String$dropRight, 1, jsonEncodedId));
	return trimmedId;
};
var $author$project$Extras$Constants$placeholderUrl = A6(
	$elm$url$Url$Url,
	0,
	'localhost',
	$elm$core$Maybe$Just(3000),
	'',
	$elm$core$Maybe$Nothing,
	$elm$core$Maybe$Nothing);
var $author$project$Pages$Hardware$ProfileResponse = function (a) {
	return {$: 63, a: a};
};
var $author$project$Pages$Hardware$SuccessfullProfileResult = F5(
	function (user_id, domain_id, identities, data, typeOfData) {
		return {tq: data, tE: domain_id, ug: identities, r3: typeOfData, r8: user_id};
	});
var $author$project$Pages$Hardware$Identities = F4(
	function (id, provider_type, provider_id, provider_data) {
		return {A: id, vl: provider_data, vm: provider_id, vn: provider_type};
	});
var $author$project$Pages$Hardware$ProviderData = function (email) {
	return {nN: email};
};
var $author$project$Pages$Hardware$providerDataDecoder = A2(
	$elm$json$Json$Decode$map,
	$author$project$Pages$Hardware$ProviderData,
	A2($elm$json$Json$Decode$field, 'email', $elm$json$Json$Decode$string));
var $author$project$Pages$Hardware$identitiesDecoder = $elm$json$Json$Decode$list(
	A5(
		$elm$json$Json$Decode$map4,
		$author$project$Pages$Hardware$Identities,
		A2($elm$json$Json$Decode$field, 'id', $elm$json$Json$Decode$string),
		A2($elm$json$Json$Decode$field, 'provider_type', $elm$json$Json$Decode$string),
		A2($elm$json$Json$Decode$field, 'provider_id', $elm$json$Json$Decode$string),
		A2($elm$json$Json$Decode$field, 'provider_data', $author$project$Pages$Hardware$providerDataDecoder)));
var $author$project$Pages$Hardware$profileDecoder = A6(
	$elm$json$Json$Decode$map5,
	$author$project$Pages$Hardware$SuccessfullProfileResult,
	A2($elm$json$Json$Decode$field, 'user_id', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'domain_id', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'identities', $author$project$Pages$Hardware$identitiesDecoder),
	A2($elm$json$Json$Decode$field, 'data', $author$project$Pages$Hardware$providerDataDecoder),
	A2($elm$json$Json$Decode$field, 'type', $elm$json$Json$Decode$string));
var $author$project$Pages$Hardware$profileRequest = function (model) {
	var headers = _List_fromArray(
		[
			A2(
			$elm$http$Http$header,
			'Authorization',
			'Bearer ' + A2($elm$core$Maybe$withDefault, 'No access token ', model.at.dR))
		]);
	var therequest = $elm$http$Http$request(
		{
			sV: $elm$http$Http$emptyBody,
			m2: A2($elm$http$Http$expectJson, $author$project$Pages$Hardware$ProfileResponse, $author$project$Pages$Hardware$profileDecoder),
			t7: headers,
			uM: 'GET',
			wo: $elm$core$Maybe$Nothing,
			wu: $elm$core$Maybe$Nothing,
			bF: 'https://ap-southeast-1.aws.realm.mongodb.com/api/client/v2.0/auth/profile'
		});
	return therequest;
};
var $author$project$Data$Ranking$tempNewlyCreatedRanking = F3(
	function (id, owner_name, name) {
		return {
			mO: false,
			dG: {h0: '', lH: ''},
			A: id,
			nb: _List_fromArray(
				[$author$project$Data$Ranking$emptyRank]),
			fR: name,
			f0: '0',
			n3: owner_name,
			n6: 0
		};
	});
var $author$project$Pages$Hardware$updateNewRankingOnChangeEvent = F2(
	function (change, ranking) {
		var updatedRanking = function () {
			var _v0 = change.ka;
			switch (_v0) {
				case 'insert':
					return $author$project$Data$Ranking$emptyRanking;
				case 'update':
					return ranking;
				default:
					return $author$project$Data$Ranking$emptyRanking;
			}
		}();
		return updatedRanking;
	});
var $author$project$Pages$Hardware$Error = function (a) {
	return {$: 13, a: a};
};
var $author$project$Pages$Hardware$validateEmail = function (eml) {
	var pattern = $elm$regex$Regex$fromString('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
	if (!eml.$) {
		var email = eml.a;
		if (!pattern.$) {
			var patn = pattern.a;
			return A2($elm$regex$Regex$contains, patn, email) ? $elm$core$Result$Ok(email) : $elm$core$Result$Err('Please enter a valid email format');
		} else {
			return $elm$core$Result$Err('');
		}
	} else {
		return $elm$core$Result$Err('Email ');
	}
};
var $author$project$Pages$Hardware$validateName = function (nme) {
	var pattern = $elm$regex$Regex$fromString('^[a-zA-Z\\s]+$');
	if (!nme.$) {
		var name = nme.a;
		if (($elm$core$String$length(name) >= 3) && ($elm$core$String$length(name) <= 30)) {
			if (!pattern.$) {
				var patn = pattern.a;
				return A2($elm$regex$Regex$contains, patn, name) ? $elm$core$Result$Ok(name) : $elm$core$Result$Err('Name can only contain alphabetic characters');
			} else {
				return $elm$core$Result$Err('Name can only contain alphabetic characters');
			}
		} else {
			if ($elm$core$String$isEmpty(name)) {
				return $elm$core$Result$Err('Name cannot be empty');
			} else {
				if ($elm$core$String$length(name) < 3) {
					return $elm$core$Result$Err('Name must have at least 3 characters');
				} else {
					return $elm$core$Result$Err('Name cannot exceed 30 characters');
				}
			}
		}
	} else {
		return $elm$core$Result$Err('Name ');
	}
};
var $author$project$Pages$Hardware$validatePassword = function (pword) {
	var pattern = $elm$regex$Regex$fromString('^.{6,30}$');
	if (!pattern.$) {
		var patn = pattern.a;
		return A2($elm$regex$Regex$contains, patn, pword) ? $elm$core$Result$Ok(pword) : $elm$core$Result$Err('Please enter a password between 6 and 30 characters in length');
	} else {
		return $elm$core$Result$Err('');
	}
};
var $author$project$Pages$Hardware$updateNewUserRegistrationFormField = F3(
	function (msg, queryType, model) {
		var newUserDetails = function () {
			if (queryType.$ === 3) {
				var userDetails = queryType.a;
				switch (msg.$) {
					case 5:
						var nme = msg.a;
						var newname = (nme === '') ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(nme);
						var vldResult = function () {
							var _v3 = $author$project$Pages$Hardware$validateName(newname);
							if (!_v3.$) {
								return '';
							} else {
								var err = _v3.a;
								return err;
							}
						}();
						return _Utils_update(
							userDetails,
							{uT: vldResult, dw: nme});
					case 1:
						var age = msg.a;
						return _Utils_update(
							userDetails,
							{sw: age});
					case 2:
						var value = msg.a;
						var newValue = function () {
							switch (value) {
								case 'Male':
									return 0;
								case 'Female':
									return 1;
								default:
									return 0;
							}
						}();
						return _Utils_update(
							userDetails,
							{tZ: newValue});
					case 3:
						var email = msg.a;
						var newemail = (email === '') ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(email);
						var vldResult = function () {
							var _v5 = $author$project$Pages$Hardware$validateEmail(newemail);
							if (!_v5.$) {
								return '';
							} else {
								var err = _v5.a;
								return err;
							}
						}();
						return _Utils_update(
							userDetails,
							{nN: newemail, tI: vldResult});
					case 4:
						var pword = msg.a;
						var vldResult = function () {
							var _v6 = $author$project$Pages$Hardware$validatePassword(pword);
							if (!_v6.$) {
								return '';
							} else {
								var err = _v6.a;
								return err;
							}
						}();
						return _Utils_update(
							userDetails,
							{n4: pword, ve: vldResult});
					case 6:
						var value = msg.a;
						var desc = userDetails.dY;
						var newDesc = _Utils_update(
							desc,
							{nX: value});
						return _Utils_update(
							userDetails,
							{dY: newDesc});
					case 7:
						var value = msg.a;
						var desc = userDetails.dY;
						var newDesc = _Utils_update(
							desc,
							{nF: value});
						return _Utils_update(
							userDetails,
							{dY: newDesc});
					case 8:
						var value = msg.a;
						return _Utils_update(
							userDetails,
							{
								n_: $elm$core$Maybe$Just(value)
							});
					case 12:
						var value = msg.a;
						return _Utils_update(
							userDetails,
							{st: value});
					default:
						return userDetails;
				}
			} else {
				return $author$project$Data$User$emptyUserInfo;
			}
		}();
		var newLoginOrRegistration = function () {
			if (queryType.$ === 3) {
				return $author$project$Pages$Hardware$RegisterUser(newUserDetails);
			} else {
				return $author$project$Pages$Hardware$Error('newLoginOrRegistration err');
			}
		}();
		return _Utils_update(
			model,
			{bJ: newLoginOrRegistration});
	});
var $author$project$Data$Ranking$updatedCity = F2(
	function (ranking, str) {
		var baseaddress = ranking.dG;
		var newBaseAddress = _Utils_update(
			baseaddress,
			{h0: str});
		return _Utils_update(
			ranking,
			{dG: newBaseAddress});
	});
var $author$project$Data$Ranking$updatedRankingName = F2(
	function (ranking, str) {
		return _Utils_update(
			ranking,
			{fR: str});
	});
var $author$project$Data$Ranking$updatedStreet = F2(
	function (ranking, str) {
		var baseaddress = ranking.dG;
		var newBaseAddress = _Utils_update(
			baseaddress,
			{lH: str});
		return _Utils_update(
			ranking,
			{dG: newBaseAddress});
	});
var $author$project$Pages$Hardware$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 49:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bJ: $author$project$Pages$Hardware$MemberSelectedView}),
					$elm$core$Platform$Cmd$none);
			case 59:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bJ: $author$project$Pages$Hardware$ConfirmDeleteUserView}),
					$elm$core$Platform$Cmd$none);
			case 60:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							bJ: $author$project$Pages$Hardware$Login($author$project$Extras$Constants$emptyEmailPassword)
						}),
					$elm$core$Platform$Cmd$none);
			case 56:
				var newUser = $author$project$Data$User$gotUserInfo(model.dl);
				var newMemberRankings = function () {
					var _v1 = model.er;
					if (_v1.$ === 1) {
						var ranking = _v1.a;
						return A2($author$project$Data$User$deleteRankingFromMemberRankings, model.dl, ranking.A);
					} else {
						return _List_fromArray(
							[$author$project$Data$Ranking$emptyRanking]);
					}
				}();
				var newUserInfo = _Utils_update(
					newUser,
					{ea: newMemberRankings});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							bJ: $author$project$Pages$Hardware$LoggedInUser,
							dl: $author$project$Data$User$Registered(newUserInfo)
						}),
					$elm$core$Platform$Cmd$none);
			case 54:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bJ: $author$project$Pages$Hardware$LoggedInUser}),
					$elm$core$Platform$Cmd$none);
			case 57:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 58:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bJ: $author$project$Pages$Hardware$ConfirmLeaveMemberView}),
					$elm$core$Platform$Cmd$none);
			case 55:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bJ: $author$project$Pages$Hardware$SpectatorSelectedView}),
					$elm$core$Platform$Cmd$none);
			case 53:
				var _v2 = model.dl;
				if (_v2.$ === 1) {
					var userInfo = _v2.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{bJ: $author$project$Pages$Hardware$ConfirmJoinMemberView}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								bJ: $author$project$Pages$Hardware$RegisterUser($author$project$Data$User$emptyUserInfo)
							}),
						$elm$core$Platform$Cmd$none);
				}
			case 33:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							bJ: $author$project$Pages$Hardware$Login($author$project$Extras$Constants$emptyEmailPassword)
						}),
					$elm$core$Platform$Cmd$none);
			case 47:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 48:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 46:
				var rank = msg.a;
				var ranking = function () {
					var _v3 = model.er;
					switch (_v3.$) {
						case 0:
							var rankng = _v3.a;
							return rankng;
						case 1:
							var rankng = _v3.a;
							return rankng;
						case 2:
							var rankng = _v3.a;
							return rankng;
						default:
							return $author$project$Data$Ranking$emptyRanking;
					}
				}();
				var qType = $author$project$Data$Ranking$isCurrentlyInAChallenge(rank) ? $author$project$Pages$Hardware$PrepareResult : A2($author$project$Pages$Hardware$CreateChallengeView, rank, ranking);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bJ: qType, oa: rank}),
					$elm$core$Platform$Cmd$none);
			case 32:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bJ: $author$project$Pages$Hardware$LoggedInUser}),
					$elm$core$Platform$Cmd$none);
			case 30:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bJ: $author$project$Pages$Hardware$LoggedInUser}),
					$elm$core$Platform$Cmd$none);
			case 29:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bJ: $author$project$Pages$Hardware$LoggedInUser}),
					$elm$core$Platform$Cmd$none);
			case 31:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bJ: $author$project$Pages$Hardware$LoggedInUser}),
					$elm$core$Platform$Cmd$none);
			case 45:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 44:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bJ: $author$project$Pages$Hardware$ConfirmDeleteOwnedRanking}),
					$elm$core$Platform$Cmd$none);
			case 40:
				var value = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							er: $author$project$Data$Ranking$Owned(
								A2(
									$author$project$Data$Ranking$updatedRankingName,
									$author$project$Data$Ranking$gotRanking(model.er),
									value))
						}),
					$elm$core$Platform$Cmd$none);
			case 41:
				var value = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							er: $author$project$Data$Ranking$Owned(
								A2(
									$author$project$Data$Ranking$updatedStreet,
									$author$project$Data$Ranking$gotRanking(model.er),
									value))
						}),
					$elm$core$Platform$Cmd$none);
			case 42:
				var value = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							er: $author$project$Data$Ranking$Owned(
								A2(
									$author$project$Data$Ranking$updatedCity,
									$author$project$Data$Ranking$gotRanking(model.er),
									value))
						}),
					$elm$core$Platform$Cmd$none);
			case 27:
				var userInfo = msg.a;
				var newRanking = $author$project$Data$Ranking$emptyRanking;
				var newRank = A3(
					$author$project$Data$Ranking$Rank,
					1,
					{A: userInfo.r9, dw: userInfo.dw},
					{A: $author$project$Extras$Constants$noCurrentChallengerId, dw: 'Challenger'});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							bJ: $author$project$Pages$Hardware$CreatingNewLadder(userInfo),
							er: $author$project$Data$Ranking$Owned(
								_Utils_update(
									newRanking,
									{
										mO: true,
										nb: _List_fromArray(
											[newRank]),
										f0: userInfo.r9,
										n3: userInfo.dw,
										n6: 1
									}))
						}),
					$elm$core$Platform$Cmd$none);
			case 38:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 36:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 37:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 35:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 24:
				var receivedJson = msg.a;
				var decodedJsObj = function () {
					var _v24 = A2($elm$json$Json$Decode$decodeValue, $author$project$Pages$Hardware$jsonMsgFromJsDecoder, receivedJson);
					if (!_v24.$) {
						var jsObj = _v24.a;
						return jsObj;
					} else {
						var err = _v24.a;
						return A3(
							$author$project$Pages$Hardware$JsonMsgFromJs,
							'ERROR',
							$author$project$Pages$Hardware$JsonData(
								$elm$json$Json$Encode$object(_List_Nil)),
							{
								dw: $elm$json$Json$Decode$errorToString(err),
								r9: $elm$json$Json$Decode$errorToString(err)
							});
					}
				}();
				var errors = function () {
					var _v23 = decodedJsObj.fZ;
					if (_v23 === 'LOGINDENIED') {
						return _List_fromArray(
							['Login Denied - Please try again ...']);
					} else {
						return _List_Nil;
					}
				}();
				var json = $author$project$Pages$Hardware$ensureDataIsJsonObj(decodedJsObj.o8);
				var newRanking = function () {
					var _v16 = decodedJsObj.fZ;
					switch (_v16) {
						case 'ownedranking':
							var _v17 = $author$project$Pages$Hardware$handleDecodeRanking(json);
							if (!_v17.$) {
								var rnking = _v17.a;
								return $author$project$Data$Ranking$Owned(rnking);
							} else {
								var err = _v17.a;
								return $author$project$Data$Ranking$Owned($author$project$Data$Ranking$emptyRanking);
							}
						case 'memberranking':
							var _v18 = $author$project$Pages$Hardware$handleDecodeRanking(json);
							if (!_v18.$) {
								var rnking = _v18.a;
								return $author$project$Data$Ranking$Member(rnking);
							} else {
								var err = _v18.a;
								return $author$project$Data$Ranking$Member($author$project$Data$Ranking$emptyRanking);
							}
						case 'JoinedRankingConfirm':
							return model.er;
						case 'CreatedNewRanking':
							return model.er;
						case 'webSocket':
							var currentSelectedRanking = $author$project$Data$Ranking$gotRanking(model.er);
							var chnge = function () {
								var _v22 = A2($elm$json$Json$Decode$decodeValue, $author$project$Pages$Hardware$changeDecoder, json);
								if (!_v22.$) {
									var change = _v22.a;
									return change;
								} else {
									var err = _v22.a;
									return $author$project$Pages$Hardware$emptyChange;
								}
							}();
							var playersFromChangeEvent = function () {
								var _v20 = chnge.m3;
								if (!_v20.$) {
									var fullDoc = _v20.a;
									var _v21 = fullDoc.qV;
									if (!_v21.$) {
										var players = _v21.a;
										return players;
									} else {
										return _List_Nil;
									}
								} else {
									return _List_Nil;
								}
							}();
							var newLadder = A3(
								$author$project$Pages$Hardware$filterAndSortRankingsOnLeaving,
								$author$project$Data$User$gotId(model.dl),
								currentSelectedRanking.nb,
								_List_fromArray(
									[
										_Utils_Tuple2('players', playersFromChangeEvent)
									]));
							var newRking = _Utils_update(
								currentSelectedRanking,
								{
									nb: newLadder,
									n6: $elm$core$List$length(newLadder)
								});
							var updatedFieldsList = $elm$core$Dict$toList(chnge.ny.of);
							var updatedRanking = A2($author$project$Pages$Hardware$updateNewRankingOnChangeEvent, chnge, newRking);
							var _v19 = model.er;
							switch (_v19.$) {
								case 1:
									return $author$project$Data$Ranking$Member(updatedRanking);
								case 0:
									return $author$project$Data$Ranking$Owned(updatedRanking);
								default:
									return $author$project$Data$Ranking$Spectator(updatedRanking);
							}
						default:
							return $author$project$Data$Ranking$None;
					}
				}();
				var updatedquerytype = function () {
					var _v13 = decodedJsObj.fZ;
					switch (_v13) {
						case 'NewUserCreationComplete':
							return $author$project$Pages$Hardware$Login($author$project$Extras$Constants$emptyEmailPassword);
						case 'USERDELETECOMPLETE':
							return $author$project$Pages$Hardware$Login($author$project$Extras$Constants$emptyEmailPassword);
						case 'LOGINDENIED':
							return $author$project$Pages$Hardware$Login($author$project$Extras$Constants$emptyEmailPassword);
						case 'ownedranking':
							return $author$project$Pages$Hardware$OwnedSelectedView;
						case 'memberranking':
							return $author$project$Pages$Hardware$MemberSelectedView;
						case 'JoinedRankingConfirm':
							var _v14 = model.er;
							if (_v14.$ === 1) {
								var selrnking = _v14.a;
								return $author$project$Pages$Hardware$MemberSelectedView;
							} else {
								return $author$project$Pages$Hardware$LoggedInUser;
							}
						case 'webSocket':
							var _v15 = model.er;
							switch (_v15.$) {
								case 1:
									return $author$project$Pages$Hardware$MemberSelectedView;
								case 0:
									return $author$project$Pages$Hardware$OwnedSelectedView;
								default:
									return $author$project$Pages$Hardware$LoggedInUser;
							}
						default:
							return $author$project$Pages$Hardware$Login($author$project$Extras$Constants$emptyEmailPassword);
					}
				}();
				var usrInfo = function () {
					var _v5 = decodedJsObj.fZ;
					switch (_v5) {
						case 'webSocket':
							var operationType = function () {
								var _v6 = A2($elm$json$Json$Decode$decodeValue, $author$project$Pages$Hardware$changeDecoder, json);
								if (!_v6.$) {
									var change = _v6.a;
									return change.ka;
								} else {
									var err = _v6.a;
									return $elm$json$Json$Decode$errorToString(err);
								}
							}();
							return $author$project$Data$User$gotUserInfo(model.dl);
						case 'NewUserCreationComplete':
							var emptyUsrInfo = $author$project$Data$User$emptyUserInfo;
							var newUsrInfo = _Utils_update(
								emptyUsrInfo,
								{dw: decodedJsObj.nB.dw, r9: decodedJsObj.nB.r9});
							return newUsrInfo;
						case 'LOGINCONFIRM':
							return $author$project$Pages$Hardware$handleDecodeUser(json);
						case 'CreatedNewRanking':
							var jsonString = A2($elm$json$Json$Encode$encode, 0, json);
							var _v7 = $author$project$Data$Ranking$extractInsertedIdFromString(jsonString);
							if (!_v7.$) {
								var insertedId = _v7.a;
								if ($author$project$Pages$Hardware$is24AlphanumericChars(insertedId)) {
									var userUpdatedWithNewRanking = A2(
										$author$project$Data$User$addNewLadderToOwnedRankings,
										model.dl,
										A3(
											$author$project$Data$Ranking$tempNewlyCreatedRanking,
											insertedId,
											$author$project$Data$Ranking$gotRanking(model.er).n3,
											$author$project$Data$Ranking$gotRanking(model.er).fR));
									return $author$project$Data$User$gotUserInfo(userUpdatedWithNewRanking);
								} else {
									return $author$project$Data$User$gotUserInfo(model.dl);
								}
							} else {
								return $author$project$Data$User$gotUserInfo(model.dl);
							}
						case 'ownedranking':
							var decodedRanking = function () {
								var _v8 = $author$project$Pages$Hardware$handleDecodeRanking(json);
								if (!_v8.$) {
									var rnking = _v8.a;
									return rnking;
								} else {
									var err = _v8.a;
									return $author$project$Data$Ranking$emptyRanking;
								}
							}();
							return $author$project$Data$User$gotUserInfo(
								A2($author$project$Data$User$addNewLadderToOwnedRankings, model.dl, decodedRanking));
						case 'JoinedRankingConfirm':
							var _v9 = $author$project$Pages$Hardware$handleNewlyJoinedDecodeRanking(json);
							if (!_v9.$) {
								var newlyJoinedRanking = _v9.a;
								var _v10 = model.er;
								if (_v10.$ === 1) {
									var selrnking = _v10.a;
									return _Utils_eq(
										selrnking.A,
										$author$project$Data$Ranking$newlyJoinedRankingIdAsValueManipulation(newlyJoinedRanking)) ? $author$project$Data$User$gotUserInfo(
										A2($author$project$Data$User$addNewLadderToMemberRankings, model.dl, selrnking)) : $author$project$Data$User$gotUserInfo(model.dl);
								} else {
									return $author$project$Data$User$gotUserInfo(model.dl);
								}
							} else {
								var err = _v9.a;
								return $author$project$Data$User$gotUserInfo(model.dl);
							}
						case 'ResultSubmitted':
							var _v11 = model.dl;
							if (_v11.$ === 1) {
								var userInfo = _v11.a;
								return userInfo;
							} else {
								return $author$project$Data$User$emptyUserInfo;
							}
						default:
							var _v12 = model.dl;
							if (_v12.$ === 1) {
								var userInfo = _v12.a;
								return userInfo;
							} else {
								return $author$project$Data$User$emptyUserInfo;
							}
					}
				}();
				var newUser = function () {
					var _v4 = decodedJsObj.fZ;
					switch (_v4) {
						case 'USERDELETECOMPLETE':
							return $author$project$Data$User$emptySpectator;
						case 'LOGINDENIED':
							return $author$project$Data$User$emptySpectator;
						case 'CreatedNewRanking':
							return $author$project$Data$User$Registered(usrInfo);
						case 'NewUserCreationComplete':
							return $author$project$Data$User$Registered(usrInfo);
						default:
							return $author$project$Data$User$Registered(usrInfo);
					}
				}();
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							d$: errors,
							qC: $elm$core$Maybe$Just(decodedJsObj),
							bJ: updatedquerytype,
							er: newRanking,
							dl: newUser
						}),
					$elm$core$Platform$Cmd$none);
			case 34:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 43:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 28:
				return _Utils_Tuple2(
					function () {
						var _v25 = model.bJ;
						switch (_v25.$) {
							case 9:
								return _Utils_update(
									model,
									{bJ: $author$project$Pages$Hardware$OwnedSelectedView});
							case 11:
								return _Utils_update(
									model,
									{bJ: $author$project$Pages$Hardware$MemberSelectedView});
							case 10:
								return _Utils_update(
									model,
									{bJ: $author$project$Pages$Hardware$LoggedInUser});
							default:
								return _Utils_update(
									model,
									{
										bJ: $author$project$Pages$Hardware$Login($author$project$Extras$Constants$emptyEmailPassword)
									});
						}
					}(),
					$elm$core$Platform$Cmd$none);
			case 25:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 23:
				var emailpword = msg.a;
				return _Utils_Tuple2(
					model,
					$author$project$Pages$Hardware$lnsConnectRequest(model));
			case 39:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 26:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							bJ: $author$project$Pages$Hardware$RegisterUser($author$project$Data$User$emptyUserInfo)
						}),
					$elm$core$Platform$Cmd$none);
			case 50:
				var searchTerm = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{vN: searchTerm}),
					$elm$core$Platform$Cmd$none);
			case 21:
				var newemail = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							dJ: {nN: newemail, n4: model.dJ.n4}
						}),
					$elm$core$Platform$Cmd$none);
			case 22:
				var newPwrd = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							dJ: {nN: model.dJ.nN, n4: newPwrd}
						}),
					$elm$core$Platform$Cmd$none);
			case 20:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{nW: !model.nW}),
					$elm$core$Platform$Cmd$none);
			case 19:
				var selectedHour = msg.a;
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 17:
				var inputElement = msg.a;
				var _v26 = model.bJ;
				if (_v26.$ === 3) {
					var bkaapt = _v26.a;
					var newApiSpecs = model.at;
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 18:
				var inputElement = msg.a;
				var _v27 = model.bJ;
				if (_v27.$ === 3) {
					var bkaapt = _v27.a;
					var newApiSpecs = model.at;
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 16:
				var newTime = msg.a;
				var dateTimeOnlyUpdatedIfNotSelected = function () {
					var _v28 = model.nG;
					if (!_v28.$) {
						if (!_v28.a.$) {
							var _v29 = _v28.a;
							return $elm$core$Maybe$Just(
								A2($author$project$Types$DateType$CurrentDateTime, newTime, $elm$time$Time$utc));
						} else {
							var _v30 = _v28.a;
							var dt = _v30.a;
							var zone = _v30.b;
							return $elm$core$Maybe$Just(
								A2($author$project$Types$DateType$SelectedDateTime, dt, zone));
						}
					} else {
						return $elm$core$Maybe$Just(
							A2($author$project$Types$DateType$CurrentDateTime, newTime, $elm$time$Time$utc));
					}
				}();
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{nG: dateTimeOnlyUpdatedIfNotSelected}),
					$elm$core$Platform$Cmd$none);
			case 15:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{d$: _List_Nil}),
					$elm$core$Platform$Cmd$none);
			case 14:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 64:
				if (!msg.a.$) {
					var auth = msg.a.a;
					var headers = _List_fromArray(
						[
							A2(
							$elm$http$Http$header,
							'Authorization',
							'Bearer ' + A2($elm$core$Maybe$withDefault, 'No access token', auth.ws))
						]);
					var flagUrlWithMongoDBMWAndPortUpdate = A2($elm$core$String$contains, $author$project$Extras$Constants$localorproductionServerAutoCheck, model.iI.fr) ? $elm$url$Url$toString(
						A6($elm$url$Url$Url, model.iI.ni, model.iI.fr, $elm$core$Maybe$Nothing, $author$project$Extras$Constants$middleWarePath, $elm$core$Maybe$Nothing, $elm$core$Maybe$Nothing)) : $elm$url$Url$toString(
						A6(
							$elm$url$Url$Url,
							model.iI.ni,
							model.iI.fr,
							$elm$core$Maybe$Just(3000),
							$author$project$Extras$Constants$middleWarePath,
							$elm$core$Maybe$Nothing,
							$elm$core$Maybe$Nothing));
					var newHttpParams = A6($author$project$Pages$Hardware$ToMongoDBMWConfig, $author$project$Extras$Constants$get, headers, flagUrlWithMongoDBMWAndPortUpdate, $elm$http$Http$emptyBody, $elm$core$Maybe$Nothing, $elm$core$Maybe$Nothing);
					var newModel = _Utils_update(
						model,
						{
							d8: true,
							bJ: $author$project$Pages$Hardware$LoggedInUser,
							gN: $elm$core$Maybe$Just(newHttpParams),
							dl: $author$project$Data$User$Registered(auth)
						});
					var apiSpecs = model.at;
					return _Utils_Tuple2(newModel, $elm$core$Platform$Cmd$none);
				} else {
					var responseErr = msg.a.a;
					var respErr = $author$project$Extras$Constants$httpErrorToString(responseErr);
					var apiSpecs = model.at;
					var newapiSpecs = _Utils_update(
						apiSpecs,
						{dR: $elm$core$Maybe$Nothing});
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								at: newapiSpecs,
								d$: _Utils_ap(
									model.d$,
									_List_fromArray(
										[respErr])),
								d8: false
							}),
						$elm$core$Platform$Cmd$none);
				}
			case 63:
				if (!msg.a.$) {
					var auth = msg.a.a;
					var headers = _List_fromArray(
						[
							A2(
							$elm$http$Http$header,
							'Authorization',
							'Bearer ' + A2(
								$elm$core$Maybe$withDefault,
								'No access token 2',
								$elm$core$Maybe$Just(auth.r3)))
						]);
					var flagUrlWithMongoDBMWAndPortUpdate = A2($elm$core$String$contains, $author$project$Extras$Constants$localorproductionServerAutoCheck, model.iI.fr) ? $elm$url$Url$toString(
						A6($elm$url$Url$Url, model.iI.ni, model.iI.fr, $elm$core$Maybe$Nothing, $author$project$Extras$Constants$middleWarePath, $elm$core$Maybe$Nothing, $elm$core$Maybe$Nothing)) : $elm$url$Url$toString(
						A6(
							$elm$url$Url$Url,
							model.iI.ni,
							model.iI.fr,
							$elm$core$Maybe$Just(3000),
							$author$project$Extras$Constants$middleWarePath,
							$elm$core$Maybe$Nothing,
							$elm$core$Maybe$Nothing));
					var newHttpParams = A6($author$project$Pages$Hardware$ToMongoDBMWConfig, $author$project$Extras$Constants$get, headers, flagUrlWithMongoDBMWAndPortUpdate, $elm$http$Http$emptyBody, $elm$core$Maybe$Nothing, $elm$core$Maybe$Nothing);
					var newModel = _Utils_update(
						model,
						{
							d8: true,
							gN: $elm$core$Maybe$Just(newHttpParams)
						});
					var apiSpecs = model.at;
					return _Utils_Tuple2(
						newModel,
						$author$project$Pages$Hardware$callRequest(newModel));
				} else {
					var responseErr = msg.a.a;
					var respErr = $author$project$Extras$Constants$httpErrorToString(responseErr);
					var apiSpecs = model.at;
					var newapiSpecs = _Utils_update(
						apiSpecs,
						{dR: $elm$core$Maybe$Nothing});
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								at: newapiSpecs,
								d$: _Utils_ap(
									model.d$,
									_List_fromArray(
										[respErr])),
								d8: false
							}),
						$elm$core$Platform$Cmd$none);
				}
			case 62:
				if (!msg.a.$) {
					var auth = msg.a.a;
					var headers = _List_Nil;
					var flagUrlWithMongoDBMWAndPortUpdate = A2($elm$core$String$contains, $author$project$Extras$Constants$localorproductionServerAutoCheck, model.iI.fr) ? $elm$url$Url$toString(
						A6($elm$url$Url$Url, model.iI.ni, model.iI.fr, $elm$core$Maybe$Nothing, $author$project$Extras$Constants$middleWarePath, $elm$core$Maybe$Nothing, $elm$core$Maybe$Nothing)) : $elm$url$Url$toString(
						A6(
							$elm$url$Url$Url,
							model.iI.ni,
							model.iI.fr,
							$elm$core$Maybe$Just(3000),
							$author$project$Extras$Constants$middleWarePath,
							$elm$core$Maybe$Nothing,
							$elm$core$Maybe$Nothing));
					var newHttpParams = A6($author$project$Pages$Hardware$ToMongoDBMWConfig, $author$project$Extras$Constants$get, headers, flagUrlWithMongoDBMWAndPortUpdate, $elm$http$Http$emptyBody, $elm$core$Maybe$Nothing, $elm$core$Maybe$Nothing);
					var newModel = _Utils_update(
						model,
						{
							bJ: $author$project$Pages$Hardware$LoggedInUser,
							gN: $elm$core$Maybe$Just(newHttpParams)
						});
					var apiSpecs = model.at;
					return _Utils_Tuple2(newModel, $elm$core$Platform$Cmd$none);
				} else {
					var responseErr = msg.a.a;
					var respErr = $author$project$Extras$Constants$httpErrorToString(responseErr);
					var apiSpecs = model.at;
					var newapiSpecs = _Utils_update(
						apiSpecs,
						{dR: $elm$core$Maybe$Nothing});
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								at: newapiSpecs,
								d$: _Utils_ap(
									model.d$,
									_List_fromArray(
										[respErr])),
								d8: false
							}),
						$elm$core$Platform$Cmd$none);
				}
			case 0:
				var separatePosixDateandTimeCombined = msg.a;
				var apiSpecs = model.at;
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 61:
				if (!msg.a.$) {
					var auth = msg.a.a;
					var headers = _List_fromArray(
						[
							A2(
							$elm$http$Http$header,
							'Authorization',
							'Bearer ' + A2(
								$elm$core$Maybe$withDefault,
								'No access token 2',
								$elm$core$Maybe$Just(auth.nA)))
						]);
					var flagUrlWithMongoDBMWAndPortUpdate = A2($elm$core$String$contains, $author$project$Extras$Constants$localorproductionServerAutoCheck, model.iI.fr) ? $elm$url$Url$toString(
						A6($elm$url$Url$Url, model.iI.ni, model.iI.fr, $elm$core$Maybe$Nothing, $author$project$Extras$Constants$middleWarePath, $elm$core$Maybe$Nothing, $elm$core$Maybe$Nothing)) : $elm$url$Url$toString(
						A6(
							$elm$url$Url$Url,
							model.iI.ni,
							model.iI.fr,
							$elm$core$Maybe$Just(3000),
							$author$project$Extras$Constants$middleWarePath,
							$elm$core$Maybe$Nothing,
							$elm$core$Maybe$Nothing));
					var newHttpParams = A6($author$project$Pages$Hardware$ToMongoDBMWConfig, $author$project$Extras$Constants$get, headers, flagUrlWithMongoDBMWAndPortUpdate, $elm$http$Http$emptyBody, $elm$core$Maybe$Nothing, $elm$core$Maybe$Nothing);
					var apiSpecs = model.at;
					var newModel = _Utils_update(
						model,
						{
							at: _Utils_update(
								apiSpecs,
								{
									dR: $elm$core$Maybe$Just(auth.nA)
								}),
							d8: true,
							bJ: $author$project$Pages$Hardware$LoggedInUser,
							gN: $elm$core$Maybe$Just(newHttpParams)
						});
					return _Utils_Tuple2(
						_Utils_update(
							newModel,
							{m9: false}),
						$author$project$Pages$Hardware$profileRequest(newModel));
				} else {
					var responseErr = msg.a.a;
					var newFailedErr = function () {
						if ((responseErr.$ === 3) && (responseErr.a === 401)) {
							return 'Login Denied - Please try again ...';
						} else {
							return 'Login Denied - Please try again ...';
						}
					}();
					var newModel = _Utils_update(
						model,
						{
							d$: _List_fromArray(
								[newFailedErr])
						});
					return _Utils_Tuple2(newModel, $elm$core$Platform$Cmd$none);
				}
			case 52:
				if (!msg.a.$) {
					var specRankingResult = msg.a.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								m9: false,
								er: $author$project$Data$Ranking$Spectator(specRankingResult)
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					var responseErr = msg.a.a;
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 5:
				var value = msg.a;
				var newModel = A3(
					$author$project$Pages$Hardware$updateNewUserRegistrationFormField,
					$author$project$Pages$Hardware$UpdateNickName(value),
					model.bJ,
					model);
				return _Utils_Tuple2(
					_Utils_update(
						newModel,
						{
							d$: _List_fromArray(
								[''])
						}),
					$elm$core$Platform$Cmd$none);
			case 1:
				var value = msg.a;
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 2:
				var value = msg.a;
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 3:
				var email = msg.a;
				return _Utils_Tuple2(
					A3(
						$author$project$Pages$Hardware$updateNewUserRegistrationFormField,
						$author$project$Pages$Hardware$UpdateEmail(email),
						model.bJ,
						model),
					$elm$core$Platform$Cmd$none);
			case 4:
				var pword = msg.a;
				return _Utils_Tuple2(
					A3(
						$author$project$Pages$Hardware$updateNewUserRegistrationFormField,
						$author$project$Pages$Hardware$UpdatePassword(pword),
						model.bJ,
						model),
					$elm$core$Platform$Cmd$none);
			case 6:
				var lvel = msg.a;
				return _Utils_Tuple2(
					A3(
						$author$project$Pages$Hardware$updateNewUserRegistrationFormField,
						$author$project$Pages$Hardware$UpdateLevel(lvel),
						model.bJ,
						model),
					$elm$core$Platform$Cmd$none);
			case 7:
				var comment = msg.a;
				return _Utils_Tuple2(
					A3(
						$author$project$Pages$Hardware$updateNewUserRegistrationFormField,
						$author$project$Pages$Hardware$UpdateComment(comment),
						model.bJ,
						model),
					$elm$core$Platform$Cmd$none);
			case 8:
				var mobile = msg.a;
				return _Utils_Tuple2(
					A3(
						$author$project$Pages$Hardware$updateNewUserRegistrationFormField,
						$author$project$Pages$Hardware$UpdateMobile(mobile),
						model.bJ,
						model),
					$elm$core$Platform$Cmd$none);
			case 9:
				var phone = msg.a;
				return _Utils_Tuple2(
					A3(
						$author$project$Pages$Hardware$updateNewUserRegistrationFormField,
						$author$project$Pages$Hardware$UpdatePhone(phone),
						model.bJ,
						model),
					$elm$core$Platform$Cmd$none);
			case 10:
				var value = msg.a;
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 11:
				var value = msg.a;
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 12:
				var value = msg.a;
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 51:
				var rankingId = msg.a;
				var updatedFlagUrlToIncludeMongoDBMWSvr = A2($elm$core$String$contains, $author$project$Extras$Constants$localorproductionServerAutoCheck, model.iI.fr) ? $elm$url$Url$toString(
					A6($elm$url$Url$Url, model.iI.ni, model.iI.fr, $elm$core$Maybe$Nothing, $author$project$Extras$Constants$productionProxyConfig, $elm$core$Maybe$Nothing, $elm$core$Maybe$Nothing)) : $elm$url$Url$toString(
					A6(
						$elm$url$Url$Url,
						model.iI.ni,
						model.iI.fr,
						$elm$core$Maybe$Just(3000),
						$author$project$Extras$Constants$middleWarePath,
						$elm$core$Maybe$Nothing,
						$elm$core$Maybe$Nothing));
				var postDataForMongoDBMWSvr = $elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'apiUrl',
							$elm$json$Json$Encode$string(
								$elm$url$Url$toString($author$project$Extras$Constants$placeholderUrl))),
							_Utils_Tuple2(
							'query_type',
							$elm$json$Json$Encode$string('fetch')),
							_Utils_Tuple2(
							'rankingid',
							$elm$json$Json$Encode$string(rankingId))
						]));
				var updatModelWithNewPostData = _Utils_update(
					model,
					{
						d$: _List_fromArray(
							['']),
						m9: true,
						bJ: $author$project$Pages$Hardware$SpectatorSelectedView,
						er: $author$project$Data$Ranking$Spectator($author$project$Data$Ranking$emptyRanking),
						gN: $elm$core$Maybe$Just(
							A6(
								$author$project$Pages$Hardware$ToMongoDBMWConfig,
								$author$project$Extras$Constants$post,
								_List_Nil,
								updatedFlagUrlToIncludeMongoDBMWSvr,
								$elm$http$Http$jsonBody(postDataForMongoDBMWSvr),
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Nothing))
					});
				return _Utils_Tuple2(updatModelWithNewPostData, $elm$core$Platform$Cmd$none);
			default:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Pages$Market$update = F2(
	function (msg, model) {
		var newModel = msg;
		return _Utils_Tuple2(
			_Utils_update(
				newModel,
				{wp: model.wp}),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Pages$PingPong$Receive = function (a) {
	return {$: 1, a: a};
};
var $author$project$Pages$PingPong$PongResponse = function (message) {
	return {uL: message};
};
var $author$project$Pages$PingPong$decodePongResponse = A2(
	$elm$json$Json$Decode$map,
	$author$project$Pages$PingPong$PongResponse,
	A2($elm$json$Json$Decode$field, 'message', $elm$json$Json$Decode$string));
var $author$project$Pages$PingPong$encodePingRequest = function (request) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'message',
				$elm$json$Json$Encode$string(request.uL))
			]));
};
var $author$project$Pages$PingPong$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 2:
				var newModel = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						newModel,
						{wp: model.wp}),
					$elm$core$Platform$Cmd$none);
			case 0:
				var therequest = $elm$http$Http$request(
					{
						sV: $elm$http$Http$jsonBody(
							$author$project$Pages$PingPong$encodePingRequest(
								{uL: 'Ping'})),
						m2: A2($elm$http$Http$expectJson, $author$project$Pages$PingPong$Receive, $author$project$Pages$PingPong$decodePongResponse),
						t7: _List_Nil,
						uM: 'POST',
						wo: $elm$core$Maybe$Nothing,
						wu: $elm$core$Maybe$Nothing,
						bF: 'http://localhost:9001/ping'
					});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							rh: {fR: 'Sending ...'}
						}),
					therequest);
			default:
				if (!msg.a.$) {
					var response = msg.a.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								rh: {fR: 'Received: ' + response.uL}
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								rh: {fR: 'Error receiving response'}
							}),
						$elm$core$Platform$Cmd$none);
				}
		}
	});
var $author$project$Pages$Portfolio$update = F2(
	function (msg, model) {
		var newModel = msg;
		return _Utils_Tuple2(
			_Utils_update(
				newModel,
				{wp: model.wp}),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Pages$Sell$update = F2(
	function (msg, model) {
		var newModel = msg;
		return _Utils_Tuple2(
			_Utils_update(
				newModel,
				{wp: model.wp}),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Pages$Support$update = F2(
	function (msg, model) {
		var newModel = msg;
		return _Utils_Tuple2(
			_Utils_update(
				newModel,
				{wp: model.wp}),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Data$User$updatedMemberRankings = F2(
	function (userInfo, lRanking) {
		return _Utils_update(
			userInfo,
			{ea: lRanking});
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 14:
				var textMessageFromJs = msg.a;
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 13:
				var rawJsonMessage = msg.a;
				if (A2(
					$elm$core$String$contains,
					'Problem',
					$author$project$Main$fromJsonToString(rawJsonMessage))) {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								d$: _Utils_ap(
									model.d$,
									_List_fromArray(
										['Problem fetching data']))
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					if (A2(
						$elm$core$String$contains,
						'LOGINDENIED',
						$author$project$Main$fromJsonToString(rawJsonMessage))) {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									d$: _Utils_ap(
										model.d$,
										_List_fromArray(
											['Login Denied - Please try again ...']))
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						var _v1 = model.u;
						if (_v1.$ === 8) {
							var hardware = _v1.a;
							return A2(
								$author$project$Main$toHardware,
								model,
								A2(
									$author$project$Pages$Hardware$update,
									$author$project$Pages$Hardware$ResponseDataFromMain(rawJsonMessage),
									hardware));
						} else {
							return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
						}
					}
				}
			case 11:
				var newTime = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{dE: newTime}),
					A2($elm$core$Task$perform, $author$project$Main$AdjustTimeZone, $elm$time$Time$here));
			case 12:
				var newZone = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							nz: $elm$core$Maybe$Just(newZone)
						}),
					$elm$core$Platform$Cmd$none);
			case 0:
				var urlRequest = msg.a;
				if (urlRequest.$ === 1) {
					var href = urlRequest.a;
					return _Utils_Tuple2(
						model,
						$elm$browser$Browser$Navigation$load(href));
				} else {
					var url = urlRequest.a;
					var _v3 = $elm$url$Url$toString(url);
					if (_v3 === 'https://haveno-web.squashpassion.com/') {
						return _Utils_Tuple2(
							model,
							$elm$browser$Browser$Navigation$load(
								$elm$url$Url$toString(url)));
					} else {
						return _Utils_Tuple2(
							model,
							model.na(url));
					}
				}
			case 10:
				var url = msg.a;
				return A2($author$project$Main$updateUrl, url, model);
			case 1:
				var dashboardMsg = msg.a;
				var _v4 = model.u;
				if (!_v4.$) {
					var dashboard = _v4.a;
					return A2(
						$author$project$Main$toDashboard,
						model,
						A2($author$project$Pages$Dashboard$update, dashboardMsg, dashboard));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 2:
				var sellMsg = msg.a;
				var _v5 = model.u;
				if (_v5.$ === 1) {
					var sell = _v5.a;
					return A2(
						$author$project$Main$toSell,
						model,
						A2($author$project$Pages$Sell$update, sellMsg, sell));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 3:
				var termsMsg = msg.a;
				var _v6 = model.u;
				if (_v6.$ === 2) {
					var terms = _v6.a;
					return A2(
						$author$project$Main$toPortfolio,
						model,
						A2($author$project$Pages$Portfolio$update, termsMsg, terms));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 4:
				var privacyMsg = msg.a;
				var _v7 = model.u;
				if (_v7.$ === 3) {
					var privacy = _v7.a;
					return A2(
						$author$project$Main$toFunds,
						model,
						A2($author$project$Pages$Funds$update, privacyMsg, privacy));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 5:
				var supportMsg = msg.a;
				var _v8 = model.u;
				if (_v8.$ === 4) {
					var support = _v8.a;
					return A2(
						$author$project$Main$toSupport,
						model,
						A2($author$project$Pages$Support$update, supportMsg, support));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 6:
				var pingpongMsg = msg.a;
				var _v9 = model.u;
				if (_v9.$ === 5) {
					var pingpong = _v9.a;
					return A2(
						$author$project$Main$toPingPong,
						model,
						A2($author$project$Pages$PingPong$update, pingpongMsg, pingpong));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 7:
				var pricingMsg = msg.a;
				var _v10 = model.u;
				if (_v10.$ === 6) {
					var pricing = _v10.a;
					return A2(
						$author$project$Main$toPricing,
						model,
						A2($author$project$Pages$Buy$update, pricingMsg, pricing));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 8:
				var aboutMsg = msg.a;
				var _v11 = model.u;
				if (_v11.$ === 7) {
					var about = _v11.a;
					return A2(
						$author$project$Main$toMarket,
						model,
						A2($author$project$Pages$Market$update, aboutMsg, about));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			default:
				var rankingsMsg = msg.a;
				var _v12 = model.u;
				if (_v12.$ === 8) {
					var rankings = _v12.a;
					switch (rankingsMsg.$) {
						case 43:
							var ranking = rankingsMsg.a;
							var user = rankingsMsg.b;
							var newRankingsModel = _Utils_update(
								rankings,
								{bJ: $author$project$Pages$Hardware$LoggedInUser});
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										u: $author$project$Main$HardwarePage(newRankingsModel)
									}),
								$author$project$Main$sendMessage(
									'createRanking' + ('~^&' + (ranking.fR + ('~^&' + (((ranking.dG.lH === '') ? 'Unspecified' : ranking.dG.lH) + ('~^&' + ((ranking.dG.h0 === '') ? 'Unspecified' : ranking.dG.h0))))))));
						case 35:
							var ownedRanking = rankingsMsg.a;
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										u: $author$project$Main$HardwarePage(
											_Utils_update(
												rankings,
												{bJ: $author$project$Pages$Hardware$OwnedSelectedView}))
									}),
								$author$project$Main$sendMessage('fetchRanking' + ('~^&' + (ownedRanking.A + '~^&ownedranking'))));
						case 36:
							var memberRanking = rankingsMsg.a;
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										u: $author$project$Main$HardwarePage(
											_Utils_update(
												rankings,
												{bJ: $author$project$Pages$Hardware$MemberSelectedView}))
									}),
								$author$project$Main$sendMessage('fetchRanking' + ('~^&' + (memberRanking.A + '~^&memberranking'))));
						case 55:
							var rankingWantToJoin = rankingsMsg.a;
							var userid = rankingsMsg.b;
							var lastRank = rankingsMsg.c;
							var updatedUser = A2($author$project$Data$User$addNewLadderToMemberRankings, rankings.dl, rankingWantToJoin);
							var newRank = {
								an: {A: '6353e8b6aedf80653eb34191', dw: 'No Challenger'},
								aB: {
									A: userid,
									dw: $author$project$Data$User$gotNickName(rankings.dl)
								},
								bC: lastRank + 1
							};
							var updatedRanking = _Utils_update(
								rankingWantToJoin,
								{
									nb: _Utils_ap(
										rankingWantToJoin.nb,
										_List_fromArray(
											[newRank]))
								});
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										u: $author$project$Main$HardwarePage(
											_Utils_update(
												rankings,
												{
													bJ: $author$project$Pages$Hardware$MemberSelectedView,
													vL: _List_Nil,
													vN: '',
													er: $author$project$Data$Ranking$Member(
														_Utils_update(
															rankingWantToJoin,
															{nb: updatedRanking.nb})),
													dl: updatedUser
												}))
									}),
								$author$project$Main$sendMessage(
									'joinRanking' + ('~^&' + (rankingWantToJoin.A + ('~^&' + (userid + ('~^&' + $elm$core$String$fromInt(lastRank + 1))))))));
						case 56:
							var rankingWantToLeave = rankingsMsg.a;
							var userid = rankingsMsg.b;
							var updatedRankingList = A2($author$project$Data$User$deleteRankingFromMemberRankings, rankings.dl, rankingWantToLeave.A);
							var updatedUserInfo = A2(
								$author$project$Data$User$updatedMemberRankings,
								$author$project$Data$User$gotUserInfo(rankings.dl),
								updatedRankingList);
							var rankingWithAnyCurrentChallengesRemoved = A2($author$project$Data$Ranking$abandonSingleUserChallenge, userid, rankingWantToLeave.nb);
							var updatedRanking = _Utils_update(
								rankingWantToLeave,
								{
									nb: A2($author$project$Data$Ranking$removeRank, userid, rankingWithAnyCurrentChallengesRemoved)
								});
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										u: $author$project$Main$HardwarePage(
											_Utils_update(
												rankings,
												{
													bJ: $author$project$Pages$Hardware$SpectatorSelectedView,
													er: $author$project$Data$Ranking$Spectator(updatedRanking),
													dl: $author$project$Data$User$Registered(updatedUserInfo)
												}))
									}),
								$author$project$Main$sendMessage(
									'leaveRanking' + ('~^&' + (rankingWantToLeave.A + ('~^&' + (userid + ('~^&' + A2(
										$elm$json$Json$Encode$encode,
										0,
										$author$project$Data$Ranking$jsonUpdatedRanking(updatedRanking)))))))));
						case 47:
							var selectedRanking = rankingsMsg.a;
							var rank = rankingsMsg.b;
							var gotRankBelow = A2(
								$elm$core$Maybe$withDefault,
								$author$project$Data$Ranking$emptyRank,
								A2($author$project$Data$Ranking$gotRankBelow, rank, selectedRanking.nb));
							var updatedRanks = A3($author$project$Data$Ranking$createSingleUserChallenge, rank.aB.A, gotRankBelow.aB, selectedRanking.nb);
							var updatedRanking = _Utils_update(
								selectedRanking,
								{nb: updatedRanks});
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										u: $author$project$Main$HardwarePage(
											_Utils_update(
												rankings,
												{
													bJ: $author$project$Pages$Hardware$MemberSelectedView,
													er: $author$project$Data$Ranking$Member(updatedRanking)
												}))
									}),
								$author$project$Main$sendMessage(
									'updateRanking' + ('~^&' + (selectedRanking.A + ('~^&' + A2(
										$elm$json$Json$Encode$encode,
										0,
										$author$project$Data$Ranking$jsonUpdatedRanking(updatedRanking)))))));
						case 48:
							var result = rankingsMsg.a;
							var selectedRanking = $author$project$Data$Ranking$gotRanking(rankings.er);
							var updatedRanks = A3(
								$author$project$Data$Ranking$handleResult,
								result,
								$author$project$Data$User$gotId(rankings.dl),
								selectedRanking.nb);
							var updatedRanking = _Utils_update(
								selectedRanking,
								{nb: updatedRanks});
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										u: $author$project$Main$HardwarePage(
											_Utils_update(
												rankings,
												{
													bJ: $author$project$Pages$Hardware$MemberSelectedView,
													er: $author$project$Data$Ranking$Member(updatedRanking)
												}))
									}),
								$author$project$Main$sendMessage(
									'updateRanking' + ('~^&' + (selectedRanking.A + ('~^&' + A2(
										$elm$json$Json$Encode$encode,
										0,
										$author$project$Data$Ranking$jsonUpdatedRanking(updatedRanking)))))));
						case 25:
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										u: $author$project$Main$HardwarePage(
											_Utils_update(
												rankings,
												{
													bJ: $author$project$Pages$Hardware$Login($author$project$Extras$Constants$emptyEmailPassword)
												}))
									}),
								$author$project$Main$sendMessage('logout'));
						case 39:
							var newUserRegistrationDetails = rankingsMsg.a;
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										u: $author$project$Main$HardwarePage(
											_Utils_update(
												rankings,
												{
													bJ: $author$project$Pages$Hardware$RegisterUser(newUserRegistrationDetails)
												}))
									}),
								$author$project$Main$sendMessage(
									'register' + ('~^&' + (A2($elm$core$Maybe$withDefault, '', newUserRegistrationDetails.nN) + ('~^&' + (newUserRegistrationDetails.n4 + ('~^&' + newUserRegistrationDetails.dw)))))));
						case 45:
							var ownedRanking = function () {
								var _v14 = rankings.er;
								if (!_v14.$) {
									var ownedRnking = _v14.a;
									return ownedRnking;
								} else {
									return $author$project$Data$Ranking$emptyRanking;
								}
							}();
							var newUser = A2($author$project$Data$User$deleteRankingFromOwnedRankings, rankings.dl, ownedRanking.A);
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										u: $author$project$Main$HardwarePage(
											_Utils_update(
												rankings,
												{bJ: $author$project$Pages$Hardware$LoggedInUser, dl: newUser}))
									}),
								$author$project$Main$sendMessage(
									'deleteRanking' + ('~^&' + $author$project$Data$Ranking$gotRankingId(
										$author$project$Data$Ranking$gotRanking(rankings.er)))));
						case 60:
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										u: $author$project$Main$HardwarePage(
											_Utils_update(
												rankings,
												{
													bJ: $author$project$Pages$Hardware$Login($author$project$Extras$Constants$emptyEmailPassword)
												}))
									}),
								$author$project$Main$sendMessage(
									'deleteAccount' + ('~^&' + $author$project$Data$User$gotId(rankings.dl))));
						default:
							return A2(
								$author$project$Main$toHardware,
								model,
								A2($author$project$Pages$Hardware$update, rankingsMsg, rankings));
					}
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
		}
	});
var $elm$html$Html$a = _VirtualDom_node('a');
var $elm$html$Html$br = _VirtualDom_node('br');
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$html$Html$footer = _VirtualDom_node('footer');
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $elm$html$Html$p = _VirtualDom_node('p');
var $elm$html$Html$span = _VirtualDom_node('span');
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $author$project$Main$footerContent = A2(
	$elm$html$Html$footer,
	_List_Nil,
	_List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('footer'),
					A2($elm$html$Html$Attributes$style, 'text-align', 'center')
				]),
			_List_fromArray(
				[
					A2($elm$html$Html$br, _List_Nil, _List_Nil),
					A2(
					$elm$html$Html$span,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(''),
							A2(
							$elm$html$Html$a,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$href('https://github.com/haveno-dex/haveno')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Haveno-Dex')
								])),
							A2($elm$html$Html$br, _List_Nil, _List_Nil),
							$elm$html$Html$text('Open source code & design'),
							A2(
							$elm$html$Html$p,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('Version 0.0.3')
								]))
						]))
				]))
		]));
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $elm$html$Html$map = $elm$virtual_dom$VirtualDom$map;
var $elm$html$Html$nav = _VirtualDom_node('nav');
var $elm$html$Html$Attributes$classList = function (classes) {
	return $elm$html$Html$Attributes$class(
		A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				A2($elm$core$List$filter, $elm$core$Tuple$second, classes))));
};
var $author$project$Main$isActive = function (_v0) {
	var link = _v0.qb;
	var page = _v0.u;
	var _v1 = _Utils_Tuple2(link, page);
	switch (_v1.a) {
		case 0:
			if (!_v1.b.$) {
				var _v2 = _v1.a;
				return true;
			} else {
				var _v3 = _v1.a;
				return false;
			}
		case 1:
			if (_v1.b.$ === 1) {
				var _v4 = _v1.a;
				return true;
			} else {
				var _v5 = _v1.a;
				return false;
			}
		case 2:
			if (_v1.b.$ === 2) {
				var _v6 = _v1.a;
				return true;
			} else {
				var _v7 = _v1.a;
				return false;
			}
		case 3:
			if (_v1.b.$ === 3) {
				var _v8 = _v1.a;
				return true;
			} else {
				var _v9 = _v1.a;
				return false;
			}
		case 4:
			if (_v1.b.$ === 4) {
				var _v10 = _v1.a;
				return true;
			} else {
				var _v11 = _v1.a;
				return false;
			}
		case 5:
			if (_v1.b.$ === 5) {
				var _v12 = _v1.a;
				return true;
			} else {
				var _v13 = _v1.a;
				return false;
			}
		case 6:
			if (_v1.b.$ === 6) {
				var _v14 = _v1.a;
				return true;
			} else {
				var _v15 = _v1.a;
				return false;
			}
		case 7:
			if (_v1.b.$ === 7) {
				var _v16 = _v1.a;
				return true;
			} else {
				var _v17 = _v1.a;
				return false;
			}
		default:
			if (_v1.b.$ === 8) {
				var _v18 = _v1.a;
				return true;
			} else {
				var _v19 = _v1.a;
				return false;
			}
	}
};
var $elm$html$Html$li = _VirtualDom_node('li');
var $elm$html$Html$Attributes$alt = $elm$html$Html$Attributes$stringProperty('alt');
var $elm$html$Html$Attributes$height = function (n) {
	return A2(
		_VirtualDom_attribute,
		'height',
		$elm$core$String$fromInt(n));
};
var $elm$html$Html$img = _VirtualDom_node('img');
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $elm$html$Html$Attributes$title = $elm$html$Html$Attributes$stringProperty('title');
var $elm$html$Html$Attributes$width = function (n) {
	return A2(
		_VirtualDom_attribute,
		'width',
		$elm$core$String$fromInt(n));
};
var $author$project$Main$logoImage = A2(
	$elm$html$Html$img,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$src('resources/Logos/monero_icon.jpeg'),
			$elm$html$Html$Attributes$width(200),
			$elm$html$Html$Attributes$height(67),
			$elm$html$Html$Attributes$alt('Monero Logo'),
			$elm$html$Html$Attributes$title('Monero Logo')
		]),
	_List_Nil);
var $elm$html$Html$ul = _VirtualDom_node('ul');
var $author$project$Main$navLinks = function (page) {
	var navLink = F2(
		function (route, _v0) {
			var url = _v0.bF;
			var caption = _v0.bj;
			return A2(
				$elm$html$Html$li,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$classList(
						_List_fromArray(
							[
								_Utils_Tuple2(
								'active',
								$author$project$Main$isActive(
									{qb: route, u: page})),
								_Utils_Tuple2('navLink', true)
							]))
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$href(url)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(caption)
							]))
					]));
		});
	var links = A2(
		$elm$html$Html$ul,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$li,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('logo')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$href('https://haveno-web.squashpassion.com'),
								$elm$html$Html$Attributes$class('logoImageShrink')
							]),
						_List_fromArray(
							[$author$project$Main$logoImage]))
					])),
				A2(
				navLink,
				0,
				{bj: 'Dashboard', bF: '/'}),
				A2(
				navLink,
				7,
				{bj: 'Market', bF: 'market'}),
				A2(
				navLink,
				4,
				{bj: 'Support', bF: 'support'}),
				A2(
				navLink,
				5,
				{bj: 'PingPong', bF: 'pingpong'}),
				A2(
				navLink,
				1,
				{bj: 'Sell', bF: 'sell'}),
				A2(
				navLink,
				6,
				{bj: 'Buy', bF: 'buy'}),
				A2(
				navLink,
				8,
				{bj: 'Hardware', bF: 'hardware'}),
				A2(
				navLink,
				2,
				{bj: 'Portfolio', bF: 'portfolio'})
			]));
	return links;
};
var $author$project$Main$burgerMenu = function (page) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('menu-btn')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('menu-btn_burger')
					]),
				_List_Nil),
				A2(
				$elm$html$Html$nav,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('below800pxnavlinks')
					]),
				_List_fromArray(
					[
						$author$project$Main$navLinks(page)
					]))
			]));
};
var $elm$html$Html$header = _VirtualDom_node('header');
var $elm$html$Html$i = _VirtualDom_node('i');
var $elm$html$Html$Attributes$name = $elm$html$Html$Attributes$stringProperty('name');
var $elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$node = $elm$virtual_dom$VirtualDom$node;
var $elm$html$Html$Attributes$target = $elm$html$Html$Attributes$stringProperty('target');
var $author$project$Main$socialsLinks = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('socials-main-container')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('socials-sub-container socials-sub-container-whatsapp')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$i,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$a,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$href(''),
									$elm$html$Html$Attributes$target('_blank')
								]),
							_List_fromArray(
								[
									A3(
									$elm$html$Html$node,
									'ion-icon',
									_List_fromArray(
										[
											$elm$html$Html$Attributes$name('logo-whatsapp')
										]),
									_List_Nil)
								]))
						]))
				]))
		]));
var $author$project$Main$topLinksLeft = function () {
	var navLink = function (_v0) {
		var url = _v0.bF;
		var caption = _v0.bj;
		return A2(
			$elm$html$Html$li,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('emailphone')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$href(url)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(caption)
						]))
				]));
	};
	var links = A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('topLinksLeft')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$i,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('material-icons')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('email')
					])),
				navLink(
				{bj: 'potential support url   ', bF: '/'}),
				A2(
				$elm$html$Html$i,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('material-icons')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('support')
					])),
				navLink(
				{bj: 'other potential support', bF: 'support'})
			]));
	return links;
}();
var $author$project$Main$topLinksLogoImage = A2(
	$elm$html$Html$img,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$src('resources/Logos/monero_icon.jpeg'),
			$elm$html$Html$Attributes$width(100),
			$elm$html$Html$Attributes$height(33),
			$elm$html$Html$Attributes$alt('Monero Logo'),
			$elm$html$Html$Attributes$title('Monero Logo')
		]),
	_List_Nil);
var $author$project$Main$topLinksLogo = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('topLinksLogo')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$a,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$href('https://haveno-web.squashpassion.com')
				]),
			_List_fromArray(
				[$author$project$Main$topLinksLogoImage]))
		]));
var $author$project$Main$pageHeader = function (page) {
	var pageheader = A2(
		$elm$html$Html$header,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('topLinks-flex-container')
					]),
				_List_fromArray(
					[
						$author$project$Main$burgerMenu(page),
						$author$project$Main$topLinksLogo,
						$author$project$Main$topLinksLeft,
						$author$project$Main$socialsLinks
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('main-nav-flex-container')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('section')
							]),
						_List_Nil),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('nav-section-above800px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$nav,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('above800pxnavlinks')
									]),
								_List_fromArray(
									[
										$author$project$Main$navLinks(page)
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('section')
							]),
						_List_Nil)
					]))
			]));
	return pageheader;
};
var $author$project$Main$showVideoOrBanner = function (page) {
	return A2(
		$elm$html$Html$img,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('banner'),
				$elm$html$Html$Attributes$src('resources/Banners/monero - 1918x494.png'),
				$elm$html$Html$Attributes$alt('Monero'),
				$elm$html$Html$Attributes$width(1918),
				$elm$html$Html$Attributes$height(494),
				$elm$html$Html$Attributes$title('Monero Banner')
			]),
		_List_Nil);
};
var $elm$html$Html$button = _VirtualDom_node('button');
var $author$project$Buttons$Default$defaultButton = function (btnName) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'align-self', 'center')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('default-button')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'color', 'white'),
								function () {
								switch (btnName) {
									case 'contact':
										return $elm$html$Html$Attributes$href('/contact');
									case 'hardware':
										return $elm$html$Html$Attributes$href('/hardware');
									case 'cost':
										return $elm$html$Html$Attributes$href('/pricing');
									default:
										return $elm$html$Html$Attributes$href('/');
								}
							}()
							]),
						_List_fromArray(
							[
								function () {
								switch (btnName) {
									case 'hardware':
										return $elm$html$Html$text('Hardware Now');
									case 'cost':
										return $elm$html$Html$text('Buy');
									default:
										return $elm$html$Html$text('');
								}
							}()
							]))
					]))
			]));
};
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$html$Html$section = _VirtualDom_node('section');
var $author$project$Pages$Buy$content = A2(
	$elm$html$Html$section,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$id('page'),
			$elm$html$Html$Attributes$class('section-background'),
			$elm$html$Html$Attributes$class('text-center')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$ul,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$h1,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('pricing')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Buy')
						])),
					$author$project$Buttons$Default$defaultButton('hardware')
				]))
		]));
var $author$project$Pages$Buy$view = function (_v0) {
	return $author$project$Pages$Buy$content;
};
var $elm$html$Html$h2 = _VirtualDom_node('h2');
var $author$project$Pages$Dashboard$content = function (model) {
	return A2(
		$elm$html$Html$section,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('page'),
				$elm$html$Html$Attributes$class('section-background')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('container container--narrow')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h1,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$classList(
								_List_fromArray(
									[
										_Utils_Tuple2('text-center', true),
										_Utils_Tuple2('Dashboard', true)
									]))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Haveno Web')
							])),
						A2(
						$elm$html$Html$h2,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('text-center')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Online Dex')
							])),
						A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('text-center')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Welcome to Haveno Web, the online decentralized exchange for Haveno, the private, untraceable cryptocurrency.')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('text-center')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Your version is:')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('text-center')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										A2(
											$elm$core$Maybe$withDefault,
											'',
											A2(
												$elm$core$Maybe$map,
												function ($) {
													return $.ez;
												},
												model.ez)))
									]))
							]))
					]))
			]));
};
var $author$project$Pages$Dashboard$view = function (model) {
	return $author$project$Pages$Dashboard$content(model);
};
var $author$project$Pages$Funds$htmlContent = A2(
	$elm$html$Html$section,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$id('page'),
			$elm$html$Html$Attributes$class('section-background'),
			$elm$html$Html$Attributes$class('text-center'),
			$elm$html$Html$Attributes$class('split')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('split-col')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$h1,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('')
						]))
				])),
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('split-col')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$h1,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('Funds')
						])),
					$author$project$Buttons$Default$defaultButton('hardware')
				])),
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('split-col')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$h1,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('')
						]))
				]))
		]));
var $author$project$Pages$Funds$content = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$id('page')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id('content'),
					$elm$html$Html$Attributes$class('col3-column')
				]),
			_List_fromArray(
				[$author$project$Pages$Funds$htmlContent]))
		]));
var $author$project$Pages$Funds$view = function (_v0) {
	return $author$project$Pages$Funds$content;
};
var $mdgriffith$elm_ui$Internal$Model$Unkeyed = function (a) {
	return {$: 0, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$AsColumn = 1;
var $mdgriffith$elm_ui$Internal$Model$asColumn = 1;
var $mdgriffith$elm_ui$Internal$Style$classes = {ss: 'a', mO: 'atv', sx: 'ab', sy: 'cx', sz: 'cy', sA: 'acb', sB: 'accx', sC: 'accy', sD: 'acr', oz: 'al', oA: 'ar', sE: 'at', nC: 'ah', nD: 'av', sH: 's', sR: 'bh', sS: 'b', sW: 'w7', sY: 'bd', sZ: 'bdt', mQ: 'bn', s_: 'bs', mU: 'cpe', s9: 'cp', ta: 'cpx', tb: 'cpy', dH: 'c', mX: 'ctr', mY: 'cb', mZ: 'ccx', dI: 'ccy', h4: 'cl', m_: 'cr', tl: 'ct', to: 'cptr', tp: 'ctxt', tS: 'fcs', pv: 'focus-within', tX: 'fs', t5: 'g', nR: 'hbh', nS: 'hc', pL: 'he', nT: 'hf', pM: 'hfp', uc: 'hv', ui: 'ic', uk: 'fr', m8: 'lbl', uo: 'iml', up: 'imlf', uq: 'imlp', ur: 'implw', us: 'it', uA: 'i', qb: 'lnk', fT: 'nb', qx: 'notxt', u1: 'ol', u2: 'or', eh: 'oq', va: 'oh', u: 'pg', qJ: 'p', vd: 'ppe', rh: 'ui', rj: 'r', vH: 'sb', vI: 'sbx', vJ: 'sby', vK: 'sbt', vU: 'e', vW: 'cap', vX: 'sev', v4: 'sk', dD: 't', wa: 'tc', wb: 'w8', wc: 'w2', wd: 'w9', we: 'tj', nt: 'tja', wf: 'tl', wg: 'w3', wh: 'w5', wi: 'w4', wj: 'tr', wk: 'w6', wl: 'w1', wm: 'tun', r1: 'ts', ew: 'clr', ww: 'u', oi: 'wc', sm: 'we', oj: 'wf', sn: 'wfp', ok: 'wrp'};
var $mdgriffith$elm_ui$Internal$Model$Generic = {$: 0};
var $mdgriffith$elm_ui$Internal$Model$div = $mdgriffith$elm_ui$Internal$Model$Generic;
var $mdgriffith$elm_ui$Internal$Model$NoNearbyChildren = {$: 0};
var $mdgriffith$elm_ui$Internal$Model$columnClass = $mdgriffith$elm_ui$Internal$Style$classes.sH + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.dH);
var $mdgriffith$elm_ui$Internal$Model$gridClass = $mdgriffith$elm_ui$Internal$Style$classes.sH + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.t5);
var $mdgriffith$elm_ui$Internal$Model$pageClass = $mdgriffith$elm_ui$Internal$Style$classes.sH + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.u);
var $mdgriffith$elm_ui$Internal$Model$paragraphClass = $mdgriffith$elm_ui$Internal$Style$classes.sH + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.qJ);
var $mdgriffith$elm_ui$Internal$Model$rowClass = $mdgriffith$elm_ui$Internal$Style$classes.sH + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.rj);
var $mdgriffith$elm_ui$Internal$Model$singleClass = $mdgriffith$elm_ui$Internal$Style$classes.sH + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.vU);
var $mdgriffith$elm_ui$Internal$Model$contextClasses = function (context) {
	switch (context) {
		case 0:
			return $mdgriffith$elm_ui$Internal$Model$rowClass;
		case 1:
			return $mdgriffith$elm_ui$Internal$Model$columnClass;
		case 2:
			return $mdgriffith$elm_ui$Internal$Model$singleClass;
		case 3:
			return $mdgriffith$elm_ui$Internal$Model$gridClass;
		case 4:
			return $mdgriffith$elm_ui$Internal$Model$paragraphClass;
		default:
			return $mdgriffith$elm_ui$Internal$Model$pageClass;
	}
};
var $mdgriffith$elm_ui$Internal$Model$Keyed = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$NoStyleSheet = {$: 0};
var $mdgriffith$elm_ui$Internal$Model$Styled = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$Unstyled = function (a) {
	return {$: 0, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$addChildren = F2(
	function (existing, nearbyChildren) {
		switch (nearbyChildren.$) {
			case 0:
				return existing;
			case 1:
				var behind = nearbyChildren.a;
				return _Utils_ap(behind, existing);
			case 2:
				var inFront = nearbyChildren.a;
				return _Utils_ap(existing, inFront);
			default:
				var behind = nearbyChildren.a;
				var inFront = nearbyChildren.b;
				return _Utils_ap(
					behind,
					_Utils_ap(existing, inFront));
		}
	});
var $mdgriffith$elm_ui$Internal$Model$addKeyedChildren = F3(
	function (key, existing, nearbyChildren) {
		switch (nearbyChildren.$) {
			case 0:
				return existing;
			case 1:
				var behind = nearbyChildren.a;
				return _Utils_ap(
					A2(
						$elm$core$List$map,
						function (x) {
							return _Utils_Tuple2(key, x);
						},
						behind),
					existing);
			case 2:
				var inFront = nearbyChildren.a;
				return _Utils_ap(
					existing,
					A2(
						$elm$core$List$map,
						function (x) {
							return _Utils_Tuple2(key, x);
						},
						inFront));
			default:
				var behind = nearbyChildren.a;
				var inFront = nearbyChildren.b;
				return _Utils_ap(
					A2(
						$elm$core$List$map,
						function (x) {
							return _Utils_Tuple2(key, x);
						},
						behind),
					_Utils_ap(
						existing,
						A2(
							$elm$core$List$map,
							function (x) {
								return _Utils_Tuple2(key, x);
							},
							inFront)));
		}
	});
var $mdgriffith$elm_ui$Internal$Model$AsEl = 2;
var $mdgriffith$elm_ui$Internal$Model$asEl = 2;
var $mdgriffith$elm_ui$Internal$Model$AsParagraph = 4;
var $mdgriffith$elm_ui$Internal$Model$asParagraph = 4;
var $mdgriffith$elm_ui$Internal$Flag$Flag = function (a) {
	return {$: 0, a: a};
};
var $mdgriffith$elm_ui$Internal$Flag$Second = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Internal$Flag$flag = function (i) {
	return (i > 31) ? $mdgriffith$elm_ui$Internal$Flag$Second(1 << (i - 32)) : $mdgriffith$elm_ui$Internal$Flag$Flag(1 << i);
};
var $mdgriffith$elm_ui$Internal$Flag$alignBottom = $mdgriffith$elm_ui$Internal$Flag$flag(41);
var $mdgriffith$elm_ui$Internal$Flag$alignRight = $mdgriffith$elm_ui$Internal$Flag$flag(40);
var $mdgriffith$elm_ui$Internal$Flag$centerX = $mdgriffith$elm_ui$Internal$Flag$flag(42);
var $mdgriffith$elm_ui$Internal$Flag$centerY = $mdgriffith$elm_ui$Internal$Flag$flag(43);
var $mdgriffith$elm_ui$Internal$Model$lengthClassName = function (x) {
	switch (x.$) {
		case 0:
			var px = x.a;
			return $elm$core$String$fromInt(px) + 'px';
		case 1:
			return 'auto';
		case 2:
			var i = x.a;
			return $elm$core$String$fromInt(i) + 'fr';
		case 3:
			var min = x.a;
			var len = x.b;
			return 'min' + ($elm$core$String$fromInt(min) + $mdgriffith$elm_ui$Internal$Model$lengthClassName(len));
		default:
			var max = x.a;
			var len = x.b;
			return 'max' + ($elm$core$String$fromInt(max) + $mdgriffith$elm_ui$Internal$Model$lengthClassName(len));
	}
};
var $elm$core$Basics$round = _Basics_round;
var $mdgriffith$elm_ui$Internal$Model$floatClass = function (x) {
	return $elm$core$String$fromInt(
		$elm$core$Basics$round(x * 255));
};
var $mdgriffith$elm_ui$Internal$Model$transformClass = function (transform) {
	switch (transform.$) {
		case 0:
			return $elm$core$Maybe$Nothing;
		case 1:
			var _v1 = transform.a;
			var x = _v1.a;
			var y = _v1.b;
			var z = _v1.c;
			return $elm$core$Maybe$Just(
				'mv-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(x) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(y) + ('-' + $mdgriffith$elm_ui$Internal$Model$floatClass(z))))));
		default:
			var _v2 = transform.a;
			var tx = _v2.a;
			var ty = _v2.b;
			var tz = _v2.c;
			var _v3 = transform.b;
			var sx = _v3.a;
			var sy = _v3.b;
			var sz = _v3.c;
			var _v4 = transform.c;
			var ox = _v4.a;
			var oy = _v4.b;
			var oz = _v4.c;
			var angle = transform.d;
			return $elm$core$Maybe$Just(
				'tfrm-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(tx) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(ty) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(tz) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(sx) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(sy) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(sz) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(ox) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(oy) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(oz) + ('-' + $mdgriffith$elm_ui$Internal$Model$floatClass(angle))))))))))))))))))));
	}
};
var $mdgriffith$elm_ui$Internal$Model$getStyleName = function (style) {
	switch (style.$) {
		case 13:
			var name = style.a;
			return name;
		case 12:
			var name = style.a;
			var o = style.b;
			return name;
		case 0:
			var _class = style.a;
			return _class;
		case 1:
			var name = style.a;
			return name;
		case 2:
			var i = style.a;
			return 'font-size-' + $elm$core$String$fromInt(i);
		case 3:
			var _class = style.a;
			return _class;
		case 4:
			var _class = style.a;
			return _class;
		case 5:
			var cls = style.a;
			var x = style.b;
			var y = style.c;
			return cls;
		case 7:
			var cls = style.a;
			var top = style.b;
			var right = style.c;
			var bottom = style.d;
			var left = style.e;
			return cls;
		case 6:
			var cls = style.a;
			var top = style.b;
			var right = style.c;
			var bottom = style.d;
			var left = style.e;
			return cls;
		case 8:
			var template = style.a;
			return 'grid-rows-' + (A2(
				$elm$core$String$join,
				'-',
				A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$lengthClassName, template.vE)) + ('-cols-' + (A2(
				$elm$core$String$join,
				'-',
				A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$lengthClassName, template.mW)) + ('-space-x-' + ($mdgriffith$elm_ui$Internal$Model$lengthClassName(template.vY.a) + ('-space-y-' + $mdgriffith$elm_ui$Internal$Model$lengthClassName(template.vY.b)))))));
		case 9:
			var pos = style.a;
			return 'gp grid-pos-' + ($elm$core$String$fromInt(pos.rj) + ('-' + ($elm$core$String$fromInt(pos.o0) + ('-' + ($elm$core$String$fromInt(pos.dn) + ('-' + $elm$core$String$fromInt(pos.iR)))))));
		case 11:
			var selector = style.a;
			var subStyle = style.b;
			var name = function () {
				switch (selector) {
					case 0:
						return 'fs';
					case 1:
						return 'hv';
					default:
						return 'act';
				}
			}();
			return A2(
				$elm$core$String$join,
				' ',
				A2(
					$elm$core$List$map,
					function (sty) {
						var _v1 = $mdgriffith$elm_ui$Internal$Model$getStyleName(sty);
						if (_v1 === '') {
							return '';
						} else {
							var styleName = _v1;
							return styleName + ('-' + name);
						}
					},
					subStyle));
		default:
			var x = style.a;
			return A2(
				$elm$core$Maybe$withDefault,
				'',
				$mdgriffith$elm_ui$Internal$Model$transformClass(x));
	}
};
var $elm$core$Dict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$get, key, dict);
		if (!_v0.$) {
			return true;
		} else {
			return false;
		}
	});
var $elm$core$Set$member = F2(
	function (key, _v0) {
		var dict = _v0;
		return A2($elm$core$Dict$member, key, dict);
	});
var $mdgriffith$elm_ui$Internal$Model$reduceStyles = F2(
	function (style, nevermind) {
		var cache = nevermind.a;
		var existing = nevermind.b;
		var styleName = $mdgriffith$elm_ui$Internal$Model$getStyleName(style);
		return A2($elm$core$Set$member, styleName, cache) ? nevermind : _Utils_Tuple2(
			A2($elm$core$Set$insert, styleName, cache),
			A2($elm$core$List$cons, style, existing));
	});
var $mdgriffith$elm_ui$Internal$Model$Property = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$Style = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$dot = function (c) {
	return '.' + c;
};
var $elm$core$String$fromFloat = _String_fromNumber;
var $mdgriffith$elm_ui$Internal$Model$formatColor = function (_v0) {
	var red = _v0.a;
	var green = _v0.b;
	var blue = _v0.c;
	var alpha = _v0.d;
	return 'rgba(' + ($elm$core$String$fromInt(
		$elm$core$Basics$round(red * 255)) + ((',' + $elm$core$String$fromInt(
		$elm$core$Basics$round(green * 255))) + ((',' + $elm$core$String$fromInt(
		$elm$core$Basics$round(blue * 255))) + (',' + ($elm$core$String$fromFloat(alpha) + ')')))));
};
var $mdgriffith$elm_ui$Internal$Model$formatBoxShadow = function (shadow) {
	return A2(
		$elm$core$String$join,
		' ',
		A2(
			$elm$core$List$filterMap,
			$elm$core$Basics$identity,
			_List_fromArray(
				[
					shadow.pW ? $elm$core$Maybe$Just('inset') : $elm$core$Maybe$Nothing,
					$elm$core$Maybe$Just(
					$elm$core$String$fromFloat(shadow.j6.a) + 'px'),
					$elm$core$Maybe$Just(
					$elm$core$String$fromFloat(shadow.j6.b) + 'px'),
					$elm$core$Maybe$Just(
					$elm$core$String$fromFloat(shadow.sU) + 'px'),
					$elm$core$Maybe$Just(
					$elm$core$String$fromFloat(shadow.vV) + 'px'),
					$elm$core$Maybe$Just(
					$mdgriffith$elm_ui$Internal$Model$formatColor(shadow.td))
				])));
};
var $mdgriffith$elm_ui$Internal$Model$renderFocusStyle = function (focus) {
	return _List_fromArray(
		[
			A2(
			$mdgriffith$elm_ui$Internal$Model$Style,
			$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.pv) + ':focus-within',
			A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				_List_fromArray(
					[
						A2(
						$elm$core$Maybe$map,
						function (color) {
							return A2(
								$mdgriffith$elm_ui$Internal$Model$Property,
								'border-color',
								$mdgriffith$elm_ui$Internal$Model$formatColor(color));
						},
						focus.sX),
						A2(
						$elm$core$Maybe$map,
						function (color) {
							return A2(
								$mdgriffith$elm_ui$Internal$Model$Property,
								'background-color',
								$mdgriffith$elm_ui$Internal$Model$formatColor(color));
						},
						focus.sL),
						A2(
						$elm$core$Maybe$map,
						function (shadow) {
							return A2(
								$mdgriffith$elm_ui$Internal$Model$Property,
								'box-shadow',
								$mdgriffith$elm_ui$Internal$Model$formatBoxShadow(
									{
										sU: shadow.sU,
										td: shadow.td,
										pW: false,
										j6: A2(
											$elm$core$Tuple$mapSecond,
											$elm$core$Basics$toFloat,
											A2($elm$core$Tuple$mapFirst, $elm$core$Basics$toFloat, shadow.j6)),
										vV: shadow.vV
									}));
						},
						focus.vS),
						$elm$core$Maybe$Just(
						A2($mdgriffith$elm_ui$Internal$Model$Property, 'outline', 'none'))
					]))),
			A2(
			$mdgriffith$elm_ui$Internal$Model$Style,
			($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.sH) + ':focus .focusable, ') + (($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.sH) + '.focusable:focus, ') + ('.ui-slide-bar:focus + ' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.sH) + ' .focusable-thumb'))),
			A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				_List_fromArray(
					[
						A2(
						$elm$core$Maybe$map,
						function (color) {
							return A2(
								$mdgriffith$elm_ui$Internal$Model$Property,
								'border-color',
								$mdgriffith$elm_ui$Internal$Model$formatColor(color));
						},
						focus.sX),
						A2(
						$elm$core$Maybe$map,
						function (color) {
							return A2(
								$mdgriffith$elm_ui$Internal$Model$Property,
								'background-color',
								$mdgriffith$elm_ui$Internal$Model$formatColor(color));
						},
						focus.sL),
						A2(
						$elm$core$Maybe$map,
						function (shadow) {
							return A2(
								$mdgriffith$elm_ui$Internal$Model$Property,
								'box-shadow',
								$mdgriffith$elm_ui$Internal$Model$formatBoxShadow(
									{
										sU: shadow.sU,
										td: shadow.td,
										pW: false,
										j6: A2(
											$elm$core$Tuple$mapSecond,
											$elm$core$Basics$toFloat,
											A2($elm$core$Tuple$mapFirst, $elm$core$Basics$toFloat, shadow.j6)),
										vV: shadow.vV
									}));
						},
						focus.vS),
						$elm$core$Maybe$Just(
						A2($mdgriffith$elm_ui$Internal$Model$Property, 'outline', 'none'))
					])))
		]);
};
var $elm$virtual_dom$VirtualDom$property = F2(
	function (key, value) {
		return A2(
			_VirtualDom_property,
			_VirtualDom_noInnerHtmlOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlJson(value));
	});
var $mdgriffith$elm_ui$Internal$Style$AllChildren = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$Batch = function (a) {
	return {$: 6, a: a};
};
var $mdgriffith$elm_ui$Internal$Style$Child = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$Class = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$Descriptor = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$Left = 3;
var $mdgriffith$elm_ui$Internal$Style$Prop = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$Right = 2;
var $mdgriffith$elm_ui$Internal$Style$Self = $elm$core$Basics$identity;
var $mdgriffith$elm_ui$Internal$Style$Supports = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Style$Content = $elm$core$Basics$identity;
var $mdgriffith$elm_ui$Internal$Style$Bottom = 1;
var $mdgriffith$elm_ui$Internal$Style$CenterX = 4;
var $mdgriffith$elm_ui$Internal$Style$CenterY = 5;
var $mdgriffith$elm_ui$Internal$Style$Top = 0;
var $mdgriffith$elm_ui$Internal$Style$alignments = _List_fromArray(
	[0, 1, 2, 3, 4, 5]);
var $mdgriffith$elm_ui$Internal$Style$contentName = function (desc) {
	switch (desc) {
		case 0:
			var _v1 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.tl);
		case 1:
			var _v2 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.mY);
		case 2:
			var _v3 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.m_);
		case 3:
			var _v4 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.h4);
		case 4:
			var _v5 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.mZ);
		default:
			var _v6 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dI);
	}
};
var $mdgriffith$elm_ui$Internal$Style$selfName = function (desc) {
	switch (desc) {
		case 0:
			var _v1 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.sE);
		case 1:
			var _v2 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.sx);
		case 2:
			var _v3 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.oA);
		case 3:
			var _v4 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.oz);
		case 4:
			var _v5 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.sy);
		default:
			var _v6 = desc;
			return $mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.sz);
	}
};
var $mdgriffith$elm_ui$Internal$Style$describeAlignment = function (values) {
	var createDescription = function (alignment) {
		var _v0 = values(alignment);
		var content = _v0.a;
		var indiv = _v0.b;
		return _List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$contentName(alignment),
				content),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Child,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.sH),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$selfName(alignment),
						indiv)
					]))
			]);
	};
	return $mdgriffith$elm_ui$Internal$Style$Batch(
		A2($elm$core$List$concatMap, createDescription, $mdgriffith$elm_ui$Internal$Style$alignments));
};
var $mdgriffith$elm_ui$Internal$Style$elDescription = _List_fromArray(
	[
		A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
		A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'column'),
		A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'pre'),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Descriptor,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.nR),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '0'),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Child,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.sR),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '-1')
					]))
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Descriptor,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.vK),
		_List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Internal$Style$Child,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dD),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.nT),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.oj),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'auto !important')
							]))
					]))
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Child,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.nS),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', 'auto')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Child,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.nT),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '100000')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Child,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.oj),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Child,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.sn),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Child,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.oi),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-start')
			])),
		$mdgriffith$elm_ui$Internal$Style$describeAlignment(
		function (alignment) {
			switch (alignment) {
				case 0:
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-start')
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', '0 !important')
							]));
				case 1:
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-end')
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', '0 !important')
							]));
				case 2:
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-end')
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-end')
							]));
				case 3:
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-start')
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-start')
							]));
				case 4:
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'center')
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'center')
							]));
				default:
					return _Utils_Tuple2(
						_List_fromArray(
							[
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.sH),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto')
									]))
							]),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important')
							]));
			}
		})
	]);
var $mdgriffith$elm_ui$Internal$Style$gridAlignments = function (values) {
	var createDescription = function (alignment) {
		return _List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Internal$Style$Child,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.sH),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$selfName(alignment),
						values(alignment))
					]))
			]);
	};
	return $mdgriffith$elm_ui$Internal$Style$Batch(
		A2($elm$core$List$concatMap, createDescription, $mdgriffith$elm_ui$Internal$Style$alignments));
};
var $mdgriffith$elm_ui$Internal$Style$Above = 0;
var $mdgriffith$elm_ui$Internal$Style$Behind = 5;
var $mdgriffith$elm_ui$Internal$Style$Below = 1;
var $mdgriffith$elm_ui$Internal$Style$OnLeft = 3;
var $mdgriffith$elm_ui$Internal$Style$OnRight = 2;
var $mdgriffith$elm_ui$Internal$Style$Within = 4;
var $mdgriffith$elm_ui$Internal$Style$locations = function () {
	var loc = 0;
	var _v0 = function () {
		switch (loc) {
			case 0:
				return 0;
			case 1:
				return 0;
			case 2:
				return 0;
			case 3:
				return 0;
			case 4:
				return 0;
			default:
				return 0;
		}
	}();
	return _List_fromArray(
		[0, 1, 2, 3, 4, 5]);
}();
var $mdgriffith$elm_ui$Internal$Style$baseSheet = _List_fromArray(
	[
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		'html,body',
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'padding', '0'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		_Utils_ap(
			$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.sH),
			_Utils_ap(
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.vU),
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ui))),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'block'),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.nT),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'img',
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'max-height', '100%'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'object-fit', 'cover')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.oj),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'img',
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'max-width', '100%'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'object-fit', 'cover')
							]))
					]))
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.sH) + ':focus',
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'outline', 'none')
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.rh),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', 'auto'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'min-height', '100%'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '0'),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				_Utils_ap(
					$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.sH),
					$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.nT)),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.nT),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Child,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.uk),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.fT),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'fixed'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '20')
							]))
					]))
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.fT),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'relative'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border', 'none'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'row'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto'),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.vU),
				$mdgriffith$elm_ui$Internal$Style$elDescription),
				$mdgriffith$elm_ui$Internal$Style$Batch(
				function (fn) {
					return A2($elm$core$List$map, fn, $mdgriffith$elm_ui$Internal$Style$locations);
				}(
					function (loc) {
						switch (loc) {
							case 0:
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ss),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'bottom', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '20'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.nT),
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', 'auto')
												])),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.oj),
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
												])),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												]))
										]));
							case 1:
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.sS),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'bottom', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '20'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												])),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.nT),
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', 'auto')
												]))
										]));
							case 2:
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.u2),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'top', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '20'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												]))
										]));
							case 3:
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.u1),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'right', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'top', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '20'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												]))
										]));
							case 4:
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.uk),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'top', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												]))
										]));
							default:
								return A2(
									$mdgriffith$elm_ui$Internal$Style$Descriptor,
									$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.sR),
									_List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'absolute'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'top', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '0'),
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none'),
											A2(
											$mdgriffith$elm_ui$Internal$Style$Child,
											'*',
											_List_fromArray(
												[
													A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto')
												]))
										]));
						}
					}))
			])),
		A2(
		$mdgriffith$elm_ui$Internal$Style$Class,
		$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.sH),
		_List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'relative'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border', 'none'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '0'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'row'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'resize', 'none'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-feature-settings', 'inherit'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'box-sizing', 'border-box'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'padding', '0'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-width', '0'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-style', 'solid'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-size', 'inherit'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'color', 'inherit'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-family', 'inherit'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'line-height', '1'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', 'inherit'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration', 'none'),
				A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-style', 'inherit'),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ok),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-wrap', 'wrap')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.qx),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, '-moz-user-select', 'none'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, '-webkit-user-select', 'none'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, '-ms-user-select', 'none'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'user-select', 'none')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.to),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'cursor', 'pointer')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.tp),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'cursor', 'text')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.vd),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none !important')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.mU),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'auto !important')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ew),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '0')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.eh),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '1')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.uc, $mdgriffith$elm_ui$Internal$Style$classes.ew)) + ':hover',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '0')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.uc, $mdgriffith$elm_ui$Internal$Style$classes.eh)) + ':hover',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '1')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.tS, $mdgriffith$elm_ui$Internal$Style$classes.ew)) + ':focus',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '0')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.tS, $mdgriffith$elm_ui$Internal$Style$classes.eh)) + ':focus',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '1')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.mO, $mdgriffith$elm_ui$Internal$Style$classes.ew)) + ':active',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '0')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot(
					_Utils_ap($mdgriffith$elm_ui$Internal$Style$classes.mO, $mdgriffith$elm_ui$Internal$Style$classes.eh)) + ':active',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'opacity', '1')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.r1),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Prop,
						'transition',
						A2(
							$elm$core$String$join,
							', ',
							A2(
								$elm$core$List$map,
								function (x) {
									return x + ' 160ms';
								},
								_List_fromArray(
									['transform', 'opacity', 'filter', 'background-color', 'color', 'font-size']))))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.vH),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow', 'auto'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '1')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.vI),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow-x', 'auto'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.rj),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '1')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.vJ),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow-y', 'auto'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dH),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '1')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.vU),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-shrink', '1')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.s9),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow', 'hidden')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ta),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow-x', 'hidden')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.tb),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow-y', 'hidden')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.oi),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', 'auto')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.mQ),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-width', '0')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.sY),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-style', 'dashed')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.sZ),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-style', 'dotted')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.s_),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'border-style', 'solid')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dD),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'pre'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline-block')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.us),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'line-height', '1.05'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'background', 'transparent'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'inherit')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.vU),
				$mdgriffith$elm_ui$Internal$Style$elDescription),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.rj),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'row'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.sH),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', '0%'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.sm),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.qb),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.nT),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'stretch !important')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.pM),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'stretch !important')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.oj),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '100000')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.mX),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'stretch')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'u:first-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.sD,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:first-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.sB,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.sy),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-left', 'auto !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:last-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.sB,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.sy),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-right', 'auto !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:only-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.sB,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.sz),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:last-of-type.' + ($mdgriffith$elm_ui$Internal$Style$classes.sB + ' ~ u'),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'u:first-of-type.' + ($mdgriffith$elm_ui$Internal$Style$classes.sD + (' ~ s.' + $mdgriffith$elm_ui$Internal$Style$classes.sB)),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						$mdgriffith$elm_ui$Internal$Style$describeAlignment(
						function (alignment) {
							switch (alignment) {
								case 0:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-start')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-start')
											]));
								case 1:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-end')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-end')
											]));
								case 2:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-end')
											]),
										_List_Nil);
								case 3:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-start')
											]),
										_List_Nil);
								case 4:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'center')
											]),
										_List_Nil);
								default:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'center')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'center')
											]));
							}
						}),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.vX),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'space-between')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.m8),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'baseline')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dH),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-direction', 'column'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.sH),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', '0px'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'min-height', 'min-content'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.pL),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.nT),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '100000')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.oj),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.sn),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.oi),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-start')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'u:first-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.sA,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:first-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.sC,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.sz),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', '0 !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:last-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.sC,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.sz),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', '0 !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:only-of-type.' + $mdgriffith$elm_ui$Internal$Style$classes.sC,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '1'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.sz),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto !important'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto !important')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						's:last-of-type.' + ($mdgriffith$elm_ui$Internal$Style$classes.sC + ' ~ u'),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'u:first-of-type.' + ($mdgriffith$elm_ui$Internal$Style$classes.sA + (' ~ s.' + $mdgriffith$elm_ui$Internal$Style$classes.sC)),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0')
							])),
						$mdgriffith$elm_ui$Internal$Style$describeAlignment(
						function (alignment) {
							switch (alignment) {
								case 0:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-start')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-bottom', 'auto')
											]));
								case 1:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-end')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin-top', 'auto')
											]));
								case 2:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-end')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-end')
											]));
								case 3:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-start')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'flex-start')
											]));
								case 4:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'center')
											]),
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'center')
											]));
								default:
									return _Utils_Tuple2(
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'center')
											]),
										_List_Nil);
							}
						}),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.mX),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-grow', '0'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-self', 'stretch !important')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.vX),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'space-between')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.t5),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', '-ms-grid'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						'.gp',
						_List_fromArray(
							[
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.sH),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Supports,
						_Utils_Tuple2('display', 'grid'),
						_List_fromArray(
							[
								_Utils_Tuple2('display', 'grid')
							])),
						$mdgriffith$elm_ui$Internal$Style$gridAlignments(
						function (alignment) {
							switch (alignment) {
								case 0:
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-start')
										]);
								case 1:
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'flex-end')
										]);
								case 2:
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-end')
										]);
								case 3:
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'flex-start')
										]);
								case 4:
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'align-items', 'center')
										]);
								default:
									return _List_fromArray(
										[
											A2($mdgriffith$elm_ui$Internal$Style$Prop, 'justify-content', 'center')
										]);
							}
						})
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.u),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'block'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.sH + ':first-child'),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot(
							$mdgriffith$elm_ui$Internal$Style$classes.sH + ($mdgriffith$elm_ui$Internal$Style$selfName(3) + (':first-child + .' + $mdgriffith$elm_ui$Internal$Style$classes.sH))),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot(
							$mdgriffith$elm_ui$Internal$Style$classes.sH + ($mdgriffith$elm_ui$Internal$Style$selfName(2) + (':first-child + .' + $mdgriffith$elm_ui$Internal$Style$classes.sH))),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'margin', '0 !important')
							])),
						$mdgriffith$elm_ui$Internal$Style$describeAlignment(
						function (alignment) {
							switch (alignment) {
								case 0:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								case 1:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								case 2:
									return _Utils_Tuple2(
										_List_Nil,
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'float', 'right'),
												A2(
												$mdgriffith$elm_ui$Internal$Style$Descriptor,
												'::after',
												_List_fromArray(
													[
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'content', '\"\"'),
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'table'),
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'clear', 'both')
													]))
											]));
								case 3:
									return _Utils_Tuple2(
										_List_Nil,
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'float', 'left'),
												A2(
												$mdgriffith$elm_ui$Internal$Style$Descriptor,
												'::after',
												_List_fromArray(
													[
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'content', '\"\"'),
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'table'),
														A2($mdgriffith$elm_ui$Internal$Style$Prop, 'clear', 'both')
													]))
											]));
								case 4:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								default:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
							}
						})
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.uo),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'pre-wrap !important'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'background-color', 'transparent')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ur),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.vU),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'flex-basis', 'auto')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.uq),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'pre-wrap !important'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'cursor', 'text'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.up),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'pre-wrap !important'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'color', 'transparent')
							]))
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.qJ),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'block'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'normal'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'overflow-wrap', 'break-word'),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Descriptor,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.nR),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '0'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.sR),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'z-index', '-1')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$AllChildren,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dD),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'normal')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$AllChildren,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.qJ),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								'::after',
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'content', 'none')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								'::before',
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'content', 'none')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$AllChildren,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.vU),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline'),
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'normal'),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.sm),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline-block')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.uk),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.sR),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ss),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.sS),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.u2),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Descriptor,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.u1),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'flex')
									])),
								A2(
								$mdgriffith$elm_ui$Internal$Style$Child,
								$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dD),
								_List_fromArray(
									[
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline'),
										A2($mdgriffith$elm_ui$Internal$Style$Prop, 'white-space', 'normal')
									]))
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.rj),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.dH),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline-flex')
							])),
						A2(
						$mdgriffith$elm_ui$Internal$Style$Child,
						$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.t5),
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'inline-grid')
							])),
						$mdgriffith$elm_ui$Internal$Style$describeAlignment(
						function (alignment) {
							switch (alignment) {
								case 0:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								case 1:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								case 2:
									return _Utils_Tuple2(
										_List_Nil,
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'float', 'right')
											]));
								case 3:
									return _Utils_Tuple2(
										_List_Nil,
										_List_fromArray(
											[
												A2($mdgriffith$elm_ui$Internal$Style$Prop, 'float', 'left')
											]));
								case 4:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
								default:
									return _Utils_Tuple2(_List_Nil, _List_Nil);
							}
						})
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				'.hidden',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'display', 'none')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.wl),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '100')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.wc),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '200')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.wg),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '300')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.wi),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '400')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.wh),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '500')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.wk),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '600')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.sW),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '700')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.wb),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '800')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.wd),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-weight', '900')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.uA),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-style', 'italic')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.v4),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration', 'line-through')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ww),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration', 'underline'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration-skip-ink', 'auto'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration-skip', 'ink')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				_Utils_ap(
					$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.ww),
					$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.v4)),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration', 'line-through underline'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration-skip-ink', 'auto'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-decoration-skip', 'ink')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.wm),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-style', 'normal')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.we),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'justify')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.nt),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'justify-all')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.wa),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'center')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.wj),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'right')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				$mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.wf),
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'text-align', 'left')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Descriptor,
				'.modal',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'position', 'fixed'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'left', '0'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'top', '0'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'width', '100%'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'height', '100%'),
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'pointer-events', 'none')
					]))
			]))
	]);
var $mdgriffith$elm_ui$Internal$Style$fontVariant = function (_var) {
	return _List_fromArray(
		[
			A2(
			$mdgriffith$elm_ui$Internal$Style$Class,
			'.v-' + _var,
			_List_fromArray(
				[
					A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-feature-settings', '\"' + (_var + '\"'))
				])),
			A2(
			$mdgriffith$elm_ui$Internal$Style$Class,
			'.v-' + (_var + '-off'),
			_List_fromArray(
				[
					A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-feature-settings', '\"' + (_var + '\" 0'))
				]))
		]);
};
var $mdgriffith$elm_ui$Internal$Style$commonValues = $elm$core$List$concat(
	_List_fromArray(
		[
			A2(
			$elm$core$List$map,
			function (x) {
				return A2(
					$mdgriffith$elm_ui$Internal$Style$Class,
					'.border-' + $elm$core$String$fromInt(x),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Style$Prop,
							'border-width',
							$elm$core$String$fromInt(x) + 'px')
						]));
			},
			A2($elm$core$List$range, 0, 6)),
			A2(
			$elm$core$List$map,
			function (i) {
				return A2(
					$mdgriffith$elm_ui$Internal$Style$Class,
					'.font-size-' + $elm$core$String$fromInt(i),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Style$Prop,
							'font-size',
							$elm$core$String$fromInt(i) + 'px')
						]));
			},
			A2($elm$core$List$range, 8, 32)),
			A2(
			$elm$core$List$map,
			function (i) {
				return A2(
					$mdgriffith$elm_ui$Internal$Style$Class,
					'.p-' + $elm$core$String$fromInt(i),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Style$Prop,
							'padding',
							$elm$core$String$fromInt(i) + 'px')
						]));
			},
			A2($elm$core$List$range, 0, 24)),
			_List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Internal$Style$Class,
				'.v-smcp',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-variant', 'small-caps')
					])),
				A2(
				$mdgriffith$elm_ui$Internal$Style$Class,
				'.v-smcp-off',
				_List_fromArray(
					[
						A2($mdgriffith$elm_ui$Internal$Style$Prop, 'font-variant', 'normal')
					]))
			]),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('zero'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('onum'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('liga'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('dlig'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('ordn'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('tnum'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('afrc'),
			$mdgriffith$elm_ui$Internal$Style$fontVariant('frac')
		]));
var $mdgriffith$elm_ui$Internal$Style$explainer = '\n.explain {\n    border: 6px solid rgb(174, 121, 15) !important;\n}\n.explain > .' + ($mdgriffith$elm_ui$Internal$Style$classes.sH + (' {\n    border: 4px dashed rgb(0, 151, 167) !important;\n}\n\n.ctr {\n    border: none !important;\n}\n.explain > .ctr > .' + ($mdgriffith$elm_ui$Internal$Style$classes.sH + ' {\n    border: 4px dashed rgb(0, 151, 167) !important;\n}\n\n')));
var $mdgriffith$elm_ui$Internal$Style$inputTextReset = '\ninput[type="search"],\ninput[type="search"]::-webkit-search-decoration,\ninput[type="search"]::-webkit-search-cancel-button,\ninput[type="search"]::-webkit-search-results-button,\ninput[type="search"]::-webkit-search-results-decoration {\n  -webkit-appearance:none;\n}\n';
var $mdgriffith$elm_ui$Internal$Style$sliderReset = '\ninput[type=range] {\n  -webkit-appearance: none; \n  background: transparent;\n  position:absolute;\n  left:0;\n  top:0;\n  z-index:10;\n  width: 100%;\n  outline: dashed 1px;\n  height: 100%;\n  opacity: 0;\n}\n';
var $mdgriffith$elm_ui$Internal$Style$thumbReset = '\ninput[type=range]::-webkit-slider-thumb {\n    -webkit-appearance: none;\n    opacity: 0.5;\n    width: 80px;\n    height: 80px;\n    background-color: black;\n    border:none;\n    border-radius: 5px;\n}\ninput[type=range]::-moz-range-thumb {\n    opacity: 0.5;\n    width: 80px;\n    height: 80px;\n    background-color: black;\n    border:none;\n    border-radius: 5px;\n}\ninput[type=range]::-ms-thumb {\n    opacity: 0.5;\n    width: 80px;\n    height: 80px;\n    background-color: black;\n    border:none;\n    border-radius: 5px;\n}\ninput[type=range][orient=vertical]{\n    writing-mode: bt-lr; /* IE */\n    -webkit-appearance: slider-vertical;  /* WebKit */\n}\n';
var $mdgriffith$elm_ui$Internal$Style$trackReset = '\ninput[type=range]::-moz-range-track {\n    background: transparent;\n    cursor: pointer;\n}\ninput[type=range]::-ms-track {\n    background: transparent;\n    cursor: pointer;\n}\ninput[type=range]::-webkit-slider-runnable-track {\n    background: transparent;\n    cursor: pointer;\n}\n';
var $mdgriffith$elm_ui$Internal$Style$overrides = '@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.sH) + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.rj) + (' > ' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.sH) + (' { flex-basis: auto !important; } ' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.sH) + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.rj) + (' > ' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.sH) + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.mX) + (' { flex-basis: auto !important; }}' + ($mdgriffith$elm_ui$Internal$Style$inputTextReset + ($mdgriffith$elm_ui$Internal$Style$sliderReset + ($mdgriffith$elm_ui$Internal$Style$trackReset + ($mdgriffith$elm_ui$Internal$Style$thumbReset + $mdgriffith$elm_ui$Internal$Style$explainer)))))))))))))));
var $elm$core$String$concat = function (strings) {
	return A2($elm$core$String$join, '', strings);
};
var $mdgriffith$elm_ui$Internal$Style$Intermediate = $elm$core$Basics$identity;
var $mdgriffith$elm_ui$Internal$Style$emptyIntermediate = F2(
	function (selector, closing) {
		return {mV: closing, aA: _List_Nil, dN: _List_Nil, c_: selector};
	});
var $mdgriffith$elm_ui$Internal$Style$renderRules = F2(
	function (_v0, rulesToRender) {
		var parent = _v0;
		var generateIntermediates = F2(
			function (rule, rendered) {
				switch (rule.$) {
					case 0:
						var name = rule.a;
						var val = rule.b;
						return _Utils_update(
							rendered,
							{
								dN: A2(
									$elm$core$List$cons,
									_Utils_Tuple2(name, val),
									rendered.dN)
							});
					case 3:
						var _v2 = rule.a;
						var prop = _v2.a;
						var value = _v2.b;
						var props = rule.b;
						return _Utils_update(
							rendered,
							{
								aA: A2(
									$elm$core$List$cons,
									{mV: '\n}', aA: _List_Nil, dN: props, c_: '@supports (' + (prop + (':' + (value + (') {' + parent.c_))))},
									rendered.aA)
							});
					case 5:
						var selector = rule.a;
						var adjRules = rule.b;
						return _Utils_update(
							rendered,
							{
								aA: A2(
									$elm$core$List$cons,
									A2(
										$mdgriffith$elm_ui$Internal$Style$renderRules,
										A2($mdgriffith$elm_ui$Internal$Style$emptyIntermediate, parent.c_ + (' + ' + selector), ''),
										adjRules),
									rendered.aA)
							});
					case 1:
						var child = rule.a;
						var childRules = rule.b;
						return _Utils_update(
							rendered,
							{
								aA: A2(
									$elm$core$List$cons,
									A2(
										$mdgriffith$elm_ui$Internal$Style$renderRules,
										A2($mdgriffith$elm_ui$Internal$Style$emptyIntermediate, parent.c_ + (' > ' + child), ''),
										childRules),
									rendered.aA)
							});
					case 2:
						var child = rule.a;
						var childRules = rule.b;
						return _Utils_update(
							rendered,
							{
								aA: A2(
									$elm$core$List$cons,
									A2(
										$mdgriffith$elm_ui$Internal$Style$renderRules,
										A2($mdgriffith$elm_ui$Internal$Style$emptyIntermediate, parent.c_ + (' ' + child), ''),
										childRules),
									rendered.aA)
							});
					case 4:
						var descriptor = rule.a;
						var descriptorRules = rule.b;
						return _Utils_update(
							rendered,
							{
								aA: A2(
									$elm$core$List$cons,
									A2(
										$mdgriffith$elm_ui$Internal$Style$renderRules,
										A2(
											$mdgriffith$elm_ui$Internal$Style$emptyIntermediate,
											_Utils_ap(parent.c_, descriptor),
											''),
										descriptorRules),
									rendered.aA)
							});
					default:
						var batched = rule.a;
						return _Utils_update(
							rendered,
							{
								aA: A2(
									$elm$core$List$cons,
									A2(
										$mdgriffith$elm_ui$Internal$Style$renderRules,
										A2($mdgriffith$elm_ui$Internal$Style$emptyIntermediate, parent.c_, ''),
										batched),
									rendered.aA)
							});
				}
			});
		return A3($elm$core$List$foldr, generateIntermediates, parent, rulesToRender);
	});
var $mdgriffith$elm_ui$Internal$Style$renderCompact = function (styleClasses) {
	var renderValues = function (values) {
		return $elm$core$String$concat(
			A2(
				$elm$core$List$map,
				function (_v3) {
					var x = _v3.a;
					var y = _v3.b;
					return x + (':' + (y + ';'));
				},
				values));
	};
	var renderClass = function (rule) {
		var _v2 = rule.dN;
		if (!_v2.b) {
			return '';
		} else {
			return rule.c_ + ('{' + (renderValues(rule.dN) + (rule.mV + '}')));
		}
	};
	var renderIntermediate = function (_v0) {
		var rule = _v0;
		return _Utils_ap(
			renderClass(rule),
			$elm$core$String$concat(
				A2($elm$core$List$map, renderIntermediate, rule.aA)));
	};
	return $elm$core$String$concat(
		A2(
			$elm$core$List$map,
			renderIntermediate,
			A3(
				$elm$core$List$foldr,
				F2(
					function (_v1, existing) {
						var name = _v1.a;
						var styleRules = _v1.b;
						return A2(
							$elm$core$List$cons,
							A2(
								$mdgriffith$elm_ui$Internal$Style$renderRules,
								A2($mdgriffith$elm_ui$Internal$Style$emptyIntermediate, name, ''),
								styleRules),
							existing);
					}),
				_List_Nil,
				styleClasses)));
};
var $mdgriffith$elm_ui$Internal$Style$rules = _Utils_ap(
	$mdgriffith$elm_ui$Internal$Style$overrides,
	$mdgriffith$elm_ui$Internal$Style$renderCompact(
		_Utils_ap($mdgriffith$elm_ui$Internal$Style$baseSheet, $mdgriffith$elm_ui$Internal$Style$commonValues)));
var $mdgriffith$elm_ui$Internal$Model$staticRoot = function (opts) {
	var _v0 = opts.uP;
	switch (_v0) {
		case 0:
			return A3(
				$elm$virtual_dom$VirtualDom$node,
				'div',
				_List_Nil,
				_List_fromArray(
					[
						A3(
						$elm$virtual_dom$VirtualDom$node,
						'style',
						_List_Nil,
						_List_fromArray(
							[
								$elm$virtual_dom$VirtualDom$text($mdgriffith$elm_ui$Internal$Style$rules)
							]))
					]));
		case 1:
			return $elm$virtual_dom$VirtualDom$text('');
		default:
			return A3(
				$elm$virtual_dom$VirtualDom$node,
				'elm-ui-static-rules',
				_List_fromArray(
					[
						A2(
						$elm$virtual_dom$VirtualDom$property,
						'rules',
						$elm$json$Json$Encode$string($mdgriffith$elm_ui$Internal$Style$rules))
					]),
				_List_Nil);
	}
};
var $mdgriffith$elm_ui$Internal$Model$fontName = function (font) {
	switch (font.$) {
		case 0:
			return 'serif';
		case 1:
			return 'sans-serif';
		case 2:
			return 'monospace';
		case 3:
			var name = font.a;
			return '\"' + (name + '\"');
		case 4:
			var name = font.a;
			var url = font.b;
			return '\"' + (name + '\"');
		default:
			var name = font.a.fR;
			return '\"' + (name + '\"');
	}
};
var $mdgriffith$elm_ui$Internal$Model$isSmallCaps = function (_var) {
	switch (_var.$) {
		case 0:
			var name = _var.a;
			return name === 'smcp';
		case 1:
			var name = _var.a;
			return false;
		default:
			var name = _var.a;
			var index = _var.b;
			return (name === 'smcp') && (index === 1);
	}
};
var $mdgriffith$elm_ui$Internal$Model$hasSmallCaps = function (typeface) {
	if (typeface.$ === 5) {
		var font = typeface.a;
		return A2($elm$core$List$any, $mdgriffith$elm_ui$Internal$Model$isSmallCaps, font.sa);
	} else {
		return false;
	}
};
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $mdgriffith$elm_ui$Internal$Model$renderProps = F3(
	function (force, _v0, existing) {
		var key = _v0.a;
		var val = _v0.b;
		return force ? (existing + ('\n  ' + (key + (': ' + (val + ' !important;'))))) : (existing + ('\n  ' + (key + (': ' + (val + ';')))));
	});
var $mdgriffith$elm_ui$Internal$Model$renderStyle = F4(
	function (options, maybePseudo, selector, props) {
		if (maybePseudo.$ === 1) {
			return _List_fromArray(
				[
					selector + ('{' + (A3(
					$elm$core$List$foldl,
					$mdgriffith$elm_ui$Internal$Model$renderProps(false),
					'',
					props) + '\n}'))
				]);
		} else {
			var pseudo = maybePseudo.a;
			switch (pseudo) {
				case 1:
					var _v2 = options.uc;
					switch (_v2) {
						case 0:
							return _List_Nil;
						case 2:
							return _List_fromArray(
								[
									selector + ('-hv {' + (A3(
									$elm$core$List$foldl,
									$mdgriffith$elm_ui$Internal$Model$renderProps(true),
									'',
									props) + '\n}'))
								]);
						default:
							return _List_fromArray(
								[
									selector + ('-hv:hover {' + (A3(
									$elm$core$List$foldl,
									$mdgriffith$elm_ui$Internal$Model$renderProps(false),
									'',
									props) + '\n}'))
								]);
					}
				case 0:
					var renderedProps = A3(
						$elm$core$List$foldl,
						$mdgriffith$elm_ui$Internal$Model$renderProps(false),
						'',
						props);
					return _List_fromArray(
						[
							selector + ('-fs:focus {' + (renderedProps + '\n}')),
							('.' + ($mdgriffith$elm_ui$Internal$Style$classes.sH + (':focus ' + (selector + '-fs  {')))) + (renderedProps + '\n}'),
							(selector + '-fs:focus-within {') + (renderedProps + '\n}'),
							('.ui-slide-bar:focus + ' + ($mdgriffith$elm_ui$Internal$Style$dot($mdgriffith$elm_ui$Internal$Style$classes.sH) + (' .focusable-thumb' + (selector + '-fs {')))) + (renderedProps + '\n}')
						]);
				default:
					return _List_fromArray(
						[
							selector + ('-act:active {' + (A3(
							$elm$core$List$foldl,
							$mdgriffith$elm_ui$Internal$Model$renderProps(false),
							'',
							props) + '\n}'))
						]);
			}
		}
	});
var $mdgriffith$elm_ui$Internal$Model$renderVariant = function (_var) {
	switch (_var.$) {
		case 0:
			var name = _var.a;
			return '\"' + (name + '\"');
		case 1:
			var name = _var.a;
			return '\"' + (name + '\" 0');
		default:
			var name = _var.a;
			var index = _var.b;
			return '\"' + (name + ('\" ' + $elm$core$String$fromInt(index)));
	}
};
var $mdgriffith$elm_ui$Internal$Model$renderVariants = function (typeface) {
	if (typeface.$ === 5) {
		var font = typeface.a;
		return $elm$core$Maybe$Just(
			A2(
				$elm$core$String$join,
				', ',
				A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$renderVariant, font.sa)));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $mdgriffith$elm_ui$Internal$Model$transformValue = function (transform) {
	switch (transform.$) {
		case 0:
			return $elm$core$Maybe$Nothing;
		case 1:
			var _v1 = transform.a;
			var x = _v1.a;
			var y = _v1.b;
			var z = _v1.c;
			return $elm$core$Maybe$Just(
				'translate3d(' + ($elm$core$String$fromFloat(x) + ('px, ' + ($elm$core$String$fromFloat(y) + ('px, ' + ($elm$core$String$fromFloat(z) + 'px)'))))));
		default:
			var _v2 = transform.a;
			var tx = _v2.a;
			var ty = _v2.b;
			var tz = _v2.c;
			var _v3 = transform.b;
			var sx = _v3.a;
			var sy = _v3.b;
			var sz = _v3.c;
			var _v4 = transform.c;
			var ox = _v4.a;
			var oy = _v4.b;
			var oz = _v4.c;
			var angle = transform.d;
			var translate = 'translate3d(' + ($elm$core$String$fromFloat(tx) + ('px, ' + ($elm$core$String$fromFloat(ty) + ('px, ' + ($elm$core$String$fromFloat(tz) + 'px)')))));
			var scale = 'scale3d(' + ($elm$core$String$fromFloat(sx) + (', ' + ($elm$core$String$fromFloat(sy) + (', ' + ($elm$core$String$fromFloat(sz) + ')')))));
			var rotate = 'rotate3d(' + ($elm$core$String$fromFloat(ox) + (', ' + ($elm$core$String$fromFloat(oy) + (', ' + ($elm$core$String$fromFloat(oz) + (', ' + ($elm$core$String$fromFloat(angle) + 'rad)')))))));
			return $elm$core$Maybe$Just(translate + (' ' + (scale + (' ' + rotate))));
	}
};
var $mdgriffith$elm_ui$Internal$Model$renderStyleRule = F3(
	function (options, rule, maybePseudo) {
		switch (rule.$) {
			case 0:
				var selector = rule.a;
				var props = rule.b;
				return A4($mdgriffith$elm_ui$Internal$Model$renderStyle, options, maybePseudo, selector, props);
			case 13:
				var name = rule.a;
				var prop = rule.b;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
					maybePseudo,
					'.' + name,
					_List_fromArray(
						[
							A2($mdgriffith$elm_ui$Internal$Model$Property, 'box-shadow', prop)
						]));
			case 12:
				var name = rule.a;
				var transparency = rule.b;
				var opacity = A2(
					$elm$core$Basics$max,
					0,
					A2($elm$core$Basics$min, 1, 1 - transparency));
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
					maybePseudo,
					'.' + name,
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Model$Property,
							'opacity',
							$elm$core$String$fromFloat(opacity))
						]));
			case 2:
				var i = rule.a;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
					maybePseudo,
					'.font-size-' + $elm$core$String$fromInt(i),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Model$Property,
							'font-size',
							$elm$core$String$fromInt(i) + 'px')
						]));
			case 1:
				var name = rule.a;
				var typefaces = rule.b;
				var features = A2(
					$elm$core$String$join,
					', ',
					A2($elm$core$List$filterMap, $mdgriffith$elm_ui$Internal$Model$renderVariants, typefaces));
				var families = _List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Internal$Model$Property,
						'font-family',
						A2(
							$elm$core$String$join,
							', ',
							A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$fontName, typefaces))),
						A2($mdgriffith$elm_ui$Internal$Model$Property, 'font-feature-settings', features),
						A2(
						$mdgriffith$elm_ui$Internal$Model$Property,
						'font-variant',
						A2($elm$core$List$any, $mdgriffith$elm_ui$Internal$Model$hasSmallCaps, typefaces) ? 'small-caps' : 'normal')
					]);
				return A4($mdgriffith$elm_ui$Internal$Model$renderStyle, options, maybePseudo, '.' + name, families);
			case 3:
				var _class = rule.a;
				var prop = rule.b;
				var val = rule.c;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
					maybePseudo,
					'.' + _class,
					_List_fromArray(
						[
							A2($mdgriffith$elm_ui$Internal$Model$Property, prop, val)
						]));
			case 4:
				var _class = rule.a;
				var prop = rule.b;
				var color = rule.c;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
					maybePseudo,
					'.' + _class,
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Model$Property,
							prop,
							$mdgriffith$elm_ui$Internal$Model$formatColor(color))
						]));
			case 5:
				var cls = rule.a;
				var x = rule.b;
				var y = rule.c;
				var yPx = $elm$core$String$fromInt(y) + 'px';
				var xPx = $elm$core$String$fromInt(x) + 'px';
				var single = '.' + $mdgriffith$elm_ui$Internal$Style$classes.vU;
				var row = '.' + $mdgriffith$elm_ui$Internal$Style$classes.rj;
				var wrappedRow = '.' + ($mdgriffith$elm_ui$Internal$Style$classes.ok + row);
				var right = '.' + $mdgriffith$elm_ui$Internal$Style$classes.oA;
				var paragraph = '.' + $mdgriffith$elm_ui$Internal$Style$classes.qJ;
				var page = '.' + $mdgriffith$elm_ui$Internal$Style$classes.u;
				var left = '.' + $mdgriffith$elm_ui$Internal$Style$classes.oz;
				var halfY = $elm$core$String$fromFloat(y / 2) + 'px';
				var halfX = $elm$core$String$fromFloat(x / 2) + 'px';
				var column = '.' + $mdgriffith$elm_ui$Internal$Style$classes.dH;
				var _class = '.' + cls;
				var any = '.' + $mdgriffith$elm_ui$Internal$Style$classes.sH;
				return $elm$core$List$concat(
					_List_fromArray(
						[
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (row + (' > ' + (any + (' + ' + any)))),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-left', xPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (wrappedRow + (' > ' + any)),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin', halfY + (' ' + halfX))
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (column + (' > ' + (any + (' + ' + any)))),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-top', yPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (page + (' > ' + (any + (' + ' + any)))),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-top', yPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (page + (' > ' + left)),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-right', xPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (page + (' > ' + right)),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-left', xPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_Utils_ap(_class, paragraph),
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Internal$Model$Property,
									'line-height',
									'calc(1em + ' + ($elm$core$String$fromInt(y) + 'px)'))
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							'textarea' + (any + _class),
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Internal$Model$Property,
									'line-height',
									'calc(1em + ' + ($elm$core$String$fromInt(y) + 'px)')),
									A2(
									$mdgriffith$elm_ui$Internal$Model$Property,
									'height',
									'calc(100% + ' + ($elm$core$String$fromInt(y) + 'px)'))
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (paragraph + (' > ' + left)),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-right', xPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (paragraph + (' > ' + right)),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'margin-left', xPx)
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (paragraph + '::after'),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'content', '\'\''),
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'display', 'block'),
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'height', '0'),
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'width', '0'),
									A2(
									$mdgriffith$elm_ui$Internal$Model$Property,
									'margin-top',
									$elm$core$String$fromInt((-1) * ((y / 2) | 0)) + 'px')
								])),
							A4(
							$mdgriffith$elm_ui$Internal$Model$renderStyle,
							options,
							maybePseudo,
							_class + (paragraph + '::before'),
							_List_fromArray(
								[
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'content', '\'\''),
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'display', 'block'),
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'height', '0'),
									A2($mdgriffith$elm_ui$Internal$Model$Property, 'width', '0'),
									A2(
									$mdgriffith$elm_ui$Internal$Model$Property,
									'margin-bottom',
									$elm$core$String$fromInt((-1) * ((y / 2) | 0)) + 'px')
								]))
						]));
			case 7:
				var cls = rule.a;
				var top = rule.b;
				var right = rule.c;
				var bottom = rule.d;
				var left = rule.e;
				var _class = '.' + cls;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
					maybePseudo,
					_class,
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Model$Property,
							'padding',
							$elm$core$String$fromFloat(top) + ('px ' + ($elm$core$String$fromFloat(right) + ('px ' + ($elm$core$String$fromFloat(bottom) + ('px ' + ($elm$core$String$fromFloat(left) + 'px')))))))
						]));
			case 6:
				var cls = rule.a;
				var top = rule.b;
				var right = rule.c;
				var bottom = rule.d;
				var left = rule.e;
				var _class = '.' + cls;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$renderStyle,
					options,
					maybePseudo,
					_class,
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Internal$Model$Property,
							'border-width',
							$elm$core$String$fromInt(top) + ('px ' + ($elm$core$String$fromInt(right) + ('px ' + ($elm$core$String$fromInt(bottom) + ('px ' + ($elm$core$String$fromInt(left) + 'px')))))))
						]));
			case 8:
				var template = rule.a;
				var toGridLengthHelper = F3(
					function (minimum, maximum, x) {
						toGridLengthHelper:
						while (true) {
							switch (x.$) {
								case 0:
									var px = x.a;
									return $elm$core$String$fromInt(px) + 'px';
								case 1:
									var _v2 = _Utils_Tuple2(minimum, maximum);
									if (_v2.a.$ === 1) {
										if (_v2.b.$ === 1) {
											var _v3 = _v2.a;
											var _v4 = _v2.b;
											return 'max-content';
										} else {
											var _v6 = _v2.a;
											var maxSize = _v2.b.a;
											return 'minmax(max-content, ' + ($elm$core$String$fromInt(maxSize) + 'px)');
										}
									} else {
										if (_v2.b.$ === 1) {
											var minSize = _v2.a.a;
											var _v5 = _v2.b;
											return 'minmax(' + ($elm$core$String$fromInt(minSize) + ('px, ' + 'max-content)'));
										} else {
											var minSize = _v2.a.a;
											var maxSize = _v2.b.a;
											return 'minmax(' + ($elm$core$String$fromInt(minSize) + ('px, ' + ($elm$core$String$fromInt(maxSize) + 'px)')));
										}
									}
								case 2:
									var i = x.a;
									var _v7 = _Utils_Tuple2(minimum, maximum);
									if (_v7.a.$ === 1) {
										if (_v7.b.$ === 1) {
											var _v8 = _v7.a;
											var _v9 = _v7.b;
											return $elm$core$String$fromInt(i) + 'fr';
										} else {
											var _v11 = _v7.a;
											var maxSize = _v7.b.a;
											return 'minmax(max-content, ' + ($elm$core$String$fromInt(maxSize) + 'px)');
										}
									} else {
										if (_v7.b.$ === 1) {
											var minSize = _v7.a.a;
											var _v10 = _v7.b;
											return 'minmax(' + ($elm$core$String$fromInt(minSize) + ('px, ' + ($elm$core$String$fromInt(i) + ('fr' + 'fr)'))));
										} else {
											var minSize = _v7.a.a;
											var maxSize = _v7.b.a;
											return 'minmax(' + ($elm$core$String$fromInt(minSize) + ('px, ' + ($elm$core$String$fromInt(maxSize) + 'px)')));
										}
									}
								case 3:
									var m = x.a;
									var len = x.b;
									var $temp$minimum = $elm$core$Maybe$Just(m),
										$temp$maximum = maximum,
										$temp$x = len;
									minimum = $temp$minimum;
									maximum = $temp$maximum;
									x = $temp$x;
									continue toGridLengthHelper;
								default:
									var m = x.a;
									var len = x.b;
									var $temp$minimum = minimum,
										$temp$maximum = $elm$core$Maybe$Just(m),
										$temp$x = len;
									minimum = $temp$minimum;
									maximum = $temp$maximum;
									x = $temp$x;
									continue toGridLengthHelper;
							}
						}
					});
				var toGridLength = function (x) {
					return A3(toGridLengthHelper, $elm$core$Maybe$Nothing, $elm$core$Maybe$Nothing, x);
				};
				var xSpacing = toGridLength(template.vY.a);
				var ySpacing = toGridLength(template.vY.b);
				var rows = function (x) {
					return 'grid-template-rows: ' + (x + ';');
				}(
					A2(
						$elm$core$String$join,
						' ',
						A2($elm$core$List$map, toGridLength, template.vE)));
				var msRows = function (x) {
					return '-ms-grid-rows: ' + (x + ';');
				}(
					A2(
						$elm$core$String$join,
						ySpacing,
						A2($elm$core$List$map, toGridLength, template.mW)));
				var msColumns = function (x) {
					return '-ms-grid-columns: ' + (x + ';');
				}(
					A2(
						$elm$core$String$join,
						ySpacing,
						A2($elm$core$List$map, toGridLength, template.mW)));
				var gapY = 'grid-row-gap:' + (toGridLength(template.vY.b) + ';');
				var gapX = 'grid-column-gap:' + (toGridLength(template.vY.a) + ';');
				var columns = function (x) {
					return 'grid-template-columns: ' + (x + ';');
				}(
					A2(
						$elm$core$String$join,
						' ',
						A2($elm$core$List$map, toGridLength, template.mW)));
				var _class = '.grid-rows-' + (A2(
					$elm$core$String$join,
					'-',
					A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$lengthClassName, template.vE)) + ('-cols-' + (A2(
					$elm$core$String$join,
					'-',
					A2($elm$core$List$map, $mdgriffith$elm_ui$Internal$Model$lengthClassName, template.mW)) + ('-space-x-' + ($mdgriffith$elm_ui$Internal$Model$lengthClassName(template.vY.a) + ('-space-y-' + $mdgriffith$elm_ui$Internal$Model$lengthClassName(template.vY.b)))))));
				var modernGrid = _class + ('{' + (columns + (rows + (gapX + (gapY + '}')))));
				var supports = '@supports (display:grid) {' + (modernGrid + '}');
				var base = _class + ('{' + (msColumns + (msRows + '}')));
				return _List_fromArray(
					[base, supports]);
			case 9:
				var position = rule.a;
				var msPosition = A2(
					$elm$core$String$join,
					' ',
					_List_fromArray(
						[
							'-ms-grid-row: ' + ($elm$core$String$fromInt(position.rj) + ';'),
							'-ms-grid-row-span: ' + ($elm$core$String$fromInt(position.iR) + ';'),
							'-ms-grid-column: ' + ($elm$core$String$fromInt(position.o0) + ';'),
							'-ms-grid-column-span: ' + ($elm$core$String$fromInt(position.dn) + ';')
						]));
				var modernPosition = A2(
					$elm$core$String$join,
					' ',
					_List_fromArray(
						[
							'grid-row: ' + ($elm$core$String$fromInt(position.rj) + (' / ' + ($elm$core$String$fromInt(position.rj + position.iR) + ';'))),
							'grid-column: ' + ($elm$core$String$fromInt(position.o0) + (' / ' + ($elm$core$String$fromInt(position.o0 + position.dn) + ';')))
						]));
				var _class = '.grid-pos-' + ($elm$core$String$fromInt(position.rj) + ('-' + ($elm$core$String$fromInt(position.o0) + ('-' + ($elm$core$String$fromInt(position.dn) + ('-' + $elm$core$String$fromInt(position.iR)))))));
				var modernGrid = _class + ('{' + (modernPosition + '}'));
				var supports = '@supports (display:grid) {' + (modernGrid + '}');
				var base = _class + ('{' + (msPosition + '}'));
				return _List_fromArray(
					[base, supports]);
			case 11:
				var _class = rule.a;
				var styles = rule.b;
				var renderPseudoRule = function (style) {
					return A3(
						$mdgriffith$elm_ui$Internal$Model$renderStyleRule,
						options,
						style,
						$elm$core$Maybe$Just(_class));
				};
				return A2($elm$core$List$concatMap, renderPseudoRule, styles);
			default:
				var transform = rule.a;
				var val = $mdgriffith$elm_ui$Internal$Model$transformValue(transform);
				var _class = $mdgriffith$elm_ui$Internal$Model$transformClass(transform);
				var _v12 = _Utils_Tuple2(_class, val);
				if ((!_v12.a.$) && (!_v12.b.$)) {
					var cls = _v12.a.a;
					var v = _v12.b.a;
					return A4(
						$mdgriffith$elm_ui$Internal$Model$renderStyle,
						options,
						maybePseudo,
						'.' + cls,
						_List_fromArray(
							[
								A2($mdgriffith$elm_ui$Internal$Model$Property, 'transform', v)
							]));
				} else {
					return _List_Nil;
				}
		}
	});
var $mdgriffith$elm_ui$Internal$Model$encodeStyles = F2(
	function (options, stylesheet) {
		return $elm$json$Json$Encode$object(
			A2(
				$elm$core$List$map,
				function (style) {
					var styled = A3($mdgriffith$elm_ui$Internal$Model$renderStyleRule, options, style, $elm$core$Maybe$Nothing);
					return _Utils_Tuple2(
						$mdgriffith$elm_ui$Internal$Model$getStyleName(style),
						A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, styled));
				},
				stylesheet));
	});
var $mdgriffith$elm_ui$Internal$Model$bracket = F2(
	function (selector, rules) {
		var renderPair = function (_v0) {
			var name = _v0.a;
			var val = _v0.b;
			return name + (': ' + (val + ';'));
		};
		return selector + (' {' + (A2(
			$elm$core$String$join,
			'',
			A2($elm$core$List$map, renderPair, rules)) + '}'));
	});
var $mdgriffith$elm_ui$Internal$Model$fontRule = F3(
	function (name, modifier, _v0) {
		var parentAdj = _v0.a;
		var textAdjustment = _v0.b;
		return _List_fromArray(
			[
				A2($mdgriffith$elm_ui$Internal$Model$bracket, '.' + (name + ('.' + (modifier + (', ' + ('.' + (name + (' .' + modifier))))))), parentAdj),
				A2($mdgriffith$elm_ui$Internal$Model$bracket, '.' + (name + ('.' + (modifier + ('> .' + ($mdgriffith$elm_ui$Internal$Style$classes.dD + (', .' + (name + (' .' + (modifier + (' > .' + $mdgriffith$elm_ui$Internal$Style$classes.dD)))))))))), textAdjustment)
			]);
	});
var $mdgriffith$elm_ui$Internal$Model$renderFontAdjustmentRule = F3(
	function (fontToAdjust, _v0, otherFontName) {
		var full = _v0.a;
		var capital = _v0.b;
		var name = _Utils_eq(fontToAdjust, otherFontName) ? fontToAdjust : (otherFontName + (' .' + fontToAdjust));
		return A2(
			$elm$core$String$join,
			' ',
			_Utils_ap(
				A3($mdgriffith$elm_ui$Internal$Model$fontRule, name, $mdgriffith$elm_ui$Internal$Style$classes.vW, capital),
				A3($mdgriffith$elm_ui$Internal$Model$fontRule, name, $mdgriffith$elm_ui$Internal$Style$classes.tX, full)));
	});
var $mdgriffith$elm_ui$Internal$Model$renderNullAdjustmentRule = F2(
	function (fontToAdjust, otherFontName) {
		var name = _Utils_eq(fontToAdjust, otherFontName) ? fontToAdjust : (otherFontName + (' .' + fontToAdjust));
		return A2(
			$elm$core$String$join,
			' ',
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Internal$Model$bracket,
					'.' + (name + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.vW + (', ' + ('.' + (name + (' .' + $mdgriffith$elm_ui$Internal$Style$classes.vW))))))),
					_List_fromArray(
						[
							_Utils_Tuple2('line-height', '1')
						])),
					A2(
					$mdgriffith$elm_ui$Internal$Model$bracket,
					'.' + (name + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.vW + ('> .' + ($mdgriffith$elm_ui$Internal$Style$classes.dD + (', .' + (name + (' .' + ($mdgriffith$elm_ui$Internal$Style$classes.vW + (' > .' + $mdgriffith$elm_ui$Internal$Style$classes.dD)))))))))),
					_List_fromArray(
						[
							_Utils_Tuple2('vertical-align', '0'),
							_Utils_Tuple2('line-height', '1')
						]))
				]));
	});
var $mdgriffith$elm_ui$Internal$Model$adjust = F3(
	function (size, height, vertical) {
		return {iR: height / size, vV: size, sd: vertical};
	});
var $elm$core$List$maximum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$max, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$List$minimum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$min, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $mdgriffith$elm_ui$Internal$Model$convertAdjustment = function (adjustment) {
	var lines = _List_fromArray(
		[adjustment.s1, adjustment.sQ, adjustment.ty, adjustment.uH]);
	var lineHeight = 1.5;
	var normalDescender = (lineHeight - 1) / 2;
	var oldMiddle = lineHeight / 2;
	var descender = A2(
		$elm$core$Maybe$withDefault,
		adjustment.ty,
		$elm$core$List$minimum(lines));
	var newBaseline = A2(
		$elm$core$Maybe$withDefault,
		adjustment.sQ,
		$elm$core$List$minimum(
			A2(
				$elm$core$List$filter,
				function (x) {
					return !_Utils_eq(x, descender);
				},
				lines)));
	var base = lineHeight;
	var ascender = A2(
		$elm$core$Maybe$withDefault,
		adjustment.s1,
		$elm$core$List$maximum(lines));
	var capitalSize = 1 / (ascender - newBaseline);
	var capitalVertical = 1 - ascender;
	var fullSize = 1 / (ascender - descender);
	var fullVertical = 1 - ascender;
	var newCapitalMiddle = ((ascender - newBaseline) / 2) + newBaseline;
	var newFullMiddle = ((ascender - descender) / 2) + descender;
	return {
		s1: A3($mdgriffith$elm_ui$Internal$Model$adjust, capitalSize, ascender - newBaseline, capitalVertical),
		px: A3($mdgriffith$elm_ui$Internal$Model$adjust, fullSize, ascender - descender, fullVertical)
	};
};
var $mdgriffith$elm_ui$Internal$Model$fontAdjustmentRules = function (converted) {
	return _Utils_Tuple2(
		_List_fromArray(
			[
				_Utils_Tuple2('display', 'block')
			]),
		_List_fromArray(
			[
				_Utils_Tuple2('display', 'inline-block'),
				_Utils_Tuple2(
				'line-height',
				$elm$core$String$fromFloat(converted.iR)),
				_Utils_Tuple2(
				'vertical-align',
				$elm$core$String$fromFloat(converted.sd) + 'em'),
				_Utils_Tuple2(
				'font-size',
				$elm$core$String$fromFloat(converted.vV) + 'em')
			]));
};
var $mdgriffith$elm_ui$Internal$Model$typefaceAdjustment = function (typefaces) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (face, found) {
				if (found.$ === 1) {
					if (face.$ === 5) {
						var _with = face.a;
						var _v2 = _with.sv;
						if (_v2.$ === 1) {
							return found;
						} else {
							var adjustment = _v2.a;
							return $elm$core$Maybe$Just(
								_Utils_Tuple2(
									$mdgriffith$elm_ui$Internal$Model$fontAdjustmentRules(
										function ($) {
											return $.px;
										}(
											$mdgriffith$elm_ui$Internal$Model$convertAdjustment(adjustment))),
									$mdgriffith$elm_ui$Internal$Model$fontAdjustmentRules(
										function ($) {
											return $.s1;
										}(
											$mdgriffith$elm_ui$Internal$Model$convertAdjustment(adjustment)))));
						}
					} else {
						return found;
					}
				} else {
					return found;
				}
			}),
		$elm$core$Maybe$Nothing,
		typefaces);
};
var $mdgriffith$elm_ui$Internal$Model$renderTopLevelValues = function (rules) {
	var withImport = function (font) {
		if (font.$ === 4) {
			var url = font.b;
			return $elm$core$Maybe$Just('@import url(\'' + (url + '\');'));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	};
	var fontImports = function (_v2) {
		var name = _v2.a;
		var typefaces = _v2.b;
		var imports = A2(
			$elm$core$String$join,
			'\n',
			A2($elm$core$List$filterMap, withImport, typefaces));
		return imports;
	};
	var allNames = A2($elm$core$List$map, $elm$core$Tuple$first, rules);
	var fontAdjustments = function (_v1) {
		var name = _v1.a;
		var typefaces = _v1.b;
		var _v0 = $mdgriffith$elm_ui$Internal$Model$typefaceAdjustment(typefaces);
		if (_v0.$ === 1) {
			return A2(
				$elm$core$String$join,
				'',
				A2(
					$elm$core$List$map,
					$mdgriffith$elm_ui$Internal$Model$renderNullAdjustmentRule(name),
					allNames));
		} else {
			var adjustment = _v0.a;
			return A2(
				$elm$core$String$join,
				'',
				A2(
					$elm$core$List$map,
					A2($mdgriffith$elm_ui$Internal$Model$renderFontAdjustmentRule, name, adjustment),
					allNames));
		}
	};
	return _Utils_ap(
		A2(
			$elm$core$String$join,
			'\n',
			A2($elm$core$List$map, fontImports, rules)),
		A2(
			$elm$core$String$join,
			'\n',
			A2($elm$core$List$map, fontAdjustments, rules)));
};
var $mdgriffith$elm_ui$Internal$Model$topLevelValue = function (rule) {
	if (rule.$ === 1) {
		var name = rule.a;
		var typefaces = rule.b;
		return $elm$core$Maybe$Just(
			_Utils_Tuple2(name, typefaces));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $mdgriffith$elm_ui$Internal$Model$toStyleSheetString = F2(
	function (options, stylesheet) {
		var combine = F2(
			function (style, rendered) {
				return {
					nl: _Utils_ap(
						rendered.nl,
						A3($mdgriffith$elm_ui$Internal$Model$renderStyleRule, options, style, $elm$core$Maybe$Nothing)),
					l0: function () {
						var _v1 = $mdgriffith$elm_ui$Internal$Model$topLevelValue(style);
						if (_v1.$ === 1) {
							return rendered.l0;
						} else {
							var topLevel = _v1.a;
							return A2($elm$core$List$cons, topLevel, rendered.l0);
						}
					}()
				};
			});
		var _v0 = A3(
			$elm$core$List$foldl,
			combine,
			{nl: _List_Nil, l0: _List_Nil},
			stylesheet);
		var topLevel = _v0.l0;
		var rules = _v0.nl;
		return _Utils_ap(
			$mdgriffith$elm_ui$Internal$Model$renderTopLevelValues(topLevel),
			$elm$core$String$concat(rules));
	});
var $mdgriffith$elm_ui$Internal$Model$toStyleSheet = F2(
	function (options, styleSheet) {
		var _v0 = options.uP;
		switch (_v0) {
			case 0:
				return A3(
					$elm$virtual_dom$VirtualDom$node,
					'div',
					_List_Nil,
					_List_fromArray(
						[
							A3(
							$elm$virtual_dom$VirtualDom$node,
							'style',
							_List_Nil,
							_List_fromArray(
								[
									$elm$virtual_dom$VirtualDom$text(
									A2($mdgriffith$elm_ui$Internal$Model$toStyleSheetString, options, styleSheet))
								]))
						]));
			case 1:
				return A3(
					$elm$virtual_dom$VirtualDom$node,
					'div',
					_List_Nil,
					_List_fromArray(
						[
							A3(
							$elm$virtual_dom$VirtualDom$node,
							'style',
							_List_Nil,
							_List_fromArray(
								[
									$elm$virtual_dom$VirtualDom$text(
									A2($mdgriffith$elm_ui$Internal$Model$toStyleSheetString, options, styleSheet))
								]))
						]));
			default:
				return A3(
					$elm$virtual_dom$VirtualDom$node,
					'elm-ui-rules',
					_List_fromArray(
						[
							A2(
							$elm$virtual_dom$VirtualDom$property,
							'rules',
							A2($mdgriffith$elm_ui$Internal$Model$encodeStyles, options, styleSheet))
						]),
					_List_Nil);
		}
	});
var $mdgriffith$elm_ui$Internal$Model$embedKeyed = F4(
	function (_static, opts, styles, children) {
		var dynamicStyleSheet = A2(
			$mdgriffith$elm_ui$Internal$Model$toStyleSheet,
			opts,
			A3(
				$elm$core$List$foldl,
				$mdgriffith$elm_ui$Internal$Model$reduceStyles,
				_Utils_Tuple2(
					$elm$core$Set$empty,
					$mdgriffith$elm_ui$Internal$Model$renderFocusStyle(opts.tS)),
				styles).b);
		return _static ? A2(
			$elm$core$List$cons,
			_Utils_Tuple2(
				'static-stylesheet',
				$mdgriffith$elm_ui$Internal$Model$staticRoot(opts)),
			A2(
				$elm$core$List$cons,
				_Utils_Tuple2('dynamic-stylesheet', dynamicStyleSheet),
				children)) : A2(
			$elm$core$List$cons,
			_Utils_Tuple2('dynamic-stylesheet', dynamicStyleSheet),
			children);
	});
var $mdgriffith$elm_ui$Internal$Model$embedWith = F4(
	function (_static, opts, styles, children) {
		var dynamicStyleSheet = A2(
			$mdgriffith$elm_ui$Internal$Model$toStyleSheet,
			opts,
			A3(
				$elm$core$List$foldl,
				$mdgriffith$elm_ui$Internal$Model$reduceStyles,
				_Utils_Tuple2(
					$elm$core$Set$empty,
					$mdgriffith$elm_ui$Internal$Model$renderFocusStyle(opts.tS)),
				styles).b);
		return _static ? A2(
			$elm$core$List$cons,
			$mdgriffith$elm_ui$Internal$Model$staticRoot(opts),
			A2($elm$core$List$cons, dynamicStyleSheet, children)) : A2($elm$core$List$cons, dynamicStyleSheet, children);
	});
var $mdgriffith$elm_ui$Internal$Flag$heightBetween = $mdgriffith$elm_ui$Internal$Flag$flag(45);
var $mdgriffith$elm_ui$Internal$Flag$heightFill = $mdgriffith$elm_ui$Internal$Flag$flag(37);
var $elm$virtual_dom$VirtualDom$keyedNode = function (tag) {
	return _VirtualDom_keyedNode(
		_VirtualDom_noScript(tag));
};
var $mdgriffith$elm_ui$Internal$Flag$present = F2(
	function (myFlag, _v0) {
		var fieldOne = _v0.a;
		var fieldTwo = _v0.b;
		if (!myFlag.$) {
			var first = myFlag.a;
			return _Utils_eq(first & fieldOne, first);
		} else {
			var second = myFlag.a;
			return _Utils_eq(second & fieldTwo, second);
		}
	});
var $elm$html$Html$s = _VirtualDom_node('s');
var $elm$html$Html$u = _VirtualDom_node('u');
var $mdgriffith$elm_ui$Internal$Flag$widthBetween = $mdgriffith$elm_ui$Internal$Flag$flag(44);
var $mdgriffith$elm_ui$Internal$Flag$widthFill = $mdgriffith$elm_ui$Internal$Flag$flag(39);
var $mdgriffith$elm_ui$Internal$Model$finalizeNode = F6(
	function (has, node, attributes, children, embedMode, parentContext) {
		var createNode = F2(
			function (nodeName, attrs) {
				if (children.$ === 1) {
					var keyed = children.a;
					return A3(
						$elm$virtual_dom$VirtualDom$keyedNode,
						nodeName,
						attrs,
						function () {
							switch (embedMode.$) {
								case 0:
									return keyed;
								case 2:
									var opts = embedMode.a;
									var styles = embedMode.b;
									return A4($mdgriffith$elm_ui$Internal$Model$embedKeyed, false, opts, styles, keyed);
								default:
									var opts = embedMode.a;
									var styles = embedMode.b;
									return A4($mdgriffith$elm_ui$Internal$Model$embedKeyed, true, opts, styles, keyed);
							}
						}());
				} else {
					var unkeyed = children.a;
					return A2(
						function () {
							switch (nodeName) {
								case 'div':
									return $elm$html$Html$div;
								case 'p':
									return $elm$html$Html$p;
								default:
									return $elm$virtual_dom$VirtualDom$node(nodeName);
							}
						}(),
						attrs,
						function () {
							switch (embedMode.$) {
								case 0:
									return unkeyed;
								case 2:
									var opts = embedMode.a;
									var styles = embedMode.b;
									return A4($mdgriffith$elm_ui$Internal$Model$embedWith, false, opts, styles, unkeyed);
								default:
									var opts = embedMode.a;
									var styles = embedMode.b;
									return A4($mdgriffith$elm_ui$Internal$Model$embedWith, true, opts, styles, unkeyed);
							}
						}());
				}
			});
		var html = function () {
			switch (node.$) {
				case 0:
					return A2(createNode, 'div', attributes);
				case 1:
					var nodeName = node.a;
					return A2(createNode, nodeName, attributes);
				default:
					var nodeName = node.a;
					var internal = node.b;
					return A3(
						$elm$virtual_dom$VirtualDom$node,
						nodeName,
						attributes,
						_List_fromArray(
							[
								A2(
								createNode,
								internal,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class($mdgriffith$elm_ui$Internal$Style$classes.sH + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.vU))
									]))
							]));
			}
		}();
		switch (parentContext) {
			case 0:
				return (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$widthFill, has) && (!A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$widthBetween, has))) ? html : (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$alignRight, has) ? A2(
					$elm$html$Html$u,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(
							A2(
								$elm$core$String$join,
								' ',
								_List_fromArray(
									[$mdgriffith$elm_ui$Internal$Style$classes.sH, $mdgriffith$elm_ui$Internal$Style$classes.vU, $mdgriffith$elm_ui$Internal$Style$classes.mX, $mdgriffith$elm_ui$Internal$Style$classes.dI, $mdgriffith$elm_ui$Internal$Style$classes.sD])))
						]),
					_List_fromArray(
						[html])) : (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$centerX, has) ? A2(
					$elm$html$Html$s,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(
							A2(
								$elm$core$String$join,
								' ',
								_List_fromArray(
									[$mdgriffith$elm_ui$Internal$Style$classes.sH, $mdgriffith$elm_ui$Internal$Style$classes.vU, $mdgriffith$elm_ui$Internal$Style$classes.mX, $mdgriffith$elm_ui$Internal$Style$classes.dI, $mdgriffith$elm_ui$Internal$Style$classes.sB])))
						]),
					_List_fromArray(
						[html])) : html));
			case 1:
				return (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$heightFill, has) && (!A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$heightBetween, has))) ? html : (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$centerY, has) ? A2(
					$elm$html$Html$s,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(
							A2(
								$elm$core$String$join,
								' ',
								_List_fromArray(
									[$mdgriffith$elm_ui$Internal$Style$classes.sH, $mdgriffith$elm_ui$Internal$Style$classes.vU, $mdgriffith$elm_ui$Internal$Style$classes.mX, $mdgriffith$elm_ui$Internal$Style$classes.sC])))
						]),
					_List_fromArray(
						[html])) : (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$alignBottom, has) ? A2(
					$elm$html$Html$u,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(
							A2(
								$elm$core$String$join,
								' ',
								_List_fromArray(
									[$mdgriffith$elm_ui$Internal$Style$classes.sH, $mdgriffith$elm_ui$Internal$Style$classes.vU, $mdgriffith$elm_ui$Internal$Style$classes.mX, $mdgriffith$elm_ui$Internal$Style$classes.sA])))
						]),
					_List_fromArray(
						[html])) : html));
			default:
				return html;
		}
	});
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $mdgriffith$elm_ui$Internal$Model$textElementClasses = $mdgriffith$elm_ui$Internal$Style$classes.sH + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.dD + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.oi + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.nS)))));
var $mdgriffith$elm_ui$Internal$Model$textElement = function (str) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class($mdgriffith$elm_ui$Internal$Model$textElementClasses)
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(str)
			]));
};
var $mdgriffith$elm_ui$Internal$Model$textElementFillClasses = $mdgriffith$elm_ui$Internal$Style$classes.sH + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.dD + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.oj + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.nT)))));
var $mdgriffith$elm_ui$Internal$Model$textElementFill = function (str) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class($mdgriffith$elm_ui$Internal$Model$textElementFillClasses)
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(str)
			]));
};
var $mdgriffith$elm_ui$Internal$Model$createElement = F3(
	function (context, children, rendered) {
		var gatherKeyed = F2(
			function (_v8, _v9) {
				var key = _v8.a;
				var child = _v8.b;
				var htmls = _v9.a;
				var existingStyles = _v9.b;
				switch (child.$) {
					case 0:
						var html = child.a;
						return _Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asParagraph) ? _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									key,
									html(context)),
								htmls),
							existingStyles) : _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									key,
									html(context)),
								htmls),
							existingStyles);
					case 1:
						var styled = child.a;
						return _Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asParagraph) ? _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									key,
									A2(styled.ue, $mdgriffith$elm_ui$Internal$Model$NoStyleSheet, context)),
								htmls),
							$elm$core$List$isEmpty(existingStyles) ? styled.rP : _Utils_ap(styled.rP, existingStyles)) : _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									key,
									A2(styled.ue, $mdgriffith$elm_ui$Internal$Model$NoStyleSheet, context)),
								htmls),
							$elm$core$List$isEmpty(existingStyles) ? styled.rP : _Utils_ap(styled.rP, existingStyles));
					case 2:
						var str = child.a;
						return _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									key,
									_Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asEl) ? $mdgriffith$elm_ui$Internal$Model$textElementFill(str) : $mdgriffith$elm_ui$Internal$Model$textElement(str)),
								htmls),
							existingStyles);
					default:
						return _Utils_Tuple2(htmls, existingStyles);
				}
			});
		var gather = F2(
			function (child, _v6) {
				var htmls = _v6.a;
				var existingStyles = _v6.b;
				switch (child.$) {
					case 0:
						var html = child.a;
						return _Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asParagraph) ? _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								html(context),
								htmls),
							existingStyles) : _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								html(context),
								htmls),
							existingStyles);
					case 1:
						var styled = child.a;
						return _Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asParagraph) ? _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								A2(styled.ue, $mdgriffith$elm_ui$Internal$Model$NoStyleSheet, context),
								htmls),
							$elm$core$List$isEmpty(existingStyles) ? styled.rP : _Utils_ap(styled.rP, existingStyles)) : _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								A2(styled.ue, $mdgriffith$elm_ui$Internal$Model$NoStyleSheet, context),
								htmls),
							$elm$core$List$isEmpty(existingStyles) ? styled.rP : _Utils_ap(styled.rP, existingStyles));
					case 2:
						var str = child.a;
						return _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								_Utils_eq(context, $mdgriffith$elm_ui$Internal$Model$asEl) ? $mdgriffith$elm_ui$Internal$Model$textElementFill(str) : $mdgriffith$elm_ui$Internal$Model$textElement(str),
								htmls),
							existingStyles);
					default:
						return _Utils_Tuple2(htmls, existingStyles);
				}
			});
		if (children.$ === 1) {
			var keyedChildren = children.a;
			var _v1 = A3(
				$elm$core$List$foldr,
				gatherKeyed,
				_Utils_Tuple2(_List_Nil, _List_Nil),
				keyedChildren);
			var keyed = _v1.a;
			var styles = _v1.b;
			var newStyles = $elm$core$List$isEmpty(styles) ? rendered.rP : _Utils_ap(rendered.rP, styles);
			if (!newStyles.b) {
				return $mdgriffith$elm_ui$Internal$Model$Unstyled(
					A5(
						$mdgriffith$elm_ui$Internal$Model$finalizeNode,
						rendered.d7,
						rendered.qy,
						rendered.dV,
						$mdgriffith$elm_ui$Internal$Model$Keyed(
							A3($mdgriffith$elm_ui$Internal$Model$addKeyedChildren, 'nearby-element-pls', keyed, rendered.s6)),
						$mdgriffith$elm_ui$Internal$Model$NoStyleSheet));
			} else {
				var allStyles = newStyles;
				return $mdgriffith$elm_ui$Internal$Model$Styled(
					{
						ue: A4(
							$mdgriffith$elm_ui$Internal$Model$finalizeNode,
							rendered.d7,
							rendered.qy,
							rendered.dV,
							$mdgriffith$elm_ui$Internal$Model$Keyed(
								A3($mdgriffith$elm_ui$Internal$Model$addKeyedChildren, 'nearby-element-pls', keyed, rendered.s6))),
						rP: allStyles
					});
			}
		} else {
			var unkeyedChildren = children.a;
			var _v3 = A3(
				$elm$core$List$foldr,
				gather,
				_Utils_Tuple2(_List_Nil, _List_Nil),
				unkeyedChildren);
			var unkeyed = _v3.a;
			var styles = _v3.b;
			var newStyles = $elm$core$List$isEmpty(styles) ? rendered.rP : _Utils_ap(rendered.rP, styles);
			if (!newStyles.b) {
				return $mdgriffith$elm_ui$Internal$Model$Unstyled(
					A5(
						$mdgriffith$elm_ui$Internal$Model$finalizeNode,
						rendered.d7,
						rendered.qy,
						rendered.dV,
						$mdgriffith$elm_ui$Internal$Model$Unkeyed(
							A2($mdgriffith$elm_ui$Internal$Model$addChildren, unkeyed, rendered.s6)),
						$mdgriffith$elm_ui$Internal$Model$NoStyleSheet));
			} else {
				var allStyles = newStyles;
				return $mdgriffith$elm_ui$Internal$Model$Styled(
					{
						ue: A4(
							$mdgriffith$elm_ui$Internal$Model$finalizeNode,
							rendered.d7,
							rendered.qy,
							rendered.dV,
							$mdgriffith$elm_ui$Internal$Model$Unkeyed(
								A2($mdgriffith$elm_ui$Internal$Model$addChildren, unkeyed, rendered.s6))),
						rP: allStyles
					});
			}
		}
	});
var $mdgriffith$elm_ui$Internal$Model$Single = F3(
	function (a, b, c) {
		return {$: 3, a: a, b: b, c: c};
	});
var $mdgriffith$elm_ui$Internal$Model$Transform = function (a) {
	return {$: 10, a: a};
};
var $mdgriffith$elm_ui$Internal$Flag$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Flag$add = F2(
	function (myFlag, _v0) {
		var one = _v0.a;
		var two = _v0.b;
		if (!myFlag.$) {
			var first = myFlag.a;
			return A2($mdgriffith$elm_ui$Internal$Flag$Field, first | one, two);
		} else {
			var second = myFlag.a;
			return A2($mdgriffith$elm_ui$Internal$Flag$Field, one, second | two);
		}
	});
var $mdgriffith$elm_ui$Internal$Model$ChildrenBehind = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$ChildrenBehindAndInFront = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$ChildrenInFront = function (a) {
	return {$: 2, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$nearbyElement = F2(
	function (location, elem) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					function () {
						switch (location) {
							case 0:
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.fT, $mdgriffith$elm_ui$Internal$Style$classes.vU, $mdgriffith$elm_ui$Internal$Style$classes.ss]));
							case 1:
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.fT, $mdgriffith$elm_ui$Internal$Style$classes.vU, $mdgriffith$elm_ui$Internal$Style$classes.sS]));
							case 2:
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.fT, $mdgriffith$elm_ui$Internal$Style$classes.vU, $mdgriffith$elm_ui$Internal$Style$classes.u2]));
							case 3:
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.fT, $mdgriffith$elm_ui$Internal$Style$classes.vU, $mdgriffith$elm_ui$Internal$Style$classes.u1]));
							case 4:
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.fT, $mdgriffith$elm_ui$Internal$Style$classes.vU, $mdgriffith$elm_ui$Internal$Style$classes.uk]));
							default:
								return A2(
									$elm$core$String$join,
									' ',
									_List_fromArray(
										[$mdgriffith$elm_ui$Internal$Style$classes.fT, $mdgriffith$elm_ui$Internal$Style$classes.vU, $mdgriffith$elm_ui$Internal$Style$classes.sR]));
						}
					}())
				]),
			_List_fromArray(
				[
					function () {
					switch (elem.$) {
						case 3:
							return $elm$virtual_dom$VirtualDom$text('');
						case 2:
							var str = elem.a;
							return $mdgriffith$elm_ui$Internal$Model$textElement(str);
						case 0:
							var html = elem.a;
							return html($mdgriffith$elm_ui$Internal$Model$asEl);
						default:
							var styled = elem.a;
							return A2(styled.ue, $mdgriffith$elm_ui$Internal$Model$NoStyleSheet, $mdgriffith$elm_ui$Internal$Model$asEl);
					}
				}()
				]));
	});
var $mdgriffith$elm_ui$Internal$Model$addNearbyElement = F3(
	function (location, elem, existing) {
		var nearby = A2($mdgriffith$elm_ui$Internal$Model$nearbyElement, location, elem);
		switch (existing.$) {
			case 0:
				if (location === 5) {
					return $mdgriffith$elm_ui$Internal$Model$ChildrenBehind(
						_List_fromArray(
							[nearby]));
				} else {
					return $mdgriffith$elm_ui$Internal$Model$ChildrenInFront(
						_List_fromArray(
							[nearby]));
				}
			case 1:
				var existingBehind = existing.a;
				if (location === 5) {
					return $mdgriffith$elm_ui$Internal$Model$ChildrenBehind(
						A2($elm$core$List$cons, nearby, existingBehind));
				} else {
					return A2(
						$mdgriffith$elm_ui$Internal$Model$ChildrenBehindAndInFront,
						existingBehind,
						_List_fromArray(
							[nearby]));
				}
			case 2:
				var existingInFront = existing.a;
				if (location === 5) {
					return A2(
						$mdgriffith$elm_ui$Internal$Model$ChildrenBehindAndInFront,
						_List_fromArray(
							[nearby]),
						existingInFront);
				} else {
					return $mdgriffith$elm_ui$Internal$Model$ChildrenInFront(
						A2($elm$core$List$cons, nearby, existingInFront));
				}
			default:
				var existingBehind = existing.a;
				var existingInFront = existing.b;
				if (location === 5) {
					return A2(
						$mdgriffith$elm_ui$Internal$Model$ChildrenBehindAndInFront,
						A2($elm$core$List$cons, nearby, existingBehind),
						existingInFront);
				} else {
					return A2(
						$mdgriffith$elm_ui$Internal$Model$ChildrenBehindAndInFront,
						existingBehind,
						A2($elm$core$List$cons, nearby, existingInFront));
				}
		}
	});
var $mdgriffith$elm_ui$Internal$Model$Embedded = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$NodeName = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$addNodeName = F2(
	function (newNode, old) {
		switch (old.$) {
			case 0:
				return $mdgriffith$elm_ui$Internal$Model$NodeName(newNode);
			case 1:
				var name = old.a;
				return A2($mdgriffith$elm_ui$Internal$Model$Embedded, name, newNode);
			default:
				var x = old.a;
				var y = old.b;
				return A2($mdgriffith$elm_ui$Internal$Model$Embedded, x, y);
		}
	});
var $mdgriffith$elm_ui$Internal$Model$alignXName = function (align) {
	switch (align) {
		case 0:
			return $mdgriffith$elm_ui$Internal$Style$classes.nC + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.oz);
		case 2:
			return $mdgriffith$elm_ui$Internal$Style$classes.nC + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.oA);
		default:
			return $mdgriffith$elm_ui$Internal$Style$classes.nC + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.sy);
	}
};
var $mdgriffith$elm_ui$Internal$Model$alignYName = function (align) {
	switch (align) {
		case 0:
			return $mdgriffith$elm_ui$Internal$Style$classes.nD + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.sE);
		case 2:
			return $mdgriffith$elm_ui$Internal$Style$classes.nD + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.sx);
		default:
			return $mdgriffith$elm_ui$Internal$Style$classes.nD + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.sz);
	}
};
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $mdgriffith$elm_ui$Internal$Model$FullTransform = F4(
	function (a, b, c, d) {
		return {$: 2, a: a, b: b, c: c, d: d};
	});
var $mdgriffith$elm_ui$Internal$Model$Moved = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$composeTransformation = F2(
	function (transform, component) {
		switch (transform.$) {
			case 0:
				switch (component.$) {
					case 0:
						var x = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(x, 0, 0));
					case 1:
						var y = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(0, y, 0));
					case 2:
						var z = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(0, 0, z));
					case 3:
						var xyz = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(xyz);
					case 4:
						var xyz = component.a;
						var angle = component.b;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							_Utils_Tuple3(0, 0, 0),
							_Utils_Tuple3(1, 1, 1),
							xyz,
							angle);
					default:
						var xyz = component.a;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							_Utils_Tuple3(0, 0, 0),
							xyz,
							_Utils_Tuple3(0, 0, 1),
							0);
				}
			case 1:
				var moved = transform.a;
				var x = moved.a;
				var y = moved.b;
				var z = moved.c;
				switch (component.$) {
					case 0:
						var newX = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(newX, y, z));
					case 1:
						var newY = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(x, newY, z));
					case 2:
						var newZ = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(
							_Utils_Tuple3(x, y, newZ));
					case 3:
						var xyz = component.a;
						return $mdgriffith$elm_ui$Internal$Model$Moved(xyz);
					case 4:
						var xyz = component.a;
						var angle = component.b;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							moved,
							_Utils_Tuple3(1, 1, 1),
							xyz,
							angle);
					default:
						var scale = component.a;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							moved,
							scale,
							_Utils_Tuple3(0, 0, 1),
							0);
				}
			default:
				var moved = transform.a;
				var x = moved.a;
				var y = moved.b;
				var z = moved.c;
				var scaled = transform.b;
				var origin = transform.c;
				var angle = transform.d;
				switch (component.$) {
					case 0:
						var newX = component.a;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							_Utils_Tuple3(newX, y, z),
							scaled,
							origin,
							angle);
					case 1:
						var newY = component.a;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							_Utils_Tuple3(x, newY, z),
							scaled,
							origin,
							angle);
					case 2:
						var newZ = component.a;
						return A4(
							$mdgriffith$elm_ui$Internal$Model$FullTransform,
							_Utils_Tuple3(x, y, newZ),
							scaled,
							origin,
							angle);
					case 3:
						var newMove = component.a;
						return A4($mdgriffith$elm_ui$Internal$Model$FullTransform, newMove, scaled, origin, angle);
					case 4:
						var newOrigin = component.a;
						var newAngle = component.b;
						return A4($mdgriffith$elm_ui$Internal$Model$FullTransform, moved, scaled, newOrigin, newAngle);
					default:
						var newScale = component.a;
						return A4($mdgriffith$elm_ui$Internal$Model$FullTransform, moved, newScale, origin, angle);
				}
		}
	});
var $mdgriffith$elm_ui$Internal$Flag$height = $mdgriffith$elm_ui$Internal$Flag$flag(7);
var $mdgriffith$elm_ui$Internal$Flag$heightContent = $mdgriffith$elm_ui$Internal$Flag$flag(36);
var $mdgriffith$elm_ui$Internal$Flag$merge = F2(
	function (_v0, _v1) {
		var one = _v0.a;
		var two = _v0.b;
		var three = _v1.a;
		var four = _v1.b;
		return A2($mdgriffith$elm_ui$Internal$Flag$Field, one | three, two | four);
	});
var $mdgriffith$elm_ui$Internal$Flag$none = A2($mdgriffith$elm_ui$Internal$Flag$Field, 0, 0);
var $mdgriffith$elm_ui$Internal$Model$renderHeight = function (h) {
	switch (h.$) {
		case 0:
			var px = h.a;
			var val = $elm$core$String$fromInt(px);
			var name = 'height-px-' + val;
			return _Utils_Tuple3(
				$mdgriffith$elm_ui$Internal$Flag$none,
				$mdgriffith$elm_ui$Internal$Style$classes.pL + (' ' + name),
				_List_fromArray(
					[
						A3($mdgriffith$elm_ui$Internal$Model$Single, name, 'height', val + 'px')
					]));
		case 1:
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$heightContent, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.nS,
				_List_Nil);
		case 2:
			var portion = h.a;
			return (portion === 1) ? _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$heightFill, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.nT,
				_List_Nil) : _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$heightFill, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.pM + (' height-fill-' + $elm$core$String$fromInt(portion)),
				_List_fromArray(
					[
						A3(
						$mdgriffith$elm_ui$Internal$Model$Single,
						$mdgriffith$elm_ui$Internal$Style$classes.sH + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.dH + (' > ' + $mdgriffith$elm_ui$Internal$Style$dot(
							'height-fill-' + $elm$core$String$fromInt(portion))))),
						'flex-grow',
						$elm$core$String$fromInt(portion * 100000))
					]));
		case 3:
			var minSize = h.a;
			var len = h.b;
			var cls = 'min-height-' + $elm$core$String$fromInt(minSize);
			var style = A3(
				$mdgriffith$elm_ui$Internal$Model$Single,
				cls,
				'min-height',
				$elm$core$String$fromInt(minSize) + 'px !important');
			var _v1 = $mdgriffith$elm_ui$Internal$Model$renderHeight(len);
			var newFlag = _v1.a;
			var newAttrs = _v1.b;
			var newStyle = _v1.c;
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$heightBetween, newFlag),
				cls + (' ' + newAttrs),
				A2($elm$core$List$cons, style, newStyle));
		default:
			var maxSize = h.a;
			var len = h.b;
			var cls = 'max-height-' + $elm$core$String$fromInt(maxSize);
			var style = A3(
				$mdgriffith$elm_ui$Internal$Model$Single,
				cls,
				'max-height',
				$elm$core$String$fromInt(maxSize) + 'px');
			var _v2 = $mdgriffith$elm_ui$Internal$Model$renderHeight(len);
			var newFlag = _v2.a;
			var newAttrs = _v2.b;
			var newStyle = _v2.c;
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$heightBetween, newFlag),
				cls + (' ' + newAttrs),
				A2($elm$core$List$cons, style, newStyle));
	}
};
var $mdgriffith$elm_ui$Internal$Flag$widthContent = $mdgriffith$elm_ui$Internal$Flag$flag(38);
var $mdgriffith$elm_ui$Internal$Model$renderWidth = function (w) {
	switch (w.$) {
		case 0:
			var px = w.a;
			return _Utils_Tuple3(
				$mdgriffith$elm_ui$Internal$Flag$none,
				$mdgriffith$elm_ui$Internal$Style$classes.sm + (' width-px-' + $elm$core$String$fromInt(px)),
				_List_fromArray(
					[
						A3(
						$mdgriffith$elm_ui$Internal$Model$Single,
						'width-px-' + $elm$core$String$fromInt(px),
						'width',
						$elm$core$String$fromInt(px) + 'px')
					]));
		case 1:
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$widthContent, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.oi,
				_List_Nil);
		case 2:
			var portion = w.a;
			return (portion === 1) ? _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$widthFill, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.oj,
				_List_Nil) : _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$widthFill, $mdgriffith$elm_ui$Internal$Flag$none),
				$mdgriffith$elm_ui$Internal$Style$classes.sn + (' width-fill-' + $elm$core$String$fromInt(portion)),
				_List_fromArray(
					[
						A3(
						$mdgriffith$elm_ui$Internal$Model$Single,
						$mdgriffith$elm_ui$Internal$Style$classes.sH + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.rj + (' > ' + $mdgriffith$elm_ui$Internal$Style$dot(
							'width-fill-' + $elm$core$String$fromInt(portion))))),
						'flex-grow',
						$elm$core$String$fromInt(portion * 100000))
					]));
		case 3:
			var minSize = w.a;
			var len = w.b;
			var cls = 'min-width-' + $elm$core$String$fromInt(minSize);
			var style = A3(
				$mdgriffith$elm_ui$Internal$Model$Single,
				cls,
				'min-width',
				$elm$core$String$fromInt(minSize) + 'px');
			var _v1 = $mdgriffith$elm_ui$Internal$Model$renderWidth(len);
			var newFlag = _v1.a;
			var newAttrs = _v1.b;
			var newStyle = _v1.c;
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$widthBetween, newFlag),
				cls + (' ' + newAttrs),
				A2($elm$core$List$cons, style, newStyle));
		default:
			var maxSize = w.a;
			var len = w.b;
			var cls = 'max-width-' + $elm$core$String$fromInt(maxSize);
			var style = A3(
				$mdgriffith$elm_ui$Internal$Model$Single,
				cls,
				'max-width',
				$elm$core$String$fromInt(maxSize) + 'px');
			var _v2 = $mdgriffith$elm_ui$Internal$Model$renderWidth(len);
			var newFlag = _v2.a;
			var newAttrs = _v2.b;
			var newStyle = _v2.c;
			return _Utils_Tuple3(
				A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$widthBetween, newFlag),
				cls + (' ' + newAttrs),
				A2($elm$core$List$cons, style, newStyle));
	}
};
var $mdgriffith$elm_ui$Internal$Flag$borderWidth = $mdgriffith$elm_ui$Internal$Flag$flag(27);
var $mdgriffith$elm_ui$Internal$Model$skippable = F2(
	function (flag, style) {
		if (_Utils_eq(flag, $mdgriffith$elm_ui$Internal$Flag$borderWidth)) {
			if (style.$ === 3) {
				var val = style.c;
				switch (val) {
					case '0px':
						return true;
					case '1px':
						return true;
					case '2px':
						return true;
					case '3px':
						return true;
					case '4px':
						return true;
					case '5px':
						return true;
					case '6px':
						return true;
					default:
						return false;
				}
			} else {
				return false;
			}
		} else {
			switch (style.$) {
				case 2:
					var i = style.a;
					return (i >= 8) && (i <= 32);
				case 7:
					var name = style.a;
					var t = style.b;
					var r = style.c;
					var b = style.d;
					var l = style.e;
					return _Utils_eq(t, b) && (_Utils_eq(t, r) && (_Utils_eq(t, l) && ((t >= 0) && (t <= 24))));
				default:
					return false;
			}
		}
	});
var $mdgriffith$elm_ui$Internal$Flag$width = $mdgriffith$elm_ui$Internal$Flag$flag(6);
var $mdgriffith$elm_ui$Internal$Flag$xAlign = $mdgriffith$elm_ui$Internal$Flag$flag(30);
var $mdgriffith$elm_ui$Internal$Flag$yAlign = $mdgriffith$elm_ui$Internal$Flag$flag(29);
var $mdgriffith$elm_ui$Internal$Model$gatherAttrRecursive = F8(
	function (classes, node, has, transform, styles, attrs, children, elementAttrs) {
		gatherAttrRecursive:
		while (true) {
			if (!elementAttrs.b) {
				var _v1 = $mdgriffith$elm_ui$Internal$Model$transformClass(transform);
				if (_v1.$ === 1) {
					return {
						dV: A2(
							$elm$core$List$cons,
							$elm$html$Html$Attributes$class(classes),
							attrs),
						s6: children,
						d7: has,
						qy: node,
						rP: styles
					};
				} else {
					var _class = _v1.a;
					return {
						dV: A2(
							$elm$core$List$cons,
							$elm$html$Html$Attributes$class(classes + (' ' + _class)),
							attrs),
						s6: children,
						d7: has,
						qy: node,
						rP: A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Internal$Model$Transform(transform),
							styles)
					};
				}
			} else {
				var attribute = elementAttrs.a;
				var remaining = elementAttrs.b;
				switch (attribute.$) {
					case 0:
						var $temp$classes = classes,
							$temp$node = node,
							$temp$has = has,
							$temp$transform = transform,
							$temp$styles = styles,
							$temp$attrs = attrs,
							$temp$children = children,
							$temp$elementAttrs = remaining;
						classes = $temp$classes;
						node = $temp$node;
						has = $temp$has;
						transform = $temp$transform;
						styles = $temp$styles;
						attrs = $temp$attrs;
						children = $temp$children;
						elementAttrs = $temp$elementAttrs;
						continue gatherAttrRecursive;
					case 3:
						var flag = attribute.a;
						var exactClassName = attribute.b;
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, flag, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							var $temp$classes = exactClassName + (' ' + classes),
								$temp$node = node,
								$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, flag, has),
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						}
					case 1:
						var actualAttribute = attribute.a;
						var $temp$classes = classes,
							$temp$node = node,
							$temp$has = has,
							$temp$transform = transform,
							$temp$styles = styles,
							$temp$attrs = A2($elm$core$List$cons, actualAttribute, attrs),
							$temp$children = children,
							$temp$elementAttrs = remaining;
						classes = $temp$classes;
						node = $temp$node;
						has = $temp$has;
						transform = $temp$transform;
						styles = $temp$styles;
						attrs = $temp$attrs;
						children = $temp$children;
						elementAttrs = $temp$elementAttrs;
						continue gatherAttrRecursive;
					case 4:
						var flag = attribute.a;
						var style = attribute.b;
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, flag, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							if (A2($mdgriffith$elm_ui$Internal$Model$skippable, flag, style)) {
								var $temp$classes = $mdgriffith$elm_ui$Internal$Model$getStyleName(style) + (' ' + classes),
									$temp$node = node,
									$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, flag, has),
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							} else {
								var $temp$classes = $mdgriffith$elm_ui$Internal$Model$getStyleName(style) + (' ' + classes),
									$temp$node = node,
									$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, flag, has),
									$temp$transform = transform,
									$temp$styles = A2($elm$core$List$cons, style, styles),
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							}
						}
					case 10:
						var flag = attribute.a;
						var component = attribute.b;
						var $temp$classes = classes,
							$temp$node = node,
							$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, flag, has),
							$temp$transform = A2($mdgriffith$elm_ui$Internal$Model$composeTransformation, transform, component),
							$temp$styles = styles,
							$temp$attrs = attrs,
							$temp$children = children,
							$temp$elementAttrs = remaining;
						classes = $temp$classes;
						node = $temp$node;
						has = $temp$has;
						transform = $temp$transform;
						styles = $temp$styles;
						attrs = $temp$attrs;
						children = $temp$children;
						elementAttrs = $temp$elementAttrs;
						continue gatherAttrRecursive;
					case 7:
						var width = attribute.a;
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$width, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							switch (width.$) {
								case 0:
									var px = width.a;
									var $temp$classes = ($mdgriffith$elm_ui$Internal$Style$classes.sm + (' width-px-' + $elm$core$String$fromInt(px))) + (' ' + classes),
										$temp$node = node,
										$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$width, has),
										$temp$transform = transform,
										$temp$styles = A2(
										$elm$core$List$cons,
										A3(
											$mdgriffith$elm_ui$Internal$Model$Single,
											'width-px-' + $elm$core$String$fromInt(px),
											'width',
											$elm$core$String$fromInt(px) + 'px'),
										styles),
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
								case 1:
									var $temp$classes = classes + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.oi),
										$temp$node = node,
										$temp$has = A2(
										$mdgriffith$elm_ui$Internal$Flag$add,
										$mdgriffith$elm_ui$Internal$Flag$widthContent,
										A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$width, has)),
										$temp$transform = transform,
										$temp$styles = styles,
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
								case 2:
									var portion = width.a;
									if (portion === 1) {
										var $temp$classes = classes + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.oj),
											$temp$node = node,
											$temp$has = A2(
											$mdgriffith$elm_ui$Internal$Flag$add,
											$mdgriffith$elm_ui$Internal$Flag$widthFill,
											A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$width, has)),
											$temp$transform = transform,
											$temp$styles = styles,
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									} else {
										var $temp$classes = classes + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.sn + (' width-fill-' + $elm$core$String$fromInt(portion)))),
											$temp$node = node,
											$temp$has = A2(
											$mdgriffith$elm_ui$Internal$Flag$add,
											$mdgriffith$elm_ui$Internal$Flag$widthFill,
											A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$width, has)),
											$temp$transform = transform,
											$temp$styles = A2(
											$elm$core$List$cons,
											A3(
												$mdgriffith$elm_ui$Internal$Model$Single,
												$mdgriffith$elm_ui$Internal$Style$classes.sH + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.rj + (' > ' + $mdgriffith$elm_ui$Internal$Style$dot(
													'width-fill-' + $elm$core$String$fromInt(portion))))),
												'flex-grow',
												$elm$core$String$fromInt(portion * 100000)),
											styles),
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									}
								default:
									var _v4 = $mdgriffith$elm_ui$Internal$Model$renderWidth(width);
									var addToFlags = _v4.a;
									var newClass = _v4.b;
									var newStyles = _v4.c;
									var $temp$classes = classes + (' ' + newClass),
										$temp$node = node,
										$temp$has = A2(
										$mdgriffith$elm_ui$Internal$Flag$merge,
										addToFlags,
										A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$width, has)),
										$temp$transform = transform,
										$temp$styles = _Utils_ap(newStyles, styles),
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
							}
						}
					case 8:
						var height = attribute.a;
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$height, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							switch (height.$) {
								case 0:
									var px = height.a;
									var val = $elm$core$String$fromInt(px) + 'px';
									var name = 'height-px-' + val;
									var $temp$classes = $mdgriffith$elm_ui$Internal$Style$classes.pL + (' ' + (name + (' ' + classes))),
										$temp$node = node,
										$temp$has = A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$height, has),
										$temp$transform = transform,
										$temp$styles = A2(
										$elm$core$List$cons,
										A3($mdgriffith$elm_ui$Internal$Model$Single, name, 'height ', val),
										styles),
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
								case 1:
									var $temp$classes = $mdgriffith$elm_ui$Internal$Style$classes.nS + (' ' + classes),
										$temp$node = node,
										$temp$has = A2(
										$mdgriffith$elm_ui$Internal$Flag$add,
										$mdgriffith$elm_ui$Internal$Flag$heightContent,
										A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$height, has)),
										$temp$transform = transform,
										$temp$styles = styles,
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
								case 2:
									var portion = height.a;
									if (portion === 1) {
										var $temp$classes = $mdgriffith$elm_ui$Internal$Style$classes.nT + (' ' + classes),
											$temp$node = node,
											$temp$has = A2(
											$mdgriffith$elm_ui$Internal$Flag$add,
											$mdgriffith$elm_ui$Internal$Flag$heightFill,
											A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$height, has)),
											$temp$transform = transform,
											$temp$styles = styles,
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									} else {
										var $temp$classes = classes + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.pM + (' height-fill-' + $elm$core$String$fromInt(portion)))),
											$temp$node = node,
											$temp$has = A2(
											$mdgriffith$elm_ui$Internal$Flag$add,
											$mdgriffith$elm_ui$Internal$Flag$heightFill,
											A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$height, has)),
											$temp$transform = transform,
											$temp$styles = A2(
											$elm$core$List$cons,
											A3(
												$mdgriffith$elm_ui$Internal$Model$Single,
												$mdgriffith$elm_ui$Internal$Style$classes.sH + ('.' + ($mdgriffith$elm_ui$Internal$Style$classes.dH + (' > ' + $mdgriffith$elm_ui$Internal$Style$dot(
													'height-fill-' + $elm$core$String$fromInt(portion))))),
												'flex-grow',
												$elm$core$String$fromInt(portion * 100000)),
											styles),
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									}
								default:
									var _v6 = $mdgriffith$elm_ui$Internal$Model$renderHeight(height);
									var addToFlags = _v6.a;
									var newClass = _v6.b;
									var newStyles = _v6.c;
									var $temp$classes = classes + (' ' + newClass),
										$temp$node = node,
										$temp$has = A2(
										$mdgriffith$elm_ui$Internal$Flag$merge,
										addToFlags,
										A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$height, has)),
										$temp$transform = transform,
										$temp$styles = _Utils_ap(newStyles, styles),
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
							}
						}
					case 2:
						var description = attribute.a;
						switch (description.$) {
							case 0:
								var $temp$classes = classes,
									$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'main', node),
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 1:
								var $temp$classes = classes,
									$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'nav', node),
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 2:
								var $temp$classes = classes,
									$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'footer', node),
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 3:
								var $temp$classes = classes,
									$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'aside', node),
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 4:
								var i = description.a;
								if (i <= 1) {
									var $temp$classes = classes,
										$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'h1', node),
										$temp$has = has,
										$temp$transform = transform,
										$temp$styles = styles,
										$temp$attrs = attrs,
										$temp$children = children,
										$temp$elementAttrs = remaining;
									classes = $temp$classes;
									node = $temp$node;
									has = $temp$has;
									transform = $temp$transform;
									styles = $temp$styles;
									attrs = $temp$attrs;
									children = $temp$children;
									elementAttrs = $temp$elementAttrs;
									continue gatherAttrRecursive;
								} else {
									if (i < 7) {
										var $temp$classes = classes,
											$temp$node = A2(
											$mdgriffith$elm_ui$Internal$Model$addNodeName,
											'h' + $elm$core$String$fromInt(i),
											node),
											$temp$has = has,
											$temp$transform = transform,
											$temp$styles = styles,
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									} else {
										var $temp$classes = classes,
											$temp$node = A2($mdgriffith$elm_ui$Internal$Model$addNodeName, 'h6', node),
											$temp$has = has,
											$temp$transform = transform,
											$temp$styles = styles,
											$temp$attrs = attrs,
											$temp$children = children,
											$temp$elementAttrs = remaining;
										classes = $temp$classes;
										node = $temp$node;
										has = $temp$has;
										transform = $temp$transform;
										styles = $temp$styles;
										attrs = $temp$attrs;
										children = $temp$children;
										elementAttrs = $temp$elementAttrs;
										continue gatherAttrRecursive;
									}
								}
							case 9:
								var $temp$classes = classes,
									$temp$node = node,
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = attrs,
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 8:
								var $temp$classes = classes,
									$temp$node = node,
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = A2(
									$elm$core$List$cons,
									A2($elm$virtual_dom$VirtualDom$attribute, 'role', 'button'),
									attrs),
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 5:
								var label = description.a;
								var $temp$classes = classes,
									$temp$node = node,
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = A2(
									$elm$core$List$cons,
									A2($elm$virtual_dom$VirtualDom$attribute, 'aria-label', label),
									attrs),
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							case 6:
								var $temp$classes = classes,
									$temp$node = node,
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = A2(
									$elm$core$List$cons,
									A2($elm$virtual_dom$VirtualDom$attribute, 'aria-live', 'polite'),
									attrs),
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
							default:
								var $temp$classes = classes,
									$temp$node = node,
									$temp$has = has,
									$temp$transform = transform,
									$temp$styles = styles,
									$temp$attrs = A2(
									$elm$core$List$cons,
									A2($elm$virtual_dom$VirtualDom$attribute, 'aria-live', 'assertive'),
									attrs),
									$temp$children = children,
									$temp$elementAttrs = remaining;
								classes = $temp$classes;
								node = $temp$node;
								has = $temp$has;
								transform = $temp$transform;
								styles = $temp$styles;
								attrs = $temp$attrs;
								children = $temp$children;
								elementAttrs = $temp$elementAttrs;
								continue gatherAttrRecursive;
						}
					case 9:
						var location = attribute.a;
						var elem = attribute.b;
						var newStyles = function () {
							switch (elem.$) {
								case 3:
									return styles;
								case 2:
									var str = elem.a;
									return styles;
								case 0:
									var html = elem.a;
									return styles;
								default:
									var styled = elem.a;
									return _Utils_ap(styles, styled.rP);
							}
						}();
						var $temp$classes = classes,
							$temp$node = node,
							$temp$has = has,
							$temp$transform = transform,
							$temp$styles = newStyles,
							$temp$attrs = attrs,
							$temp$children = A3($mdgriffith$elm_ui$Internal$Model$addNearbyElement, location, elem, children),
							$temp$elementAttrs = remaining;
						classes = $temp$classes;
						node = $temp$node;
						has = $temp$has;
						transform = $temp$transform;
						styles = $temp$styles;
						attrs = $temp$attrs;
						children = $temp$children;
						elementAttrs = $temp$elementAttrs;
						continue gatherAttrRecursive;
					case 6:
						var x = attribute.a;
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$xAlign, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							var $temp$classes = $mdgriffith$elm_ui$Internal$Model$alignXName(x) + (' ' + classes),
								$temp$node = node,
								$temp$has = function (flags) {
								switch (x) {
									case 1:
										return A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$centerX, flags);
									case 2:
										return A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$alignRight, flags);
									default:
										return flags;
								}
							}(
								A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$xAlign, has)),
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						}
					default:
						var y = attribute.a;
						if (A2($mdgriffith$elm_ui$Internal$Flag$present, $mdgriffith$elm_ui$Internal$Flag$yAlign, has)) {
							var $temp$classes = classes,
								$temp$node = node,
								$temp$has = has,
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						} else {
							var $temp$classes = $mdgriffith$elm_ui$Internal$Model$alignYName(y) + (' ' + classes),
								$temp$node = node,
								$temp$has = function (flags) {
								switch (y) {
									case 1:
										return A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$centerY, flags);
									case 2:
										return A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$alignBottom, flags);
									default:
										return flags;
								}
							}(
								A2($mdgriffith$elm_ui$Internal$Flag$add, $mdgriffith$elm_ui$Internal$Flag$yAlign, has)),
								$temp$transform = transform,
								$temp$styles = styles,
								$temp$attrs = attrs,
								$temp$children = children,
								$temp$elementAttrs = remaining;
							classes = $temp$classes;
							node = $temp$node;
							has = $temp$has;
							transform = $temp$transform;
							styles = $temp$styles;
							attrs = $temp$attrs;
							children = $temp$children;
							elementAttrs = $temp$elementAttrs;
							continue gatherAttrRecursive;
						}
				}
			}
		}
	});
var $mdgriffith$elm_ui$Internal$Model$Untransformed = {$: 0};
var $mdgriffith$elm_ui$Internal$Model$untransformed = $mdgriffith$elm_ui$Internal$Model$Untransformed;
var $mdgriffith$elm_ui$Internal$Model$element = F4(
	function (context, node, attributes, children) {
		return A3(
			$mdgriffith$elm_ui$Internal$Model$createElement,
			context,
			children,
			A8(
				$mdgriffith$elm_ui$Internal$Model$gatherAttrRecursive,
				$mdgriffith$elm_ui$Internal$Model$contextClasses(context),
				node,
				$mdgriffith$elm_ui$Internal$Flag$none,
				$mdgriffith$elm_ui$Internal$Model$untransformed,
				_List_Nil,
				_List_Nil,
				$mdgriffith$elm_ui$Internal$Model$NoNearbyChildren,
				$elm$core$List$reverse(attributes)));
	});
var $mdgriffith$elm_ui$Internal$Model$Height = function (a) {
	return {$: 8, a: a};
};
var $mdgriffith$elm_ui$Element$height = $mdgriffith$elm_ui$Internal$Model$Height;
var $mdgriffith$elm_ui$Internal$Model$Attr = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$htmlClass = function (cls) {
	return $mdgriffith$elm_ui$Internal$Model$Attr(
		$elm$html$Html$Attributes$class(cls));
};
var $mdgriffith$elm_ui$Internal$Model$Content = {$: 1};
var $mdgriffith$elm_ui$Element$shrink = $mdgriffith$elm_ui$Internal$Model$Content;
var $mdgriffith$elm_ui$Internal$Model$Width = function (a) {
	return {$: 7, a: a};
};
var $mdgriffith$elm_ui$Element$width = $mdgriffith$elm_ui$Internal$Model$Width;
var $mdgriffith$elm_ui$Element$column = F2(
	function (attrs, children) {
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asColumn,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.tl + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.h4)),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
						attrs))),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(children));
	});
var $author$project$Pages$Hardware$CancelFetchedMember = {$: 30};
var $author$project$Pages$Hardware$DeleteAccount = {$: 60};
var $mdgriffith$elm_ui$Internal$Model$AlignX = function (a) {
	return {$: 6, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$CenterX = 1;
var $mdgriffith$elm_ui$Element$centerX = $mdgriffith$elm_ui$Internal$Model$AlignX(1);
var $mdgriffith$elm_ui$Internal$Model$AlignY = function (a) {
	return {$: 5, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$CenterY = 1;
var $mdgriffith$elm_ui$Element$centerY = $mdgriffith$elm_ui$Internal$Model$AlignY(1);
var $mdgriffith$elm_ui$Internal$Model$Colored = F3(
	function (a, b, c) {
		return {$: 4, a: a, b: b, c: c};
	});
var $mdgriffith$elm_ui$Internal$Model$StyleClass = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Flag$bgColor = $mdgriffith$elm_ui$Internal$Flag$flag(8);
var $mdgriffith$elm_ui$Internal$Model$formatColorClass = function (_v0) {
	var red = _v0.a;
	var green = _v0.b;
	var blue = _v0.c;
	var alpha = _v0.d;
	return $mdgriffith$elm_ui$Internal$Model$floatClass(red) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(green) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(blue) + ('-' + $mdgriffith$elm_ui$Internal$Model$floatClass(alpha))))));
};
var $mdgriffith$elm_ui$Element$Background$color = function (clr) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$bgColor,
		A3(
			$mdgriffith$elm_ui$Internal$Model$Colored,
			'bg-' + $mdgriffith$elm_ui$Internal$Model$formatColorClass(clr),
			'background-color',
			clr));
};
var $mdgriffith$elm_ui$Internal$Model$Fill = function (a) {
	return {$: 2, a: a};
};
var $mdgriffith$elm_ui$Element$fill = $mdgriffith$elm_ui$Internal$Model$Fill(1);
var $mdgriffith$elm_ui$Internal$Model$Describe = function (a) {
	return {$: 2, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$Main = {$: 0};
var $mdgriffith$elm_ui$Element$Region$mainContent = $mdgriffith$elm_ui$Internal$Model$Describe($mdgriffith$elm_ui$Internal$Model$Main);
var $mdgriffith$elm_ui$Internal$Model$Max = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $mdgriffith$elm_ui$Element$maximum = F2(
	function (i, l) {
		return A2($mdgriffith$elm_ui$Internal$Model$Max, i, l);
	});
var $mdgriffith$elm_ui$Internal$Model$PaddingStyle = F5(
	function (a, b, c, d, e) {
		return {$: 7, a: a, b: b, c: c, d: d, e: e};
	});
var $mdgriffith$elm_ui$Internal$Flag$padding = $mdgriffith$elm_ui$Internal$Flag$flag(2);
var $mdgriffith$elm_ui$Element$padding = function (x) {
	var f = x;
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$padding,
		A5(
			$mdgriffith$elm_ui$Internal$Model$PaddingStyle,
			'p-' + $elm$core$String$fromInt(x),
			f,
			f,
			f,
			f));
};
var $mdgriffith$elm_ui$Internal$Model$Rgba = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $mdgriffith$elm_ui$Element$rgb255 = F3(
	function (red, green, blue) {
		return A4($mdgriffith$elm_ui$Internal$Model$Rgba, red / 255, green / 255, blue / 255, 1);
	});
var $Orasund$elm_ui_framework$Framework$container = _List_fromArray(
	[
		$mdgriffith$elm_ui$Element$centerX,
		$mdgriffith$elm_ui$Element$centerY,
		$mdgriffith$elm_ui$Element$width(
		A2($mdgriffith$elm_ui$Element$maximum, 1200, $mdgriffith$elm_ui$Element$fill)),
		$mdgriffith$elm_ui$Element$padding(20),
		$mdgriffith$elm_ui$Element$Region$mainContent,
		$mdgriffith$elm_ui$Element$Background$color(
		A3($mdgriffith$elm_ui$Element$rgb255, 255, 255, 255))
	]);
var $mdgriffith$elm_ui$Element$el = F2(
	function (attrs, child) {
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asEl,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
					attrs)),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(
				_List_fromArray(
					[child])));
	});
var $mdgriffith$elm_ui$Internal$Model$Left = 0;
var $mdgriffith$elm_ui$Element$alignLeft = $mdgriffith$elm_ui$Internal$Model$AlignX(0);
var $mdgriffith$elm_ui$Internal$Model$Class = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Flag$fontWeight = $mdgriffith$elm_ui$Internal$Flag$flag(13);
var $mdgriffith$elm_ui$Element$Font$bold = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$fontWeight, $mdgriffith$elm_ui$Internal$Style$classes.sW);
var $elm$core$Basics$clamp = F3(
	function (low, high, number) {
		return (_Utils_cmp(number, low) < 0) ? low : ((_Utils_cmp(number, high) > 0) ? high : number);
	});
var $mdgriffith$elm_ui$Internal$Model$Heading = function (a) {
	return {$: 4, a: a};
};
var $mdgriffith$elm_ui$Element$Region$heading = A2($elm$core$Basics$composeL, $mdgriffith$elm_ui$Internal$Model$Describe, $mdgriffith$elm_ui$Internal$Model$Heading);
var $mdgriffith$elm_ui$Internal$Model$paddingName = F4(
	function (top, right, bottom, left) {
		return 'pad-' + ($elm$core$String$fromInt(top) + ('-' + ($elm$core$String$fromInt(right) + ('-' + ($elm$core$String$fromInt(bottom) + ('-' + $elm$core$String$fromInt(left)))))));
	});
var $mdgriffith$elm_ui$Element$paddingEach = function (_v0) {
	var top = _v0.rV;
	var right = _v0.rg;
	var bottom = _v0.oP;
	var left = _v0.p8;
	if (_Utils_eq(top, right) && (_Utils_eq(top, bottom) && _Utils_eq(top, left))) {
		var topFloat = top;
		return A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$padding,
			A5(
				$mdgriffith$elm_ui$Internal$Model$PaddingStyle,
				'p-' + $elm$core$String$fromInt(top),
				topFloat,
				topFloat,
				topFloat,
				topFloat));
	} else {
		return A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$padding,
			A5(
				$mdgriffith$elm_ui$Internal$Model$PaddingStyle,
				A4($mdgriffith$elm_ui$Internal$Model$paddingName, top, right, bottom, left),
				top,
				right,
				bottom,
				left));
	}
};
var $mdgriffith$elm_ui$Internal$Model$FontSize = function (a) {
	return {$: 2, a: a};
};
var $mdgriffith$elm_ui$Internal$Flag$fontSize = $mdgriffith$elm_ui$Internal$Flag$flag(4);
var $mdgriffith$elm_ui$Element$Font$size = function (i) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$fontSize,
		$mdgriffith$elm_ui$Internal$Model$FontSize(i));
};
var $Orasund$elm_ui_framework$Framework$Heading$h = function (inputLevel) {
	var level = A3($elm$core$Basics$clamp, 1, 6, inputLevel);
	var size = (level === 6) ? 14 : (32 - ((level - 1) * 4));
	return _List_fromArray(
		[
			$mdgriffith$elm_ui$Element$Region$heading(level),
			$mdgriffith$elm_ui$Element$Font$size(size),
			$mdgriffith$elm_ui$Element$paddingEach(
			{oP: 2, p8: 0, rg: 0, rV: 2}),
			$mdgriffith$elm_ui$Element$alignLeft,
			$mdgriffith$elm_ui$Element$Font$bold
		]);
};
var $Orasund$elm_ui_framework$Framework$Heading$h5 = $Orasund$elm_ui_framework$Framework$Heading$h(5);
var $mdgriffith$elm_ui$Internal$Model$Button = {$: 8};
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $mdgriffith$elm_ui$Element$Input$enter = 'Enter';
var $mdgriffith$elm_ui$Internal$Model$NoAttribute = {$: 0};
var $mdgriffith$elm_ui$Element$Input$hasFocusStyle = function (attr) {
	if (((attr.$ === 4) && (attr.b.$ === 11)) && (!attr.b.a)) {
		var _v1 = attr.b;
		var _v2 = _v1.a;
		return true;
	} else {
		return false;
	}
};
var $mdgriffith$elm_ui$Element$Input$focusDefault = function (attrs) {
	return A2($elm$core$List$any, $mdgriffith$elm_ui$Element$Input$hasFocusStyle, attrs) ? $mdgriffith$elm_ui$Internal$Model$NoAttribute : $mdgriffith$elm_ui$Internal$Model$htmlClass('focusable');
};
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $mdgriffith$elm_ui$Element$Events$onClick = A2($elm$core$Basics$composeL, $mdgriffith$elm_ui$Internal$Model$Attr, $elm$html$Html$Events$onClick);
var $elm$virtual_dom$VirtualDom$MayPreventDefault = function (a) {
	return {$: 2, a: a};
};
var $elm$html$Html$Events$preventDefaultOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayPreventDefault(decoder));
	});
var $mdgriffith$elm_ui$Element$Input$onKeyLookup = function (lookup) {
	var decode = function (code) {
		var _v0 = lookup(code);
		if (_v0.$ === 1) {
			return $elm$json$Json$Decode$fail('No key matched');
		} else {
			var msg = _v0.a;
			return $elm$json$Json$Decode$succeed(msg);
		}
	};
	var isKey = A2(
		$elm$json$Json$Decode$andThen,
		decode,
		A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string));
	return $mdgriffith$elm_ui$Internal$Model$Attr(
		A2(
			$elm$html$Html$Events$preventDefaultOn,
			'keydown',
			A2(
				$elm$json$Json$Decode$map,
				function (fired) {
					return _Utils_Tuple2(fired, true);
				},
				isKey)));
};
var $mdgriffith$elm_ui$Internal$Flag$cursor = $mdgriffith$elm_ui$Internal$Flag$flag(21);
var $mdgriffith$elm_ui$Element$pointer = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$cursor, $mdgriffith$elm_ui$Internal$Style$classes.to);
var $mdgriffith$elm_ui$Element$Input$space = ' ';
var $elm$html$Html$Attributes$tabindex = function (n) {
	return A2(
		_VirtualDom_attribute,
		'tabIndex',
		$elm$core$String$fromInt(n));
};
var $mdgriffith$elm_ui$Element$Input$button = F2(
	function (attrs, _v0) {
		var onPress = _v0.aq;
		var label = _v0.I;
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asEl,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.mZ + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.dI + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.vK + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.qx)))))),
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Element$pointer,
							A2(
								$elm$core$List$cons,
								$mdgriffith$elm_ui$Element$Input$focusDefault(attrs),
								A2(
									$elm$core$List$cons,
									$mdgriffith$elm_ui$Internal$Model$Describe($mdgriffith$elm_ui$Internal$Model$Button),
									A2(
										$elm$core$List$cons,
										$mdgriffith$elm_ui$Internal$Model$Attr(
											$elm$html$Html$Attributes$tabindex(0)),
										function () {
											if (onPress.$ === 1) {
												return A2(
													$elm$core$List$cons,
													$mdgriffith$elm_ui$Internal$Model$Attr(
														$elm$html$Html$Attributes$disabled(true)),
													attrs);
											} else {
												var msg = onPress.a;
												return A2(
													$elm$core$List$cons,
													$mdgriffith$elm_ui$Element$Events$onClick(msg),
													A2(
														$elm$core$List$cons,
														$mdgriffith$elm_ui$Element$Input$onKeyLookup(
															function (code) {
																return _Utils_eq(code, $mdgriffith$elm_ui$Element$Input$enter) ? $elm$core$Maybe$Just(msg) : (_Utils_eq(code, $mdgriffith$elm_ui$Element$Input$space) ? $elm$core$Maybe$Just(msg) : $elm$core$Maybe$Nothing);
															}),
														attrs));
											}
										}()))))))),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(
				_List_fromArray(
					[label])));
	});
var $mdgriffith$elm_ui$Internal$Flag$fontAlignment = $mdgriffith$elm_ui$Internal$Flag$flag(12);
var $mdgriffith$elm_ui$Element$Font$center = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$fontAlignment, $mdgriffith$elm_ui$Internal$Style$classes.wa);
var $mdgriffith$elm_ui$Internal$Flag$borderColor = $mdgriffith$elm_ui$Internal$Flag$flag(28);
var $mdgriffith$elm_ui$Element$Border$color = function (clr) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$borderColor,
		A3(
			$mdgriffith$elm_ui$Internal$Model$Colored,
			'bc-' + $mdgriffith$elm_ui$Internal$Model$formatColorClass(clr),
			'border-color',
			clr));
};
var $Orasund$elm_ui_framework$Framework$Color$grey = A3($mdgriffith$elm_ui$Element$rgb255, 122, 122, 122);
var $mdgriffith$elm_ui$Internal$Model$Hover = 1;
var $mdgriffith$elm_ui$Internal$Model$PseudoSelector = F2(
	function (a, b) {
		return {$: 11, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Flag$hover = $mdgriffith$elm_ui$Internal$Flag$flag(33);
var $mdgriffith$elm_ui$Internal$Model$Nearby = F2(
	function (a, b) {
		return {$: 9, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$TransformComponent = F2(
	function (a, b) {
		return {$: 10, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$Empty = {$: 3};
var $mdgriffith$elm_ui$Internal$Model$Text = function (a) {
	return {$: 2, a: a};
};
var $mdgriffith$elm_ui$Internal$Model$map = F2(
	function (fn, el) {
		switch (el.$) {
			case 1:
				var styled = el.a;
				return $mdgriffith$elm_ui$Internal$Model$Styled(
					{
						ue: F2(
							function (add, context) {
								return A2(
									$elm$virtual_dom$VirtualDom$map,
									fn,
									A2(styled.ue, add, context));
							}),
						rP: styled.rP
					});
			case 0:
				var html = el.a;
				return $mdgriffith$elm_ui$Internal$Model$Unstyled(
					A2(
						$elm$core$Basics$composeL,
						$elm$virtual_dom$VirtualDom$map(fn),
						html));
			case 2:
				var str = el.a;
				return $mdgriffith$elm_ui$Internal$Model$Text(str);
			default:
				return $mdgriffith$elm_ui$Internal$Model$Empty;
		}
	});
var $elm$virtual_dom$VirtualDom$mapAttribute = _VirtualDom_mapAttribute;
var $mdgriffith$elm_ui$Internal$Model$mapAttrFromStyle = F2(
	function (fn, attr) {
		switch (attr.$) {
			case 0:
				return $mdgriffith$elm_ui$Internal$Model$NoAttribute;
			case 2:
				var description = attr.a;
				return $mdgriffith$elm_ui$Internal$Model$Describe(description);
			case 6:
				var x = attr.a;
				return $mdgriffith$elm_ui$Internal$Model$AlignX(x);
			case 5:
				var y = attr.a;
				return $mdgriffith$elm_ui$Internal$Model$AlignY(y);
			case 7:
				var x = attr.a;
				return $mdgriffith$elm_ui$Internal$Model$Width(x);
			case 8:
				var x = attr.a;
				return $mdgriffith$elm_ui$Internal$Model$Height(x);
			case 3:
				var x = attr.a;
				var y = attr.b;
				return A2($mdgriffith$elm_ui$Internal$Model$Class, x, y);
			case 4:
				var flag = attr.a;
				var style = attr.b;
				return A2($mdgriffith$elm_ui$Internal$Model$StyleClass, flag, style);
			case 9:
				var location = attr.a;
				var elem = attr.b;
				return A2(
					$mdgriffith$elm_ui$Internal$Model$Nearby,
					location,
					A2($mdgriffith$elm_ui$Internal$Model$map, fn, elem));
			case 1:
				var htmlAttr = attr.a;
				return $mdgriffith$elm_ui$Internal$Model$Attr(
					A2($elm$virtual_dom$VirtualDom$mapAttribute, fn, htmlAttr));
			default:
				var fl = attr.a;
				var trans = attr.b;
				return A2($mdgriffith$elm_ui$Internal$Model$TransformComponent, fl, trans);
		}
	});
var $mdgriffith$elm_ui$Internal$Model$removeNever = function (style) {
	return A2($mdgriffith$elm_ui$Internal$Model$mapAttrFromStyle, $elm$core$Basics$never, style);
};
var $mdgriffith$elm_ui$Internal$Model$unwrapDecsHelper = F2(
	function (attr, _v0) {
		var styles = _v0.a;
		var trans = _v0.b;
		var _v1 = $mdgriffith$elm_ui$Internal$Model$removeNever(attr);
		switch (_v1.$) {
			case 4:
				var style = _v1.b;
				return _Utils_Tuple2(
					A2($elm$core$List$cons, style, styles),
					trans);
			case 10:
				var flag = _v1.a;
				var component = _v1.b;
				return _Utils_Tuple2(
					styles,
					A2($mdgriffith$elm_ui$Internal$Model$composeTransformation, trans, component));
			default:
				return _Utils_Tuple2(styles, trans);
		}
	});
var $mdgriffith$elm_ui$Internal$Model$unwrapDecorations = function (attrs) {
	var _v0 = A3(
		$elm$core$List$foldl,
		$mdgriffith$elm_ui$Internal$Model$unwrapDecsHelper,
		_Utils_Tuple2(_List_Nil, $mdgriffith$elm_ui$Internal$Model$Untransformed),
		attrs);
	var styles = _v0.a;
	var transform = _v0.b;
	return A2(
		$elm$core$List$cons,
		$mdgriffith$elm_ui$Internal$Model$Transform(transform),
		styles);
};
var $mdgriffith$elm_ui$Element$mouseOver = function (decs) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$hover,
		A2(
			$mdgriffith$elm_ui$Internal$Model$PseudoSelector,
			1,
			$mdgriffith$elm_ui$Internal$Model$unwrapDecorations(decs)));
};
var $mdgriffith$elm_ui$Element$paddingXY = F2(
	function (x, y) {
		if (_Utils_eq(x, y)) {
			var f = x;
			return A2(
				$mdgriffith$elm_ui$Internal$Model$StyleClass,
				$mdgriffith$elm_ui$Internal$Flag$padding,
				A5(
					$mdgriffith$elm_ui$Internal$Model$PaddingStyle,
					'p-' + $elm$core$String$fromInt(x),
					f,
					f,
					f,
					f));
		} else {
			var yFloat = y;
			var xFloat = x;
			return A2(
				$mdgriffith$elm_ui$Internal$Model$StyleClass,
				$mdgriffith$elm_ui$Internal$Flag$padding,
				A5(
					$mdgriffith$elm_ui$Internal$Model$PaddingStyle,
					'p-' + ($elm$core$String$fromInt(x) + ('-' + $elm$core$String$fromInt(y))),
					yFloat,
					xFloat,
					yFloat,
					xFloat));
		}
	});
var $mdgriffith$elm_ui$Internal$Model$Top = 0;
var $mdgriffith$elm_ui$Element$alignTop = $mdgriffith$elm_ui$Internal$Model$AlignY(0);
var $Orasund$elm_ui_framework$Framework$Color$lighterGrey = A3($mdgriffith$elm_ui$Element$rgb255, 245, 245, 245);
var $Orasund$elm_ui_framework$Framework$Color$light = _List_fromArray(
	[
		$mdgriffith$elm_ui$Element$Background$color($Orasund$elm_ui_framework$Framework$Color$lighterGrey),
		$mdgriffith$elm_ui$Element$Border$color($Orasund$elm_ui_framework$Framework$Color$lighterGrey)
	]);
var $Orasund$elm_ui_framework$Framework$Color$lightGrey = A3($mdgriffith$elm_ui$Element$rgb255, 219, 219, 219);
var $mdgriffith$elm_ui$Element$rgba = $mdgriffith$elm_ui$Internal$Model$Rgba;
var $mdgriffith$elm_ui$Internal$Model$boxShadowClass = function (shadow) {
	return $elm$core$String$concat(
		_List_fromArray(
			[
				shadow.pW ? 'box-inset' : 'box-',
				$mdgriffith$elm_ui$Internal$Model$floatClass(shadow.j6.a) + 'px',
				$mdgriffith$elm_ui$Internal$Model$floatClass(shadow.j6.b) + 'px',
				$mdgriffith$elm_ui$Internal$Model$floatClass(shadow.sU) + 'px',
				$mdgriffith$elm_ui$Internal$Model$floatClass(shadow.vV) + 'px',
				$mdgriffith$elm_ui$Internal$Model$formatColorClass(shadow.td)
			]));
};
var $mdgriffith$elm_ui$Internal$Flag$shadows = $mdgriffith$elm_ui$Internal$Flag$flag(19);
var $mdgriffith$elm_ui$Element$Border$shadow = function (almostShade) {
	var shade = {sU: almostShade.sU, td: almostShade.td, pW: false, j6: almostShade.j6, vV: almostShade.vV};
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$shadows,
		A3(
			$mdgriffith$elm_ui$Internal$Model$Single,
			$mdgriffith$elm_ui$Internal$Model$boxShadowClass(shade),
			'box-shadow',
			$mdgriffith$elm_ui$Internal$Model$formatBoxShadow(shade)));
};
var $mdgriffith$elm_ui$Internal$Flag$borderRound = $mdgriffith$elm_ui$Internal$Flag$flag(17);
var $mdgriffith$elm_ui$Element$Border$rounded = function (radius) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$borderRound,
		A3(
			$mdgriffith$elm_ui$Internal$Model$Single,
			'br-' + $elm$core$String$fromInt(radius),
			'border-radius',
			$elm$core$String$fromInt(radius) + 'px'));
};
var $Orasund$elm_ui_framework$Framework$Color$simple = _List_fromArray(
	[
		$mdgriffith$elm_ui$Element$Background$color($Orasund$elm_ui_framework$Framework$Color$lightGrey),
		$mdgriffith$elm_ui$Element$Border$color($Orasund$elm_ui_framework$Framework$Color$lightGrey)
	]);
var $Orasund$elm_ui_framework$Framework$Tag$simple = _Utils_ap(
	$Orasund$elm_ui_framework$Framework$Color$simple,
	_List_fromArray(
		[
			$mdgriffith$elm_ui$Element$Border$rounded(4),
			A2($mdgriffith$elm_ui$Element$paddingXY, 7, 4)
		]));
var $mdgriffith$elm_ui$Internal$Model$BorderWidth = F5(
	function (a, b, c, d, e) {
		return {$: 6, a: a, b: b, c: c, d: d, e: e};
	});
var $mdgriffith$elm_ui$Element$Border$width = function (v) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$borderWidth,
		A5(
			$mdgriffith$elm_ui$Internal$Model$BorderWidth,
			'b-' + $elm$core$String$fromInt(v),
			v,
			v,
			v,
			v));
};
var $Orasund$elm_ui_framework$Framework$Card$simple = _Utils_ap(
	$Orasund$elm_ui_framework$Framework$Tag$simple,
	_Utils_ap(
		$Orasund$elm_ui_framework$Framework$Color$light,
		_List_fromArray(
			[
				$mdgriffith$elm_ui$Element$Border$shadow(
				{
					sU: 10,
					td: A4($mdgriffith$elm_ui$Element$rgba, 0, 0, 0, 0.05),
					j6: _Utils_Tuple2(0, 2),
					vV: 1
				}),
				$mdgriffith$elm_ui$Element$Border$width(1),
				$mdgriffith$elm_ui$Element$Border$color($Orasund$elm_ui_framework$Framework$Color$lightGrey),
				$mdgriffith$elm_ui$Element$alignTop,
				$mdgriffith$elm_ui$Element$padding(20),
				$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink)
			])));
var $Orasund$elm_ui_framework$Framework$Button$simple = _Utils_ap(
	$Orasund$elm_ui_framework$Framework$Card$simple,
	_Utils_ap(
		$Orasund$elm_ui_framework$Framework$Color$simple,
		_List_fromArray(
			[
				$mdgriffith$elm_ui$Element$Font$center,
				$mdgriffith$elm_ui$Element$mouseOver(
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$Border$color($Orasund$elm_ui_framework$Framework$Color$grey)
					])),
				A2($mdgriffith$elm_ui$Element$paddingXY, 16, 12)
			])));
var $Orasund$elm_ui_framework$Framework$Button$fill = _Utils_ap(
	$Orasund$elm_ui_framework$Framework$Button$simple,
	_List_fromArray(
		[
			$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
		]));
var $Orasund$elm_ui_framework$Framework$Color$cyan = A3($mdgriffith$elm_ui$Element$rgb255, 32, 156, 238);
var $Orasund$elm_ui_framework$Framework$Color$info = _List_fromArray(
	[
		$mdgriffith$elm_ui$Element$Background$color($Orasund$elm_ui_framework$Framework$Color$cyan),
		$mdgriffith$elm_ui$Element$Border$color($Orasund$elm_ui_framework$Framework$Color$cyan)
	]);
var $mdgriffith$elm_ui$Element$text = function (content) {
	return $mdgriffith$elm_ui$Internal$Model$Text(content);
};
var $author$project$Pages$Hardware$infoBtn = F2(
	function (label, msg) {
		return A2(
			$mdgriffith$elm_ui$Element$Input$button,
			_Utils_ap(
				$Orasund$elm_ui_framework$Framework$Button$simple,
				_Utils_ap($Orasund$elm_ui_framework$Framework$Button$fill, $Orasund$elm_ui_framework$Framework$Color$info)),
			{
				I: $mdgriffith$elm_ui$Element$text(label),
				aq: $elm$core$Maybe$Just(msg)
			});
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $mdgriffith$elm_ui$Internal$Flag$fontColor = $mdgriffith$elm_ui$Internal$Flag$flag(14);
var $mdgriffith$elm_ui$Element$Font$color = function (fontColor) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$fontColor,
		A3(
			$mdgriffith$elm_ui$Internal$Model$Colored,
			'fc-' + $mdgriffith$elm_ui$Internal$Model$formatColorClass(fontColor),
			'color',
			fontColor));
};
var $Orasund$elm_ui_framework$Framework$Color$darkerGrey = A3($mdgriffith$elm_ui$Element$rgb255, 18, 18, 18);
var $Orasund$elm_ui_framework$Framework$layoutAttributes = _Utils_ap(
	_List_fromArray(
		[
			$mdgriffith$elm_ui$Element$Font$size(16),
			$mdgriffith$elm_ui$Element$Font$color($Orasund$elm_ui_framework$Framework$Color$darkerGrey)
		]),
	$Orasund$elm_ui_framework$Framework$Color$light);
var $mdgriffith$elm_ui$Internal$Model$FocusStyleOption = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Element$focusStyle = $mdgriffith$elm_ui$Internal$Model$FocusStyleOption;
var $elm$core$List$singleton = function (value) {
	return _List_fromArray(
		[value]);
};
var $Orasund$elm_ui_framework$Framework$Color$turquoise = A3($mdgriffith$elm_ui$Element$rgb255, 0, 209, 178);
var $Orasund$elm_ui_framework$Framework$layoutOptions = $elm$core$List$singleton(
	$mdgriffith$elm_ui$Element$focusStyle(
		{
			sL: $elm$core$Maybe$Nothing,
			sX: $elm$core$Maybe$Just($Orasund$elm_ui_framework$Framework$Color$turquoise),
			vS: $elm$core$Maybe$Just(
				{
					sU: 10,
					td: $Orasund$elm_ui_framework$Framework$Color$turquoise,
					j6: _Utils_Tuple2(0, 0),
					vV: 1
				})
		}));
var $mdgriffith$elm_ui$Internal$Model$OnlyDynamic = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$StaticRootAndDynamic = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$AllowHover = 1;
var $mdgriffith$elm_ui$Internal$Model$Layout = 0;
var $mdgriffith$elm_ui$Internal$Model$focusDefaultStyle = {
	sL: $elm$core$Maybe$Nothing,
	sX: $elm$core$Maybe$Nothing,
	vS: $elm$core$Maybe$Just(
		{
			sU: 0,
			td: A4($mdgriffith$elm_ui$Internal$Model$Rgba, 155 / 255, 203 / 255, 1, 1),
			j6: _Utils_Tuple2(0, 0),
			vV: 3
		})
};
var $mdgriffith$elm_ui$Internal$Model$optionsToRecord = function (options) {
	var combine = F2(
		function (opt, record) {
			switch (opt.$) {
				case 0:
					var hoverable = opt.a;
					var _v4 = record.uc;
					if (_v4.$ === 1) {
						return _Utils_update(
							record,
							{
								uc: $elm$core$Maybe$Just(hoverable)
							});
					} else {
						return record;
					}
				case 1:
					var focusStyle = opt.a;
					var _v5 = record.tS;
					if (_v5.$ === 1) {
						return _Utils_update(
							record,
							{
								tS: $elm$core$Maybe$Just(focusStyle)
							});
					} else {
						return record;
					}
				default:
					var renderMode = opt.a;
					var _v6 = record.uP;
					if (_v6.$ === 1) {
						return _Utils_update(
							record,
							{
								uP: $elm$core$Maybe$Just(renderMode)
							});
					} else {
						return record;
					}
			}
		});
	var andFinally = function (record) {
		return {
			tS: function () {
				var _v0 = record.tS;
				if (_v0.$ === 1) {
					return $mdgriffith$elm_ui$Internal$Model$focusDefaultStyle;
				} else {
					var focusable = _v0.a;
					return focusable;
				}
			}(),
			uc: function () {
				var _v1 = record.uc;
				if (_v1.$ === 1) {
					return 1;
				} else {
					var hoverable = _v1.a;
					return hoverable;
				}
			}(),
			uP: function () {
				var _v2 = record.uP;
				if (_v2.$ === 1) {
					return 0;
				} else {
					var actualMode = _v2.a;
					return actualMode;
				}
			}()
		};
	};
	return andFinally(
		A3(
			$elm$core$List$foldr,
			combine,
			{tS: $elm$core$Maybe$Nothing, uc: $elm$core$Maybe$Nothing, uP: $elm$core$Maybe$Nothing},
			options));
};
var $mdgriffith$elm_ui$Internal$Model$toHtml = F2(
	function (mode, el) {
		switch (el.$) {
			case 0:
				var html = el.a;
				return html($mdgriffith$elm_ui$Internal$Model$asEl);
			case 1:
				var styles = el.a.rP;
				var html = el.a.ue;
				return A2(
					html,
					mode(styles),
					$mdgriffith$elm_ui$Internal$Model$asEl);
			case 2:
				var text = el.a;
				return $mdgriffith$elm_ui$Internal$Model$textElement(text);
			default:
				return $mdgriffith$elm_ui$Internal$Model$textElement('');
		}
	});
var $mdgriffith$elm_ui$Internal$Model$renderRoot = F3(
	function (optionList, attributes, child) {
		var options = $mdgriffith$elm_ui$Internal$Model$optionsToRecord(optionList);
		var embedStyle = function () {
			var _v0 = options.uP;
			if (_v0 === 1) {
				return $mdgriffith$elm_ui$Internal$Model$OnlyDynamic(options);
			} else {
				return $mdgriffith$elm_ui$Internal$Model$StaticRootAndDynamic(options);
			}
		}();
		return A2(
			$mdgriffith$elm_ui$Internal$Model$toHtml,
			embedStyle,
			A4(
				$mdgriffith$elm_ui$Internal$Model$element,
				$mdgriffith$elm_ui$Internal$Model$asEl,
				$mdgriffith$elm_ui$Internal$Model$div,
				attributes,
				$mdgriffith$elm_ui$Internal$Model$Unkeyed(
					_List_fromArray(
						[child]))));
	});
var $mdgriffith$elm_ui$Internal$Model$FontFamily = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$SansSerif = {$: 1};
var $mdgriffith$elm_ui$Internal$Model$Typeface = function (a) {
	return {$: 3, a: a};
};
var $mdgriffith$elm_ui$Internal$Flag$fontFamily = $mdgriffith$elm_ui$Internal$Flag$flag(5);
var $elm$core$String$toLower = _String_toLower;
var $elm$core$String$words = _String_words;
var $mdgriffith$elm_ui$Internal$Model$renderFontClassName = F2(
	function (font, current) {
		return _Utils_ap(
			current,
			function () {
				switch (font.$) {
					case 0:
						return 'serif';
					case 1:
						return 'sans-serif';
					case 2:
						return 'monospace';
					case 3:
						var name = font.a;
						return A2(
							$elm$core$String$join,
							'-',
							$elm$core$String$words(
								$elm$core$String$toLower(name)));
					case 4:
						var name = font.a;
						var url = font.b;
						return A2(
							$elm$core$String$join,
							'-',
							$elm$core$String$words(
								$elm$core$String$toLower(name)));
					default:
						var name = font.a.fR;
						return A2(
							$elm$core$String$join,
							'-',
							$elm$core$String$words(
								$elm$core$String$toLower(name)));
				}
			}());
	});
var $mdgriffith$elm_ui$Internal$Model$rootStyle = function () {
	var families = _List_fromArray(
		[
			$mdgriffith$elm_ui$Internal$Model$Typeface('Open Sans'),
			$mdgriffith$elm_ui$Internal$Model$Typeface('Helvetica'),
			$mdgriffith$elm_ui$Internal$Model$Typeface('Verdana'),
			$mdgriffith$elm_ui$Internal$Model$SansSerif
		]);
	return _List_fromArray(
		[
			A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$bgColor,
			A3(
				$mdgriffith$elm_ui$Internal$Model$Colored,
				'bg-' + $mdgriffith$elm_ui$Internal$Model$formatColorClass(
					A4($mdgriffith$elm_ui$Internal$Model$Rgba, 1, 1, 1, 0)),
				'background-color',
				A4($mdgriffith$elm_ui$Internal$Model$Rgba, 1, 1, 1, 0))),
			A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$fontColor,
			A3(
				$mdgriffith$elm_ui$Internal$Model$Colored,
				'fc-' + $mdgriffith$elm_ui$Internal$Model$formatColorClass(
					A4($mdgriffith$elm_ui$Internal$Model$Rgba, 0, 0, 0, 1)),
				'color',
				A4($mdgriffith$elm_ui$Internal$Model$Rgba, 0, 0, 0, 1))),
			A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$fontSize,
			$mdgriffith$elm_ui$Internal$Model$FontSize(20)),
			A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$fontFamily,
			A2(
				$mdgriffith$elm_ui$Internal$Model$FontFamily,
				A3($elm$core$List$foldl, $mdgriffith$elm_ui$Internal$Model$renderFontClassName, 'font-', families),
				families))
		]);
}();
var $mdgriffith$elm_ui$Element$layoutWith = F3(
	function (_v0, attrs, child) {
		var options = _v0.u9;
		return A3(
			$mdgriffith$elm_ui$Internal$Model$renderRoot,
			options,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Internal$Model$htmlClass(
					A2(
						$elm$core$String$join,
						' ',
						_List_fromArray(
							[$mdgriffith$elm_ui$Internal$Style$classes.rh, $mdgriffith$elm_ui$Internal$Style$classes.sH, $mdgriffith$elm_ui$Internal$Style$classes.vU]))),
				_Utils_ap($mdgriffith$elm_ui$Internal$Model$rootStyle, attrs)),
			child);
	});
var $Orasund$elm_ui_framework$Framework$layout = function (attributes) {
	return A2(
		$mdgriffith$elm_ui$Element$layoutWith,
		{u9: $Orasund$elm_ui_framework$Framework$layoutOptions},
		_Utils_ap($Orasund$elm_ui_framework$Framework$layoutAttributes, attributes));
};
var $Orasund$elm_ui_framework$Framework$responsiveLayout = F2(
	function (attributes, view) {
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A3(
					$elm$html$Html$node,
					'meta',
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$attribute, 'name', 'viewport'),
							A2($elm$html$Html$Attributes$attribute, 'content', 'width=device-width, initial-scale=1.0')
						]),
					_List_Nil),
					A2($Orasund$elm_ui_framework$Framework$layout, attributes, view)
				]));
	});
var $mdgriffith$elm_ui$Internal$Model$SpacingStyle = F3(
	function (a, b, c) {
		return {$: 5, a: a, b: b, c: c};
	});
var $mdgriffith$elm_ui$Internal$Flag$spacing = $mdgriffith$elm_ui$Internal$Flag$flag(3);
var $mdgriffith$elm_ui$Internal$Model$spacingName = F2(
	function (x, y) {
		return 'spacing-' + ($elm$core$String$fromInt(x) + ('-' + $elm$core$String$fromInt(y)));
	});
var $mdgriffith$elm_ui$Element$spacing = function (x) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$spacing,
		A3(
			$mdgriffith$elm_ui$Internal$Model$SpacingStyle,
			A2($mdgriffith$elm_ui$Internal$Model$spacingName, x, x),
			x,
			x));
};
var $Orasund$elm_ui_framework$Framework$Grid$simple = _List_fromArray(
	[
		$mdgriffith$elm_ui$Element$spacing(10),
		$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
		$mdgriffith$elm_ui$Element$alignTop
	]);
var $author$project$Pages$Hardware$confirmDeleteUserView = function (userInfo) {
	return A2(
		$Orasund$elm_ui_framework$Framework$responsiveLayout,
		_List_Nil,
		A2(
			$mdgriffith$elm_ui$Element$column,
			$Orasund$elm_ui_framework$Framework$container,
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$el,
					$Orasund$elm_ui_framework$Framework$Heading$h5,
					$mdgriffith$elm_ui$Element$text(userInfo.dw + ' - Are you sure you want to delete your account?\n            Please note that this will delete all your AND THE RANKING MEMBER\'S rankings and is IRREVERSIBLE!\n            (You may wish to inform them before deleting)')),
					A2(
					$mdgriffith$elm_ui$Element$column,
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
						_Utils_ap($Orasund$elm_ui_framework$Framework$Card$simple, $Orasund$elm_ui_framework$Framework$Grid$simple)),
					_List_fromArray(
						[
							A2($author$project$Pages$Hardware$infoBtn, 'Delete User Account', $author$project$Pages$Hardware$DeleteAccount),
							A2($author$project$Pages$Hardware$infoBtn, 'Cancel', $author$project$Pages$Hardware$CancelFetchedMember)
						]))
				])));
};
var $author$project$Pages$Hardware$CancelFetchedSpectator = {$: 31};
var $author$project$Pages$Hardware$ConfirmJoin = F3(
	function (a, b, c) {
		return {$: 55, a: a, b: b, c: c};
	});
var $author$project$Data$Ranking$gotLowestRank = function (ranks) {
	if (!ranks.b) {
		return $elm$core$Maybe$Nothing;
	} else {
		if (!ranks.b.b) {
			var rank = ranks.a;
			return $elm$core$Maybe$Just(rank);
		} else {
			var head = ranks.a;
			var tail = ranks.b;
			var findMaxHelper = F2(
				function (currentMax, remainingList) {
					findMaxHelper:
					while (true) {
						if (!remainingList.b) {
							return currentMax;
						} else {
							var next = remainingList.a;
							var rest = remainingList.b;
							if (_Utils_cmp(next.bC, currentMax.bC) > 0) {
								var $temp$currentMax = next,
									$temp$remainingList = rest;
								currentMax = $temp$currentMax;
								remainingList = $temp$remainingList;
								continue findMaxHelper;
							} else {
								var $temp$currentMax = currentMax,
									$temp$remainingList = rest;
								currentMax = $temp$currentMax;
								remainingList = $temp$remainingList;
								continue findMaxHelper;
							}
						}
					}
				});
			return $elm$core$Maybe$Just(
				A2(findMaxHelper, head, tail));
		}
	}
};
var $author$project$SR$Elements$spectatorSelectedRankingHeaderEl = F2(
	function (userInfo, r) {
		return A2(
			$mdgriffith$elm_ui$Element$el,
			$Orasund$elm_ui_framework$Framework$Heading$h5,
			$mdgriffith$elm_ui$Element$text(userInfo.dw + (' you\'re interested in joining' + (' - ' + (r.fR + (' Id no: ' + (r.A + (' . \n Which is owned by ' + (r.n3 + (' id no: ' + r.f0))))))))));
	});
var $mdgriffith$elm_ui$Internal$Model$AsRow = 0;
var $mdgriffith$elm_ui$Internal$Model$asRow = 0;
var $mdgriffith$elm_ui$Internal$Model$Padding = F5(
	function (a, b, c, d, e) {
		return {$: 0, a: a, b: b, c: c, d: d, e: e};
	});
var $mdgriffith$elm_ui$Internal$Model$Spaced = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $mdgriffith$elm_ui$Internal$Model$extractSpacingAndPadding = function (attrs) {
	return A3(
		$elm$core$List$foldr,
		F2(
			function (attr, _v0) {
				var pad = _v0.a;
				var spacing = _v0.b;
				return _Utils_Tuple2(
					function () {
						if (!pad.$) {
							var x = pad.a;
							return pad;
						} else {
							if ((attr.$ === 4) && (attr.b.$ === 7)) {
								var _v3 = attr.b;
								var name = _v3.a;
								var t = _v3.b;
								var r = _v3.c;
								var b = _v3.d;
								var l = _v3.e;
								return $elm$core$Maybe$Just(
									A5($mdgriffith$elm_ui$Internal$Model$Padding, name, t, r, b, l));
							} else {
								return $elm$core$Maybe$Nothing;
							}
						}
					}(),
					function () {
						if (!spacing.$) {
							var x = spacing.a;
							return spacing;
						} else {
							if ((attr.$ === 4) && (attr.b.$ === 5)) {
								var _v6 = attr.b;
								var name = _v6.a;
								var x = _v6.b;
								var y = _v6.c;
								return $elm$core$Maybe$Just(
									A3($mdgriffith$elm_ui$Internal$Model$Spaced, name, x, y));
							} else {
								return $elm$core$Maybe$Nothing;
							}
						}
					}());
			}),
		_Utils_Tuple2($elm$core$Maybe$Nothing, $elm$core$Maybe$Nothing),
		attrs);
};
var $mdgriffith$elm_ui$Internal$Model$paddingNameFloat = F4(
	function (top, right, bottom, left) {
		return 'pad-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(top) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(right) + ('-' + ($mdgriffith$elm_ui$Internal$Model$floatClass(bottom) + ('-' + $mdgriffith$elm_ui$Internal$Model$floatClass(left)))))));
	});
var $mdgriffith$elm_ui$Element$wrappedRow = F2(
	function (attrs, children) {
		var _v0 = $mdgriffith$elm_ui$Internal$Model$extractSpacingAndPadding(attrs);
		var padded = _v0.a;
		var spaced = _v0.b;
		if (spaced.$ === 1) {
			return A4(
				$mdgriffith$elm_ui$Internal$Model$element,
				$mdgriffith$elm_ui$Internal$Model$asRow,
				$mdgriffith$elm_ui$Internal$Model$div,
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.h4 + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.dI + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.ok)))),
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
							attrs))),
				$mdgriffith$elm_ui$Internal$Model$Unkeyed(children));
		} else {
			var _v2 = spaced.a;
			var spaceName = _v2.a;
			var x = _v2.b;
			var y = _v2.c;
			var newPadding = function () {
				if (!padded.$) {
					var _v5 = padded.a;
					var name = _v5.a;
					var t = _v5.b;
					var r = _v5.c;
					var b = _v5.d;
					var l = _v5.e;
					if ((_Utils_cmp(r, x / 2) > -1) && (_Utils_cmp(b, y / 2) > -1)) {
						var newTop = t - (y / 2);
						var newRight = r - (x / 2);
						var newLeft = l - (x / 2);
						var newBottom = b - (y / 2);
						return $elm$core$Maybe$Just(
							A2(
								$mdgriffith$elm_ui$Internal$Model$StyleClass,
								$mdgriffith$elm_ui$Internal$Flag$padding,
								A5(
									$mdgriffith$elm_ui$Internal$Model$PaddingStyle,
									A4($mdgriffith$elm_ui$Internal$Model$paddingNameFloat, newTop, newRight, newBottom, newLeft),
									newTop,
									newRight,
									newBottom,
									newLeft)));
					} else {
						return $elm$core$Maybe$Nothing;
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}();
			if (!newPadding.$) {
				var pad = newPadding.a;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$element,
					$mdgriffith$elm_ui$Internal$Model$asRow,
					$mdgriffith$elm_ui$Internal$Model$div,
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.h4 + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.dI + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.ok)))),
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$shrink),
							A2(
								$elm$core$List$cons,
								$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
								_Utils_ap(
									attrs,
									_List_fromArray(
										[pad]))))),
					$mdgriffith$elm_ui$Internal$Model$Unkeyed(children));
			} else {
				var halfY = -(y / 2);
				var halfX = -(x / 2);
				return A4(
					$mdgriffith$elm_ui$Internal$Model$element,
					$mdgriffith$elm_ui$Internal$Model$asEl,
					$mdgriffith$elm_ui$Internal$Model$div,
					attrs,
					$mdgriffith$elm_ui$Internal$Model$Unkeyed(
						_List_fromArray(
							[
								A4(
								$mdgriffith$elm_ui$Internal$Model$element,
								$mdgriffith$elm_ui$Internal$Model$asRow,
								$mdgriffith$elm_ui$Internal$Model$div,
								A2(
									$elm$core$List$cons,
									$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.h4 + (' ' + ($mdgriffith$elm_ui$Internal$Style$classes.dI + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.ok)))),
									A2(
										$elm$core$List$cons,
										$mdgriffith$elm_ui$Internal$Model$Attr(
											A2(
												$elm$html$Html$Attributes$style,
												'margin',
												$elm$core$String$fromFloat(halfY) + ('px' + (' ' + ($elm$core$String$fromFloat(halfX) + 'px'))))),
										A2(
											$elm$core$List$cons,
											$mdgriffith$elm_ui$Internal$Model$Attr(
												A2(
													$elm$html$Html$Attributes$style,
													'width',
													'calc(100% + ' + ($elm$core$String$fromInt(x) + 'px)'))),
											A2(
												$elm$core$List$cons,
												$mdgriffith$elm_ui$Internal$Model$Attr(
													A2(
														$elm$html$Html$Attributes$style,
														'height',
														'calc(100% + ' + ($elm$core$String$fromInt(y) + 'px)'))),
												A2(
													$elm$core$List$cons,
													A2(
														$mdgriffith$elm_ui$Internal$Model$StyleClass,
														$mdgriffith$elm_ui$Internal$Flag$spacing,
														A3($mdgriffith$elm_ui$Internal$Model$SpacingStyle, spaceName, x, y)),
													_List_Nil))))),
								$mdgriffith$elm_ui$Internal$Model$Unkeyed(children))
							])));
			}
		}
	});
var $author$project$Pages$Hardware$confirmJoinView = F2(
	function (userInfo, ranking) {
		return A2(
			$Orasund$elm_ui_framework$Framework$responsiveLayout,
			_List_Nil,
			A2(
				$mdgriffith$elm_ui$Element$column,
				$Orasund$elm_ui_framework$Framework$container,
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Element$wrappedRow,
						_List_Nil,
						_List_fromArray(
							[
								A2($author$project$SR$Elements$spectatorSelectedRankingHeaderEl, userInfo, ranking)
							])),
						A2(
						$mdgriffith$elm_ui$Element$el,
						$Orasund$elm_ui_framework$Framework$Heading$h5,
						$mdgriffith$elm_ui$Element$text(userInfo.dw + (' - Are you sure you want to join' + (ranking.n3 + '\'s  ranking?')))),
						A2(
						$mdgriffith$elm_ui$Element$column,
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							_Utils_ap($Orasund$elm_ui_framework$Framework$Card$simple, $Orasund$elm_ui_framework$Framework$Grid$simple)),
						_List_fromArray(
							[
								A2(
								$author$project$Pages$Hardware$infoBtn,
								'Join',
								A3(
									$author$project$Pages$Hardware$ConfirmJoin,
									ranking,
									userInfo.r9,
									A2(
										$elm$core$Maybe$withDefault,
										$author$project$Data$Ranking$emptyRank,
										$author$project$Data$Ranking$gotLowestRank(ranking.nb)).bC)),
								A2($author$project$Pages$Hardware$infoBtn, 'Cancel', $author$project$Pages$Hardware$CancelFetchedSpectator)
							]))
					])));
	});
var $author$project$Pages$Hardware$ConfirmLeaveMemberRanking = F2(
	function (a, b) {
		return {$: 56, a: a, b: b};
	});
var $author$project$SR$Elements$memberSelectedRankingHeaderEl = F2(
	function (userInfo, r) {
		return A2(
			$mdgriffith$elm_ui$Element$el,
			$Orasund$elm_ui_framework$Framework$Heading$h5,
			$mdgriffith$elm_ui$Element$text(userInfo.dw + (' you\'re a member of' + (' - ' + (r.fR + (' Id no: ' + (r.A + (' . \n Which is owned by ' + (r.n3 + (' id no: ' + r.f0))))))))));
	});
var $author$project$Pages$Hardware$confirmLeaveView = F2(
	function (userInfo, ranking) {
		return A2(
			$Orasund$elm_ui_framework$Framework$responsiveLayout,
			_List_Nil,
			A2(
				$mdgriffith$elm_ui$Element$column,
				$Orasund$elm_ui_framework$Framework$container,
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Element$wrappedRow,
						_List_Nil,
						_List_fromArray(
							[
								A2($author$project$SR$Elements$memberSelectedRankingHeaderEl, userInfo, ranking)
							])),
						A2(
						$mdgriffith$elm_ui$Element$el,
						$Orasund$elm_ui_framework$Framework$Heading$h5,
						$mdgriffith$elm_ui$Element$text(userInfo.dw + (' - Are you sure you want to leave ' + (ranking.n3 + '\'s  ranking?')))),
						A2(
						$mdgriffith$elm_ui$Element$column,
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							_Utils_ap($Orasund$elm_ui_framework$Framework$Card$simple, $Orasund$elm_ui_framework$Framework$Grid$simple)),
						_List_fromArray(
							[
								A2(
								$author$project$Pages$Hardware$infoBtn,
								'Leave',
								A2($author$project$Pages$Hardware$ConfirmLeaveMemberRanking, ranking, userInfo.r9)),
								A2($author$project$Pages$Hardware$infoBtn, 'Cancel', $author$project$Pages$Hardware$CancelFetchedMember)
							]))
					])));
	});
var $author$project$Pages$Hardware$Cancel = {$: 28};
var $author$project$Pages$Hardware$ConfirmChallenge = F2(
	function (a, b) {
		return {$: 47, a: a, b: b};
	});
var $Orasund$elm_ui_framework$Framework$Card$fill = _Utils_ap(
	$Orasund$elm_ui_framework$Framework$Card$simple,
	_List_fromArray(
		[
			$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
		]));
var $Orasund$elm_ui_framework$Framework$Heading$h6 = $Orasund$elm_ui_framework$Framework$Heading$h(6);
var $author$project$Pages$Hardware$isUserRankedHigher = F2(
	function (userInfo, ranking) {
		var userRank = A2(
			$elm$core$Maybe$map,
			function ($) {
				return $.bC;
			},
			$elm$core$List$head(
				A2(
					$elm$core$List$filter,
					function (r) {
						return _Utils_eq(r.aB.A, userInfo.r9);
					},
					ranking.nb)));
		var otherRank = A2(
			$elm$core$Maybe$map,
			function ($) {
				return $.bC;
			},
			$elm$core$List$head(
				A2(
					$elm$core$List$filter,
					function (r) {
						return !_Utils_eq(r.aB.A, userInfo.r9);
					},
					ranking.nb)));
		var _v0 = _Utils_Tuple2(userRank, otherRank);
		if ((!_v0.a.$) && (!_v0.b.$)) {
			var ur = _v0.a.a;
			var or = _v0.b.a;
			return _Utils_cmp(ur, or) < 0;
		} else {
			return false;
		}
	});
var $mdgriffith$elm_ui$Internal$Model$Paragraph = {$: 9};
var $mdgriffith$elm_ui$Element$paragraph = F2(
	function (attrs, children) {
		return A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asParagraph,
			$mdgriffith$elm_ui$Internal$Model$div,
			A2(
				$elm$core$List$cons,
				$mdgriffith$elm_ui$Internal$Model$Describe($mdgriffith$elm_ui$Internal$Model$Paragraph),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Element$spacing(5),
						attrs))),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(children));
	});
var $mdgriffith$elm_ui$Element$Border$widthXY = F2(
	function (x, y) {
		return A2(
			$mdgriffith$elm_ui$Internal$Model$StyleClass,
			$mdgriffith$elm_ui$Internal$Flag$borderWidth,
			A5(
				$mdgriffith$elm_ui$Internal$Model$BorderWidth,
				'b-' + ($elm$core$String$fromInt(x) + ('-' + $elm$core$String$fromInt(y))),
				y,
				x,
				y,
				x));
	});
var $mdgriffith$elm_ui$Element$Border$widthEach = function (_v0) {
	var bottom = _v0.oP;
	var top = _v0.rV;
	var left = _v0.p8;
	var right = _v0.rg;
	return (_Utils_eq(top, bottom) && _Utils_eq(left, right)) ? (_Utils_eq(top, right) ? $mdgriffith$elm_ui$Element$Border$width(top) : A2($mdgriffith$elm_ui$Element$Border$widthXY, left, top)) : A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$borderWidth,
		A5(
			$mdgriffith$elm_ui$Internal$Model$BorderWidth,
			'b-' + ($elm$core$String$fromInt(top) + ('-' + ($elm$core$String$fromInt(right) + ('-' + ($elm$core$String$fromInt(bottom) + ('-' + $elm$core$String$fromInt(left))))))),
			top,
			right,
			bottom,
			left));
};
var $Orasund$elm_ui_framework$Framework$Grid$section = _Utils_ap(
	$Orasund$elm_ui_framework$Framework$Grid$simple,
	_List_fromArray(
		[
			$mdgriffith$elm_ui$Element$Border$widthEach(
			{oP: 0, p8: 0, rg: 0, rV: 2}),
			$mdgriffith$elm_ui$Element$Border$color($Orasund$elm_ui_framework$Framework$Color$lightGrey),
			$mdgriffith$elm_ui$Element$paddingEach(
			{oP: 30, p8: 0, rg: 0, rV: 10})
		]));
var $author$project$Pages$Hardware$createChallengeView = F3(
	function (uinfo, rank, ranking) {
		return (!_Utils_eq(rank.aB.A, uinfo.r9)) ? ((!A2($author$project$Pages$Hardware$isUserRankedHigher, uinfo, ranking)) ? A2(
			$Orasund$elm_ui_framework$Framework$responsiveLayout,
			_List_Nil,
			A2(
				$mdgriffith$elm_ui$Element$column,
				$Orasund$elm_ui_framework$Framework$Grid$section,
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Element$el,
						$Orasund$elm_ui_framework$Framework$Heading$h6,
						$mdgriffith$elm_ui$Element$text(' Your opponent\'s details: ')),
						A2(
						$mdgriffith$elm_ui$Element$paragraph,
						_Utils_ap($Orasund$elm_ui_framework$Framework$Card$fill, $Orasund$elm_ui_framework$Framework$Color$info),
						_List_fromArray(
							[
								A2(
								$mdgriffith$elm_ui$Element$el,
								_List_Nil,
								$mdgriffith$elm_ui$Element$text(uinfo.dw + (' you are challenging ' + rank.aB.dw)))
							])),
						A2(
						$mdgriffith$elm_ui$Element$el,
						_List_Nil,
						$mdgriffith$elm_ui$Element$text('Email: ')),
						A2(
						$mdgriffith$elm_ui$Element$paragraph,
						_Utils_ap($Orasund$elm_ui_framework$Framework$Card$fill, $Orasund$elm_ui_framework$Framework$Color$info),
						_List_fromArray(
							[
								A2(
								$mdgriffith$elm_ui$Element$el,
								_List_Nil,
								$mdgriffith$elm_ui$Element$text('challenger@c.com'))
							])),
						A2(
						$mdgriffith$elm_ui$Element$el,
						_List_Nil,
						$mdgriffith$elm_ui$Element$text('Mobile: ')),
						A2(
						$mdgriffith$elm_ui$Element$paragraph,
						_Utils_ap($Orasund$elm_ui_framework$Framework$Card$fill, $Orasund$elm_ui_framework$Framework$Color$info),
						_List_fromArray(
							[
								A2(
								$mdgriffith$elm_ui$Element$el,
								_List_Nil,
								$mdgriffith$elm_ui$Element$text('challenger mobile'))
							])),
						A2(
						$mdgriffith$elm_ui$Element$column,
						_Utils_ap($Orasund$elm_ui_framework$Framework$Card$simple, $Orasund$elm_ui_framework$Framework$Grid$simple),
						_List_fromArray(
							[
								A2(
								$mdgriffith$elm_ui$Element$wrappedRow,
								$Orasund$elm_ui_framework$Framework$Grid$simple,
								_List_fromArray(
									[
										A2(
										$mdgriffith$elm_ui$Element$Input$button,
										_Utils_ap($Orasund$elm_ui_framework$Framework$Button$simple, $Orasund$elm_ui_framework$Framework$Color$simple),
										{
											I: $mdgriffith$elm_ui$Element$text('Cancel'),
											aq: $elm$core$Maybe$Just($author$project$Pages$Hardware$Cancel)
										}),
										A2(
										$mdgriffith$elm_ui$Element$Input$button,
										_Utils_ap($Orasund$elm_ui_framework$Framework$Button$simple, $Orasund$elm_ui_framework$Framework$Color$info),
										{
											I: $mdgriffith$elm_ui$Element$text('Confirm'),
											aq: $elm$core$Maybe$Just(
												A2($author$project$Pages$Hardware$ConfirmChallenge, ranking, rank))
										})
									]))
							]))
					]))) : A2(
			$Orasund$elm_ui_framework$Framework$responsiveLayout,
			_List_Nil,
			A2(
				$mdgriffith$elm_ui$Element$column,
				$Orasund$elm_ui_framework$Framework$Grid$section,
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Element$paragraph,
						_Utils_ap($Orasund$elm_ui_framework$Framework$Card$fill, $Orasund$elm_ui_framework$Framework$Color$info),
						_List_fromArray(
							[
								A2(
								$mdgriffith$elm_ui$Element$el,
								_List_Nil,
								$mdgriffith$elm_ui$Element$text(uinfo.dw + ' aim high! Challenge up '))
							])),
						A2(
						$mdgriffith$elm_ui$Element$column,
						_Utils_ap($Orasund$elm_ui_framework$Framework$Card$simple, $Orasund$elm_ui_framework$Framework$Grid$simple),
						_List_fromArray(
							[
								A2(
								$mdgriffith$elm_ui$Element$wrappedRow,
								$Orasund$elm_ui_framework$Framework$Grid$simple,
								_List_fromArray(
									[
										A2(
										$mdgriffith$elm_ui$Element$Input$button,
										_Utils_ap($Orasund$elm_ui_framework$Framework$Button$simple, $Orasund$elm_ui_framework$Framework$Color$simple),
										{
											I: $mdgriffith$elm_ui$Element$text('Cancel'),
											aq: $elm$core$Maybe$Just($author$project$Pages$Hardware$Cancel)
										})
									]))
							]))
					])))) : A2(
			$Orasund$elm_ui_framework$Framework$responsiveLayout,
			_List_Nil,
			A2(
				$mdgriffith$elm_ui$Element$column,
				$Orasund$elm_ui_framework$Framework$Grid$section,
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Element$paragraph,
						_Utils_ap($Orasund$elm_ui_framework$Framework$Card$fill, $Orasund$elm_ui_framework$Framework$Color$info),
						_List_fromArray(
							[
								A2(
								$mdgriffith$elm_ui$Element$el,
								_List_Nil,
								$mdgriffith$elm_ui$Element$text(rank.aB.dw + ' you can\'t challenge yourself! '))
							])),
						A2(
						$mdgriffith$elm_ui$Element$column,
						_Utils_ap($Orasund$elm_ui_framework$Framework$Card$simple, $Orasund$elm_ui_framework$Framework$Grid$simple),
						_List_fromArray(
							[
								A2(
								$mdgriffith$elm_ui$Element$wrappedRow,
								$Orasund$elm_ui_framework$Framework$Grid$simple,
								_List_fromArray(
									[
										A2(
										$mdgriffith$elm_ui$Element$Input$button,
										_Utils_ap($Orasund$elm_ui_framework$Framework$Button$simple, $Orasund$elm_ui_framework$Framework$Color$simple),
										{
											I: $mdgriffith$elm_ui$Element$text('Cancel'),
											aq: $elm$core$Maybe$Just($author$project$Pages$Hardware$Cancel)
										})
									]))
							]))
					])));
	});
var $author$project$Pages$Hardware$CityAddressChg = function (a) {
	return {$: 42, a: a};
};
var $author$project$Pages$Hardware$RankingNameChg = function (a) {
	return {$: 40, a: a};
};
var $author$project$Pages$Hardware$StreetAddressChg = function (a) {
	return {$: 41, a: a};
};
var $mdgriffith$elm_ui$Element$htmlAttribute = $mdgriffith$elm_ui$Internal$Model$Attr;
var $Orasund$elm_ui_framework$Framework$Input$label = _List_fromArray(
	[
		$mdgriffith$elm_ui$Element$centerX,
		$mdgriffith$elm_ui$Element$padding(10),
		$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink),
		$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill)
	]);
var $mdgriffith$elm_ui$Element$Input$Label = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $mdgriffith$elm_ui$Element$Input$OnLeft = 1;
var $mdgriffith$elm_ui$Element$Input$labelLeft = $mdgriffith$elm_ui$Element$Input$Label(1);
var $mdgriffith$elm_ui$Element$Font$alignLeft = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$fontAlignment, $mdgriffith$elm_ui$Internal$Style$classes.wf);
var $mdgriffith$elm_ui$Element$rgb = F3(
	function (r, g, b) {
		return A4($mdgriffith$elm_ui$Internal$Model$Rgba, r, g, b, 1);
	});
var $author$project$SR$Elements$colors = {
	oM: A3($mdgriffith$elm_ui$Element$rgb255, 0, 0, 0),
	mP: A3($mdgriffith$elm_ui$Element$rgb255, 2, 7, 239),
	o2: A3($mdgriffith$elm_ui$Element$rgb255, 204, 75, 75),
	o7: A3($mdgriffith$elm_ui$Element$rgb, 0, 0, 0.9),
	pH: A3($mdgriffith$elm_ui$Element$rgb255, 0, 153, 0),
	pI: A3($mdgriffith$elm_ui$Element$rgb, 0.9, 0.9, 0.9),
	p9: A3($mdgriffith$elm_ui$Element$rgb255, 0, 128, 255),
	q3: A3($mdgriffith$elm_ui$Element$rgb255, 102, 0, 102),
	q4: A3($mdgriffith$elm_ui$Element$rgb, 0.8, 0, 0),
	sk: A3($mdgriffith$elm_ui$Element$rgb255, 255, 255, 255)
};
var $author$project$Utils$Validation$Validate$isValid4to20Chars = function (str) {
	return A2(
		$elm$regex$Regex$contains,
		A2(
			$elm$core$Maybe$withDefault,
			$elm$regex$Regex$never,
			$elm$regex$Regex$fromString('(?!.*[\\.\\-\\_]{2,})^[a-zA-Z0-9\\.\\-\\_]{4,20}$')),
		str);
};
var $mdgriffith$elm_ui$Internal$Model$MoveX = function (a) {
	return {$: 0, a: a};
};
var $mdgriffith$elm_ui$Internal$Flag$moveX = $mdgriffith$elm_ui$Internal$Flag$flag(25);
var $mdgriffith$elm_ui$Element$moveLeft = function (x) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$TransformComponent,
		$mdgriffith$elm_ui$Internal$Flag$moveX,
		$mdgriffith$elm_ui$Internal$Model$MoveX(-x));
};
var $author$project$SR$Elements$ladderCityValidation = function (ranking) {
	return $author$project$Utils$Validation$Validate$isValid4to20Chars(ranking.dG.h0) ? A2(
		$mdgriffith$elm_ui$Element$el,
		_Utils_ap(
			A2(
				$elm$core$List$append,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$htmlAttribute(
						$elm$html$Html$Attributes$id('laddercityValidMsg'))
					]),
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$Font$color($author$project$SR$Elements$colors.pH),
						$mdgriffith$elm_ui$Element$Font$alignLeft
					])),
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$moveLeft(1.0)
				])),
		$mdgriffith$elm_ui$Element$text('City name OK!')) : A2(
		$mdgriffith$elm_ui$Element$el,
		_Utils_ap(
			A2(
				$elm$core$List$append,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$htmlAttribute(
						$elm$html$Html$Attributes$id('laddercityValidMsg'))
					]),
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$Font$color($author$project$SR$Elements$colors.mP),
						$mdgriffith$elm_ui$Element$Font$alignLeft
					])),
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$moveLeft(0.0)
				])),
		$mdgriffith$elm_ui$Element$text('If entered, must be unique (4-20 continuous chars)'));
};
var $author$project$SR$Elements$ladderNameValidation = function (ranking) {
	return $author$project$Utils$Validation$Validate$isValid4to20Chars(ranking.fR) ? A2(
		$mdgriffith$elm_ui$Element$el,
		_Utils_ap(
			A2(
				$elm$core$List$append,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$htmlAttribute(
						$elm$html$Html$Attributes$id('laddernameValidMsg'))
					]),
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$Font$color($author$project$SR$Elements$colors.pH),
						$mdgriffith$elm_ui$Element$Font$alignLeft
					])),
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$moveLeft(1.0)
				])),
		$mdgriffith$elm_ui$Element$text('Ranking name OK!')) : A2(
		$mdgriffith$elm_ui$Element$el,
		_Utils_ap(
			A2(
				$elm$core$List$append,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$htmlAttribute(
						$elm$html$Html$Attributes$id('laddernameValidMsg'))
					]),
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$Font$color($author$project$SR$Elements$colors.q4),
						$mdgriffith$elm_ui$Element$Font$alignLeft
					])),
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$moveLeft(0.0)
				])),
		$mdgriffith$elm_ui$Element$text('Must be unique (4-20 continuous chars)'));
};
var $author$project$SR$Elements$ladderStreetValidation = function (ranking) {
	return $author$project$Utils$Validation$Validate$isValid4to20Chars(ranking.dG.lH) ? A2(
		$mdgriffith$elm_ui$Element$el,
		_Utils_ap(
			A2(
				$elm$core$List$append,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$htmlAttribute(
						$elm$html$Html$Attributes$id('ladderstreetValidMsg'))
					]),
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$Font$color($author$project$SR$Elements$colors.pH),
						$mdgriffith$elm_ui$Element$Font$alignLeft
					])),
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$moveLeft(1.0)
				])),
		$mdgriffith$elm_ui$Element$text('Street name OK!')) : A2(
		$mdgriffith$elm_ui$Element$el,
		_Utils_ap(
			A2(
				$elm$core$List$append,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$htmlAttribute(
						$elm$html$Html$Attributes$id('ladderstreetValidMsg'))
					]),
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$Font$color($author$project$SR$Elements$colors.mP),
						$mdgriffith$elm_ui$Element$Font$alignLeft
					])),
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$moveLeft(0.0)
				])),
		$mdgriffith$elm_ui$Element$text('If entered, must be unique (4-20 continuous chars)'));
};
var $mdgriffith$elm_ui$Element$Input$Placeholder = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $mdgriffith$elm_ui$Element$Input$placeholder = $mdgriffith$elm_ui$Element$Input$Placeholder;
var $author$project$Pages$Hardware$CancelCreateNewRanking = {$: 32};
var $author$project$Pages$Hardware$ConfirmNewRanking = F2(
	function (a, b) {
		return {$: 43, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Model$Focus = 0;
var $mdgriffith$elm_ui$Internal$Flag$focus = $mdgriffith$elm_ui$Internal$Flag$flag(31);
var $mdgriffith$elm_ui$Element$focused = function (decs) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$focus,
		A2(
			$mdgriffith$elm_ui$Internal$Model$PseudoSelector,
			0,
			$mdgriffith$elm_ui$Internal$Model$unwrapDecorations(decs)));
};
var $Orasund$elm_ui_framework$Framework$Color$disabled = _Utils_ap(
	$Orasund$elm_ui_framework$Framework$Color$simple,
	_List_fromArray(
		[
			$mdgriffith$elm_ui$Element$Font$color($Orasund$elm_ui_framework$Framework$Color$grey),
			$mdgriffith$elm_ui$Element$mouseOver(_List_Nil),
			$mdgriffith$elm_ui$Element$focused(_List_Nil),
			$mdgriffith$elm_ui$Element$htmlAttribute(
			A2($elm$html$Html$Attributes$style, 'cursor', 'not-allowed'))
		]));
var $author$project$Pages$Hardware$enableButton = function (enable) {
	return enable ? $Orasund$elm_ui_framework$Framework$Color$info : $Orasund$elm_ui_framework$Framework$Color$disabled;
};
var $author$project$Pages$Hardware$isValidatedForAllLadderDetailsInput = function (ranking) {
	return $author$project$Utils$Validation$Validate$isValid4to20Chars(ranking.fR) && (((ranking.dG.lH === '') || $author$project$Utils$Validation$Validate$isValid4to20Chars(ranking.dG.lH)) && ((ranking.dG.h0 === '') || $author$project$Utils$Validation$Validate$isValid4to20Chars(ranking.dG.h0)));
};
var $Orasund$elm_ui_framework$Framework$Color$yellow = A3($mdgriffith$elm_ui$Element$rgb255, 255, 221, 87);
var $Orasund$elm_ui_framework$Framework$Color$warning = _List_fromArray(
	[
		$mdgriffith$elm_ui$Element$Background$color($Orasund$elm_ui_framework$Framework$Color$yellow),
		$mdgriffith$elm_ui$Element$Border$color($Orasund$elm_ui_framework$Framework$Color$yellow)
	]);
var $author$project$SR$Elements$missingDataPara = A2(
	$mdgriffith$elm_ui$Element$paragraph,
	_Utils_ap($Orasund$elm_ui_framework$Framework$Card$fill, $Orasund$elm_ui_framework$Framework$Color$warning),
	_List_fromArray(
		[
			A2(
			$mdgriffith$elm_ui$Element$el,
			_List_fromArray(
				[$mdgriffith$elm_ui$Element$Font$bold]),
			$mdgriffith$elm_ui$Element$text('Please note: ')),
			A2(
			$mdgriffith$elm_ui$Element$paragraph,
			_List_Nil,
			$elm$core$List$singleton(
				$mdgriffith$elm_ui$Element$text('Essential data is missing!')))
		]));
var $author$project$SR$Elements$warningParagraph = A2(
	$mdgriffith$elm_ui$Element$paragraph,
	_Utils_ap($Orasund$elm_ui_framework$Framework$Card$fill, $Orasund$elm_ui_framework$Framework$Color$warning),
	_List_fromArray(
		[
			A2(
			$mdgriffith$elm_ui$Element$el,
			_List_fromArray(
				[$mdgriffith$elm_ui$Element$Font$bold]),
			$mdgriffith$elm_ui$Element$text('Please note: ')),
			A2(
			$mdgriffith$elm_ui$Element$paragraph,
			_List_Nil,
			$elm$core$List$singleton(
				$mdgriffith$elm_ui$Element$text('Can all your members find the venue (if there is one)?')))
		]));
var $author$project$Pages$Hardware$rankingDetailsConfirmPanel = F2(
	function (ranking, userInfo) {
		return $author$project$Pages$Hardware$isValidatedForAllLadderDetailsInput(ranking) ? A2(
			$mdgriffith$elm_ui$Element$column,
			$Orasund$elm_ui_framework$Framework$Grid$section,
			_List_fromArray(
				[
					((ranking.dG.lH === '') && (ranking.dG.h0 === '')) ? $author$project$SR$Elements$warningParagraph : $mdgriffith$elm_ui$Element$text('Click to continue ...'),
					A2(
					$mdgriffith$elm_ui$Element$column,
					_Utils_ap($Orasund$elm_ui_framework$Framework$Card$simple, $Orasund$elm_ui_framework$Framework$Grid$simple),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Element$wrappedRow,
							$Orasund$elm_ui_framework$Framework$Grid$simple,
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Element$Input$button,
									_Utils_ap($Orasund$elm_ui_framework$Framework$Button$simple, $Orasund$elm_ui_framework$Framework$Color$info),
									{
										I: $mdgriffith$elm_ui$Element$text('Cancel'),
										aq: $elm$core$Maybe$Just($author$project$Pages$Hardware$CancelCreateNewRanking)
									}),
									A2(
									$mdgriffith$elm_ui$Element$Input$button,
									_Utils_ap(
										$Orasund$elm_ui_framework$Framework$Button$simple,
										$author$project$Pages$Hardware$enableButton(
											$author$project$Pages$Hardware$isValidatedForAllLadderDetailsInput(ranking))),
									{
										I: $mdgriffith$elm_ui$Element$text('Confirm'),
										aq: $elm$core$Maybe$Just(
											A2(
												$author$project$Pages$Hardware$ConfirmNewRanking,
												ranking,
												$author$project$Data$User$Registered(userInfo)))
									})
								]))
						]))
				])) : A2(
			$mdgriffith$elm_ui$Element$column,
			$Orasund$elm_ui_framework$Framework$Grid$section,
			_List_fromArray(
				[
					$author$project$SR$Elements$missingDataPara,
					A2(
					$mdgriffith$elm_ui$Element$el,
					$Orasund$elm_ui_framework$Framework$Heading$h6,
					$mdgriffith$elm_ui$Element$text('Click to continue ...')),
					A2(
					$mdgriffith$elm_ui$Element$column,
					_Utils_ap($Orasund$elm_ui_framework$Framework$Card$simple, $Orasund$elm_ui_framework$Framework$Grid$simple),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Element$wrappedRow,
							$Orasund$elm_ui_framework$Framework$Grid$simple,
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Element$Input$button,
									_Utils_ap($Orasund$elm_ui_framework$Framework$Button$simple, $Orasund$elm_ui_framework$Framework$Color$info),
									{
										I: $mdgriffith$elm_ui$Element$text('Cancel'),
										aq: $elm$core$Maybe$Just($author$project$Pages$Hardware$CancelCreateNewRanking)
									})
								]))
						]))
				]));
	});
var $Orasund$elm_ui_framework$Framework$Input$simple = _List_fromArray(
	[
		$mdgriffith$elm_ui$Element$Background$color($Orasund$elm_ui_framework$Framework$Color$lighterGrey),
		$mdgriffith$elm_ui$Element$Font$color($Orasund$elm_ui_framework$Framework$Color$darkerGrey)
	]);
var $mdgriffith$elm_ui$Element$Input$TextInputNode = function (a) {
	return {$: 0, a: a};
};
var $mdgriffith$elm_ui$Element$Input$TextArea = {$: 1};
var $mdgriffith$elm_ui$Internal$Model$LivePolite = {$: 6};
var $mdgriffith$elm_ui$Element$Region$announce = $mdgriffith$elm_ui$Internal$Model$Describe($mdgriffith$elm_ui$Internal$Model$LivePolite);
var $mdgriffith$elm_ui$Element$Input$applyLabel = F3(
	function (attrs, label, input) {
		if (label.$ === 1) {
			var labelText = label.a;
			return A4(
				$mdgriffith$elm_ui$Internal$Model$element,
				$mdgriffith$elm_ui$Internal$Model$asColumn,
				$mdgriffith$elm_ui$Internal$Model$NodeName('label'),
				attrs,
				$mdgriffith$elm_ui$Internal$Model$Unkeyed(
					_List_fromArray(
						[input])));
		} else {
			var position = label.a;
			var labelAttrs = label.b;
			var labelChild = label.c;
			var labelElement = A4(
				$mdgriffith$elm_ui$Internal$Model$element,
				$mdgriffith$elm_ui$Internal$Model$asEl,
				$mdgriffith$elm_ui$Internal$Model$div,
				labelAttrs,
				$mdgriffith$elm_ui$Internal$Model$Unkeyed(
					_List_fromArray(
						[labelChild])));
			switch (position) {
				case 2:
					return A4(
						$mdgriffith$elm_ui$Internal$Model$element,
						$mdgriffith$elm_ui$Internal$Model$asColumn,
						$mdgriffith$elm_ui$Internal$Model$NodeName('label'),
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.m8),
							attrs),
						$mdgriffith$elm_ui$Internal$Model$Unkeyed(
							_List_fromArray(
								[labelElement, input])));
				case 3:
					return A4(
						$mdgriffith$elm_ui$Internal$Model$element,
						$mdgriffith$elm_ui$Internal$Model$asColumn,
						$mdgriffith$elm_ui$Internal$Model$NodeName('label'),
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.m8),
							attrs),
						$mdgriffith$elm_ui$Internal$Model$Unkeyed(
							_List_fromArray(
								[input, labelElement])));
				case 0:
					return A4(
						$mdgriffith$elm_ui$Internal$Model$element,
						$mdgriffith$elm_ui$Internal$Model$asRow,
						$mdgriffith$elm_ui$Internal$Model$NodeName('label'),
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.m8),
							attrs),
						$mdgriffith$elm_ui$Internal$Model$Unkeyed(
							_List_fromArray(
								[input, labelElement])));
				default:
					return A4(
						$mdgriffith$elm_ui$Internal$Model$element,
						$mdgriffith$elm_ui$Internal$Model$asRow,
						$mdgriffith$elm_ui$Internal$Model$NodeName('label'),
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.m8),
							attrs),
						$mdgriffith$elm_ui$Internal$Model$Unkeyed(
							_List_fromArray(
								[labelElement, input])));
			}
		}
	});
var $mdgriffith$elm_ui$Element$Input$autofill = A2(
	$elm$core$Basics$composeL,
	$mdgriffith$elm_ui$Internal$Model$Attr,
	$elm$html$Html$Attributes$attribute('autocomplete'));
var $mdgriffith$elm_ui$Internal$Model$Behind = 5;
var $mdgriffith$elm_ui$Element$createNearby = F2(
	function (loc, element) {
		if (element.$ === 3) {
			return $mdgriffith$elm_ui$Internal$Model$NoAttribute;
		} else {
			return A2($mdgriffith$elm_ui$Internal$Model$Nearby, loc, element);
		}
	});
var $mdgriffith$elm_ui$Element$behindContent = function (element) {
	return A2($mdgriffith$elm_ui$Element$createNearby, 5, element);
};
var $mdgriffith$elm_ui$Internal$Model$MoveY = function (a) {
	return {$: 1, a: a};
};
var $mdgriffith$elm_ui$Internal$Flag$moveY = $mdgriffith$elm_ui$Internal$Flag$flag(26);
var $mdgriffith$elm_ui$Element$moveUp = function (y) {
	return A2(
		$mdgriffith$elm_ui$Internal$Model$TransformComponent,
		$mdgriffith$elm_ui$Internal$Flag$moveY,
		$mdgriffith$elm_ui$Internal$Model$MoveY(-y));
};
var $mdgriffith$elm_ui$Element$Input$calcMoveToCompensateForPadding = function (attrs) {
	var gatherSpacing = F2(
		function (attr, found) {
			if ((attr.$ === 4) && (attr.b.$ === 5)) {
				var _v2 = attr.b;
				var x = _v2.b;
				var y = _v2.c;
				if (found.$ === 1) {
					return $elm$core$Maybe$Just(y);
				} else {
					return found;
				}
			} else {
				return found;
			}
		});
	var _v0 = A3($elm$core$List$foldr, gatherSpacing, $elm$core$Maybe$Nothing, attrs);
	if (_v0.$ === 1) {
		return $mdgriffith$elm_ui$Internal$Model$NoAttribute;
	} else {
		var vSpace = _v0.a;
		return $mdgriffith$elm_ui$Element$moveUp(
			$elm$core$Basics$floor(vSpace / 2));
	}
};
var $mdgriffith$elm_ui$Internal$Flag$overflow = $mdgriffith$elm_ui$Internal$Flag$flag(20);
var $mdgriffith$elm_ui$Element$clip = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$overflow, $mdgriffith$elm_ui$Internal$Style$classes.s9);
var $mdgriffith$elm_ui$Element$Input$darkGrey = A3($mdgriffith$elm_ui$Element$rgb, 186 / 255, 189 / 255, 182 / 255);
var $mdgriffith$elm_ui$Element$Input$defaultTextPadding = A2($mdgriffith$elm_ui$Element$paddingXY, 12, 12);
var $mdgriffith$elm_ui$Element$Input$white = A3($mdgriffith$elm_ui$Element$rgb, 1, 1, 1);
var $mdgriffith$elm_ui$Element$Input$defaultTextBoxStyle = _List_fromArray(
	[
		$mdgriffith$elm_ui$Element$Input$defaultTextPadding,
		$mdgriffith$elm_ui$Element$Border$rounded(3),
		$mdgriffith$elm_ui$Element$Border$color($mdgriffith$elm_ui$Element$Input$darkGrey),
		$mdgriffith$elm_ui$Element$Background$color($mdgriffith$elm_ui$Element$Input$white),
		$mdgriffith$elm_ui$Element$Border$width(1),
		$mdgriffith$elm_ui$Element$spacing(5),
		$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
		$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$shrink)
	]);
var $mdgriffith$elm_ui$Element$Input$getHeight = function (attr) {
	if (attr.$ === 8) {
		var h = attr.a;
		return $elm$core$Maybe$Just(h);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $mdgriffith$elm_ui$Internal$Model$Label = function (a) {
	return {$: 5, a: a};
};
var $mdgriffith$elm_ui$Element$Input$hiddenLabelAttribute = function (label) {
	if (label.$ === 1) {
		var textLabel = label.a;
		return $mdgriffith$elm_ui$Internal$Model$Describe(
			$mdgriffith$elm_ui$Internal$Model$Label(textLabel));
	} else {
		return $mdgriffith$elm_ui$Internal$Model$NoAttribute;
	}
};
var $mdgriffith$elm_ui$Internal$Model$InFront = 4;
var $mdgriffith$elm_ui$Element$inFront = function (element) {
	return A2($mdgriffith$elm_ui$Element$createNearby, 4, element);
};
var $mdgriffith$elm_ui$Element$Input$isConstrained = function (len) {
	isConstrained:
	while (true) {
		switch (len.$) {
			case 1:
				return false;
			case 0:
				return true;
			case 2:
				return true;
			case 3:
				var l = len.b;
				var $temp$len = l;
				len = $temp$len;
				continue isConstrained;
			default:
				var l = len.b;
				return true;
		}
	}
};
var $mdgriffith$elm_ui$Element$Input$isHiddenLabel = function (label) {
	if (label.$ === 1) {
		return true;
	} else {
		return false;
	}
};
var $mdgriffith$elm_ui$Element$Input$isStacked = function (label) {
	if (!label.$) {
		var loc = label.a;
		switch (loc) {
			case 0:
				return false;
			case 1:
				return false;
			case 2:
				return true;
			default:
				return true;
		}
	} else {
		return true;
	}
};
var $mdgriffith$elm_ui$Element$Input$negateBox = function (box) {
	return {oP: -box.oP, p8: -box.p8, rg: -box.rg, rV: -box.rV};
};
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 1, a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $mdgriffith$elm_ui$Element$Input$isFill = function (len) {
	isFill:
	while (true) {
		switch (len.$) {
			case 2:
				return true;
			case 1:
				return false;
			case 0:
				return false;
			case 3:
				var l = len.b;
				var $temp$len = l;
				len = $temp$len;
				continue isFill;
			default:
				var l = len.b;
				var $temp$len = l;
				len = $temp$len;
				continue isFill;
		}
	}
};
var $mdgriffith$elm_ui$Element$Input$isPixel = function (len) {
	isPixel:
	while (true) {
		switch (len.$) {
			case 1:
				return false;
			case 0:
				return true;
			case 2:
				return false;
			case 3:
				var l = len.b;
				var $temp$len = l;
				len = $temp$len;
				continue isPixel;
			default:
				var l = len.b;
				var $temp$len = l;
				len = $temp$len;
				continue isPixel;
		}
	}
};
var $mdgriffith$elm_ui$Element$Input$redistributeOver = F4(
	function (isMultiline, stacked, attr, els) {
		switch (attr.$) {
			case 9:
				return _Utils_update(
					els,
					{
						y: A2($elm$core$List$cons, attr, els.y)
					});
			case 7:
				var width = attr.a;
				return $mdgriffith$elm_ui$Element$Input$isFill(width) ? _Utils_update(
					els,
					{
						_: A2($elm$core$List$cons, attr, els._),
						az: A2($elm$core$List$cons, attr, els.az),
						y: A2($elm$core$List$cons, attr, els.y)
					}) : (stacked ? _Utils_update(
					els,
					{
						_: A2($elm$core$List$cons, attr, els._)
					}) : _Utils_update(
					els,
					{
						y: A2($elm$core$List$cons, attr, els.y)
					}));
			case 8:
				var height = attr.a;
				return (!stacked) ? _Utils_update(
					els,
					{
						_: A2($elm$core$List$cons, attr, els._),
						y: A2($elm$core$List$cons, attr, els.y)
					}) : ($mdgriffith$elm_ui$Element$Input$isFill(height) ? _Utils_update(
					els,
					{
						_: A2($elm$core$List$cons, attr, els._),
						y: A2($elm$core$List$cons, attr, els.y)
					}) : ($mdgriffith$elm_ui$Element$Input$isPixel(height) ? _Utils_update(
					els,
					{
						y: A2($elm$core$List$cons, attr, els.y)
					}) : _Utils_update(
					els,
					{
						y: A2($elm$core$List$cons, attr, els.y)
					})));
			case 6:
				return _Utils_update(
					els,
					{
						_: A2($elm$core$List$cons, attr, els._)
					});
			case 5:
				return _Utils_update(
					els,
					{
						_: A2($elm$core$List$cons, attr, els._)
					});
			case 4:
				switch (attr.b.$) {
					case 5:
						var _v1 = attr.b;
						return _Utils_update(
							els,
							{
								_: A2($elm$core$List$cons, attr, els._),
								az: A2($elm$core$List$cons, attr, els.az),
								y: A2($elm$core$List$cons, attr, els.y),
								g0: A2($elm$core$List$cons, attr, els.g0)
							});
					case 7:
						var cls = attr.a;
						var _v2 = attr.b;
						var pad = _v2.a;
						var t = _v2.b;
						var r = _v2.c;
						var b = _v2.d;
						var l = _v2.e;
						if (isMultiline) {
							return _Utils_update(
								els,
								{
									bl: A2($elm$core$List$cons, attr, els.bl),
									y: A2($elm$core$List$cons, attr, els.y)
								});
						} else {
							var newTop = t - A2($elm$core$Basics$min, t, b);
							var newLineHeight = $mdgriffith$elm_ui$Element$htmlAttribute(
								A2(
									$elm$html$Html$Attributes$style,
									'line-height',
									'calc(1.0em + ' + ($elm$core$String$fromFloat(
										2 * A2($elm$core$Basics$min, t, b)) + 'px)')));
							var newHeight = $mdgriffith$elm_ui$Element$htmlAttribute(
								A2(
									$elm$html$Html$Attributes$style,
									'height',
									'calc(1.0em + ' + ($elm$core$String$fromFloat(
										2 * A2($elm$core$Basics$min, t, b)) + 'px)')));
							var newBottom = b - A2($elm$core$Basics$min, t, b);
							var reducedVerticalPadding = A2(
								$mdgriffith$elm_ui$Internal$Model$StyleClass,
								$mdgriffith$elm_ui$Internal$Flag$padding,
								A5(
									$mdgriffith$elm_ui$Internal$Model$PaddingStyle,
									A4($mdgriffith$elm_ui$Internal$Model$paddingNameFloat, newTop, r, newBottom, l),
									newTop,
									r,
									newBottom,
									l));
							return _Utils_update(
								els,
								{
									bl: A2($elm$core$List$cons, attr, els.bl),
									az: A2(
										$elm$core$List$cons,
										newHeight,
										A2($elm$core$List$cons, newLineHeight, els.az)),
									y: A2($elm$core$List$cons, reducedVerticalPadding, els.y)
								});
						}
					case 6:
						var _v3 = attr.b;
						return _Utils_update(
							els,
							{
								bl: A2($elm$core$List$cons, attr, els.bl),
								y: A2($elm$core$List$cons, attr, els.y)
							});
					case 10:
						return _Utils_update(
							els,
							{
								bl: A2($elm$core$List$cons, attr, els.bl),
								y: A2($elm$core$List$cons, attr, els.y)
							});
					case 2:
						return _Utils_update(
							els,
							{
								_: A2($elm$core$List$cons, attr, els._)
							});
					case 1:
						var _v4 = attr.b;
						return _Utils_update(
							els,
							{
								_: A2($elm$core$List$cons, attr, els._)
							});
					default:
						var flag = attr.a;
						var cls = attr.b;
						return _Utils_update(
							els,
							{
								y: A2($elm$core$List$cons, attr, els.y)
							});
				}
			case 0:
				return els;
			case 1:
				var a = attr.a;
				return _Utils_update(
					els,
					{
						az: A2($elm$core$List$cons, attr, els.az)
					});
			case 2:
				return _Utils_update(
					els,
					{
						az: A2($elm$core$List$cons, attr, els.az)
					});
			case 3:
				return _Utils_update(
					els,
					{
						y: A2($elm$core$List$cons, attr, els.y)
					});
			default:
				return _Utils_update(
					els,
					{
						az: A2($elm$core$List$cons, attr, els.az)
					});
		}
	});
var $mdgriffith$elm_ui$Element$Input$redistribute = F3(
	function (isMultiline, stacked, attrs) {
		return function (redist) {
			return {
				bl: $elm$core$List$reverse(redist.bl),
				_: $elm$core$List$reverse(redist._),
				az: $elm$core$List$reverse(redist.az),
				y: $elm$core$List$reverse(redist.y),
				g0: $elm$core$List$reverse(redist.g0)
			};
		}(
			A3(
				$elm$core$List$foldl,
				A2($mdgriffith$elm_ui$Element$Input$redistributeOver, isMultiline, stacked),
				{bl: _List_Nil, _: _List_Nil, az: _List_Nil, y: _List_Nil, g0: _List_Nil},
				attrs));
	});
var $mdgriffith$elm_ui$Element$Input$renderBox = function (_v0) {
	var top = _v0.rV;
	var right = _v0.rg;
	var bottom = _v0.oP;
	var left = _v0.p8;
	return $elm$core$String$fromInt(top) + ('px ' + ($elm$core$String$fromInt(right) + ('px ' + ($elm$core$String$fromInt(bottom) + ('px ' + ($elm$core$String$fromInt(left) + 'px'))))));
};
var $mdgriffith$elm_ui$Internal$Model$Transparency = F2(
	function (a, b) {
		return {$: 12, a: a, b: b};
	});
var $mdgriffith$elm_ui$Internal$Flag$transparency = $mdgriffith$elm_ui$Internal$Flag$flag(0);
var $mdgriffith$elm_ui$Element$alpha = function (o) {
	var transparency = function (x) {
		return 1 - x;
	}(
		A2(
			$elm$core$Basics$min,
			1.0,
			A2($elm$core$Basics$max, 0.0, o)));
	return A2(
		$mdgriffith$elm_ui$Internal$Model$StyleClass,
		$mdgriffith$elm_ui$Internal$Flag$transparency,
		A2(
			$mdgriffith$elm_ui$Internal$Model$Transparency,
			'transparency-' + $mdgriffith$elm_ui$Internal$Model$floatClass(transparency),
			transparency));
};
var $mdgriffith$elm_ui$Element$Input$charcoal = A3($mdgriffith$elm_ui$Element$rgb, 136 / 255, 138 / 255, 133 / 255);
var $mdgriffith$elm_ui$Element$Input$renderPlaceholder = F3(
	function (_v0, forPlaceholder, on) {
		var placeholderAttrs = _v0.a;
		var placeholderEl = _v0.b;
		return A2(
			$mdgriffith$elm_ui$Element$el,
			_Utils_ap(
				forPlaceholder,
				_Utils_ap(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Font$color($mdgriffith$elm_ui$Element$Input$charcoal),
							$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.qx + (' ' + $mdgriffith$elm_ui$Internal$Style$classes.vd)),
							$mdgriffith$elm_ui$Element$clip,
							$mdgriffith$elm_ui$Element$Border$color(
							A4($mdgriffith$elm_ui$Element$rgba, 0, 0, 0, 0)),
							$mdgriffith$elm_ui$Element$Background$color(
							A4($mdgriffith$elm_ui$Element$rgba, 0, 0, 0, 0)),
							$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							$mdgriffith$elm_ui$Element$alpha(
							on ? 1 : 0)
						]),
					placeholderAttrs)),
			placeholderEl);
	});
var $mdgriffith$elm_ui$Element$scrollbarY = A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$overflow, $mdgriffith$elm_ui$Internal$Style$classes.vJ);
var $elm$html$Html$Attributes$spellcheck = $elm$html$Html$Attributes$boolProperty('spellcheck');
var $mdgriffith$elm_ui$Element$Input$spellcheck = A2($elm$core$Basics$composeL, $mdgriffith$elm_ui$Internal$Model$Attr, $elm$html$Html$Attributes$spellcheck);
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $mdgriffith$elm_ui$Internal$Model$unstyled = A2($elm$core$Basics$composeL, $mdgriffith$elm_ui$Internal$Model$Unstyled, $elm$core$Basics$always);
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $mdgriffith$elm_ui$Element$Input$value = A2($elm$core$Basics$composeL, $mdgriffith$elm_ui$Internal$Model$Attr, $elm$html$Html$Attributes$value);
var $mdgriffith$elm_ui$Element$Input$textHelper = F3(
	function (textInput, attrs, textOptions) {
		var withDefaults = _Utils_ap($mdgriffith$elm_ui$Element$Input$defaultTextBoxStyle, attrs);
		var redistributed = A3(
			$mdgriffith$elm_ui$Element$Input$redistribute,
			_Utils_eq(textInput.S, $mdgriffith$elm_ui$Element$Input$TextArea),
			$mdgriffith$elm_ui$Element$Input$isStacked(textOptions.I),
			withDefaults);
		var onlySpacing = function (attr) {
			if ((attr.$ === 4) && (attr.b.$ === 5)) {
				var _v9 = attr.b;
				return true;
			} else {
				return false;
			}
		};
		var heightConstrained = function () {
			var _v7 = textInput.S;
			if (!_v7.$) {
				var inputType = _v7.a;
				return false;
			} else {
				return A2(
					$elm$core$Maybe$withDefault,
					false,
					A2(
						$elm$core$Maybe$map,
						$mdgriffith$elm_ui$Element$Input$isConstrained,
						$elm$core$List$head(
							$elm$core$List$reverse(
								A2($elm$core$List$filterMap, $mdgriffith$elm_ui$Element$Input$getHeight, withDefaults)))));
			}
		}();
		var getPadding = function (attr) {
			if ((attr.$ === 4) && (attr.b.$ === 7)) {
				var cls = attr.a;
				var _v6 = attr.b;
				var pad = _v6.a;
				var t = _v6.b;
				var r = _v6.c;
				var b = _v6.d;
				var l = _v6.e;
				return $elm$core$Maybe$Just(
					{
						oP: A2(
							$elm$core$Basics$max,
							0,
							$elm$core$Basics$floor(b - 3)),
						p8: A2(
							$elm$core$Basics$max,
							0,
							$elm$core$Basics$floor(l - 3)),
						rg: A2(
							$elm$core$Basics$max,
							0,
							$elm$core$Basics$floor(r - 3)),
						rV: A2(
							$elm$core$Basics$max,
							0,
							$elm$core$Basics$floor(t - 3))
					});
			} else {
				return $elm$core$Maybe$Nothing;
			}
		};
		var parentPadding = A2(
			$elm$core$Maybe$withDefault,
			{oP: 0, p8: 0, rg: 0, rV: 0},
			$elm$core$List$head(
				$elm$core$List$reverse(
					A2($elm$core$List$filterMap, getPadding, withDefaults))));
		var inputElement = A4(
			$mdgriffith$elm_ui$Internal$Model$element,
			$mdgriffith$elm_ui$Internal$Model$asEl,
			function () {
				var _v3 = textInput.S;
				if (!_v3.$) {
					var inputType = _v3.a;
					return $mdgriffith$elm_ui$Internal$Model$NodeName('input');
				} else {
					return $mdgriffith$elm_ui$Internal$Model$NodeName('textarea');
				}
			}(),
			_Utils_ap(
				function () {
					var _v4 = textInput.S;
					if (!_v4.$) {
						var inputType = _v4.a;
						return _List_fromArray(
							[
								$mdgriffith$elm_ui$Internal$Model$Attr(
								$elm$html$Html$Attributes$type_(inputType)),
								$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.us)
							]);
					} else {
						return _List_fromArray(
							[
								$mdgriffith$elm_ui$Element$clip,
								$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
								$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.uo),
								$mdgriffith$elm_ui$Element$Input$calcMoveToCompensateForPadding(withDefaults),
								$mdgriffith$elm_ui$Element$paddingEach(parentPadding),
								$mdgriffith$elm_ui$Internal$Model$Attr(
								A2(
									$elm$html$Html$Attributes$style,
									'margin',
									$mdgriffith$elm_ui$Element$Input$renderBox(
										$mdgriffith$elm_ui$Element$Input$negateBox(parentPadding)))),
								$mdgriffith$elm_ui$Internal$Model$Attr(
								A2($elm$html$Html$Attributes$style, 'box-sizing', 'content-box'))
							]);
					}
				}(),
				_Utils_ap(
					_List_fromArray(
						[
							$mdgriffith$elm_ui$Element$Input$value(textOptions.dD),
							$mdgriffith$elm_ui$Internal$Model$Attr(
							$elm$html$Html$Events$onInput(textOptions.dx)),
							$mdgriffith$elm_ui$Element$Input$hiddenLabelAttribute(textOptions.I),
							$mdgriffith$elm_ui$Element$Input$spellcheck(textInput.c5),
							A2(
							$elm$core$Maybe$withDefault,
							$mdgriffith$elm_ui$Internal$Model$NoAttribute,
							A2($elm$core$Maybe$map, $mdgriffith$elm_ui$Element$Input$autofill, textInput.bP))
						]),
					redistributed.az)),
			$mdgriffith$elm_ui$Internal$Model$Unkeyed(_List_Nil));
		var wrappedInput = function () {
			var _v0 = textInput.S;
			if (_v0.$ === 1) {
				return A4(
					$mdgriffith$elm_ui$Internal$Model$element,
					$mdgriffith$elm_ui$Internal$Model$asEl,
					$mdgriffith$elm_ui$Internal$Model$div,
					_Utils_ap(
						(heightConstrained ? $elm$core$List$cons($mdgriffith$elm_ui$Element$scrollbarY) : $elm$core$Basics$identity)(
							_List_fromArray(
								[
									$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
									A2($elm$core$List$any, $mdgriffith$elm_ui$Element$Input$hasFocusStyle, withDefaults) ? $mdgriffith$elm_ui$Internal$Model$NoAttribute : $mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.pv),
									$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.ur)
								])),
						redistributed.y),
					$mdgriffith$elm_ui$Internal$Model$Unkeyed(
						_List_fromArray(
							[
								A4(
								$mdgriffith$elm_ui$Internal$Model$element,
								$mdgriffith$elm_ui$Internal$Model$asParagraph,
								$mdgriffith$elm_ui$Internal$Model$div,
								A2(
									$elm$core$List$cons,
									$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
									A2(
										$elm$core$List$cons,
										$mdgriffith$elm_ui$Element$height($mdgriffith$elm_ui$Element$fill),
										A2(
											$elm$core$List$cons,
											$mdgriffith$elm_ui$Element$inFront(inputElement),
											A2(
												$elm$core$List$cons,
												$mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.uq),
												redistributed.g0)))),
								$mdgriffith$elm_ui$Internal$Model$Unkeyed(
									function () {
										if (textOptions.dD === '') {
											var _v1 = textOptions.dy;
											if (_v1.$ === 1) {
												return _List_fromArray(
													[
														$mdgriffith$elm_ui$Element$text('\u00A0')
													]);
											} else {
												var place = _v1.a;
												return _List_fromArray(
													[
														A3($mdgriffith$elm_ui$Element$Input$renderPlaceholder, place, _List_Nil, textOptions.dD === '')
													]);
											}
										} else {
											return _List_fromArray(
												[
													$mdgriffith$elm_ui$Internal$Model$unstyled(
													A2(
														$elm$html$Html$span,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class($mdgriffith$elm_ui$Internal$Style$classes.up)
															]),
														_List_fromArray(
															[
																$elm$html$Html$text(textOptions.dD + '\u00A0')
															])))
												]);
										}
									}()))
							])));
			} else {
				var inputType = _v0.a;
				return A4(
					$mdgriffith$elm_ui$Internal$Model$element,
					$mdgriffith$elm_ui$Internal$Model$asEl,
					$mdgriffith$elm_ui$Internal$Model$div,
					A2(
						$elm$core$List$cons,
						$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
						A2(
							$elm$core$List$cons,
							A2($elm$core$List$any, $mdgriffith$elm_ui$Element$Input$hasFocusStyle, withDefaults) ? $mdgriffith$elm_ui$Internal$Model$NoAttribute : $mdgriffith$elm_ui$Internal$Model$htmlClass($mdgriffith$elm_ui$Internal$Style$classes.pv),
							$elm$core$List$concat(
								_List_fromArray(
									[
										redistributed.y,
										function () {
										var _v2 = textOptions.dy;
										if (_v2.$ === 1) {
											return _List_Nil;
										} else {
											var place = _v2.a;
											return _List_fromArray(
												[
													$mdgriffith$elm_ui$Element$behindContent(
													A3($mdgriffith$elm_ui$Element$Input$renderPlaceholder, place, redistributed.bl, textOptions.dD === ''))
												]);
										}
									}()
									])))),
					$mdgriffith$elm_ui$Internal$Model$Unkeyed(
						_List_fromArray(
							[inputElement])));
			}
		}();
		return A3(
			$mdgriffith$elm_ui$Element$Input$applyLabel,
			A2(
				$elm$core$List$cons,
				A2($mdgriffith$elm_ui$Internal$Model$Class, $mdgriffith$elm_ui$Internal$Flag$cursor, $mdgriffith$elm_ui$Internal$Style$classes.tp),
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_ui$Element$Input$isHiddenLabel(textOptions.I) ? $mdgriffith$elm_ui$Internal$Model$NoAttribute : $mdgriffith$elm_ui$Element$spacing(5),
					A2($elm$core$List$cons, $mdgriffith$elm_ui$Element$Region$announce, redistributed._))),
			textOptions.I,
			wrappedInput);
	});
var $mdgriffith$elm_ui$Element$Input$text = $mdgriffith$elm_ui$Element$Input$textHelper(
	{
		bP: $elm$core$Maybe$Nothing,
		c5: false,
		S: $mdgriffith$elm_ui$Element$Input$TextInputNode('text')
	});
var $author$project$Pages$Hardware$createLadderView = F2(
	function (userInfo, ranking) {
		return A2(
			$Orasund$elm_ui_framework$Framework$responsiveLayout,
			_List_Nil,
			A2(
				$mdgriffith$elm_ui$Element$column,
				$Orasund$elm_ui_framework$Framework$Grid$section,
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Element$el,
						$Orasund$elm_ui_framework$Framework$Heading$h5,
						$mdgriffith$elm_ui$Element$text(userInfo.dw + ' - Please Enter Your Ladder \nDetails And Click \'Create\' below:')),
						A2(
						$mdgriffith$elm_ui$Element$wrappedRow,
						_Utils_ap($Orasund$elm_ui_framework$Framework$Card$fill, $Orasund$elm_ui_framework$Framework$Grid$simple),
						_List_fromArray(
							[
								A2(
								$mdgriffith$elm_ui$Element$column,
								$Orasund$elm_ui_framework$Framework$Grid$simple,
								_List_fromArray(
									[
										A2(
										$mdgriffith$elm_ui$Element$Input$text,
										_Utils_ap(
											$Orasund$elm_ui_framework$Framework$Input$simple,
											_List_fromArray(
												[
													$mdgriffith$elm_ui$Element$htmlAttribute(
													$elm$html$Html$Attributes$id('RankingName'))
												])),
										{
											I: A2(
												$mdgriffith$elm_ui$Element$Input$labelLeft,
												_Utils_ap(
													$Orasund$elm_ui_framework$Framework$Input$label,
													_List_fromArray(
														[
															$mdgriffith$elm_ui$Element$moveLeft(11.0)
														])),
												$mdgriffith$elm_ui$Element$text('Ranking name*')),
											dx: $author$project$Pages$Hardware$RankingNameChg,
											dy: $elm$core$Maybe$Just(
												A2(
													$mdgriffith$elm_ui$Element$Input$placeholder,
													_List_Nil,
													$mdgriffith$elm_ui$Element$text('Ranking name*'))),
											dD: ranking.fR
										}),
										$author$project$SR$Elements$ladderNameValidation(ranking),
										A2(
										$mdgriffith$elm_ui$Element$Input$text,
										_Utils_ap(
											$Orasund$elm_ui_framework$Framework$Input$simple,
											_List_fromArray(
												[
													$mdgriffith$elm_ui$Element$htmlAttribute(
													$elm$html$Html$Attributes$id('Street'))
												])),
										{
											I: A2(
												$mdgriffith$elm_ui$Element$Input$labelLeft,
												_Utils_ap(
													$Orasund$elm_ui_framework$Framework$Input$label,
													_List_fromArray(
														[
															$mdgriffith$elm_ui$Element$moveLeft(11.0)
														])),
												$mdgriffith$elm_ui$Element$text('Street')),
											dx: $author$project$Pages$Hardware$StreetAddressChg,
											dy: $elm$core$Maybe$Just(
												A2(
													$mdgriffith$elm_ui$Element$Input$placeholder,
													_List_Nil,
													$mdgriffith$elm_ui$Element$text('Street'))),
											dD: ranking.dG.lH
										}),
										$author$project$SR$Elements$ladderStreetValidation(ranking),
										A2(
										$mdgriffith$elm_ui$Element$Input$text,
										_Utils_ap(
											$Orasund$elm_ui_framework$Framework$Input$simple,
											_List_fromArray(
												[
													$mdgriffith$elm_ui$Element$htmlAttribute(
													$elm$html$Html$Attributes$id('City'))
												])),
										{
											I: A2(
												$mdgriffith$elm_ui$Element$Input$labelLeft,
												_Utils_ap(
													$Orasund$elm_ui_framework$Framework$Input$label,
													_List_fromArray(
														[
															$mdgriffith$elm_ui$Element$moveLeft(11.0)
														])),
												$mdgriffith$elm_ui$Element$text('City')),
											dx: $author$project$Pages$Hardware$CityAddressChg,
											dy: $elm$core$Maybe$Just(
												A2(
													$mdgriffith$elm_ui$Element$Input$placeholder,
													_List_Nil,
													$mdgriffith$elm_ui$Element$text('City'))),
											dD: ranking.dG.h0
										}),
										$author$project$SR$Elements$ladderCityValidation(ranking)
									]))
							])),
						$mdgriffith$elm_ui$Element$text('* required'),
						A2($author$project$Pages$Hardware$rankingDetailsConfirmPanel, ranking, userInfo)
					])));
	});
var $author$project$SR$Elements$ownedSelectedRankingHeaderEl = function (r) {
	return A2(
		$mdgriffith$elm_ui$Element$el,
		$Orasund$elm_ui_framework$Framework$Heading$h5,
		$mdgriffith$elm_ui$Element$text(r.n3 + (' this your owned ranking' + (' - ' + (r.fR + (' . \n Id is: ' + r.A))))));
};
var $author$project$Pages$Hardware$dialogueConfirmChallengeView = F3(
	function (uinfo, rank, ranking) {
		return A2(
			$Orasund$elm_ui_framework$Framework$responsiveLayout,
			_List_Nil,
			A2(
				$mdgriffith$elm_ui$Element$column,
				$Orasund$elm_ui_framework$Framework$container,
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Element$el,
						$Orasund$elm_ui_framework$Framework$Heading$h5,
						$mdgriffith$elm_ui$Element$text(ranking.n3 + (' - Are you sure you want to challenge ' + (rank.aB.dw + '?')))),
						A2(
						$mdgriffith$elm_ui$Element$wrappedRow,
						_List_Nil,
						_List_fromArray(
							[
								$author$project$SR$Elements$ownedSelectedRankingHeaderEl(ranking)
							])),
						A2(
						$mdgriffith$elm_ui$Element$column,
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							_Utils_ap($Orasund$elm_ui_framework$Framework$Card$simple, $Orasund$elm_ui_framework$Framework$Grid$simple)),
						_List_fromArray(
							[
								A2(
								$author$project$Pages$Hardware$infoBtn,
								'Confirm',
								A2($author$project$Pages$Hardware$ConfirmChallenge, ranking, rank)),
								A2($author$project$Pages$Hardware$infoBtn, 'Cancel', $author$project$Pages$Hardware$Cancel)
							]))
					])));
	});
var $author$project$Pages$Hardware$DeleteOwnedRanking = {$: 45};
var $author$project$Pages$Hardware$dialogueDeleteOwnedView = F2(
	function (uinfo, ranking) {
		return A2(
			$Orasund$elm_ui_framework$Framework$responsiveLayout,
			_List_Nil,
			A2(
				$mdgriffith$elm_ui$Element$column,
				$Orasund$elm_ui_framework$Framework$container,
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Element$el,
						$Orasund$elm_ui_framework$Framework$Heading$h6,
						$mdgriffith$elm_ui$Element$text(ranking.n3 + ' - Are you sure you want to delete this ranking?\n            Please note that this will delete all your AND THE \n            RANKING MEMBER\'S rankings and is IRREVERSIBLE!\n            (You may wish to inform them before deleting)')),
						A2(
						$mdgriffith$elm_ui$Element$wrappedRow,
						_List_Nil,
						_List_fromArray(
							[
								$author$project$SR$Elements$ownedSelectedRankingHeaderEl(ranking)
							])),
						A2(
						$mdgriffith$elm_ui$Element$column,
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							_Utils_ap($Orasund$elm_ui_framework$Framework$Card$simple, $Orasund$elm_ui_framework$Framework$Grid$simple)),
						_List_fromArray(
							[
								A2($author$project$Pages$Hardware$infoBtn, 'Delete', $author$project$Pages$Hardware$DeleteOwnedRanking),
								A2($author$project$Pages$Hardware$infoBtn, 'Cancel', $author$project$Pages$Hardware$Cancel)
							]))
					])));
	});
var $author$project$Pages$Hardware$CancelDialoguePrepareResultView = {$: 49};
var $author$project$Pages$Hardware$ConfirmResult = function (a) {
	return {$: 48, a: a};
};
var $author$project$Data$Ranking$Lost = 1;
var $author$project$Data$Ranking$Won = 0;
var $author$project$Data$Ranking$isUserOwnerOfRankning = F2(
	function (userid, ranking) {
		return _Utils_eq(ranking.f0, userid) ? true : false;
	});
var $author$project$Pages$Hardware$dialoguePrepareResultView = F3(
	function (uinfo, rank, ranking) {
		return A2(
			$Orasund$elm_ui_framework$Framework$responsiveLayout,
			_List_Nil,
			A2(
				$mdgriffith$elm_ui$Element$column,
				$Orasund$elm_ui_framework$Framework$container,
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Element$el,
						$Orasund$elm_ui_framework$Framework$Heading$h5,
						$mdgriffith$elm_ui$Element$text(uinfo.dw + (' - Are you ready to enter your result vs ' + (rank.an.dw + '?')))),
						A2($author$project$Data$Ranking$isUserOwnerOfRankning, uinfo.r9, ranking) ? A2(
						$mdgriffith$elm_ui$Element$wrappedRow,
						_List_Nil,
						_List_fromArray(
							[
								A2($author$project$SR$Elements$memberSelectedRankingHeaderEl, uinfo, ranking)
							])) : A2(
						$mdgriffith$elm_ui$Element$wrappedRow,
						_List_Nil,
						_List_fromArray(
							[
								A2($author$project$SR$Elements$memberSelectedRankingHeaderEl, uinfo, ranking)
							])),
						A2(
						$mdgriffith$elm_ui$Element$column,
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							_Utils_ap($Orasund$elm_ui_framework$Framework$Card$simple, $Orasund$elm_ui_framework$Framework$Grid$simple)),
						_List_fromArray(
							[
								A2(
								$author$project$Pages$Hardware$infoBtn,
								'Win',
								$author$project$Pages$Hardware$ConfirmResult(0)),
								A2(
								$author$project$Pages$Hardware$infoBtn,
								'Lose',
								$author$project$Pages$Hardware$ConfirmResult(1)),
								A2(
								$author$project$Pages$Hardware$infoBtn,
								'Abandon Challenge',
								$author$project$Pages$Hardware$ConfirmResult(2)),
								A2($author$project$Pages$Hardware$infoBtn, 'Cancel', $author$project$Pages$Hardware$CancelDialoguePrepareResultView)
							]))
					])));
	});
var $author$project$Pages$Hardware$DialogueConfirmDeleteAccount = {$: 59};
var $author$project$Pages$Hardware$LogOut = {$: 25};
var $author$project$Pages$Hardware$Create = {$: 26};
var $author$project$Pages$Hardware$displayGlobalRankingBtns = F3(
	function (searchterm, searchResults, userVal) {
		return A2(
			$mdgriffith$elm_ui$Element$column,
			$Orasund$elm_ui_framework$Framework$Grid$section,
			_List_fromArray(
				[
					A2($author$project$Pages$Hardware$infoBtn, 'Connect Wallet', $author$project$Pages$Hardware$Create)
				]));
	});
var $author$project$SR$Elements$globalHeading = function (user) {
	if (!user.$) {
		return A2(
			$mdgriffith$elm_ui$Element$el,
			$Orasund$elm_ui_framework$Framework$Heading$h5,
			$mdgriffith$elm_ui$Element$text('Spectator in global heading'));
	} else {
		var userInfo = user.a;
		return A2(
			$mdgriffith$elm_ui$Element$el,
			$Orasund$elm_ui_framework$Framework$Heading$h5,
			$mdgriffith$elm_ui$Element$text('SportRank - Welcome Back - ' + userInfo.dw));
	}
};
var $author$project$Pages$Hardware$globalView = F3(
	function (searchterm, searchResults, userVal) {
		if (!userVal.$) {
			return A2(
				$Orasund$elm_ui_framework$Framework$responsiveLayout,
				_List_Nil,
				A2(
					$mdgriffith$elm_ui$Element$column,
					$Orasund$elm_ui_framework$Framework$container,
					_List_fromArray(
						[
							$author$project$SR$Elements$globalHeading(userVal),
							$mdgriffith$elm_ui$Element$text('\n')
						])));
		} else {
			return A2(
				$Orasund$elm_ui_framework$Framework$responsiveLayout,
				_List_Nil,
				A2(
					$mdgriffith$elm_ui$Element$column,
					$Orasund$elm_ui_framework$Framework$container,
					_List_fromArray(
						[
							$author$project$SR$Elements$globalHeading(userVal),
							$mdgriffith$elm_ui$Element$text('\n'),
							A2($author$project$Pages$Hardware$infoBtn, 'Log Out', $author$project$Pages$Hardware$LogOut),
							$mdgriffith$elm_ui$Element$text('\n'),
							A2($author$project$Pages$Hardware$infoBtn, 'Delete Account', $author$project$Pages$Hardware$DialogueConfirmDeleteAccount),
							A3($author$project$Pages$Hardware$displayGlobalRankingBtns, searchterm, searchResults, userVal)
						])));
		}
	});
var $author$project$Pages$Hardware$ClickedLedgerConnect = function (a) {
	return {$: 23, a: a};
};
var $author$project$Pages$Hardware$loginView = function (model) {
	return A2(
		$Orasund$elm_ui_framework$Framework$responsiveLayout,
		_List_Nil,
		A2(
			$mdgriffith$elm_ui$Element$column,
			$Orasund$elm_ui_framework$Framework$container,
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$el,
					$Orasund$elm_ui_framework$Framework$Heading$h5,
					$mdgriffith$elm_ui$Element$text('Haveno-Web')),
					$mdgriffith$elm_ui$Element$text('\n'),
					A2(
					$author$project$Pages$Hardware$infoBtn,
					'Connect Wallet',
					$author$project$Pages$Hardware$ClickedLedgerConnect(model.dJ)),
					$mdgriffith$elm_ui$Element$text('\n'),
					A2(
					$mdgriffith$elm_ui$Element$el,
					$Orasund$elm_ui_framework$Framework$Heading$h6,
					$mdgriffith$elm_ui$Element$text('Not connected yet')),
					function () {
					var _v0 = model.d$;
					if (!_v0.b) {
						return $mdgriffith$elm_ui$Element$text('');
					} else {
						return A2(
							$mdgriffith$elm_ui$Element$column,
							$Orasund$elm_ui_framework$Framework$Grid$section,
							A2(
								$elm$core$List$map,
								function (error) {
									return A2(
										$mdgriffith$elm_ui$Element$el,
										$Orasund$elm_ui_framework$Framework$Heading$h6,
										$mdgriffith$elm_ui$Element$text(error));
								},
								model.d$));
					}
				}()
				])));
};
var $author$project$Pages$Hardware$DialogueConfirmLeaveView = {$: 58};
var $author$project$Pages$Hardware$ViewRank = function (a) {
	return {$: 46, a: a};
};
var $author$project$Pages$Hardware$challengeInProgressBtnDisabled = function (r) {
	return A2(
		$mdgriffith$elm_ui$Element$column,
		$Orasund$elm_ui_framework$Framework$Grid$simple,
		_List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Element$Input$button,
				_Utils_ap(
					$Orasund$elm_ui_framework$Framework$Button$fill,
					$author$project$Pages$Hardware$enableButton(false)),
				{
					I: $mdgriffith$elm_ui$Element$text(
						$elm$core$String$fromInt(r.bC) + ('. ' + (r.aB.dw + (' vs ' + r.an.dw)))),
					aq: $elm$core$Maybe$Just(
						$author$project$Pages$Hardware$ViewRank(r))
				})
			]));
};
var $Orasund$elm_ui_framework$Framework$Color$primary = _List_fromArray(
	[
		$mdgriffith$elm_ui$Element$Background$color($Orasund$elm_ui_framework$Framework$Color$turquoise),
		$mdgriffith$elm_ui$Element$Border$color($Orasund$elm_ui_framework$Framework$Color$turquoise)
	]);
var $author$project$Pages$Hardware$challengeInProgressBtnEnabled = function (r) {
	return A2(
		$mdgriffith$elm_ui$Element$column,
		$Orasund$elm_ui_framework$Framework$Grid$simple,
		_List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Element$Input$button,
				_Utils_ap($Orasund$elm_ui_framework$Framework$Button$fill, $Orasund$elm_ui_framework$Framework$Color$primary),
				{
					I: $mdgriffith$elm_ui$Element$text(
						$elm$core$String$fromInt(r.bC) + ('. ' + (r.aB.dw + (' vs ' + r.an.dw)))),
					aq: $elm$core$Maybe$Just(
						$author$project$Pages$Hardware$ViewRank(r))
				})
			]));
};
var $author$project$Pages$Hardware$determineButtonType = F2(
	function (loggedInUsersRank, rankBeingIterated) {
		var rankBeingIteratedIsInAChallenge = !_Utils_eq(rankBeingIterated.an.A, $author$project$Extras$Constants$noCurrentChallengerId);
		var loggedInUserIsInAChallenge = !_Utils_eq(loggedInUsersRank.an.A, $author$project$Extras$Constants$noCurrentChallengerId);
		return loggedInUserIsInAChallenge ? (_Utils_eq(loggedInUsersRank.aB.A, rankBeingIterated.aB.A) ? 1 : (_Utils_eq(loggedInUsersRank.aB.A, rankBeingIterated.an.A) ? 2 : 4)) : (rankBeingIteratedIsInAChallenge ? (_Utils_eq(loggedInUsersRank.aB.A, rankBeingIterated.aB.A) ? 1 : 2) : (_Utils_eq(loggedInUsersRank.bC - 1, rankBeingIterated.bC) ? 3 : 4));
	});
var $author$project$Pages$Hardware$singlePlayerBtnDisabled = function (r) {
	return A2(
		$mdgriffith$elm_ui$Element$column,
		$Orasund$elm_ui_framework$Framework$Grid$simple,
		_List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Element$Input$button,
				_Utils_ap(
					$Orasund$elm_ui_framework$Framework$Button$fill,
					$author$project$Pages$Hardware$enableButton(false)),
				{
					I: $mdgriffith$elm_ui$Element$text(
						$elm$core$String$fromInt(r.bC) + ('. ' + r.aB.dw)),
					aq: $elm$core$Maybe$Just(
						$author$project$Pages$Hardware$ViewRank(r))
				})
			]));
};
var $author$project$Pages$Hardware$singlePlayerBtnEnabled = function (r) {
	return A2(
		$mdgriffith$elm_ui$Element$column,
		$Orasund$elm_ui_framework$Framework$Grid$simple,
		_List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Element$Input$button,
				_Utils_ap($Orasund$elm_ui_framework$Framework$Button$fill, $Orasund$elm_ui_framework$Framework$Color$primary),
				{
					I: $mdgriffith$elm_ui$Element$text(
						$elm$core$String$fromInt(r.bC) + ('. ' + r.aB.dw)),
					aq: $elm$core$Maybe$Just(
						$author$project$Pages$Hardware$ViewRank(r))
				})
			]));
};
var $author$project$Pages$Hardware$configureThenAddPlayerRankingBtns = F2(
	function (currentUserRank, rank) {
		var elementMsg = (A2($author$project$Pages$Hardware$determineButtonType, currentUserRank, rank) === 1) ? $author$project$Pages$Hardware$challengeInProgressBtnEnabled(rank) : ((A2($author$project$Pages$Hardware$determineButtonType, currentUserRank, rank) === 2) ? $author$project$Pages$Hardware$challengeInProgressBtnDisabled(rank) : ((A2($author$project$Pages$Hardware$determineButtonType, currentUserRank, rank) === 3) ? $author$project$Pages$Hardware$singlePlayerBtnEnabled(rank) : $author$project$Pages$Hardware$singlePlayerBtnDisabled(rank)));
		return elementMsg;
	});
var $author$project$Pages$Hardware$findUserRank = F2(
	function (userid, ladder) {
		return $elm$core$List$head(
			A2(
				$elm$core$List$filter,
				function (r) {
					return _Utils_eq(r.aB.A, userid);
				},
				ladder));
	});
var $author$project$Pages$Hardware$playerbuttons = F2(
	function (r, u) {
		var currentUserRank = A2(
			$elm$core$Maybe$withDefault,
			$author$project$Data$Ranking$emptyRank,
			A2($author$project$Pages$Hardware$findUserRank, u.r9, r.nb));
		return A2(
			$mdgriffith$elm_ui$Element$column,
			$Orasund$elm_ui_framework$Framework$Grid$section,
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$column,
					_Utils_ap($Orasund$elm_ui_framework$Framework$Card$simple, $Orasund$elm_ui_framework$Framework$Grid$simple),
					A2(
						$elm$core$List$map,
						$author$project$Pages$Hardware$configureThenAddPlayerRankingBtns(currentUserRank),
						r.nb))
				]));
	});
var $author$project$Pages$Hardware$memberSelectedView = F2(
	function (u, r) {
		return A2(
			$Orasund$elm_ui_framework$Framework$responsiveLayout,
			_List_Nil,
			A2(
				$mdgriffith$elm_ui$Element$column,
				$Orasund$elm_ui_framework$Framework$container,
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Element$wrappedRow,
						_List_Nil,
						_List_fromArray(
							[
								A2($author$project$SR$Elements$memberSelectedRankingHeaderEl, u, r)
							])),
						A2(
						$mdgriffith$elm_ui$Element$column,
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							_Utils_ap($Orasund$elm_ui_framework$Framework$Card$simple, $Orasund$elm_ui_framework$Framework$Grid$simple)),
						_List_fromArray(
							[
								A2($author$project$Pages$Hardware$infoBtn, 'Leave', $author$project$Pages$Hardware$DialogueConfirmLeaveView),
								A2($author$project$Pages$Hardware$infoBtn, 'Cancel', $author$project$Pages$Hardware$CancelFetchedMember),
								A2($author$project$Pages$Hardware$playerbuttons, r, u)
							]))
					])));
	});
var $author$project$Pages$Hardware$CancelFetchedOwned = function (a) {
	return {$: 29, a: a};
};
var $author$project$Pages$Hardware$DialogDeleteOwnedRanking = {$: 44};
var $author$project$Pages$Hardware$ownedSelectedView = F2(
	function (u, r) {
		return A2(
			$Orasund$elm_ui_framework$Framework$responsiveLayout,
			_List_Nil,
			A2(
				$mdgriffith$elm_ui$Element$column,
				$Orasund$elm_ui_framework$Framework$container,
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Element$wrappedRow,
						_List_Nil,
						_List_fromArray(
							[
								$author$project$SR$Elements$ownedSelectedRankingHeaderEl(r)
							])),
						A2(
						$mdgriffith$elm_ui$Element$column,
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							_Utils_ap($Orasund$elm_ui_framework$Framework$Card$simple, $Orasund$elm_ui_framework$Framework$Grid$simple)),
						_List_fromArray(
							[
								A2($author$project$Pages$Hardware$infoBtn, 'Delete', $author$project$Pages$Hardware$DialogDeleteOwnedRanking),
								A2(
								$author$project$Pages$Hardware$infoBtn,
								'Cancel',
								$author$project$Pages$Hardware$CancelFetchedOwned(u)),
								A2($author$project$Pages$Hardware$playerbuttons, r, u)
							]))
					])));
	});
var $mdgriffith$elm_ui$Element$Input$email = $mdgriffith$elm_ui$Element$Input$textHelper(
	{
		bP: $elm$core$Maybe$Just('email'),
		c5: false,
		S: $mdgriffith$elm_ui$Element$Input$TextInputNode('email')
	});
var $author$project$Utils$Validation$Validate$isEmailValid = function (newEmail) {
	return A2(
		$elm$regex$Regex$contains,
		A2(
			$elm$core$Maybe$withDefault,
			$elm$regex$Regex$never,
			$elm$regex$Regex$fromString('[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?')),
		newEmail);
};
var $author$project$Pages$Hardware$emailValidationErr = function (str) {
	return ($author$project$Utils$Validation$Validate$isEmailValid(str) && (!(!$elm$core$String$length(str)))) ? A2(
		$mdgriffith$elm_ui$Element$el,
		A2(
			$elm$core$List$append,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$Font$color($author$project$SR$Elements$colors.pH),
					$mdgriffith$elm_ui$Element$Font$alignLeft
				]),
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$moveLeft(1.0)
				])),
		$mdgriffith$elm_ui$Element$text('Email OK!')) : A2(
		$mdgriffith$elm_ui$Element$el,
		A2(
			$elm$core$List$append,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$Font$color($author$project$SR$Elements$colors.q4),
					$mdgriffith$elm_ui$Element$Font$alignLeft
				]),
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$moveLeft(7.0)
				])),
		$mdgriffith$elm_ui$Element$text(' Please enter \n a valid email'));
};
var $elm$html$Html$Attributes$autofocus = $elm$html$Html$Attributes$boolProperty('autofocus');
var $mdgriffith$elm_ui$Element$Input$focusedOnLoad = $mdgriffith$elm_ui$Internal$Model$Attr(
	$elm$html$Html$Attributes$autofocus(true));
var $author$project$SR$Elements$justParasimpleUserInfoText = A2(
	$mdgriffith$elm_ui$Element$paragraph,
	_List_Nil,
	$elm$core$List$singleton(
		$mdgriffith$elm_ui$Element$text('Can your challengers reach you if you don\'t submit contact details?')));
var $author$project$Utils$Validation$Validate$isMobileValid = function (newMobile) {
	return (newMobile === '') ? true : A2(
		$elm$regex$Regex$contains,
		A2(
			$elm$core$Maybe$withDefault,
			$elm$regex$Regex$never,
			$elm$regex$Regex$fromString('^\\+((?:9[679]|8[035789]|6[789]|5[90]|42|3[578]|2[1-689])|9[0-58]|8[1246]|6[0-6]|5[1-8]|4[013-9]|3[0-469]|2[70]|7|1)(?:\\W*\\d){0,13}\\d$')),
		newMobile);
};
var $author$project$Pages$Hardware$mobileValidationErr = function (str) {
	return $author$project$Utils$Validation$Validate$isMobileValid(str) ? A2(
		$mdgriffith$elm_ui$Element$el,
		A2(
			$elm$core$List$append,
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$Font$color($author$project$SR$Elements$colors.pH),
					$mdgriffith$elm_ui$Element$Font$alignLeft
				]),
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$htmlAttribute(
					$elm$html$Html$Attributes$id('userMobileValid'))
				])),
		$mdgriffith$elm_ui$Element$text('Mobile OK!')) : (($elm$core$String$length(str) > 0) ? A2(
		$mdgriffith$elm_ui$Element$el,
		_Utils_ap(
			A2(
				$elm$core$List$append,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$Font$color($author$project$SR$Elements$colors.q4),
						$mdgriffith$elm_ui$Element$Font$alignLeft
					]),
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$htmlAttribute(
						$elm$html$Html$Attributes$id('userMobileInvalid'))
					])),
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$moveLeft(5.0)
				])),
		$mdgriffith$elm_ui$Element$text(' Mobile number, if\n entered, must be valid (+ not 00)')) : A2(
		$mdgriffith$elm_ui$Element$el,
		_List_Nil,
		$mdgriffith$elm_ui$Element$text('')));
};
var $author$project$Utils$Validation$Validate$isValid4to8Chars = function (str) {
	return A2(
		$elm$regex$Regex$contains,
		A2(
			$elm$core$Maybe$withDefault,
			$elm$regex$Regex$never,
			$elm$regex$Regex$fromString('(?!.*[\\.\\-\\_]{2,})^[a-zA-Z0-9\\.\\-\\_]{4,8}$')),
		str);
};
var $author$project$SR$Elements$nameValidView = function (userInfo) {
	return (!$elm$core$String$length(userInfo.dw)) ? A2(
		$mdgriffith$elm_ui$Element$el,
		_Utils_ap(
			A2(
				$elm$core$List$append,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$htmlAttribute(
						$elm$html$Html$Attributes$id('usernameValidMsg'))
					]),
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$Font$color($author$project$SR$Elements$colors.pH),
						$mdgriffith$elm_ui$Element$Font$alignLeft
					])),
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$moveLeft(1.0)
				])),
		$mdgriffith$elm_ui$Element$text('Anon OK!')) : ($author$project$Utils$Validation$Validate$isValid4to8Chars(userInfo.dw) ? A2(
		$mdgriffith$elm_ui$Element$el,
		_Utils_ap(
			A2(
				$elm$core$List$append,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$htmlAttribute(
						$elm$html$Html$Attributes$id('usernameValidMsg'))
					]),
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$Font$color($author$project$SR$Elements$colors.pH),
						$mdgriffith$elm_ui$Element$Font$alignLeft
					])),
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$moveLeft(1.0)
				])),
		$mdgriffith$elm_ui$Element$text('Nickname OK!')) : A2(
		$mdgriffith$elm_ui$Element$el,
		_Utils_ap(
			A2(
				$elm$core$List$append,
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$htmlAttribute(
						$elm$html$Html$Attributes$id('usernameValidMsg'))
					]),
				_List_fromArray(
					[
						$mdgriffith$elm_ui$Element$Font$color($author$project$SR$Elements$colors.q4),
						$mdgriffith$elm_ui$Element$Font$alignLeft
					])),
			_List_fromArray(
				[
					$mdgriffith$elm_ui$Element$moveLeft(0.0)
				])),
		$mdgriffith$elm_ui$Element$text('If entered please make \nunique and 5-8 continuous chars')));
};
var $mdgriffith$elm_ui$Element$Input$newPassword = F2(
	function (attrs, pass) {
		return A3(
			$mdgriffith$elm_ui$Element$Input$textHelper,
			{
				bP: $elm$core$Maybe$Just('new-password'),
				c5: false,
				S: $mdgriffith$elm_ui$Element$Input$TextInputNode(
					pass.vT ? 'text' : 'password')
			},
			attrs,
			{I: pass.I, dx: pass.dx, dy: pass.dy, dD: pass.dD});
	});
var $author$project$SR$Elements$passwordValidView = function (userInfo) {
	return $author$project$Utils$Validation$Validate$isValid4to8Chars(userInfo.n4) ? A2(
		$mdgriffith$elm_ui$Element$el,
		_List_fromArray(
			[
				$mdgriffith$elm_ui$Element$Font$color($author$project$SR$Elements$colors.pH),
				$mdgriffith$elm_ui$Element$Font$alignLeft,
				$mdgriffith$elm_ui$Element$moveLeft(1.0)
			]),
		$mdgriffith$elm_ui$Element$text('Password OK!')) : A2(
		$mdgriffith$elm_ui$Element$el,
		_List_fromArray(
			[
				$mdgriffith$elm_ui$Element$Font$color($author$project$SR$Elements$colors.q4),
				$mdgriffith$elm_ui$Element$Font$alignLeft,
				$mdgriffith$elm_ui$Element$moveLeft(0.0)
			]),
		$mdgriffith$elm_ui$Element$text('5-8 continuous chars'));
};
var $author$project$Pages$Hardware$CancelRegistration = {$: 33};
var $author$project$Pages$Hardware$RegisUser = function (a) {
	return {$: 39, a: a};
};
var $author$project$Utils$Validation$Validate$is20CharMax = function (str) {
	return ($elm$core$String$length(str) <= 20) ? true : false;
};
var $author$project$Pages$Hardware$isValidatedForAllUserDetailsInput = function (userInfo) {
	return ($author$project$Utils$Validation$Validate$isEmailValid(
		A2($elm$core$Maybe$withDefault, '', userInfo.nN)) && ($author$project$Utils$Validation$Validate$isValid4to8Chars(userInfo.dw) && ($author$project$Utils$Validation$Validate$is20CharMax('') && ($author$project$Utils$Validation$Validate$isEmailValid(
		A2($elm$core$Maybe$withDefault, '', userInfo.nN)) && $author$project$Utils$Validation$Validate$isMobileValid(
		A2($elm$core$Maybe$withDefault, '', userInfo.n_)))))) ? true : false;
};
var $author$project$Pages$Hardware$userDetailsConfirmPanel = function (userInfo) {
	return (($author$project$Utils$Validation$Validate$isEmailValid(
		A2($elm$core$Maybe$withDefault, '', userInfo.nN)) && ($elm$core$String$length(
		A2($elm$core$Maybe$withDefault, '', userInfo.nN)) > 0)) && (($author$project$Utils$Validation$Validate$isValid4to8Chars(userInfo.n4) && ($elm$core$String$length(userInfo.n4) > 0)) && ((userInfo.dw === '') || $author$project$Utils$Validation$Validate$isValid4to8Chars(userInfo.dw)))) ? A2(
		$mdgriffith$elm_ui$Element$column,
		$Orasund$elm_ui_framework$Framework$Grid$section,
		_List_fromArray(
			[
				A2(
				$mdgriffith$elm_ui$Element$el,
				$Orasund$elm_ui_framework$Framework$Heading$h6,
				$mdgriffith$elm_ui$Element$text('Click to continue ...')),
				A2(
				$mdgriffith$elm_ui$Element$column,
				_Utils_ap($Orasund$elm_ui_framework$Framework$Card$simple, $Orasund$elm_ui_framework$Framework$Grid$simple),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Element$wrappedRow,
						$Orasund$elm_ui_framework$Framework$Grid$simple,
						_List_fromArray(
							[
								A2(
								$mdgriffith$elm_ui$Element$Input$button,
								_Utils_ap($Orasund$elm_ui_framework$Framework$Button$simple, $Orasund$elm_ui_framework$Framework$Color$info),
								{
									I: $mdgriffith$elm_ui$Element$text('Cancel'),
									aq: $elm$core$Maybe$Just($author$project$Pages$Hardware$CancelRegistration)
								}),
								A2(
								$mdgriffith$elm_ui$Element$Input$button,
								_Utils_ap(
									$Orasund$elm_ui_framework$Framework$Button$simple,
									$author$project$Pages$Hardware$enableButton(
										$author$project$Pages$Hardware$isValidatedForAllUserDetailsInput(userInfo))),
								{
									I: $mdgriffith$elm_ui$Element$text('Register'),
									aq: $elm$core$Maybe$Just(
										$author$project$Pages$Hardware$RegisUser(userInfo))
								})
							]))
					]))
			])) : A2(
		$mdgriffith$elm_ui$Element$column,
		$Orasund$elm_ui_framework$Framework$Grid$section,
		_List_fromArray(
			[
				$author$project$SR$Elements$missingDataPara,
				A2(
				$mdgriffith$elm_ui$Element$el,
				$Orasund$elm_ui_framework$Framework$Heading$h6,
				$mdgriffith$elm_ui$Element$text('Click to continue ...')),
				A2(
				$mdgriffith$elm_ui$Element$column,
				_Utils_ap($Orasund$elm_ui_framework$Framework$Card$simple, $Orasund$elm_ui_framework$Framework$Grid$simple),
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Element$wrappedRow,
						$Orasund$elm_ui_framework$Framework$Grid$simple,
						_List_fromArray(
							[
								A2(
								$mdgriffith$elm_ui$Element$Input$button,
								_Utils_ap($Orasund$elm_ui_framework$Framework$Button$simple, $Orasund$elm_ui_framework$Framework$Color$info),
								{
									I: $mdgriffith$elm_ui$Element$text('Cancel'),
									aq: $elm$core$Maybe$Just($author$project$Pages$Hardware$CancelRegistration)
								})
							]))
					]))
			]));
};
var $author$project$Utils$Validation$Validate$validatedMaxTextLength = F2(
	function (str, maxLength) {
		return (_Utils_cmp(
			$elm$core$String$length(str),
			maxLength) > 0) ? A2($elm$core$String$dropRight, 1, str) : str;
	});
var $author$project$Pages$Hardware$registerView = function (userInfo) {
	return A2(
		$Orasund$elm_ui_framework$Framework$responsiveLayout,
		_List_Nil,
		A2(
			$mdgriffith$elm_ui$Element$column,
			$Orasund$elm_ui_framework$Framework$Grid$section,
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_ui$Element$el,
					$Orasund$elm_ui_framework$Framework$Heading$h5,
					$mdgriffith$elm_ui$Element$text('Please Enter Your User \nDetails And Click \'Register\' below:')),
					A2(
					$mdgriffith$elm_ui$Element$wrappedRow,
					_Utils_ap($Orasund$elm_ui_framework$Framework$Card$fill, $Orasund$elm_ui_framework$Framework$Grid$simple),
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_ui$Element$column,
							$Orasund$elm_ui_framework$Framework$Grid$simple,
							_List_fromArray(
								[
									A2(
									$mdgriffith$elm_ui$Element$Input$email,
									_Utils_ap(
										$Orasund$elm_ui_framework$Framework$Input$simple,
										_List_fromArray(
											[
												$mdgriffith$elm_ui$Element$htmlAttribute(
												$elm$html$Html$Attributes$id('userEmail')),
												$mdgriffith$elm_ui$Element$Input$focusedOnLoad
											])),
									{
										I: A2(
											$mdgriffith$elm_ui$Element$Input$labelLeft,
											_Utils_ap(
												$Orasund$elm_ui_framework$Framework$Input$label,
												_List_fromArray(
													[
														$mdgriffith$elm_ui$Element$moveLeft(11.0)
													])),
											$mdgriffith$elm_ui$Element$text('Email*')),
										dx: $author$project$Pages$Hardware$UpdateEmail,
										dy: $elm$core$Maybe$Just(
											A2(
												$mdgriffith$elm_ui$Element$Input$placeholder,
												_List_Nil,
												$mdgriffith$elm_ui$Element$text('Email'))),
										dD: A2($elm$core$Maybe$withDefault, '', userInfo.nN)
									}),
									$author$project$Pages$Hardware$emailValidationErr(
									A2($elm$core$Maybe$withDefault, '', userInfo.nN)),
									A2(
									$mdgriffith$elm_ui$Element$Input$newPassword,
									_Utils_ap(
										$Orasund$elm_ui_framework$Framework$Input$simple,
										_List_fromArray(
											[
												$mdgriffith$elm_ui$Element$htmlAttribute(
												$elm$html$Html$Attributes$id('Password'))
											])),
									{
										I: A2(
											$mdgriffith$elm_ui$Element$Input$labelLeft,
											_Utils_ap(
												$Orasund$elm_ui_framework$Framework$Input$label,
												_List_fromArray(
													[
														$mdgriffith$elm_ui$Element$moveLeft(11.0)
													])),
											$mdgriffith$elm_ui$Element$text('Password*')),
										dx: $author$project$Pages$Hardware$UpdatePassword,
										dy: $elm$core$Maybe$Just(
											A2(
												$mdgriffith$elm_ui$Element$Input$placeholder,
												_List_Nil,
												$mdgriffith$elm_ui$Element$text('Password'))),
										vT: false,
										dD: userInfo.n4
									}),
									$author$project$SR$Elements$passwordValidView(userInfo),
									A2(
									$mdgriffith$elm_ui$Element$Input$text,
									_Utils_ap(
										$Orasund$elm_ui_framework$Framework$Input$simple,
										_List_fromArray(
											[
												$mdgriffith$elm_ui$Element$htmlAttribute(
												$elm$html$Html$Attributes$id('nickName'))
											])),
									{
										I: A2(
											$mdgriffith$elm_ui$Element$Input$labelLeft,
											_Utils_ap(
												$Orasund$elm_ui_framework$Framework$Input$label,
												_List_fromArray(
													[
														$mdgriffith$elm_ui$Element$moveLeft(11.0)
													])),
											$mdgriffith$elm_ui$Element$text('Nickname')),
										dx: $author$project$Pages$Hardware$UpdateNickName,
										dy: $elm$core$Maybe$Just(
											A2(
												$mdgriffith$elm_ui$Element$Input$placeholder,
												_List_Nil,
												$mdgriffith$elm_ui$Element$text('Nickname'))),
										dD: userInfo.dw
									}),
									$author$project$SR$Elements$nameValidView(userInfo),
									A2(
									$mdgriffith$elm_ui$Element$Input$text,
									_Utils_ap(
										$Orasund$elm_ui_framework$Framework$Input$simple,
										_List_fromArray(
											[
												$mdgriffith$elm_ui$Element$htmlAttribute(
												$elm$html$Html$Attributes$id('Level'))
											])),
									{
										I: A2(
											$mdgriffith$elm_ui$Element$Input$labelLeft,
											_Utils_ap(
												$Orasund$elm_ui_framework$Framework$Input$label,
												_List_fromArray(
													[
														$mdgriffith$elm_ui$Element$moveLeft(11.0)
													])),
											$mdgriffith$elm_ui$Element$text('Level')),
										dx: $author$project$Pages$Hardware$UpdateLevel,
										dy: $elm$core$Maybe$Just(
											A2(
												$mdgriffith$elm_ui$Element$Input$placeholder,
												_List_Nil,
												$mdgriffith$elm_ui$Element$text('Level'))),
										dD: userInfo.dY.nX
									}),
									A2(
									$mdgriffith$elm_ui$Element$Input$text,
									_Utils_ap(
										$Orasund$elm_ui_framework$Framework$Input$simple,
										_List_fromArray(
											[
												$mdgriffith$elm_ui$Element$htmlAttribute(
												$elm$html$Html$Attributes$id('Comment'))
											])),
									{
										I: A2(
											$mdgriffith$elm_ui$Element$Input$labelLeft,
											_Utils_ap(
												$Orasund$elm_ui_framework$Framework$Input$label,
												_List_fromArray(
													[
														$mdgriffith$elm_ui$Element$moveLeft(11.0)
													])),
											$mdgriffith$elm_ui$Element$text('Comment')),
										dx: $author$project$Pages$Hardware$UpdateComment,
										dy: $elm$core$Maybe$Just(
											A2(
												$mdgriffith$elm_ui$Element$Input$placeholder,
												_List_Nil,
												$mdgriffith$elm_ui$Element$text('Comment'))),
										dD: userInfo.dY.nF
									}),
									A2(
									$mdgriffith$elm_ui$Element$Input$text,
									_Utils_ap(
										$Orasund$elm_ui_framework$Framework$Input$simple,
										_List_fromArray(
											[
												$mdgriffith$elm_ui$Element$htmlAttribute(
												$elm$html$Html$Attributes$id('userMobile'))
											])),
									{
										I: A2(
											$mdgriffith$elm_ui$Element$Input$labelLeft,
											_Utils_ap(
												$Orasund$elm_ui_framework$Framework$Input$label,
												_List_fromArray(
													[
														$mdgriffith$elm_ui$Element$moveLeft(11.0)
													])),
											$mdgriffith$elm_ui$Element$text('Mobile \n(inc. Int code\neg.+65)')),
										dx: $author$project$Pages$Hardware$UpdateMobile,
										dy: $elm$core$Maybe$Just(
											A2(
												$mdgriffith$elm_ui$Element$Input$placeholder,
												_List_Nil,
												$mdgriffith$elm_ui$Element$text('Mobile'))),
										dD: A2(
											$author$project$Utils$Validation$Validate$validatedMaxTextLength,
											A2($elm$core$Maybe$withDefault, '', userInfo.n_),
											25)
									}),
									$author$project$Pages$Hardware$mobileValidationErr(
									A2($elm$core$Maybe$withDefault, '', userInfo.n_))
								]))
						])),
					$mdgriffith$elm_ui$Element$text('* required'),
					$author$project$SR$Elements$justParasimpleUserInfoText,
					$author$project$Pages$Hardware$userDetailsConfirmPanel(userInfo),
					$mdgriffith$elm_ui$Element$text('\n')
				])));
};
var $author$project$Pages$Hardware$SpectatorJoin = {$: 53};
var $author$project$Pages$Hardware$spectatorSelectedView = F2(
	function (u, r) {
		return A2(
			$Orasund$elm_ui_framework$Framework$responsiveLayout,
			_List_Nil,
			A2(
				$mdgriffith$elm_ui$Element$column,
				$Orasund$elm_ui_framework$Framework$container,
				_List_fromArray(
					[
						A2(
						$mdgriffith$elm_ui$Element$wrappedRow,
						_List_Nil,
						_List_fromArray(
							[
								A2($author$project$SR$Elements$spectatorSelectedRankingHeaderEl, u, r)
							])),
						A2(
						$mdgriffith$elm_ui$Element$column,
						A2(
							$elm$core$List$cons,
							$mdgriffith$elm_ui$Element$width($mdgriffith$elm_ui$Element$fill),
							_Utils_ap($Orasund$elm_ui_framework$Framework$Card$simple, $Orasund$elm_ui_framework$Framework$Grid$simple)),
						_List_fromArray(
							[
								A2($author$project$Pages$Hardware$infoBtn, 'Join This Ladder?', $author$project$Pages$Hardware$SpectatorJoin),
								A2($author$project$Pages$Hardware$infoBtn, 'Cancel', $author$project$Pages$Hardware$CancelFetchedSpectator),
								A2($author$project$Pages$Hardware$playerbuttons, r, u)
							]))
					])));
	});
var $author$project$Pages$Hardware$spectatorView = A2(
	$Orasund$elm_ui_framework$Framework$responsiveLayout,
	_List_Nil,
	A2(
		$mdgriffith$elm_ui$Element$column,
		$Orasund$elm_ui_framework$Framework$container,
		_List_fromArray(
			[
				$author$project$SR$Elements$globalHeading($author$project$Data$User$emptySpectator),
				$mdgriffith$elm_ui$Element$text('\n Hi Spectator! \n'),
				A2($author$project$Pages$Hardware$infoBtn, 'Back to Login', $author$project$Pages$Hardware$LogOut),
				$mdgriffith$elm_ui$Element$text('\n')
			])));
var $author$project$Pages$Hardware$content = function (model) {
	return A2(
		$elm$html$Html$section,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('page'),
				$elm$html$Html$Attributes$class('section-background'),
				$elm$html$Html$Attributes$class('text-center')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('split')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('split-col')
							]),
						_List_Nil),
						function () {
						var _v0 = model.rL;
						switch (_v0) {
							case 0:
								return A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('spinner')
												]),
											_List_Nil)
										]));
							case 2:
								return A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('error')
										]));
							default:
								return A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('split-col')
										]),
									_List_fromArray(
										[
											function () {
											var _v1 = model.bJ;
											switch (_v1.$) {
												case 0:
													return A2(
														$elm$html$Html$ul,
														_List_Nil,
														_List_fromArray(
															[
																A2(
																$Orasund$elm_ui_framework$Framework$responsiveLayout,
																_List_Nil,
																A2(
																	$mdgriffith$elm_ui$Element$column,
																	$Orasund$elm_ui_framework$Framework$container,
																	_List_fromArray(
																		[
																			A2(
																			$mdgriffith$elm_ui$Element$el,
																			$Orasund$elm_ui_framework$Framework$Heading$h5,
																			$mdgriffith$elm_ui$Element$text('RefreshTknQP - Error!'))
																		])))
															]));
												case 1:
													return $author$project$Pages$Hardware$loginView(model);
												case 2:
													return $author$project$Pages$Hardware$spectatorView;
												case 3:
													var newUser = _v1.a;
													return $author$project$Pages$Hardware$registerView(newUser);
												case 4:
													return A3($author$project$Pages$Hardware$globalView, model.vN, model.vL, model.dl);
												case 5:
													var userInfo = _v1.a;
													return A2(
														$author$project$Pages$Hardware$createLadderView,
														userInfo,
														$author$project$Data$Ranking$gotRanking(model.er));
												case 6:
													var userInfo = function () {
														var _v2 = model.dl;
														if (_v2.$ === 1) {
															var usrInfo = _v2.a;
															return usrInfo;
														} else {
															return $author$project$Data$User$emptyUserInfo;
														}
													}();
													return A2(
														$author$project$Pages$Hardware$ownedSelectedView,
														userInfo,
														$author$project$Data$Ranking$gotRanking(model.er));
												case 7:
													var userInfo = function () {
														var _v3 = model.dl;
														if (_v3.$ === 1) {
															var usrInfo = _v3.a;
															return usrInfo;
														} else {
															return $author$project$Data$User$emptyUserInfo;
														}
													}();
													return A2(
														$author$project$Pages$Hardware$memberSelectedView,
														userInfo,
														$author$project$Data$Ranking$gotRanking(model.er));
												case 8:
													var userInfo = function () {
														var _v5 = model.dl;
														if (_v5.$ === 1) {
															var usrInfo = _v5.a;
															return usrInfo;
														} else {
															return $author$project$Data$User$emptyUserInfo;
														}
													}();
													var ranking = function () {
														var _v4 = model.er;
														if (_v4.$ === 2) {
															var rankng = _v4.a;
															return rankng;
														} else {
															return $author$project$Data$Ranking$emptyRanking;
														}
													}();
													return A2($author$project$Pages$Hardware$spectatorSelectedView, userInfo, ranking);
												case 9:
													var userInfo = function () {
														var _v6 = model.dl;
														if (_v6.$ === 1) {
															var usrInfo = _v6.a;
															return usrInfo;
														} else {
															return $author$project$Data$User$emptyUserInfo;
														}
													}();
													return A2(
														$author$project$Pages$Hardware$dialogueDeleteOwnedView,
														userInfo,
														$author$project$Data$Ranking$gotRanking(model.er));
												case 10:
													var rank = _v1.a;
													var ranking = _v1.b;
													var userInfo = function () {
														var _v7 = model.dl;
														if (_v7.$ === 1) {
															var usrInfo = _v7.a;
															return usrInfo;
														} else {
															return $author$project$Data$User$emptyUserInfo;
														}
													}();
													return A3($author$project$Pages$Hardware$createChallengeView, userInfo, rank, ranking);
												case 11:
													var rank = _v1.a;
													var ranking = _v1.b;
													var userInfo = function () {
														var _v8 = model.dl;
														if (_v8.$ === 1) {
															var usrInfo = _v8.a;
															return usrInfo;
														} else {
															return $author$project$Data$User$emptyUserInfo;
														}
													}();
													return A3($author$project$Pages$Hardware$dialogueConfirmChallengeView, userInfo, rank, ranking);
												case 14:
													var userInfo = function () {
														var _v9 = model.dl;
														if (_v9.$ === 1) {
															var usrInfo = _v9.a;
															return usrInfo;
														} else {
															return $author$project$Data$User$emptyUserInfo;
														}
													}();
													return A2(
														$author$project$Pages$Hardware$confirmJoinView,
														userInfo,
														$author$project$Data$Ranking$gotRanking(model.er));
												case 15:
													var userInfo = function () {
														var _v10 = model.dl;
														if (_v10.$ === 1) {
															var usrInfo = _v10.a;
															return usrInfo;
														} else {
															return $author$project$Data$User$emptyUserInfo;
														}
													}();
													return A2(
														$author$project$Pages$Hardware$confirmLeaveView,
														userInfo,
														$author$project$Data$Ranking$gotRanking(model.er));
												case 16:
													var userInfo = function () {
														var _v11 = model.dl;
														if (_v11.$ === 1) {
															var usrInfo = _v11.a;
															return usrInfo;
														} else {
															return $author$project$Data$User$emptyUserInfo;
														}
													}();
													return $author$project$Pages$Hardware$confirmDeleteUserView(userInfo);
												case 12:
													return A3(
														$author$project$Pages$Hardware$dialoguePrepareResultView,
														$author$project$Data$User$gotUserInfo(model.dl),
														model.oa,
														$author$project$Data$Ranking$gotRanking(model.er));
												default:
													return A2(
														$elm$html$Html$ul,
														_List_Nil,
														_List_fromArray(
															[
																$elm$html$Html$text('error')
															]));
											}
										}()
										]));
						}
					}(),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('split-col')
							]),
						_List_Nil)
					]))
			]));
};
var $author$project$Pages$Hardware$view = function (model) {
	return $author$project$Pages$Hardware$content(model);
};
var $elm$html$Html$h3 = _VirtualDom_node('h3');
var $elm$html$Html$h6 = _VirtualDom_node('h6');
var $author$project$Pages$Market$content = A2(
	$elm$html$Html$section,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$id('page'),
			$elm$html$Html$Attributes$class('section-background')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('split')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('split-col')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$h6,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('')
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('split-col')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$h1,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('text-center')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Market')
								])),
							A2(
							$elm$html$Html$h3,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('text-center')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('')
								])),
							$author$project$Buttons$Default$defaultButton('hardware')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('split-col')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$h6,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('')
								]))
						]))
				]))
		]));
var $author$project$Pages$Market$view = function (_v0) {
	return $author$project$Pages$Market$content;
};
var $author$project$Pages$PingPong$Send = {$: 0};
var $author$project$Pages$PingPong$view = function (model) {
	var _v0 = model.rh;
	var name = _v0.fR;
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				$elm$html$Html$text(name),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Events$onClick($author$project$Pages$PingPong$Send)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Send Ping')
					]))
			]));
};
var $author$project$Pages$Portfolio$htmlContent = A2(
	$elm$html$Html$section,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$id('page'),
			$elm$html$Html$Attributes$class('section-background'),
			$elm$html$Html$Attributes$class('text-center'),
			$elm$html$Html$Attributes$class('split')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('split-col')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$h1,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('')
						]))
				])),
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('split-col')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$h1,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('Portfolio')
						])),
					A2(
					$elm$html$Html$h3,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('Info ')
						])),
					$author$project$Buttons$Default$defaultButton('hardware'),
					A2(
					$elm$html$Html$p,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('Any text              ')
						]))
				])),
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('split-col')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$h1,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('')
						]))
				]))
		]));
var $author$project$Pages$Portfolio$content = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$id('page')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id('content'),
					$elm$html$Html$Attributes$class('col3-column')
				]),
			_List_fromArray(
				[$author$project$Pages$Portfolio$htmlContent]))
		]));
var $author$project$Pages$Portfolio$view = function (_v0) {
	return $author$project$Pages$Portfolio$content;
};
var $elm$html$Html$h4 = _VirtualDom_node('h4');
var $author$project$Pages$Sell$content = A2(
	$elm$html$Html$section,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('section-background'),
			$elm$html$Html$Attributes$id('page')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$h1,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$classList(
					_List_fromArray(
						[
							_Utils_Tuple2('text-center', true),
							_Utils_Tuple2('testimonial', true)
						]))
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Sell')
				])),
			A2(
			$elm$html$Html$h4,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('text-center')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Sell your crypto here'),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('text-center'),
							A2($elm$html$Html$Attributes$style, 'margin-top', '1rem')
						]),
					_List_fromArray(
						[
							$author$project$Buttons$Default$defaultButton('hardware')
						]))
				]))
		]));
var $author$project$Pages$Sell$view = function (_v0) {
	return $author$project$Pages$Sell$content;
};
var $author$project$Pages$Support$content = A2(
	$elm$html$Html$section,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('section-background'),
			$elm$html$Html$Attributes$id('page')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('split')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('split-col')
						]),
					_List_Nil),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('split-col')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$h1,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('text-center')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Support')
								])),
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('text-center')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('We\'re here to help you with any issues you may have.')
								])),
							$author$project$Buttons$Default$defaultButton('hardware')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('split-col')
						]),
					_List_Nil)
				]))
		]));
var $author$project$Pages$Support$view = function (_v0) {
	return $author$project$Pages$Support$content;
};
var $author$project$Main$view = function (model) {
	var contentByPage = function () {
		var _v0 = model.u;
		switch (_v0.$) {
			case 0:
				var dashboard = _v0.a;
				return A2(
					$elm$html$Html$map,
					$author$project$Main$GotDashboardMsg,
					$author$project$Pages$Dashboard$view(dashboard));
			case 1:
				var dashboard = _v0.a;
				return A2(
					$elm$html$Html$map,
					$author$project$Main$GotSellMsg,
					$author$project$Pages$Sell$view(dashboard));
			case 2:
				var terms = _v0.a;
				return A2(
					$elm$html$Html$map,
					$author$project$Main$GotPortfolioMsg,
					$author$project$Pages$Portfolio$view(terms));
			case 3:
				var privacy = _v0.a;
				return A2(
					$elm$html$Html$map,
					$author$project$Main$GotFundsMsg,
					$author$project$Pages$Funds$view(privacy));
			case 4:
				var support = _v0.a;
				return A2(
					$elm$html$Html$map,
					$author$project$Main$GotSupportMsg,
					$author$project$Pages$Support$view(support));
			case 5:
				var pingpong = _v0.a;
				return A2(
					$elm$html$Html$map,
					$author$project$Main$GotPingPongMsg,
					$author$project$Pages$PingPong$view(pingpong));
			case 6:
				var buy = _v0.a;
				return A2(
					$elm$html$Html$map,
					$author$project$Main$GotBuyMsg,
					$author$project$Pages$Buy$view(buy));
			case 7:
				var market = _v0.a;
				return A2(
					$elm$html$Html$map,
					$author$project$Main$GotMarketMsg,
					$author$project$Pages$Market$view(market));
			case 8:
				var hardware = _v0.a;
				return A2(
					$elm$html$Html$map,
					$author$project$Main$GotHardwareMsg,
					$author$project$Pages$Hardware$view(hardware));
			default:
				return $elm$html$Html$text('Not Found');
		}
	}();
	return {
		sV: _List_fromArray(
			[
				$author$project$Main$pageHeader(model.u),
				$author$project$Main$showVideoOrBanner(model.u),
				contentByPage,
				$author$project$Main$footerContent
			]),
		wp: 'Haveno-Web'
	};
};
var $author$project$Main$main = $elm$browser$Browser$application(
	{ul: $author$project$Main$init, u3: $author$project$Main$ChangedUrl, u4: $author$project$Main$ClickedLink, v6: $author$project$Main$subscriptions, wx: $author$project$Main$update, wA: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main($elm$json$Json$Decode$string)(0)}});}(this));
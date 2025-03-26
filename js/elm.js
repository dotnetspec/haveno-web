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
	if (region.at.jl === region.X.jl)
	{
		return 'on line ' + region.at.jl;
	}
	return 'on lines ' + region.at.jl + ' through ' + region.X.jl;
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
		impl.tx,
		impl.vj,
		impl.uY,
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
		c: func(record.c),
		nS: record.nS,
		nL: record.nL
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
		var message = !tag ? value : tag < 3 ? value.a : value.c;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.nS;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.nL) && event.preventDefault(),
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
		impl.tx,
		impl.vj,
		impl.uY,
		function(sendToApp, initialModel) {
			var view = impl.vk;
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
		impl.tx,
		impl.vj,
		impl.uY,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.ej && impl.ej(sendToApp)
			var view = impl.vk;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.sk);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.ve) && (_VirtualDom_doc.title = title = doc.ve);
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
	var onUrlChange = impl.t4;
	var onUrlRequest = impl.t5;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		ej: function(sendToApp)
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
							&& curr.ko === next.ko
							&& curr.mQ === next.mQ
							&& curr.kh.a === next.kh.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		tx: function(flags)
		{
			return A3(impl.tx, flags, _Browser_getUrl(), key);
		},
		vk: impl.vk,
		vj: impl.vj,
		uY: impl.uY
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
		? { tn: 'hidden', sv: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { tn: 'mozHidden', sv: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { tn: 'msHidden', sv: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { tn: 'webkitHidden', sv: 'webkitvisibilitychange' }
		: { tn: 'hidden', sv: 'visibilitychange' };
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
		q_: _Browser_getScene(),
		rK: {
			rT: _Browser_window.pageXOffset,
			rW: _Browser_window.pageYOffset,
			dn: _Browser_doc.documentElement.clientWidth,
			iD: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		dn: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		iD: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
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
			q_: {
				dn: node.scrollWidth,
				iD: node.scrollHeight
			},
			rK: {
				rT: node.scrollLeft,
				rW: node.scrollTop,
				dn: node.clientWidth,
				iD: node.clientHeight
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
			q_: _Browser_getScene(),
			rK: {
				rT: x,
				rW: y,
				dn: _Browser_doc.documentElement.clientWidth,
				iD: _Browser_doc.documentElement.clientHeight
			},
			dq: {
				rT: x + rect.left,
				rW: y + rect.top,
				dn: rect.width,
				iD: rect.height
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



// SEND REQUEST

var _Http_toTask = F3(function(router, toTask, request)
{
	return _Scheduler_binding(function(callback)
	{
		function done(response) {
			callback(toTask(request.s0.a(response)));
		}

		var xhr = new XMLHttpRequest();
		xhr.addEventListener('error', function() { done($elm$http$Http$NetworkError_); });
		xhr.addEventListener('timeout', function() { done($elm$http$Http$Timeout_); });
		xhr.addEventListener('load', function() { done(_Http_toResponse(request.s0.b, xhr)); });
		$elm$core$Maybe$isJust(request.ni) && _Http_track(router, xhr, request.ni.a);

		try {
			xhr.open(request.pW, request.dl, true);
		} catch (e) {
			return done($elm$http$Http$BadUrl_(request.dl));
		}

		_Http_configureRequest(xhr, request);

		request.sk.a && xhr.setRequestHeader('Content-Type', request.sk.a);
		xhr.send(request.sk.b);

		return function() { xhr.c = true; xhr.abort(); };
	});
});


// CONFIGURE

function _Http_configureRequest(xhr, request)
{
	for (var headers = request.bI; headers.b; headers = headers.b) // WHILE_CONS
	{
		xhr.setRequestHeader(headers.a.a, headers.a.b);
	}
	xhr.timeout = request.lM.a || 0;
	xhr.responseType = request.s0.d;
	xhr.withCredentials = request.r7;
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
		dl: xhr.responseURL,
		uS: xhr.status,
		uT: xhr.statusText,
		bI: _Http_parseHeaders(xhr.getAllResponseHeaders())
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
			uI: event.loaded,
			uM: event.total
		}))));
	});
	xhr.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Receiving({
			un: event.loaded,
			uM: event.lengthComputable ? $elm$core$Maybe$Just(event.total) : $elm$core$Maybe$Nothing
		}))));
	});
}var $author$project$Main$ChangedUrl = function (a) {
	return {$: 11, a: a};
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
		if (!builder.ap) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.au),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.au);
		} else {
			var treeLen = builder.ap * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.av) : builder.av;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.ap);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.au) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.au);
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
					{av: nodeList, ap: (len / $elm$core$Array$branchFactor) | 0, au: tail});
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
		return {s8: fragment, mQ: host, uf: path, kh: port_, ko: protocol, um: query};
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
var $author$project$Main$Loading = 0;
var $author$project$Main$SplashPage = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$decodeString = _Json_runOnString;
var $author$project$Proto$Io$Haveno$Protobuffer$Internals_$defaultProto__Io__Haveno__Protobuffer__BalancesInfo = {sr: $elm$core$Maybe$Nothing, rU: $elm$core$Maybe$Nothing};
var $author$project$Proto$Io$Haveno$Protobuffer$defaultBalancesInfo = $author$project$Proto$Io$Haveno$Protobuffer$Internals_$defaultProto__Io__Haveno__Protobuffer__BalancesInfo;
var $author$project$Pages$Splash$Loading = 0;
var $author$project$Pages$Splash$Model = F7(
	function (status, pagetitle, root, balances, primaryaddress, version, errors) {
		return {bH: balances, dF: errors, qj: pagetitle, f1: primaryaddress, qR: root, dL: status, bF: version};
	});
var $author$project$Pages$Splash$Splash = $elm$core$Basics$identity;
var $author$project$Pages$Splash$initialModel = A7(
	$author$project$Pages$Splash$Model,
	0,
	'Splash',
	{tU: 'Loading...'},
	$elm$core$Maybe$Nothing,
	'',
	'',
	_List_Nil);
var $elm$time$Time$Posix = $elm$core$Basics$identity;
var $elm$time$Time$millisToPosix = $elm$core$Basics$identity;
var $author$project$Pages$Accounts$BTC = 0;
var $author$project$Pages$Accounts$Loaded = 0;
var $author$project$Pages$Accounts$ManageAccounts = 0;
var $author$project$Pages$Accounts$initialModel = {
	bH: $elm$core$Maybe$Just($author$project$Proto$Io$Haveno$Protobuffer$defaultBalancesInfo),
	no: 0,
	sK: 0,
	dF: _List_Nil,
	pB: false,
	pM: _List_Nil,
	mT: _List_Nil,
	jO: '',
	qj: 'Accounts',
	f1: '',
	dL: 0,
	na: ''
};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Pages$Accounts$init = function (_v0) {
	return _Utils_Tuple2($author$project$Pages$Accounts$initialModel, $elm$core$Platform$Cmd$none);
};
var $author$project$Pages$Buy$GotInitialModel = $elm$core$Basics$identity;
var $author$project$Pages$Buy$Buy = $elm$core$Basics$identity;
var $author$project$Pages$Buy$Loading = 0;
var $author$project$Pages$Buy$initialModel = {
	qR: {tU: 'Loading...'},
	dL: 0,
	ve: 'Buy'
};
var $elm$core$Platform$Cmd$map = _Platform_map;
var $author$project$Pages$Buy$init = function (_v0) {
	return _Utils_Tuple2(
		_Utils_update(
			$author$project$Pages$Buy$initialModel,
			{ve: 'Haveno-Web Buy'}),
		A2($elm$core$Platform$Cmd$map, $elm$core$Basics$identity, $elm$core$Platform$Cmd$none));
};
var $author$project$Pages$Connect$initialModel = {eZ: 0, e2: '', tk: false, mY: 'node.haveno.network:17750', f1: '', nP: false, m2: false, vl: false};
var $author$project$Pages$Connect$init = function (_v0) {
	return _Utils_Tuple2($author$project$Pages$Connect$initialModel, $elm$core$Platform$Cmd$none);
};
var $author$project$Pages$Donate$DonateView = 0;
var $author$project$Pages$Donate$Loaded = 0;
var $author$project$Pages$Donate$initialModel = {
	bH: $elm$core$Maybe$Just($author$project$Proto$Io$Haveno$Protobuffer$defaultBalancesInfo),
	sK: 0,
	dF: _List_Nil,
	pB: false,
	qj: 'Donate',
	f1: '',
	dL: 0,
	na: ''
};
var $author$project$Pages$Donate$init = function (_v0) {
	return _Utils_Tuple2($author$project$Pages$Donate$initialModel, $elm$core$Platform$Cmd$none);
};
var $author$project$Pages$Funds$FundsView = 0;
var $author$project$Pages$Funds$Loaded = 0;
var $author$project$Pages$Funds$initialModel = {
	bH: $elm$core$Maybe$Just($author$project$Proto$Io$Haveno$Protobuffer$defaultBalancesInfo),
	sK: 0,
	dF: _List_Nil,
	pB: false,
	qj: 'Funds',
	f1: '',
	dL: 0,
	na: ''
};
var $author$project$Pages$Funds$init = function (_v0) {
	return _Utils_Tuple2($author$project$Pages$Funds$initialModel, $elm$core$Platform$Cmd$none);
};
var $author$project$Pages$Market$GotInitialModel = $elm$core$Basics$identity;
var $author$project$Pages$Market$Loading = 0;
var $author$project$Pages$Market$Market = $elm$core$Basics$identity;
var $author$project$Pages$Market$initialModel = {
	qR: {tU: 'Loading...'},
	dL: 0,
	ve: 'Market'
};
var $author$project$Pages$Market$init = function (_v0) {
	return _Utils_Tuple2(
		_Utils_update(
			$author$project$Pages$Market$initialModel,
			{ve: 'Haveno-Web Market'}),
		A2($elm$core$Platform$Cmd$map, $elm$core$Basics$identity, $elm$core$Platform$Cmd$none));
};
var $author$project$Pages$Portfolio$GotInitialModel = $elm$core$Basics$identity;
var $author$project$Pages$Portfolio$Loading = 0;
var $author$project$Pages$Portfolio$Portfolio = $elm$core$Basics$identity;
var $author$project$Pages$Portfolio$initialModel = {
	qR: {tU: 'Loading...'},
	dL: 0,
	ve: 'Portfolio'
};
var $author$project$Pages$Portfolio$init = function (_v0) {
	return _Utils_Tuple2(
		_Utils_update(
			$author$project$Pages$Portfolio$initialModel,
			{ve: 'Haveno-Web Portfolio'}),
		A2($elm$core$Platform$Cmd$map, $elm$core$Basics$identity, $elm$core$Platform$Cmd$none));
};
var $author$project$Pages$Sell$GotInitialModel = $elm$core$Basics$identity;
var $author$project$Pages$Sell$Loading = 0;
var $author$project$Pages$Sell$Sell = $elm$core$Basics$identity;
var $author$project$Pages$Sell$initialModel = {
	qR: {tU: 'Loading...'},
	dL: 0,
	ve: 'Sell'
};
var $author$project$Pages$Sell$init = function (_v0) {
	return _Utils_Tuple2(
		$author$project$Pages$Sell$initialModel,
		A2($elm$core$Platform$Cmd$map, $elm$core$Basics$identity, $elm$core$Platform$Cmd$none));
};
var $author$project$Pages$Splash$NoOp = 0;
var $author$project$Pages$Splash$init = function (fromMainToSplash) {
	var newModel = A7(
		$author$project$Pages$Splash$Model,
		0,
		'Splash',
		{tU: 'Loading...'},
		$elm$core$Maybe$Nothing,
		'',
		fromMainToSplash.pj,
		_List_Nil);
	return _Utils_Tuple2(
		newModel,
		A2(
			$elm$core$Platform$Cmd$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Platform$Cmd$none));
};
var $author$project$Pages$Support$GotInitialModel = $elm$core$Basics$identity;
var $author$project$Pages$Support$Loading = 0;
var $author$project$Pages$Support$Support = $elm$core$Basics$identity;
var $author$project$Pages$Support$initialModel = {
	qR: {tU: 'Loading...'},
	dL: 0,
	ve: 'Support'
};
var $author$project$Pages$Support$init = function (_v0) {
	return _Utils_Tuple2(
		_Utils_update(
			$author$project$Pages$Support$initialModel,
			{ve: 'Haveno-Web Support'}),
		A2($elm$core$Platform$Cmd$map, $elm$core$Basics$identity, $elm$core$Platform$Cmd$none));
};
var $elm$url$Url$Parser$State = F5(
	function (visited, unvisited, params, frag, value) {
		return {d_: frag, ea: params, dN: unvisited, ao: value, eq: visited};
	});
var $elm$url$Url$Parser$getFirstMatch = function (states) {
	getFirstMatch:
	while (true) {
		if (!states.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var state = states.a;
			var rest = states.b;
			var _v1 = state.dN;
			if (!_v1.b) {
				return $elm$core$Maybe$Just(state.ao);
			} else {
				if ((_v1.a === '') && (!_v1.b.b)) {
					return $elm$core$Maybe$Just(state.ao);
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
var $elm$url$Url$percentDecode = _Url_percentDecode;
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
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
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
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
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
					$elm$url$Url$Parser$preparePath(url.uf),
					$elm$url$Url$Parser$prepareQuery(url.um),
					url.s8,
					$elm$core$Basics$identity)));
	});
var $author$project$Main$AccountsPage = function (a) {
	return {$: 7, a: a};
};
var $author$project$Main$GotAccountsMsg = function (a) {
	return {$: 8, a: a};
};
var $author$project$Main$toAccounts = F2(
	function (model, _v0) {
		var accounts = _v0.a;
		var cmd = _v0.b;
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					E: $author$project$Main$AccountsPage(
						_Utils_update(
							accounts,
							{bH: model.bH}))
				}),
			A2($elm$core$Platform$Cmd$map, $author$project$Main$GotAccountsMsg, cmd));
	});
var $author$project$Main$ConnectPage = function (a) {
	return {$: 9, a: a};
};
var $author$project$Main$GotConnectMsg = function (a) {
	return {$: 10, a: a};
};
var $author$project$Main$Loaded = 1;
var $elm$core$Basics$not = _Basics_not;
var $author$project$Main$isXMRWalletConnected = function (model) {
	return (!(model.f1 === '')) ? true : false;
};
var $author$project$Main$toConnect = F2(
	function (model, _v0) {
		var connect = _v0.a;
		var cmd = _v0.b;
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					E: $author$project$Main$ConnectPage(
						_Utils_update(
							connect,
							{
								tk: model.dv,
								vl: $author$project$Main$isXMRWalletConnected(model)
							})),
					dL: 1
				}),
			A2($elm$core$Platform$Cmd$map, $author$project$Main$GotConnectMsg, cmd));
	});
var $author$project$Main$DonatePage = function (a) {
	return {$: 8, a: a};
};
var $author$project$Main$GotDonateMsg = function (a) {
	return {$: 9, a: a};
};
var $author$project$Main$toDonate = F2(
	function (model, _v0) {
		var donate = _v0.a;
		var cmd = _v0.b;
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					E: $author$project$Main$DonatePage(donate)
				}),
			A2($elm$core$Platform$Cmd$map, $author$project$Main$GotDonateMsg, cmd));
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
		var newFundsModel = _Utils_update(
			funds,
			{bH: model.bH});
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					E: $author$project$Main$FundsPage(newFundsModel)
				}),
			A2($elm$core$Platform$Cmd$map, $author$project$Main$GotFundsMsg, cmd));
	});
var $author$project$Main$GotMarketMsg = function (a) {
	return {$: 7, a: a};
};
var $author$project$Main$MarketPage = function (a) {
	return {$: 6, a: a};
};
var $author$project$Main$toMarket = F2(
	function (model, _v0) {
		var market = _v0.a;
		var cmd = _v0.b;
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					E: $author$project$Main$MarketPage(market)
				}),
			A2($elm$core$Platform$Cmd$map, $author$project$Main$GotMarketMsg, cmd));
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
					E: $author$project$Main$PortfolioPage(portfolio)
				}),
			A2($elm$core$Platform$Cmd$map, $author$project$Main$GotPortfolioMsg, cmd));
	});
var $author$project$Main$BuyPage = function (a) {
	return {$: 5, a: a};
};
var $author$project$Main$GotBuyMsg = function (a) {
	return {$: 6, a: a};
};
var $author$project$Main$toPricing = F2(
	function (model, _v0) {
		var pricing = _v0.a;
		var cmd = _v0.b;
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					E: $author$project$Main$BuyPage(pricing)
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
					E: $author$project$Main$SellPage(sell)
				}),
			A2($elm$core$Platform$Cmd$map, $author$project$Main$GotSellMsg, cmd));
	});
var $author$project$Main$GotXmrPrimaryAddress = function (a) {
	return {$: 16, a: a};
};
var $author$project$Proto$Io$Haveno$Protobuffer$Internals_$defaultProto__Io__Haveno__Protobuffer__GetVersionRequest = {};
var $author$project$Proto$Io$Haveno$Protobuffer$defaultGetVersionRequest = $author$project$Proto$Io$Haveno$Protobuffer$Internals_$defaultProto__Io__Haveno__Protobuffer__GetVersionRequest;
var $author$project$Main$GotBalances = function (a) {
	return {$: 15, a: a};
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
				bI: A2(
					$elm$core$List$cons,
					A2($elm$http$Http$header, key, value),
					req.bI)
			});
	});
var $author$project$Proto$Io$Haveno$Protobuffer$Internals_$defaultProto__Io__Haveno__Protobuffer__GetBalancesRequest = {g: ''};
var $author$project$Proto$Io$Haveno$Protobuffer$defaultGetBalancesRequest = $author$project$Proto$Io$Haveno$Protobuffer$Internals_$defaultProto__Io__Haveno__Protobuffer__GetBalancesRequest;
var $anmolitor$elm_grpc$Grpc$Internal$Rpc = $elm$core$Basics$identity;
var $eriktim$elm_protocol_buffers$Internal$Int64$Int64 = $elm$core$Basics$identity;
var $elm$core$Bitwise$or = _Bitwise_or;
var $eriktim$elm_protocol_buffers$Internal$Int64$fromInts = F2(
	function (higher, lower) {
		return {to: 0 | higher, nE: 0 | lower};
	});
var $eriktim$elm_protocol_buffers$Protobuf$Types$Int64$fromInts = $eriktim$elm_protocol_buffers$Internal$Int64$fromInts;
var $author$project$Proto$Io$Haveno$Protobuffer$Internals_$defaultProto__Io__Haveno__Protobuffer__BtcBalanceInfo = {
	oo: A2($eriktim$elm_protocol_buffers$Protobuf$Types$Int64$fromInts, 0, 0),
	jm: A2($eriktim$elm_protocol_buffers$Protobuf$Types$Int64$fromInts, 0, 0),
	kG: A2($eriktim$elm_protocol_buffers$Protobuf$Types$Int64$fromInts, 0, 0),
	lQ: A2($eriktim$elm_protocol_buffers$Protobuf$Types$Int64$fromInts, 0, 0)
};
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
var $eriktim$elm_protocol_buffers$Internal$Int32$operations = {s9: $elm$core$Basics$identity, ta: $eriktim$elm_protocol_buffers$Internal$Int32$fromSigned, tb: $eriktim$elm_protocol_buffers$Internal$Int32$fromZigZag, ui: $eriktim$elm_protocol_buffers$Internal$Int32$popBase128, ul: $eriktim$elm_protocol_buffers$Internal$Int32$pushBase128, vf: $eriktim$elm_protocol_buffers$Internal$Int32$toSigned, vg: $eriktim$elm_protocol_buffers$Internal$Int32$toZigZag};
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
						A2(config.ul, 127 & octet, value));
				},
				$eriktim$elm_protocol_buffers$Protobuf$Decode$varIntDecoder(config)) : $elm$bytes$Bytes$Decode$succeed(
				_Utils_Tuple2(
					1,
					config.s9(octet)));
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
		return (state.dn <= 0) ? ($elm$core$Set$isEmpty(state.kD) ? $elm$bytes$Bytes$Decode$succeed(
			$elm$bytes$Bytes$Decode$Done(
				_Utils_Tuple2(width, state.tR))) : $elm$bytes$Bytes$Decode$fail) : A2(
			$elm$bytes$Bytes$Decode$andThen,
			function (_v0) {
				var usedBytes = _v0.a;
				var _v1 = _v0.b;
				var fieldNumber = _v1.a;
				var wireType = _v1.b;
				var _v2 = A2($elm$core$Dict$get, fieldNumber, state.ns);
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
										tR: fn(state.tR),
										kD: A2($elm$core$Set$remove, fieldNumber, state.kD),
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
					{ns: dict, tR: v, kD: requiredSet, dn: width},
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
var $eriktim$elm_protocol_buffers$Internal$Int64$fromBase128 = $eriktim$elm_protocol_buffers$Internal$Int64$fromInts(0);
var $eriktim$elm_protocol_buffers$Internal$Int64$and = F2(
	function (n, _v0) {
		var lower = _v0.nE;
		return A2($eriktim$elm_protocol_buffers$Internal$Int64$fromInts, 0, n & lower);
	});
var $elm$core$Bitwise$complement = _Bitwise_complement;
var $eriktim$elm_protocol_buffers$Internal$Int64$negate = function (_int) {
	var higher = _int.to;
	var lower = _int.nE;
	return ((!lower) && (!higher)) ? _int : A2($eriktim$elm_protocol_buffers$Internal$Int64$fromInts, ~higher, (~lower) + 1);
};
var $eriktim$elm_protocol_buffers$Internal$Int64$shiftRightZfBy = F2(
	function (n, _v0) {
		var higher = _v0.to;
		var lower = _v0.nE;
		if (n > 32) {
			return A2($eriktim$elm_protocol_buffers$Internal$Int64$fromInts, 0, higher >>> n);
		} else {
			var carry = higher << (32 - n);
			var newLower = (carry | (lower >>> n)) >>> 0;
			return A2($eriktim$elm_protocol_buffers$Internal$Int64$fromInts, higher >>> n, newLower);
		}
	});
var $eriktim$elm_protocol_buffers$Internal$Int64$xor = F2(
	function (_v0, _v1) {
		var a = _v0;
		var b = _v1;
		return A2($eriktim$elm_protocol_buffers$Internal$Int64$fromInts, a.to ^ b.to, a.nE ^ b.nE);
	});
var $eriktim$elm_protocol_buffers$Internal$Int64$fromZigZag = function (value) {
	return A2(
		$eriktim$elm_protocol_buffers$Internal$Int64$xor,
		A2($eriktim$elm_protocol_buffers$Internal$Int64$shiftRightZfBy, 1, value),
		$eriktim$elm_protocol_buffers$Internal$Int64$negate(
			A2($eriktim$elm_protocol_buffers$Internal$Int64$and, 1, value)));
};
var $eriktim$elm_protocol_buffers$Internal$Int64$popBase128 = function (_int) {
	var lower = _int.nE;
	var higherBits = A2($eriktim$elm_protocol_buffers$Internal$Int64$shiftRightZfBy, 7, _int);
	var base128 = 127 & lower;
	return _Utils_Tuple2(base128, higherBits);
};
var $eriktim$elm_protocol_buffers$Internal$Int64$addUnsafe = F2(
	function (n, _v0) {
		var higher = _v0.to;
		var lower = _v0.nE;
		return A2($eriktim$elm_protocol_buffers$Internal$Int64$fromInts, higher, n + lower);
	});
var $eriktim$elm_protocol_buffers$Internal$Int64$shiftLeftBy = F2(
	function (n, _v0) {
		var higher = _v0.to;
		var lower = _v0.nE;
		if (n > 32) {
			return A2($eriktim$elm_protocol_buffers$Internal$Int64$fromInts, lower << n, 0);
		} else {
			var carry = lower >>> (32 - n);
			var newHigher = carry | (higher << n);
			return A2($eriktim$elm_protocol_buffers$Internal$Int64$fromInts, newHigher, lower << n);
		}
	});
var $eriktim$elm_protocol_buffers$Internal$Int64$pushBase128 = F2(
	function (base128, _int) {
		return A2(
			$eriktim$elm_protocol_buffers$Internal$Int64$addUnsafe,
			base128,
			A2($eriktim$elm_protocol_buffers$Internal$Int64$shiftLeftBy, 7, _int));
	});
var $eriktim$elm_protocol_buffers$Internal$Int64$shiftRightBy63 = function (_v0) {
	var higher = _v0.to;
	var onlyOnesOrZeros = higher >> 31;
	return A2($eriktim$elm_protocol_buffers$Internal$Int64$fromInts, onlyOnesOrZeros, onlyOnesOrZeros);
};
var $eriktim$elm_protocol_buffers$Internal$Int64$toZigZag = function (value) {
	return A2(
		$eriktim$elm_protocol_buffers$Internal$Int64$xor,
		$eriktim$elm_protocol_buffers$Internal$Int64$shiftRightBy63(value),
		A2($eriktim$elm_protocol_buffers$Internal$Int64$shiftLeftBy, 1, value));
};
var $eriktim$elm_protocol_buffers$Internal$Int64$operations = {s9: $eriktim$elm_protocol_buffers$Internal$Int64$fromBase128, ta: $elm$core$Basics$identity, tb: $eriktim$elm_protocol_buffers$Internal$Int64$fromZigZag, ui: $eriktim$elm_protocol_buffers$Internal$Int64$popBase128, ul: $eriktim$elm_protocol_buffers$Internal$Int64$pushBase128, vf: $elm$core$Basics$identity, vg: $eriktim$elm_protocol_buffers$Internal$Int64$toZigZag};
var $eriktim$elm_protocol_buffers$Protobuf$Decode$packedDecoder = F2(
	function (decoderWireType, decoder) {
		return function (wireType) {
			if (wireType.$ === 2) {
				return decoder;
			} else {
				return _Utils_eq(wireType, decoderWireType) ? decoder : $elm$bytes$Bytes$Decode$fail;
			}
		};
	});
var $eriktim$elm_protocol_buffers$Protobuf$Decode$uintDecoder = function (config) {
	return A2(
		$eriktim$elm_protocol_buffers$Protobuf$Decode$packedDecoder,
		$eriktim$elm_protocol_buffers$Internal$Protobuf$VarInt,
		A2(
			$elm$bytes$Bytes$Decode$map,
			$elm$core$Tuple$mapSecond(config.ta),
			$eriktim$elm_protocol_buffers$Protobuf$Decode$varIntDecoder(config)));
};
var $eriktim$elm_protocol_buffers$Protobuf$Decode$uint64 = $eriktim$elm_protocol_buffers$Protobuf$Decode$uintDecoder($eriktim$elm_protocol_buffers$Internal$Int64$operations);
var $author$project$Proto$Io$Haveno$Protobuffer$Internals_$decodeProto__Io__Haveno__Protobuffer__BtcBalanceInfo = A2(
	$eriktim$elm_protocol_buffers$Protobuf$Decode$message,
	$author$project$Proto$Io$Haveno$Protobuffer$Internals_$defaultProto__Io__Haveno__Protobuffer__BtcBalanceInfo,
	_List_fromArray(
		[
			A3(
			$eriktim$elm_protocol_buffers$Protobuf$Decode$optional,
			1,
			$eriktim$elm_protocol_buffers$Protobuf$Decode$uint64,
			F2(
				function (a, r) {
					return _Utils_update(
						r,
						{oo: a});
				})),
			A3(
			$eriktim$elm_protocol_buffers$Protobuf$Decode$optional,
			2,
			$eriktim$elm_protocol_buffers$Protobuf$Decode$uint64,
			F2(
				function (a, r) {
					return _Utils_update(
						r,
						{kG: a});
				})),
			A3(
			$eriktim$elm_protocol_buffers$Protobuf$Decode$optional,
			3,
			$eriktim$elm_protocol_buffers$Protobuf$Decode$uint64,
			F2(
				function (a, r) {
					return _Utils_update(
						r,
						{lQ: a});
				})),
			A3(
			$eriktim$elm_protocol_buffers$Protobuf$Decode$optional,
			4,
			$eriktim$elm_protocol_buffers$Protobuf$Decode$uint64,
			F2(
				function (a, r) {
					return _Utils_update(
						r,
						{jm: a});
				}))
		]));
var $author$project$Proto$Io$Haveno$Protobuffer$Internals_$defaultProto__Io__Haveno__Protobuffer__XmrBalanceInfo = {
	oo: A2($eriktim$elm_protocol_buffers$Protobuf$Types$Int64$fromInts, 0, 0),
	bR: A2($eriktim$elm_protocol_buffers$Protobuf$Types$Int64$fromInts, 0, 0),
	kd: A2($eriktim$elm_protocol_buffers$Protobuf$Types$Int64$fromInts, 0, 0),
	us: A2($eriktim$elm_protocol_buffers$Protobuf$Types$Int64$fromInts, 0, 0),
	kH: A2($eriktim$elm_protocol_buffers$Protobuf$Types$Int64$fromInts, 0, 0)
};
var $author$project$Proto$Io$Haveno$Protobuffer$Internals_$decodeProto__Io__Haveno__Protobuffer__XmrBalanceInfo = A2(
	$eriktim$elm_protocol_buffers$Protobuf$Decode$message,
	$author$project$Proto$Io$Haveno$Protobuffer$Internals_$defaultProto__Io__Haveno__Protobuffer__XmrBalanceInfo,
	_List_fromArray(
		[
			A3(
			$eriktim$elm_protocol_buffers$Protobuf$Decode$optional,
			1,
			$eriktim$elm_protocol_buffers$Protobuf$Decode$uint64,
			F2(
				function (a, r) {
					return _Utils_update(
						r,
						{bR: a});
				})),
			A3(
			$eriktim$elm_protocol_buffers$Protobuf$Decode$optional,
			2,
			$eriktim$elm_protocol_buffers$Protobuf$Decode$uint64,
			F2(
				function (a, r) {
					return _Utils_update(
						r,
						{oo: a});
				})),
			A3(
			$eriktim$elm_protocol_buffers$Protobuf$Decode$optional,
			3,
			$eriktim$elm_protocol_buffers$Protobuf$Decode$uint64,
			F2(
				function (a, r) {
					return _Utils_update(
						r,
						{kd: a});
				})),
			A3(
			$eriktim$elm_protocol_buffers$Protobuf$Decode$optional,
			4,
			$eriktim$elm_protocol_buffers$Protobuf$Decode$uint64,
			F2(
				function (a, r) {
					return _Utils_update(
						r,
						{us: a});
				})),
			A3(
			$eriktim$elm_protocol_buffers$Protobuf$Decode$optional,
			5,
			$eriktim$elm_protocol_buffers$Protobuf$Decode$uint64,
			F2(
				function (a, r) {
					return _Utils_update(
						r,
						{kH: a});
				}))
		]));
var $author$project$Proto$Io$Haveno$Protobuffer$Internals_$decodeProto__Io__Haveno__Protobuffer__BalancesInfo = A2(
	$eriktim$elm_protocol_buffers$Protobuf$Decode$message,
	$author$project$Proto$Io$Haveno$Protobuffer$Internals_$defaultProto__Io__Haveno__Protobuffer__BalancesInfo,
	_List_fromArray(
		[
			A3(
			$eriktim$elm_protocol_buffers$Protobuf$Decode$optional,
			1,
			A2($eriktim$elm_protocol_buffers$Protobuf$Decode$map, $elm$core$Maybe$Just, $author$project$Proto$Io$Haveno$Protobuffer$Internals_$decodeProto__Io__Haveno__Protobuffer__BtcBalanceInfo),
			F2(
				function (a, r) {
					return _Utils_update(
						r,
						{sr: a});
				})),
			A3(
			$eriktim$elm_protocol_buffers$Protobuf$Decode$optional,
			2,
			A2($eriktim$elm_protocol_buffers$Protobuf$Decode$map, $elm$core$Maybe$Just, $author$project$Proto$Io$Haveno$Protobuffer$Internals_$decodeProto__Io__Haveno__Protobuffer__XmrBalanceInfo),
			F2(
				function (a, r) {
					return _Utils_update(
						r,
						{rU: a});
				}))
		]));
var $author$project$Proto$Io$Haveno$Protobuffer$Internals_$defaultProto__Io__Haveno__Protobuffer__GetBalancesReply = {bH: $elm$core$Maybe$Nothing};
var $author$project$Proto$Io$Haveno$Protobuffer$Internals_$decodeProto__Io__Haveno__Protobuffer__GetBalancesReply = A2(
	$eriktim$elm_protocol_buffers$Protobuf$Decode$message,
	$author$project$Proto$Io$Haveno$Protobuffer$Internals_$defaultProto__Io__Haveno__Protobuffer__GetBalancesReply,
	_List_fromArray(
		[
			A3(
			$eriktim$elm_protocol_buffers$Protobuf$Decode$optional,
			1,
			A2($eriktim$elm_protocol_buffers$Protobuf$Decode$map, $elm$core$Maybe$Just, $author$project$Proto$Io$Haveno$Protobuffer$Internals_$decodeProto__Io__Haveno__Protobuffer__BalancesInfo),
			F2(
				function (a, r) {
					return _Utils_update(
						r,
						{bH: a});
				}))
		]));
var $author$project$Proto$Io$Haveno$Protobuffer$decodeGetBalancesReply = $author$project$Proto$Io$Haveno$Protobuffer$Internals_$decodeProto__Io__Haveno__Protobuffer__GetBalancesReply;
var $eriktim$elm_protocol_buffers$Protobuf$Encode$Encoder = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
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
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $elm$bytes$Bytes$Encode$U8 = function (a) {
	return {$: 3, a: a};
};
var $elm$bytes$Bytes$Encode$unsignedInt8 = $elm$bytes$Bytes$Encode$U8;
var $eriktim$elm_protocol_buffers$Protobuf$Encode$toVarIntEncoders = F2(
	function (config, value) {
		var _v0 = config.ui(value);
		var base128 = _v0.a;
		var higherBits = _v0.b;
		return _Utils_eq(
			higherBits,
			config.s9(0)) ? _List_fromArray(
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
var $elm$bytes$Bytes$Encode$getStringWidth = _Bytes_getStringWidth;
var $elm$bytes$Bytes$Encode$Utf8 = F2(
	function (a, b) {
		return {$: 9, a: a, b: b};
	});
var $elm$bytes$Bytes$Encode$string = function (str) {
	return A2(
		$elm$bytes$Bytes$Encode$Utf8,
		_Bytes_getStringWidth(str),
		str);
};
var $eriktim$elm_protocol_buffers$Protobuf$Encode$string = function (v) {
	var width = $elm$bytes$Bytes$Encode$getStringWidth(v);
	return A2(
		$eriktim$elm_protocol_buffers$Protobuf$Encode$Encoder,
		$eriktim$elm_protocol_buffers$Internal$Protobuf$LengthDelimited(width),
		_Utils_Tuple2(
			width,
			$elm$bytes$Bytes$Encode$string(v)));
};
var $author$project$Proto$Io$Haveno$Protobuffer$Internals_$encodeProto__Io__Haveno__Protobuffer__GetBalancesRequest = function (value) {
	return $eriktim$elm_protocol_buffers$Protobuf$Encode$message(
		_List_fromArray(
			[
				_Utils_Tuple2(
				1,
				$eriktim$elm_protocol_buffers$Protobuf$Encode$string(value.g))
			]));
};
var $author$project$Proto$Io$Haveno$Protobuffer$encodeGetBalancesRequest = $author$project$Proto$Io$Haveno$Protobuffer$Internals_$encodeProto__Io__Haveno__Protobuffer__GetBalancesRequest;
var $author$project$Proto$Io$Haveno$Protobuffer$Wallets$getBalances = {sN: $author$project$Proto$Io$Haveno$Protobuffer$decodeGetBalancesReply, sZ: $author$project$Proto$Io$Haveno$Protobuffer$encodeGetBalancesRequest, ud: 'io.haveno.protobuffer', uA: 'GetBalances', uJ: 'Wallets'};
var $anmolitor$elm_grpc$Grpc$grpcContentType = 'application/grpc-web+proto';
var $anmolitor$elm_grpc$Grpc$new = F2(
	function (rpc, req) {
		return {
			sk: req,
			bI: _List_fromArray(
				[
					A2($elm$http$Http$header, 'accept', $anmolitor$elm_grpc$Grpc$grpcContentType)
				]),
			mQ: '',
			m3: false,
			kK: rpc,
			lM: $elm$core$Maybe$Nothing,
			ni: $elm$core$Maybe$Nothing
		};
	});
var $anmolitor$elm_grpc$Grpc$setHost = F2(
	function (host, _v0) {
		var req = _v0;
		return _Utils_update(
			req,
			{mQ: host});
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
var $elm$core$Maybe$isJust = function (maybe) {
	if (!maybe.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
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
	return {c: message};
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
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $anmolitor$elm_grpc$Grpc$handleResponse = F2(
	function (decoder, httpResponse) {
		var parseResponse = F3(
			function (isGoodStatus, metadata, bytes) {
				var defaultGrpcStatus = isGoodStatus ? 0 : $anmolitor$elm_grpc$Grpc$httpBadStatusToGrpcStatus(metadata.uS);
				var grpcStatus = A2(
					$elm$core$Maybe$withDefault,
					defaultGrpcStatus,
					A2(
						$elm$core$Maybe$andThen,
						$anmolitor$elm_grpc$Grpc$errCodeFromInt,
						A2(
							$elm$core$Maybe$andThen,
							$elm$core$String$toInt,
							A2($elm$core$Dict$get, 'grpc-status', metadata.bI))));
				if (!grpcStatus) {
					return A2(
						$elm$core$Result$fromMaybe,
						$anmolitor$elm_grpc$Grpc$BadBody(bytes),
						A2(
							$elm$core$Maybe$andThen,
							function (response) {
								return A2($eriktim$elm_protocol_buffers$Protobuf$Decode$decode, decoder, response.c);
							},
							A2($elm$bytes$Bytes$Decode$decode, $anmolitor$elm_grpc$Grpc$responseDecoder, bytes)));
				} else {
					var errMessage = A2(
						$elm$core$Maybe$withDefault,
						metadata.uT,
						A2($elm$core$Dict$get, 'grpc-message', metadata.bI));
					return $elm$core$Result$Err(
						$anmolitor$elm_grpc$Grpc$BadStatus(
							{s_: errMessage, cA: metadata, uu: bytes, dL: grpcStatus}));
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
		return {qM: reqs, rn: subs};
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
							var _v4 = req.ni;
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
			A3($elm$http$Http$updateReqs, router, cmds, state.qM));
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
					state.rn)));
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
					r7: r.r7,
					sk: r.sk,
					s0: A2(_Http_mapExpect, func, r.s0),
					bI: r.bI,
					pW: r.pW,
					lM: r.lM,
					ni: r.ni,
					dl: r.dl
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
			{r7: false, sk: r.sk, s0: r.s0, bI: r.bI, pW: r.pW, lM: r.lM, ni: r.ni, dl: r.dl}));
};
var $elm$http$Http$riskyRequest = function (r) {
	return $elm$http$Http$command(
		$elm$http$Http$Request(
			{r7: true, sk: r.sk, s0: r.s0, bI: r.bI, pW: r.pW, lM: r.lM, ni: r.ni, dl: r.dl}));
};
var $anmolitor$elm_grpc$Grpc$rpcPath = function (_v0) {
	var service = _v0.uJ;
	var _package = _v0.ud;
	var rpcName = _v0.uA;
	return '/' + (($elm$core$String$isEmpty(_package) ? '' : (_package + '.')) + (service + ('/' + rpcName)));
};
var $anmolitor$elm_grpc$Grpc$toCmd = F2(
	function (expect, _v0) {
		var req = _v0;
		var toHttpRequest = req.m3 ? $elm$http$Http$riskyRequest : $elm$http$Http$request;
		var _v1 = req.kK;
		var rpc = _v1;
		var body = A2(
			$elm$http$Http$bytesBody,
			$anmolitor$elm_grpc$Grpc$grpcContentType,
			$anmolitor$elm_grpc$Grpc$frameRequest(
				$eriktim$elm_protocol_buffers$Protobuf$Encode$encode(
					rpc.sZ(req.sk))));
		return toHttpRequest(
			{
				sk: body,
				s0: A2(
					$elm$http$Http$expectBytesResponse,
					expect,
					$anmolitor$elm_grpc$Grpc$handleResponse(rpc.sN)),
				bI: req.bI,
				pW: 'POST',
				lM: req.lM,
				ni: req.ni,
				dl: _Utils_ap(
					req.mQ,
					$anmolitor$elm_grpc$Grpc$rpcPath(req.kK))
			});
	});
var $author$project$Main$gotAvailableBalances = function () {
	var grpcRequest = A2(
		$anmolitor$elm_grpc$Grpc$setHost,
		'http://localhost:8080',
		A3(
			$anmolitor$elm_grpc$Grpc$addHeader,
			'password',
			'apitest',
			A2($anmolitor$elm_grpc$Grpc$new, $author$project$Proto$Io$Haveno$Protobuffer$Wallets$getBalances, $author$project$Proto$Io$Haveno$Protobuffer$defaultGetBalancesRequest)));
	return A2($anmolitor$elm_grpc$Grpc$toCmd, $author$project$Main$GotBalances, grpcRequest);
}();
var $author$project$Main$jsInterop = _Platform_outgoingPort('jsInterop', $elm$core$Basics$identity);
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(0),
				entries));
	});
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
var $author$project$Main$gotDecryptedCryptoAccountData = function (model) {
	var message = $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'typeOfMsg',
				$elm$json$Json$Encode$string('decryptCryptoAccountsMsgRequest')),
				_Utils_Tuple2(
				'currency',
				$elm$json$Json$Encode$string('BTC')),
				_Utils_Tuple2(
				'page',
				$elm$json$Json$Encode$string('AccountsPage')),
				_Utils_Tuple2(
				'accountsData',
				A2(
					$elm$json$Json$Encode$list,
					$elm$json$Json$Encode$string,
					_List_fromArray(
						['', '']))),
				_Utils_Tuple2(
				'password',
				$elm$json$Json$Encode$string(model.nN))
			]));
	return $author$project$Main$jsInterop(message);
};
var $author$project$Proto$Io$Haveno$Protobuffer$Internals_$defaultProto__Io__Haveno__Protobuffer__GetXmrPrimaryAddressRequest = {};
var $author$project$Proto$Io$Haveno$Protobuffer$defaultGetXmrPrimaryAddressRequest = $author$project$Proto$Io$Haveno$Protobuffer$Internals_$defaultProto__Io__Haveno__Protobuffer__GetXmrPrimaryAddressRequest;
var $author$project$Proto$Io$Haveno$Protobuffer$Internals_$defaultProto__Io__Haveno__Protobuffer__GetXmrPrimaryAddressReply = {uk: ''};
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
var $author$project$Proto$Io$Haveno$Protobuffer$Internals_$decodeProto__Io__Haveno__Protobuffer__GetXmrPrimaryAddressReply = A2(
	$eriktim$elm_protocol_buffers$Protobuf$Decode$message,
	$author$project$Proto$Io$Haveno$Protobuffer$Internals_$defaultProto__Io__Haveno__Protobuffer__GetXmrPrimaryAddressReply,
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
						{uk: a});
				}))
		]));
var $author$project$Proto$Io$Haveno$Protobuffer$decodeGetXmrPrimaryAddressReply = $author$project$Proto$Io$Haveno$Protobuffer$Internals_$decodeProto__Io__Haveno__Protobuffer__GetXmrPrimaryAddressReply;
var $author$project$Proto$Io$Haveno$Protobuffer$Internals_$encodeProto__Io__Haveno__Protobuffer__GetXmrPrimaryAddressRequest = function (_v0) {
	return $eriktim$elm_protocol_buffers$Protobuf$Encode$message(_List_Nil);
};
var $author$project$Proto$Io$Haveno$Protobuffer$encodeGetXmrPrimaryAddressRequest = $author$project$Proto$Io$Haveno$Protobuffer$Internals_$encodeProto__Io__Haveno__Protobuffer__GetXmrPrimaryAddressRequest;
var $author$project$Proto$Io$Haveno$Protobuffer$Wallets$getXmrPrimaryAddress = {sN: $author$project$Proto$Io$Haveno$Protobuffer$decodeGetXmrPrimaryAddressReply, sZ: $author$project$Proto$Io$Haveno$Protobuffer$encodeGetXmrPrimaryAddressRequest, ud: 'io.haveno.protobuffer', uA: 'GetXmrPrimaryAddress', uJ: 'Wallets'};
var $author$project$Comms$CustomGrpc$gotPrimaryAddress = A2(
	$anmolitor$elm_grpc$Grpc$setHost,
	'http://localhost:8080',
	A3(
		$anmolitor$elm_grpc$Grpc$addHeader,
		'password',
		'apitest',
		A2($anmolitor$elm_grpc$Grpc$new, $author$project$Proto$Io$Haveno$Protobuffer$Wallets$getXmrPrimaryAddress, $author$project$Proto$Io$Haveno$Protobuffer$defaultGetXmrPrimaryAddressRequest)));
var $author$project$Main$notifyJsReady = function () {
	var sendMessage = $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'typeOfMsg',
				$elm$json$Json$Encode$string('ElmReady')),
				_Utils_Tuple2(
				'currency',
				$elm$json$Json$Encode$string('')),
				_Utils_Tuple2(
				'page',
				$elm$json$Json$Encode$string('AccountsPage')),
				_Utils_Tuple2(
				'accountsData',
				A2(
					$elm$json$Json$Encode$list,
					$elm$json$Json$Encode$string,
					_List_fromArray(
						['', '']))),
				_Utils_Tuple2(
				'password',
				$elm$json$Json$Encode$string('test-password'))
			]));
	return $author$project$Main$jsInterop(sendMessage);
}();
var $author$project$Main$GotVersion = function (a) {
	return {$: 13, a: a};
};
var $author$project$Proto$Io$Haveno$Protobuffer$Internals_$defaultProto__Io__Haveno__Protobuffer__GetVersionReply = {bF: ''};
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
						{bF: a});
				}))
		]));
var $author$project$Proto$Io$Haveno$Protobuffer$decodeGetVersionReply = $author$project$Proto$Io$Haveno$Protobuffer$Internals_$decodeProto__Io__Haveno__Protobuffer__GetVersionReply;
var $author$project$Proto$Io$Haveno$Protobuffer$Internals_$encodeProto__Io__Haveno__Protobuffer__GetVersionRequest = function (_v0) {
	return $eriktim$elm_protocol_buffers$Protobuf$Encode$message(_List_Nil);
};
var $author$project$Proto$Io$Haveno$Protobuffer$encodeGetVersionRequest = $author$project$Proto$Io$Haveno$Protobuffer$Internals_$encodeProto__Io__Haveno__Protobuffer__GetVersionRequest;
var $author$project$Proto$Io$Haveno$Protobuffer$GetVersion$getVersion = {sN: $author$project$Proto$Io$Haveno$Protobuffer$decodeGetVersionReply, sZ: $author$project$Proto$Io$Haveno$Protobuffer$encodeGetVersionRequest, ud: 'io.haveno.protobuffer', uA: 'GetVersion', uJ: 'GetVersion'};
var $author$project$Main$sendVersionRequest = function (request) {
	var grpcRequest = A2(
		$anmolitor$elm_grpc$Grpc$setHost,
		'http://localhost:8080',
		A3(
			$anmolitor$elm_grpc$Grpc$addHeader,
			'password',
			'apitest',
			A2($anmolitor$elm_grpc$Grpc$new, $author$project$Proto$Io$Haveno$Protobuffer$GetVersion$getVersion, request)));
	return A2($anmolitor$elm_grpc$Grpc$toCmd, $author$project$Main$GotVersion, grpcRequest);
};
var $author$project$Main$Timeout = {$: 17};
var $elm$core$Process$sleep = _Process_sleep;
var $author$project$Main$startTimeout = A2(
	$elm$core$Task$perform,
	function (_v0) {
		return $author$project$Main$Timeout;
	},
	$elm$core$Process$sleep(5 * 1000));
var $author$project$Main$toSplash = F2(
	function (model, _v0) {
		var dashboard = _v0.a;
		var cmd = _v0.b;
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					E: $author$project$Main$SplashPage(dashboard)
				}),
			$elm$core$Platform$Cmd$batch(
				_List_fromArray(
					[
						$author$project$Main$sendVersionRequest($author$project$Proto$Io$Haveno$Protobuffer$defaultGetVersionRequest),
						$author$project$Main$gotAvailableBalances,
						A2($anmolitor$elm_grpc$Grpc$toCmd, $author$project$Main$GotXmrPrimaryAddress, $author$project$Comms$CustomGrpc$gotPrimaryAddress),
						$author$project$Main$startTimeout,
						$author$project$Main$notifyJsReady,
						$author$project$Main$gotDecryptedCryptoAccountData(model)
					])));
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
					E: $author$project$Main$SupportPage(support)
				}),
			A2($elm$core$Platform$Cmd$map, $author$project$Main$GotSupportMsg, cmd));
	});
var $author$project$Main$AccountsRoute = 7;
var $author$project$Main$Buy = 5;
var $author$project$Main$ConnectRoute = 9;
var $author$project$Main$DonateRoute = 8;
var $author$project$Main$FundsRoute = 3;
var $author$project$Main$Market = 6;
var $author$project$Main$PortfolioRoute = 2;
var $author$project$Main$SellRoute = 1;
var $author$project$Main$SplashRoute = 0;
var $author$project$Main$Support = 4;
var $elm$url$Url$Parser$Parser = $elm$core$Basics$identity;
var $elm$url$Url$Parser$mapState = F2(
	function (func, _v0) {
		var visited = _v0.eq;
		var unvisited = _v0.dN;
		var params = _v0.ea;
		var frag = _v0.d_;
		var value = _v0.ao;
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
			var visited = _v1.eq;
			var unvisited = _v1.dN;
			var params = _v1.ea;
			var frag = _v1.d_;
			var value = _v1.ao;
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
		var visited = _v0.eq;
		var unvisited = _v0.dN;
		var params = _v0.ea;
		var frag = _v0.d_;
		var value = _v0.ao;
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
			$elm$url$Url$Parser$s('buy')),
			A2(
			$elm$url$Url$Parser$map,
			6,
			$elm$url$Url$Parser$s('market')),
			A2(
			$elm$url$Url$Parser$map,
			7,
			$elm$url$Url$Parser$s('accounts')),
			A2(
			$elm$url$Url$Parser$map,
			8,
			$elm$url$Url$Parser$s('donate')),
			A2(
			$elm$url$Url$Parser$map,
			9,
			$elm$url$Url$Parser$s('connect'))
		]));
var $author$project$Main$updateUrl = F2(
	function (url, model) {
		var urlMinusQueryStr = _Utils_update(
			url,
			{
				um: $elm$core$Maybe$Just('')
			});
		var _v0 = A2($elm$url$Url$Parser$parse, $author$project$Main$urlAsPageParser, urlMinusQueryStr);
		if (!_v0.$) {
			switch (_v0.a) {
				case 7:
					var _v1 = _v0.a;
					return A2(
						$author$project$Main$toAccounts,
						model,
						$author$project$Pages$Accounts$init(0));
				case 0:
					var _v2 = _v0.a;
					return A2(
						$author$project$Main$toSplash,
						model,
						$author$project$Pages$Splash$init(
							{pj: model.bF, lL: $elm$core$Maybe$Nothing}));
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
						$author$project$Pages$Funds$init(''));
				case 4:
					var _v6 = _v0.a;
					return A2(
						$author$project$Main$toSupport,
						model,
						$author$project$Pages$Support$init(0));
				case 5:
					var _v7 = _v0.a;
					return A2(
						$author$project$Main$toPricing,
						model,
						$author$project$Pages$Buy$init(0));
				case 6:
					var _v8 = _v0.a;
					return A2(
						$author$project$Main$toMarket,
						model,
						$author$project$Pages$Market$init(0));
				case 8:
					var _v9 = _v0.a;
					return A2(
						$author$project$Main$toDonate,
						model,
						$author$project$Pages$Donate$init(0));
				default:
					var _v10 = _v0.a;
					return A2(
						$author$project$Main$toConnect,
						model,
						$author$project$Pages$Connect$init(0));
			}
		} else {
			return A2(
				$author$project$Main$toSplash,
				model,
				$author$project$Pages$Splash$init(
					{pj: model.bF, lL: $elm$core$Maybe$Nothing}));
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
	function (flag, _v0, key) {
		var decodedJsonFromSetupElmjs = function () {
			var _v1 = A2($elm$json$Json$Decode$decodeString, $author$project$Main$urlDecoder, flag);
			if (!_v1.$) {
				var urLAfterFlagDecode = _v1.a;
				return _Utils_update(
					urLAfterFlagDecode,
					{uf: '/'});
			} else {
				return A6($elm$url$Url$Url, 1, 'haveno-web-dev.netlify.app', $elm$core$Maybe$Nothing, '', $elm$core$Maybe$Nothing, $elm$core$Maybe$Nothing);
			}
		}();
		var initialModel = {
			bH: $elm$core$Maybe$Just($author$project$Proto$Io$Haveno$Protobuffer$defaultBalancesInfo),
			np: _List_fromArray(
				['']),
			dF: _List_Nil,
			o5: decodedJsonFromSetupElmjs,
			pv: false,
			dv: false,
			dG: false,
			pG: key,
			E: $author$project$Main$SplashPage($author$project$Pages$Splash$initialModel),
			f1: '',
			nN: '',
			dL: 0,
			lL: $elm$time$Time$millisToPosix(0),
			rs: $elm$core$Maybe$Nothing,
			bF: 'No Haveno version available',
			rY: $elm$core$Maybe$Nothing
		};
		return A2($author$project$Main$updateUrl, decodedJsonFromSetupElmjs, initialModel);
	});
var $author$project$Main$Recv = function (a) {
	return {$: 12, a: a};
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $author$project$Main$receiveMsgsFromJs = _Platform_incomingPort('receiveMsgsFromJs', $elm$json$Json$Decode$value);
var $author$project$Main$subscriptions = function (_v0) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				$author$project$Main$receiveMsgsFromJs($author$project$Main$Recv)
			]));
};
var $author$project$Pages$Accounts$AddNewCryptoAccount = function (a) {
	return {$: 3, a: a};
};
var $author$project$Pages$Accounts$DecryptCryptoAccounts = function (a) {
	return {$: 4, a: a};
};
var $author$project$Main$NoOp = {$: 18};
var $author$project$Pages$Funds$SubAddressView = 1;
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Main$JsMessage = F4(
	function (page, typeOfMsg, accountsData, currency) {
		return {ez: accountsData, sJ: currency, E: page, nV: typeOfMsg};
	});
var $elm$json$Json$Decode$list = _Json_decodeList;
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom = $elm$json$Json$Decode$map2($elm$core$Basics$apR);
var $elm$json$Json$Decode$field = _Json_decodeField;
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required = F3(
	function (key, valDecoder, decoder) {
		return A2(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
			A2($elm$json$Json$Decode$field, key, valDecoder),
			decoder);
	});
var $author$project$Main$jsMessageDecoder = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'currency',
	$elm$json$Json$Decode$string,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'accountsData',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$string),
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'typeOfMsg',
			$elm$json$Json$Decode$string,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'page',
				$elm$json$Json$Decode$string,
				$elm$json$Json$Decode$succeed($author$project$Main$JsMessage)))));
var $elm$browser$Browser$Navigation$load = _Browser_load;
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
		var _v0 = url.ko;
		if (!_v0) {
			return 'http://';
		} else {
			return 'https://';
		}
	}();
	return A3(
		$elm$url$Url$addPrefixed,
		'#',
		url.s8,
		A3(
			$elm$url$Url$addPrefixed,
			'?',
			url.um,
			_Utils_ap(
				A2(
					$elm$url$Url$addPort,
					url.kh,
					_Utils_ap(http, url.mQ)),
				url.uf)));
};
var $author$project$Pages$Accounts$DisplayStoredBTCAddresses = 4;
var $author$project$Pages$Accounts$Errored = 1;
var $author$project$Pages$Accounts$msgFromAccounts = _Platform_outgoingPort('msgFromAccounts', $elm$json$Json$Encode$string);
var $author$project$Pages$Accounts$encryptionMsg = function (msgString) {
	return $author$project$Pages$Accounts$msgFromAccounts(msgString);
};
var $author$project$Pages$Accounts$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 3:
				var address = msg.a;
				var btcAccountCount = $elm$core$List$length(model.pM);
				var storeAs = 'BTC_Public_Key_' + $elm$core$String$fromInt(btcAccountCount);
				var message = A2(
					$elm$json$Json$Encode$encode,
					0,
					$elm$json$Json$Encode$object(
						_List_fromArray(
							[
								_Utils_Tuple2(
								'typeOfMsg',
								$elm$json$Json$Encode$string('encryptCryptoAccountMsgRequest')),
								_Utils_Tuple2(
								'currency',
								$elm$json$Json$Encode$string('BTC')),
								_Utils_Tuple2(
								'address',
								$elm$json$Json$Encode$string(address)),
								_Utils_Tuple2(
								'storeAs',
								$elm$json$Json$Encode$string(storeAs))
							])));
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							sK: 4,
							pM: _Utils_ap(
								model.pM,
								_List_fromArray(
									[address]))
						}),
					$author$project$Pages$Accounts$encryptionMsg(message));
			case 4:
				var data = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							pM: _Utils_ap(model.pM, data)
						}),
					$elm$core$Platform$Cmd$none);
			case 1:
				if (!msg.a.$) {
					var primaryAddresponse = msg.a.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{sK: 0, f1: primaryAddresponse.uk, dL: 0}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{dL: 1}),
						$elm$core$Platform$Cmd$none);
				}
			case 2:
				if (!msg.a.$) {
					var subAddresponse = msg.a.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{sK: 0, dL: 0, na: subAddresponse.na}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{dL: 1}),
						$elm$core$Platform$Cmd$none);
				}
			case 0:
				if (!msg.a.$) {
					var response = msg.a.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{bH: response.bH, sK: 0, dL: 0}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{dL: 1}),
						$elm$core$Platform$Cmd$none);
				}
			case 5:
				var newView = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{sK: newView}),
					$elm$core$Platform$Cmd$none);
			default:
				var address = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{jO: address}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Pages$Buy$update = F2(
	function (msg, model) {
		var newModel = msg;
		return _Utils_Tuple2(
			_Utils_update(
				newModel,
				{ve: model.ve}),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Pages$Connect$RetryWalletConnection = function (a) {
	return {$: 0, a: a};
};
var $author$project$Pages$Connect$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				if (!msg.a.$) {
					var primaryAddresponse = msg.a.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{eZ: model.eZ, f1: primaryAddresponse.uk, m2: false, vl: true}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{eZ: model.eZ + 1, m2: true}),
						A2($anmolitor$elm_grpc$Grpc$toCmd, $author$project$Pages$Connect$RetryWalletConnection, $author$project$Comms$CustomGrpc$gotPrimaryAddress));
				}
			case 1:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{nP: true}),
					$elm$core$Platform$Cmd$none);
			case 2:
				var node = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{e2: node}),
					$elm$core$Platform$Cmd$none);
			default:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{e2: '', mY: model.e2}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Pages$Donate$Errored = 1;
var $author$project$Pages$Donate$ManageDonateView = 1;
var $author$project$Pages$Donate$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 1:
				if (!msg.a.$) {
					var primaryAddresponse = msg.a.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{sK: 0, f1: primaryAddresponse.uk, dL: 0}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{dL: 1}),
						$elm$core$Platform$Cmd$none);
				}
			case 2:
				if (!msg.a.$) {
					var subAddresponse = msg.a.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{sK: 1, dL: 0, na: subAddresponse.na}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{dL: 1}),
						$elm$core$Platform$Cmd$none);
				}
			default:
				if (!msg.a.$) {
					var response = msg.a.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{bH: response.bH, dL: 0}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{dL: 1}),
						$elm$core$Platform$Cmd$none);
				}
		}
	});
var $author$project$Pages$Funds$Errored = 1;
var $author$project$Pages$Funds$GotXmrNewSubaddress = function (a) {
	return {$: 0, a: a};
};
var $author$project$Proto$Io$Haveno$Protobuffer$Internals_$defaultProto__Io__Haveno__Protobuffer__GetXmrNewSubaddressRequest = {};
var $author$project$Proto$Io$Haveno$Protobuffer$defaultGetXmrNewSubaddressRequest = $author$project$Proto$Io$Haveno$Protobuffer$Internals_$defaultProto__Io__Haveno__Protobuffer__GetXmrNewSubaddressRequest;
var $author$project$Proto$Io$Haveno$Protobuffer$Internals_$defaultProto__Io__Haveno__Protobuffer__GetXmrNewSubaddressReply = {na: ''};
var $author$project$Proto$Io$Haveno$Protobuffer$Internals_$decodeProto__Io__Haveno__Protobuffer__GetXmrNewSubaddressReply = A2(
	$eriktim$elm_protocol_buffers$Protobuf$Decode$message,
	$author$project$Proto$Io$Haveno$Protobuffer$Internals_$defaultProto__Io__Haveno__Protobuffer__GetXmrNewSubaddressReply,
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
						{na: a});
				}))
		]));
var $author$project$Proto$Io$Haveno$Protobuffer$decodeGetXmrNewSubaddressReply = $author$project$Proto$Io$Haveno$Protobuffer$Internals_$decodeProto__Io__Haveno__Protobuffer__GetXmrNewSubaddressReply;
var $author$project$Proto$Io$Haveno$Protobuffer$Internals_$encodeProto__Io__Haveno__Protobuffer__GetXmrNewSubaddressRequest = function (_v0) {
	return $eriktim$elm_protocol_buffers$Protobuf$Encode$message(_List_Nil);
};
var $author$project$Proto$Io$Haveno$Protobuffer$encodeGetXmrNewSubaddressRequest = $author$project$Proto$Io$Haveno$Protobuffer$Internals_$encodeProto__Io__Haveno__Protobuffer__GetXmrNewSubaddressRequest;
var $author$project$Proto$Io$Haveno$Protobuffer$Wallets$getXmrNewSubaddress = {sN: $author$project$Proto$Io$Haveno$Protobuffer$decodeGetXmrNewSubaddressReply, sZ: $author$project$Proto$Io$Haveno$Protobuffer$encodeGetXmrNewSubaddressRequest, ud: 'io.haveno.protobuffer', uA: 'GetXmrNewSubaddress', uJ: 'Wallets'};
var $author$project$Pages$Funds$gotNewSubAddress = function () {
	var grpcRequest = A2(
		$anmolitor$elm_grpc$Grpc$setHost,
		'http://localhost:8080',
		A3(
			$anmolitor$elm_grpc$Grpc$addHeader,
			'password',
			'apitest',
			A2($anmolitor$elm_grpc$Grpc$new, $author$project$Proto$Io$Haveno$Protobuffer$Wallets$getXmrNewSubaddress, $author$project$Proto$Io$Haveno$Protobuffer$defaultGetXmrNewSubaddressRequest)));
	return A2($anmolitor$elm_grpc$Grpc$toCmd, $author$project$Pages$Funds$GotXmrNewSubaddress, grpcRequest);
}();
var $author$project$Pages$Funds$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 2:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{pB: !model.pB}),
					$elm$core$Platform$Cmd$none);
			case 1:
				return _Utils_Tuple2(model, $author$project$Pages$Funds$gotNewSubAddress);
			default:
				if (!msg.a.$) {
					var subAddresponse = msg.a.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{sK: 1, dL: 0, na: subAddresponse.na}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{dL: 1}),
						$elm$core$Platform$Cmd$none);
				}
		}
	});
var $author$project$Pages$Market$update = F2(
	function (msg, model) {
		var newModel = msg;
		return _Utils_Tuple2(
			_Utils_update(
				newModel,
				{ve: model.ve}),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Pages$Portfolio$update = F2(
	function (msg, model) {
		var newModel = msg;
		return _Utils_Tuple2(
			_Utils_update(
				newModel,
				{ve: model.ve}),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Pages$Sell$update = F2(
	function (msg, model) {
		var newModel = msg;
		return _Utils_Tuple2(
			_Utils_update(
				newModel,
				{ve: model.ve}),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Pages$Splash$update = F2(
	function (_v0, model) {
		return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	});
var $author$project$Pages$Support$update = F2(
	function (msg, model) {
		var newModel = msg;
		return _Utils_Tuple2(
			_Utils_update(
				newModel,
				{ve: model.ve}),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 13:
				if (!msg.a.$) {
					var versionResp = msg.a.a;
					var verResp = function () {
						var version = versionResp.bF;
						return version;
					}();
					var updatedModel = _Utils_update(
						model,
						{dv: true, dL: 1, bF: verResp});
					return A2(
						$author$project$Main$toAccounts,
						updatedModel,
						$author$project$Pages$Accounts$init(0));
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{dv: false, bF: 'Error obtaining version'}),
						$elm$core$Platform$Cmd$none);
				}
			case 16:
				if (!msg.a.$) {
					var primaryAddresponse = msg.a.a;
					var updatedModel = _Utils_update(
						model,
						{dv: true, f1: primaryAddresponse.uk, dL: 1});
					return A2(
						$author$project$Main$toAccounts,
						updatedModel,
						$author$project$Pages$Accounts$init(0));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 15:
				if (!msg.a.$) {
					var response = msg.a.a;
					var updatedModel = _Utils_update(
						model,
						{bH: response.bH, dL: 1});
					return _Utils_Tuple2(
						updatedModel,
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									$elm$core$Platform$Cmd$none,
									A2(
									$elm$core$Platform$Cmd$map,
									function (_v2) {
										return $author$project$Main$NoOp;
									},
									$elm$core$Platform$Cmd$none)
								])));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 0:
				var urlRequest = msg.a;
				if (urlRequest.$ === 1) {
					var href = urlRequest.a;
					return _Utils_Tuple2(
						model,
						$elm$browser$Browser$Navigation$load(href));
				} else {
					var url = urlRequest.a;
					var modelWithMenuClosed = _Utils_update(
						model,
						{dG: false});
					var _v4 = $elm$url$Url$toString(url);
					if (_v4 === 'https://haveno-web-dev.netlify.app//') {
						return _Utils_Tuple2(
							modelWithMenuClosed,
							$elm$browser$Browser$Navigation$load(
								$elm$url$Url$toString(url)));
					} else {
						return A2($author$project$Main$updateUrl, url, modelWithMenuClosed);
					}
				}
			case 11:
				var url = msg.a;
				return A2($author$project$Main$updateUrl, url, model);
			case 14:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{dG: !model.dG}),
					$elm$core$Platform$Cmd$none);
			case 12:
				var message = msg.a;
				var _v5 = A2($elm$json$Json$Decode$decodeValue, $author$project$Main$jsMessageDecoder, message);
				if (!_v5.$) {
					var jsMsg = _v5.a;
					var _v6 = jsMsg.E;
					if (_v6 === 'AccountsPage') {
						var _v7 = jsMsg.nV;
						switch (_v7) {
							case 'encryptCryptoAccountMsgRequest':
								var accountsMdl = function () {
									var _v8 = model.E;
									if (_v8.$ === 7) {
										var accountsModel = _v8.a;
										return _Utils_update(
											accountsModel,
											{pM: jsMsg.ez});
									} else {
										return $author$project$Pages$Accounts$initialModel;
									}
								}();
								return A2(
									$author$project$Main$toAccounts,
									model,
									A2(
										$author$project$Pages$Accounts$update,
										$author$project$Pages$Accounts$AddNewCryptoAccount(
											A2(
												$elm$core$Maybe$withDefault,
												'No BTC address',
												$elm$core$List$head(jsMsg.ez))),
										accountsMdl));
							case 'decryptedCryptoAccountsResponse':
								var accountsMdl = function () {
									var _v9 = model.E;
									if (_v9.$ === 7) {
										var accountsModel = _v9.a;
										return _Utils_update(
											accountsModel,
											{pM: jsMsg.ez});
									} else {
										return $author$project$Pages$Accounts$initialModel;
									}
								}();
								return A2(
									$author$project$Main$toAccounts,
									_Utils_update(
										model,
										{np: jsMsg.ez}),
									A2(
										$author$project$Pages$Accounts$update,
										$author$project$Pages$Accounts$DecryptCryptoAccounts(jsMsg.ez),
										accountsMdl));
							default:
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{
											dF: _Utils_ap(
												model.dF,
												_List_fromArray(
													['Third Case', jsMsg.nV]))
										}),
									$elm$core$Platform$Cmd$none);
						}
					} else {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									dF: _Utils_ap(
										model.dF,
										_List_fromArray(
											['Second Case', 'Not accounts page']))
								}),
							$elm$core$Platform$Cmd$none);
					}
				} else {
					var errmsg = _v5.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								dF: _Utils_ap(
									model.dF,
									_List_fromArray(
										[
											'First Case',
											$elm$json$Json$Decode$errorToString(errmsg)
										]))
							}),
						$elm$core$Platform$Cmd$none);
				}
			case 1:
				var dashboardMsg = msg.a;
				var _v10 = model.E;
				if (!_v10.$) {
					var dashboard = _v10.a;
					var updatedSplashModel = _Utils_update(
						dashboard,
						{bF: model.bF});
					return A2(
						$author$project$Main$toSplash,
						model,
						A2($author$project$Pages$Splash$update, dashboardMsg, updatedSplashModel));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 2:
				var sellMsg = msg.a;
				var _v11 = model.E;
				if (_v11.$ === 1) {
					var sell = _v11.a;
					return A2(
						$author$project$Main$toSell,
						model,
						A2($author$project$Pages$Sell$update, sellMsg, sell));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 3:
				var termsMsg = msg.a;
				var _v12 = model.E;
				if (_v12.$ === 2) {
					var terms = _v12.a;
					return A2(
						$author$project$Main$toPortfolio,
						model,
						A2($author$project$Pages$Portfolio$update, termsMsg, terms));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 4:
				var fundsMsg = msg.a;
				var _v13 = model.E;
				if (_v13.$ === 3) {
					var fundsModel = _v13.a;
					switch (fundsMsg.$) {
						case 2:
							var newFundsModel = _Utils_update(
								fundsModel,
								{f1: model.f1});
							return A2(
								$author$project$Main$toFunds,
								model,
								A2($author$project$Pages$Funds$update, fundsMsg, newFundsModel));
						case 1:
							var newFundsModel = _Utils_update(
								fundsModel,
								{sK: 1, dL: 0});
							return A2(
								$author$project$Main$toFunds,
								model,
								A2($author$project$Pages$Funds$update, fundsMsg, newFundsModel));
						default:
							return A2(
								$author$project$Main$toFunds,
								model,
								A2($author$project$Pages$Funds$update, fundsMsg, fundsModel));
					}
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 5:
				var supportMsg = msg.a;
				var _v15 = model.E;
				if (_v15.$ === 4) {
					var support = _v15.a;
					return A2(
						$author$project$Main$toSupport,
						model,
						A2($author$project$Pages$Support$update, supportMsg, support));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 6:
				var pricingMsg = msg.a;
				var _v16 = model.E;
				if (_v16.$ === 5) {
					var pricing = _v16.a;
					return A2(
						$author$project$Main$toPricing,
						model,
						A2($author$project$Pages$Buy$update, pricingMsg, pricing));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 7:
				var aboutMsg = msg.a;
				var _v17 = model.E;
				if (_v17.$ === 6) {
					var about = _v17.a;
					return A2(
						$author$project$Main$toMarket,
						model,
						A2($author$project$Pages$Market$update, aboutMsg, about));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 8:
				var accountsMsg = msg.a;
				var _v18 = model.E;
				if (_v18.$ === 7) {
					var accountsModel = _v18.a;
					var _v19 = A2($author$project$Pages$Accounts$update, accountsMsg, accountsModel);
					var updatedAccountsModel = _v19.a;
					var accountsCmd = _v19.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								E: $author$project$Main$AccountsPage(updatedAccountsModel)
							}),
						A2($elm$core$Platform$Cmd$map, $author$project$Main$GotAccountsMsg, accountsCmd));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 9:
				var donateMsg = msg.a;
				var _v20 = model.E;
				if (_v20.$ === 8) {
					var donate = _v20.a;
					return A2(
						$author$project$Main$toDonate,
						model,
						A2($author$project$Pages$Donate$update, donateMsg, donate));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 10:
				var connectMsg = msg.a;
				var _v21 = model.E;
				if (_v21.$ === 9) {
					var connect = _v21.a;
					return A2(
						$author$project$Main$toConnect,
						model,
						A2($author$project$Pages$Connect$update, connectMsg, connect));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 17:
				return (!model.dv) ? A2(
					$author$project$Main$toConnect,
					model,
					$author$project$Pages$Connect$init(0)) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			default:
				return A2(
					$author$project$Main$toAccounts,
					model,
					$author$project$Pages$Accounts$init(0));
		}
	});
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $author$project$Main$GotSplashMsg = function (a) {
	return {$: 1, a: a};
};
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $elm$html$Html$map = $elm$virtual_dom$VirtualDom$map;
var $author$project$Pages$Accounts$ChangeView = function (a) {
	return {$: 5, a: a};
};
var $author$project$Pages$Accounts$CreateNewBTCAccountView = 3;
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
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$html$Html$h6 = _VirtualDom_node('h6');
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $author$project$Pages$Accounts$btcAccountsView = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h6,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('accounts-subtitle')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Your BTC Accounts')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('accounts-listOfBTCAccounts')
					]),
				$elm$core$List$isEmpty(model.pM) ? _List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('btc-account-item')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('There are no BTC accounts set up yet')
							]))
					]) : A2(
					$elm$core$List$map,
					function (account) {
						return A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$classList(
									_List_fromArray(
										[
											_Utils_Tuple2('btc-account-item', true),
											_Utils_Tuple2('address-label', true)
										]))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(account)
								]));
					},
					model.pM))
			]));
};
var $author$project$Pages$Accounts$UpdateNewBTCAddress = function (a) {
	return {$: 6, a: a};
};
var $elm$html$Html$button = _VirtualDom_node('button');
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
var $author$project$Utils$MyUtils$infoBtn = F3(
	function (label, identifier, msg) {
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('info-button'),
					$elm$html$Html$Attributes$id(identifier),
					$elm$html$Html$Events$onClick(msg)
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(label)
				]));
	});
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$html$Html$label = _VirtualDom_node('label');
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
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
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
var $elm$html$Html$Attributes$placeholder = $elm$html$Html$Attributes$stringProperty('placeholder');
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$readonly = $elm$html$Html$Attributes$boolProperty('readOnly');
var $elm$html$Html$span = _VirtualDom_node('span');
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$Pages$Accounts$createNewBTCAccountView = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h6,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('cryptocurrency-list')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Cryptocurrency')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('account-item'),
						$elm$html$Html$Attributes$id('crypto-type')
					]),
				_List_fromArray(
					[
						function () {
						var _v0 = model.no;
						return $elm$html$Html$text('BTC');
					}()
					])),
				A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$label,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('large-text')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Bitcoin address: ')
							])),
						A2(
						$elm$html$Html$span,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$id('bitcoin-address-input'),
										$elm$html$Html$Attributes$type_('text'),
										$elm$html$Html$Attributes$placeholder('Enter valid BTC address'),
										$elm$html$Html$Events$onInput($author$project$Pages$Accounts$UpdateNewBTCAddress)
									]),
								_List_Nil)
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$label,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('large-text')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Limitations: ')
							])),
						A2(
						$elm$html$Html$span,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$id('limitations-input'),
										$elm$html$Html$Attributes$type_('text'),
										$elm$html$Html$Attributes$readonly(true),
										$elm$html$Html$Attributes$value('Max. trade duration: 0 hours/Max.trade limit: 96.00 XMR')
									]),
								_List_Nil)
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$label,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('large-text')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Account name: ')
							])),
						A2(
						$elm$html$Html$span,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$id('account-name-input'),
										$elm$html$Html$Attributes$type_('text'),
										$elm$html$Html$Attributes$readonly(true),
										$elm$html$Html$Attributes$value('BTC: ' + model.jO)
									]),
								_List_Nil)
							]))
					])),
				A3(
				$author$project$Utils$MyUtils$infoBtn,
				'SAVE NEW BTC ACCOUNT',
				'save-new-BTC-account-button',
				$author$project$Pages$Accounts$AddNewCryptoAccount(model.jO))
			]));
};
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $author$project$Pages$Accounts$errorView = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('accounts-container')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$h1,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('accounts-title')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Accounts')
				])),
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('error-message'),
					$elm$html$Html$Attributes$id('accounts-error-message')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Error: Unable to retrieve relevant data. Please try again later.')
				]))
		]));
var $author$project$Pages$Accounts$existingCryptoAccountsView = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h6,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('accounts-subtitle')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Your Cryptocurrency Accounts')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('accounts-listOfExistingCryptoAccounts')
					]),
				$elm$core$List$isEmpty(model.mT) ? _List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('account-item')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('There are no accounts set up yet')
							]))
					]) : A2(
					$elm$core$List$map,
					function (account) {
						return A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('account-item')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(account)
								]));
					},
					model.mT))
			]));
};
var $elm$html$Html$h4 = _VirtualDom_node('h4');
var $author$project$Pages$Accounts$Backup = 7;
var $author$project$Pages$Accounts$CryptoAccounts = 2;
var $author$project$Pages$Accounts$TraditionalCurrencyAccounts = 1;
var $author$project$Pages$Accounts$WalletPassword = 5;
var $author$project$Pages$Accounts$WalletSeed = 6;
var $elm$html$Html$p = _VirtualDom_node('p');
var $author$project$Pages$Accounts$manageAccountsView = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('accounts-container')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$h1,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('accounts-title')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Accounts')
				])),
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					A3(
					$author$project$Utils$MyUtils$infoBtn,
					'Traditional Currency Accounts',
					'traditionalCurrencyAccountsButton',
					$author$project$Pages$Accounts$ChangeView(1))
				])),
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					A3(
					$author$project$Utils$MyUtils$infoBtn,
					'Crypto Currency Accounts',
					'cryptocurrencyAccountsButton',
					$author$project$Pages$Accounts$ChangeView(2))
				])),
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					A3(
					$author$project$Utils$MyUtils$infoBtn,
					'Wallet Password',
					'walletPasswordButton',
					$author$project$Pages$Accounts$ChangeView(5))
				])),
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					A3(
					$author$project$Utils$MyUtils$infoBtn,
					'Wallet Seed',
					'walletSeedButton',
					$author$project$Pages$Accounts$ChangeView(6))
				])),
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					A3(
					$author$project$Utils$MyUtils$infoBtn,
					'Backup',
					'backupButton',
					$author$project$Pages$Accounts$ChangeView(7))
				]))
		]));
var $elm$html$Html$section = _VirtualDom_node('section');
var $author$project$Pages$Accounts$view = function (model) {
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
						A2($elm$html$Html$div, _List_Nil, _List_Nil),
						function () {
						var _v0 = model.dL;
						if (_v0 === 1) {
							return A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('split-col')
									]),
								_List_fromArray(
									[$author$project$Pages$Accounts$errorView]));
						} else {
							return A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('split-col')
									]),
								_List_fromArray(
									[
										function () {
										var _v1 = model.sK;
										switch (_v1) {
											case 4:
												return A2(
													$elm$html$Html$div,
													_List_Nil,
													_List_fromArray(
														[
															A2(
															$elm$html$Html$h4,
															_List_Nil,
															_List_fromArray(
																[
																	$elm$html$Html$text('BTC Accounts')
																])),
															$author$project$Pages$Accounts$btcAccountsView(model)
														]));
											case 0:
												return $author$project$Pages$Accounts$manageAccountsView;
											case 1:
												return A2(
													$elm$html$Html$div,
													_List_Nil,
													_List_fromArray(
														[
															$elm$html$Html$text('Traditional Currency Accounts')
														]));
											case 2:
												return A2(
													$elm$html$Html$div,
													_List_Nil,
													_List_fromArray(
														[
															A2(
															$elm$html$Html$h4,
															_List_Nil,
															_List_fromArray(
																[
																	$elm$html$Html$text('Cryptocurrency Accounts')
																])),
															A2(
															$elm$html$Html$p,
															_List_Nil,
															_List_fromArray(
																[
																	A3(
																	$author$project$Utils$MyUtils$infoBtn,
																	'VIEW BTC ACCOUNTS',
																	'btcAccountsButton',
																	$author$project$Pages$Accounts$ChangeView(4))
																])),
															$author$project$Pages$Accounts$existingCryptoAccountsView(model),
															A2(
															$elm$html$Html$p,
															_List_Nil,
															_List_fromArray(
																[
																	A3(
																	$author$project$Utils$MyUtils$infoBtn,
																	'Add New BTC CryptoCurrency Account',
																	'addnewBTCaccountViewbutton',
																	$author$project$Pages$Accounts$ChangeView(3))
																]))
														]));
											case 3:
												return A2(
													$elm$html$Html$div,
													_List_Nil,
													_List_fromArray(
														[
															A2(
															$elm$html$Html$h4,
															_List_Nil,
															_List_fromArray(
																[
																	$elm$html$Html$text('Cryptocurrency Accounts')
																])),
															$author$project$Pages$Accounts$existingCryptoAccountsView(model),
															$author$project$Pages$Accounts$createNewBTCAccountView(model)
														]));
											case 5:
												return A2(
													$elm$html$Html$div,
													_List_Nil,
													_List_fromArray(
														[
															$elm$html$Html$text('Wallet Password ')
														]));
											case 6:
												return A2(
													$elm$html$Html$div,
													_List_Nil,
													_List_fromArray(
														[
															$elm$html$Html$text('Seed ')
														]));
											default:
												return A2(
													$elm$html$Html$div,
													_List_Nil,
													_List_fromArray(
														[
															$elm$html$Html$text('Backup ')
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
var $elm$html$Html$a = _VirtualDom_node('a');
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
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
var $elm$html$Html$ul = _VirtualDom_node('ul');
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
var $author$project$Pages$Connect$ApplyCustomMoneroNode = {$: 3};
var $author$project$Pages$Connect$RetryHavenoConnection = {$: 1};
var $author$project$Pages$Connect$SetCustomMoneroNode = function (a) {
	return {$: 2, a: a};
};
var $anmolitor$elm_grpc$Grpc$UnknownGrpcStatus = function (a) {
	return {$: 5, a: a};
};
var $elm$html$Html$h2 = _VirtualDom_node('h2');
var $author$project$Pages$Connect$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('funds-container')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h1,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('funds-title')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Connection Issues')
					])),
				A2(
				$elm$html$Html$h2,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('funds-title')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Here you can resolve wallet and Haveno connection issues.')
					])),
				(!model.vl) ? A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('walletNotConnectedWarning')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('⚠ Monero Wallet not connected.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('info-button'),
										$elm$html$Html$Attributes$id('retryWalletConnectionButton'),
										$elm$html$Html$Events$onClick(
										$author$project$Pages$Connect$RetryWalletConnection(
											$elm$core$Result$Err(
												$anmolitor$elm_grpc$Grpc$UnknownGrpcStatus(''))))
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Retry Monero Wallet Connection')
									]))
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Current Monero Node:')
							])),
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('current-node')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(model.mY)
							]))
					])) : A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('walletNotConnectedWarning')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('')
					])),
				A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Enter a custom Monero node:')
							])),
						A2(
						$elm$html$Html$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$placeholder('Custom Monero Node'),
								$elm$html$Html$Events$onInput($author$project$Pages$Connect$SetCustomMoneroNode),
								$elm$html$Html$Attributes$value(model.e2)
							]),
						_List_Nil),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								A3($author$project$Utils$MyUtils$infoBtn, 'Use Custom Node', 'retryHavenoConnectionButton', $author$project$Pages$Connect$ApplyCustomMoneroNode)
							]))
					])),
				(!model.tk) ? A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('havenoNodeNotConnected')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('⚠ Haveno Node not connected.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								A3($author$project$Utils$MyUtils$infoBtn, 'Retry Haveno Connection', 'retryHavenoConnectionButton', $author$project$Pages$Connect$RetryHavenoConnection)
							]))
					])) : $elm$html$Html$text('')
			]));
};
var $author$project$Pages$Donate$errorView = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('accounts-container')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$h1,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('accounts-title')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Donate')
				])),
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('error-message'),
					$elm$html$Html$Attributes$id('accounts-error-message')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Error: Unable to retrieve relevant data. Please try again later.')
				]))
		]));
var $author$project$Extras$Constants$donationAddress = '86F2Vbx6QRL3jfxeACFUsPTAh2x264dDNdgmt8m96zSQd8rwGrsw4th7XrmdhQkFXf32timtpWupQMWokagkXYfiPKYGvpt';
var $author$project$Pages$Donate$manageDonateView = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('accounts-container')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$h1,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('accounts-title')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Donate')
				])),
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('address-text')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('address-label')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Thank you for your support. Every bit helps. Please send your donation to: ')
						])),
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id('donationaddress'),
							$elm$html$Html$Attributes$class('address-value')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text($author$project$Extras$Constants$donationAddress)
						])),
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('address-label')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Thank you. It is much appreciated')
						]))
				]))
		]));
var $author$project$Pages$Donate$view = function (model) {
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
						var _v0 = model.dL;
						if (_v0 === 1) {
							return A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('split-col')
									]),
								_List_fromArray(
									[$author$project$Pages$Donate$errorView]));
						} else {
							return A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('split-col')
									]),
								_List_fromArray(
									[
										function () {
										var _v1 = model.sK;
										if (!_v1) {
											return $author$project$Pages$Donate$manageDonateView;
										} else {
											return $author$project$Pages$Donate$manageDonateView;
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
var $author$project$Pages$Funds$ClickedGotNewSubaddress = {$: 1};
var $MartinSStewart$elm_uint64$UInt64$UInt64 = $elm$core$Basics$identity;
var $MartinSStewart$elm_uint64$UInt64$limit24 = 16777216;
var $MartinSStewart$elm_uint64$UInt64$max16 = 65535;
var $MartinSStewart$elm_uint64$UInt64$max24 = 16777215;
var $MartinSStewart$elm_uint64$UInt64$add = F2(
	function (_v0, _v2) {
		var _v1 = _v0;
		var highA = _v1.a;
		var midA = _v1.b;
		var lowA = _v1.c;
		var _v3 = _v2;
		var highB = _v3.a;
		var midB = _v3.b;
		var lowB = _v3.c;
		var low = lowA + lowB;
		var mid = (_Utils_cmp(low, $MartinSStewart$elm_uint64$UInt64$limit24) < 0) ? (midA + midB) : ((midA + midB) + 1);
		var high = (_Utils_cmp(mid, $MartinSStewart$elm_uint64$UInt64$limit24) < 0) ? (highA + highB) : ((highA + highB) + 1);
		return _Utils_Tuple3($MartinSStewart$elm_uint64$UInt64$max16 & high, $MartinSStewart$elm_uint64$UInt64$max24 & mid, $MartinSStewart$elm_uint64$UInt64$max24 & low);
	});
var $elm$core$String$fromFloat = _String_fromNumber;
var $MartinSStewart$elm_uint64$UInt64$limit48 = 281474976710656;
var $MartinSStewart$elm_uint64$UInt64$maxSafeHighPart = 31;
var $MartinSStewart$elm_uint64$UInt64$maxSafe = _Utils_Tuple3($MartinSStewart$elm_uint64$UInt64$maxSafeHighPart, $MartinSStewart$elm_uint64$UInt64$max24, $MartinSStewart$elm_uint64$UInt64$max24);
var $MartinSStewart$elm_uint64$UInt64$maxSafeInt = 9007199254740991;
var $MartinSStewart$elm_uint64$UInt64$zero = _Utils_Tuple3(0, 0, 0);
var $MartinSStewart$elm_uint64$UInt64$fromInt = function (x) {
	if (x <= 0) {
		return $MartinSStewart$elm_uint64$UInt64$zero;
	} else {
		if (_Utils_cmp(x, $MartinSStewart$elm_uint64$UInt64$maxSafeInt) < 1) {
			var high = $elm$core$Basics$floor(x / $MartinSStewart$elm_uint64$UInt64$limit48);
			var midLow = x - ($MartinSStewart$elm_uint64$UInt64$limit48 * high);
			var mid = $elm$core$Basics$floor(midLow / $MartinSStewart$elm_uint64$UInt64$limit24);
			var low = midLow - ($MartinSStewart$elm_uint64$UInt64$limit24 * mid);
			return _Utils_Tuple3(high, mid, low);
		} else {
			return $MartinSStewart$elm_uint64$UInt64$maxSafe;
		}
	}
};
var $MartinSStewart$elm_uint64$UInt64$mul = F2(
	function (_v0, _v2) {
		var _v1 = _v0;
		var highA = _v1.a;
		var midA = _v1.b;
		var lowA = _v1.c;
		var _v3 = _v2;
		var highB = _v3.a;
		var midB = _v3.b;
		var lowB = _v3.c;
		var lowFull = lowA * lowB;
		var lowCarry = $elm$core$Basics$floor(lowFull / $MartinSStewart$elm_uint64$UInt64$limit24);
		var midFull = (lowCarry + (lowA * midB)) + (midA * lowB);
		var midCarry = $elm$core$Basics$floor(midFull / $MartinSStewart$elm_uint64$UInt64$limit24);
		var mid = midFull - (midCarry * $MartinSStewart$elm_uint64$UInt64$limit24);
		var low = lowFull - (lowCarry * $MartinSStewart$elm_uint64$UInt64$limit24);
		var high = $MartinSStewart$elm_uint64$UInt64$max16 & (((midCarry + (lowA * highB)) + (midA * midB)) + (highA * lowB));
		return _Utils_Tuple3(high, mid, low);
	});
var $elm$core$Basics$round = _Basics_round;
var $MartinSStewart$elm_uint64$UInt64$toFloat = function (_v0) {
	var _v1 = _v0;
	var high = _v1.a;
	var mid = _v1.b;
	var low = _v1.c;
	return (((high * $MartinSStewart$elm_uint64$UInt64$limit24) + mid) * $MartinSStewart$elm_uint64$UInt64$limit24) + low;
};
var $author$project$Extras$Constants$xmrConversionConstant = 4294967296;
var $author$project$Pages$Funds$formatBalance = function (int64) {
	var scale = A2($elm$core$Basics$pow, 10, 11);
	var fullUInt64 = function () {
		var lowPart = (int64.nE < 0) ? $MartinSStewart$elm_uint64$UInt64$fromInt(int64.nE + $author$project$Extras$Constants$xmrConversionConstant) : $MartinSStewart$elm_uint64$UInt64$fromInt(int64.nE);
		var highPart = A2(
			$MartinSStewart$elm_uint64$UInt64$mul,
			$MartinSStewart$elm_uint64$UInt64$fromInt($author$project$Extras$Constants$xmrConversionConstant),
			$MartinSStewart$elm_uint64$UInt64$fromInt(int64.to));
		return A2($MartinSStewart$elm_uint64$UInt64$add, highPart, lowPart);
	}();
	var fullFloat = $MartinSStewart$elm_uint64$UInt64$toFloat(fullUInt64);
	var xmrAmount = fullFloat / 1000000000000;
	var roundedXmr = $elm$core$Basics$round(xmrAmount * scale) / scale;
	return $elm$core$String$fromFloat(roundedXmr);
};
var $eriktim$elm_protocol_buffers$Internal$Int64$toInts = function (_v0) {
	var higher = _v0.to;
	var lower = _v0.nE;
	return _Utils_Tuple2(higher, lower);
};
var $eriktim$elm_protocol_buffers$Protobuf$Types$Int64$toInts = $eriktim$elm_protocol_buffers$Internal$Int64$toInts;
var $author$project$Pages$Funds$btcBalanceAsString = function (balInfo) {
	if (!balInfo.$) {
		var blInfo = balInfo.a;
		var _v1 = blInfo.sr;
		if (_v1.$ === 1) {
			return '0.00';
		} else {
			var btcbalinfo = _v1.a;
			var _v2 = $eriktim$elm_protocol_buffers$Protobuf$Types$Int64$toInts(btcbalinfo.oo);
			var firstInt = _v2.a;
			var secondInt = _v2.b;
			return $author$project$Pages$Funds$formatBalance(
				{to: firstInt, nE: secondInt});
		}
	} else {
		return '';
	}
};
var $author$project$Pages$Funds$ToggleFundsVisibility = {$: 2};
var $author$project$Extras$Constants$blankAddress = '************************';
var $author$project$Pages$Funds$primaryAddressView = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('address-container')
			]),
		_List_fromArray(
			[
				A3(
				$author$project$Utils$MyUtils$infoBtn,
				model.pB ? 'Hide' : 'Show',
				'',
				$author$project$Pages$Funds$ToggleFundsVisibility),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('address-text')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('address-label')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Primary address: ')
							])),
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('address-value'),
								$elm$html$Html$Attributes$id('primaryaddress')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								model.pB ? model.f1 : $author$project$Extras$Constants$blankAddress)
							]))
					]))
			]));
};
var $author$project$Pages$Funds$reservedOfferBalanceAsString = function (balInfo) {
	if (!balInfo.$) {
		var blInfo = balInfo.a;
		var _v1 = blInfo.rU;
		if (_v1.$ === 1) {
			return '0.00';
		} else {
			var xmrbalViewinfo = _v1.a;
			var _v2 = $eriktim$elm_protocol_buffers$Protobuf$Types$Int64$toInts(xmrbalViewinfo.us);
			var firstInt = _v2.a;
			var secondInt = _v2.b;
			return $elm$core$String$fromInt(firstInt) + ('.' + $elm$core$String$fromInt(secondInt));
		}
	} else {
		return '';
	}
};
var $author$project$Pages$Funds$xmrAvailableBalanceAsString = function (balInfo) {
	if (!balInfo.$) {
		var blInfo = balInfo.a;
		var _v1 = blInfo.rU;
		if (_v1.$ === 1) {
			return '0.00';
		} else {
			var xmrbalViewinfo = _v1.a;
			var _v2 = $eriktim$elm_protocol_buffers$Protobuf$Types$Int64$toInts(xmrbalViewinfo.oo);
			var firstInt = _v2.a;
			var secondInt = _v2.b;
			return $author$project$Pages$Funds$formatBalance(
				{to: firstInt, nE: secondInt});
		}
	} else {
		return '0.00';
	}
};
var $author$project$Pages$Funds$xmrBalView = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('balance-text')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('address-label')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Available Balance: ')
					])),
				A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('address-value'),
						$elm$html$Html$Attributes$id('xmrAvailableBalance')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						model.pB ? ($author$project$Pages$Funds$xmrAvailableBalanceAsString(model.bH) + ' XMR') : $author$project$Extras$Constants$blankAddress)
					]))
			]));
};
var $author$project$Pages$Funds$custodialFundsView = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('funds-container'),
				$elm$html$Html$Attributes$id('custodialFundsView')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h1,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('funds-title')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Funds')
					])),
				$author$project$Pages$Funds$primaryAddressView(model),
				$author$project$Pages$Funds$xmrBalView(model),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('btcbalance'),
						$elm$html$Html$Attributes$class('balance-text')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						'Available BTC Balance: ' + ($author$project$Pages$Funds$btcBalanceAsString(model.bH) + ' BTC'))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('reservedOfferBalance'),
						$elm$html$Html$Attributes$class('balance-text')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						'Reserved Offer Balance: ' + ($author$project$Pages$Funds$reservedOfferBalanceAsString(model.bH) + ' XMR'))
					])),
				A3($author$project$Utils$MyUtils$infoBtn, 'New Sub Address', '', $author$project$Pages$Funds$ClickedGotNewSubaddress)
			]));
};
var $author$project$Pages$Funds$errorView = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('funds-container')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$h1,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('funds-title')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Funds')
				])),
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('error-message'),
					$elm$html$Html$Attributes$id('funds-error-message')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Error: Unable to retrieve relevant data. Please try again later.')
				]))
		]));
var $author$project$Pages$Funds$subAddressView = function (newSubaddress) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('funds-container')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h1,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('funds-title')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Funds')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('address-text'),
						$elm$html$Html$Attributes$id('newSubaddress')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('New Subaddress: ' + newSubaddress)
					]))
			]));
};
var $author$project$Pages$Funds$view = function (model) {
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
						var _v0 = model.dL;
						if (_v0 === 1) {
							return A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('split-col')
									]),
								_List_fromArray(
									[$author$project$Pages$Funds$errorView]));
						} else {
							return A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('split-col')
									]),
								_List_fromArray(
									[
										function () {
										var _v1 = model.sK;
										if (!_v1) {
											return $author$project$Pages$Funds$custodialFundsView(model);
										} else {
											return $author$project$Pages$Funds$subAddressView(model.na);
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
var $elm$html$Html$h3 = _VirtualDom_node('h3');
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
var $author$project$Pages$Splash$view = function (model) {
	var _v0 = model.dL;
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('split-col'),
				$elm$html$Html$Attributes$class('spinner')
			]),
		_List_Nil);
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
var $author$project$Main$contentByPage = function (model) {
	var _v0 = model.E;
	switch (_v0.$) {
		case 0:
			var dashboard = _v0.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Main$GotSplashMsg,
				$author$project$Pages$Splash$view(dashboard));
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
			var buy = _v0.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Main$GotBuyMsg,
				$author$project$Pages$Buy$view(buy));
		case 6:
			var market = _v0.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Main$GotMarketMsg,
				$author$project$Pages$Market$view(market));
		case 7:
			var accounts = _v0.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Main$GotAccountsMsg,
				$author$project$Pages$Accounts$view(accounts));
		case 8:
			var donate = _v0.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Main$GotDonateMsg,
				$author$project$Pages$Donate$view(donate));
		default:
			var connect = _v0.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Main$GotConnectMsg,
				$author$project$Pages$Connect$view(connect));
	}
};
var $elm$html$Html$br = _VirtualDom_node('br');
var $elm$html$Html$footer = _VirtualDom_node('footer');
var $author$project$Main$footerContent = function (model) {
	return A2(
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
										$elm$html$Html$text('Haveno-Web')
									])),
								A2($elm$html$Html$br, _List_Nil, _List_Nil),
								$elm$html$Html$text('Open source code & design'),
								A2(
								$elm$html$Html$p,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Version 0.6.67')
									])),
								$elm$html$Html$text('Haveno Version'),
								A2(
								$elm$html$Html$p,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$id('havenofooterver')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(model.bF)
									]))
							]))
					]))
			]));
};
var $author$project$Main$ToggleMenu = {$: 14};
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $elm$html$Html$Attributes$name = $elm$html$Html$Attributes$stringProperty('name');
var $author$project$Main$isActive = function (_v0) {
	var link = _v0.pL;
	var page = _v0.E;
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
		case 8:
			if (_v1.b.$ === 8) {
				var _v18 = _v1.a;
				return true;
			} else {
				var _v19 = _v1.a;
				return false;
			}
		default:
			if (_v1.b.$ === 9) {
				var _v20 = _v1.a;
				return true;
			} else {
				var _v21 = _v1.a;
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
var $author$project$Main$topLogo = A2(
	$elm$html$Html$div,
	_List_Nil,
	_List_fromArray(
		[
			A2(
			$elm$html$Html$img,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$src('assets/resources/images/logo-splash100X33.png'),
					$elm$html$Html$Attributes$width(75),
					$elm$html$Html$Attributes$height(22),
					$elm$html$Html$Attributes$alt('Haveno Logo'),
					$elm$html$Html$Attributes$title('Haveno Logo'),
					$elm$html$Html$Attributes$id('topLogoId'),
					$elm$html$Html$Attributes$class('topLogo')
				]),
			_List_Nil)
		]));
var $author$project$Main$navLinks = function (page) {
	var navLink = F2(
		function (route, _v0) {
			var url = _v0.dl;
			var caption = _v0.bZ;
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
									{pL: route, E: page})),
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
						$elm$html$Html$Attributes$class('logoInNavLinks')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$href('https://haveno-web-dev.netlify.app/'),
								$elm$html$Html$Attributes$class('topLogoShrink')
							]),
						_List_fromArray(
							[$author$project$Main$topLogo]))
					])),
				A2(
				navLink,
				3,
				{bZ: 'Funds', dl: 'funds'}),
				A2(
				navLink,
				6,
				{bZ: 'Market', dl: 'market'}),
				A2(
				navLink,
				4,
				{bZ: 'Support', dl: 'support'}),
				A2(
				navLink,
				1,
				{bZ: 'Sell', dl: 'sell'}),
				A2(
				navLink,
				5,
				{bZ: 'Buy', dl: 'buy'}),
				A2(
				navLink,
				2,
				{bZ: 'Portfolio', dl: 'portfolio'}),
				A2(
				navLink,
				7,
				{bZ: 'Accounts', dl: 'accounts'}),
				A2(
				navLink,
				9,
				{bZ: 'Connect', dl: 'connect'}),
				A2(
				navLink,
				8,
				{bZ: 'Donate', dl: 'donate'})
			]));
	return links;
};
var $author$project$Main$menu = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$classList(
						_List_fromArray(
							[
								_Utils_Tuple2('menu-btn', true),
								_Utils_Tuple2('open', model.dG)
							])),
						$elm$html$Html$Events$onClick($author$project$Main$ToggleMenu),
						$elm$html$Html$Attributes$name('menubutton'),
						A2($elm$html$Html$Attributes$attribute, 'data-testid', 'menu-Html.button')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						model.dG ? '✖' : '☰')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$classList(
						_List_fromArray(
							[
								_Utils_Tuple2('menu', true),
								_Utils_Tuple2('open', model.dG)
							]))
					]),
				_List_fromArray(
					[
						$author$project$Main$navLinks(model.E)
					]))
			]));
};
var $author$project$Main$connectionStatusView = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('connection-status'),
				$elm$html$Html$Attributes$id('connectionStatus')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class(
						($author$project$Main$isXMRWalletConnected(model) && model.dv) ? 'status-dot green' : 'status-dot red')
					]),
				_List_Nil),
				$elm$html$Html$text(
				($author$project$Main$isXMRWalletConnected(model) && model.dv) ? 'Connected' : ((!$author$project$Main$isXMRWalletConnected(model)) ? 'Wallet not connected' : 'Haveno node not connected')),
				A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$href('/connect'),
						$elm$html$Html$Attributes$class('status-link')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Fix')
					]))
			]));
};
var $author$project$Proto$Io$Haveno$Protobuffer$defaultXmrBalanceInfo = $author$project$Proto$Io$Haveno$Protobuffer$Internals_$defaultProto__Io__Haveno__Protobuffer__XmrBalanceInfo;
var $author$project$Utils$MyUtils$gotBalancesReplyAsTypeAlias = function (reply) {
	var balInformation = A2($elm$core$Maybe$withDefault, $author$project$Proto$Io$Haveno$Protobuffer$defaultBalancesInfo, reply);
	var gotXmr = A2($elm$core$Maybe$withDefault, $author$project$Proto$Io$Haveno$Protobuffer$defaultXmrBalanceInfo, balInformation.rU);
	var _v0 = $eriktim$elm_protocol_buffers$Protobuf$Types$Int64$toInts(gotXmr.us);
	var res1 = _v0.a;
	var _v1 = $eriktim$elm_protocol_buffers$Protobuf$Types$Int64$toInts(gotXmr.kd);
	var pend1 = _v1.a;
	var _v2 = $eriktim$elm_protocol_buffers$Protobuf$Types$Int64$toInts(gotXmr.oo);
	var available1 = _v2.a;
	return {
		on: $elm$core$String$fromInt(available1),
		ug: $elm$core$String$fromInt(pend1),
		ur: $elm$core$String$fromInt(res1)
	};
};
var $author$project$Main$only2Decimals = function (str) {
	var _v0 = A2($elm$core$String$split, '.', str);
	if ((_v0.b && _v0.b.b) && (!_v0.b.b.b)) {
		var intPart = _v0.a;
		var _v1 = _v0.b;
		var decPart = _v1.a;
		var truncatedDecPart = A2($elm$core$String$left, 2, decPart);
		return intPart + ('.' + truncatedDecPart);
	} else {
		return str;
	}
};
var $author$project$Main$dashboardContainer = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('dashboard-panel')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('dashboard-section')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('large-text'),
								$elm$html$Html$Attributes$id('dashboard-container-xmrAvailableBalance')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								$author$project$Main$only2Decimals(
									$author$project$Pages$Funds$xmrAvailableBalanceAsString(model.bH)) + ' XMR')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('small-text')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Available Balance')
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('dashboard-section')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('large-text'),
								$elm$html$Html$Attributes$id('pendingBalance')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								$author$project$Utils$MyUtils$gotBalancesReplyAsTypeAlias(model.bH).ug + ' XMR')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('small-text')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Pending')
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('dashboard-section')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('large-text'),
								$elm$html$Html$Attributes$id('reservedOfferBalance')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								$author$project$Utils$MyUtils$gotBalancesReplyAsTypeAlias(model.bH).ur + ' XMR')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('small-text')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Reserved')
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('dashboard-section')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('large-text')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('XMR/USD: ')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('small-text')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Market price by Haveno Price Index')
							]))
					]))
			]));
};
var $author$project$Main$viewContainer = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('dashboard-container')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('item1')
					]),
				_List_fromArray(
					[$author$project$Main$topLogo])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('item2')
					]),
				_List_fromArray(
					[
						$author$project$Main$connectionStatusView(model)
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('item3')
					]),
				_List_fromArray(
					[
						$author$project$Main$dashboardContainer(model)
					]))
			]));
};
var $author$project$Main$view = function (model) {
	return {
		sk: function () {
			var _v0 = model.dL;
			if (!_v0) {
				return _List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('split-col'),
								$elm$html$Html$Attributes$class('spinner')
							]),
						_List_Nil)
					]);
			} else {
				return _List_fromArray(
					[
						$author$project$Main$viewContainer(model),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('main-nav-flex-container')
							]),
						_List_fromArray(
							[
								$author$project$Main$menu(model)
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('contentByPage')
							]),
						_List_fromArray(
							[
								$author$project$Main$contentByPage(model)
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('footerContent')
							]),
						_List_fromArray(
							[
								$author$project$Main$footerContent(model)
							]))
					]);
			}
		}(),
		ve: 'Haveno-Web'
	};
};
var $author$project$Main$main = $elm$browser$Browser$application(
	{tx: $author$project$Main$init, t4: $author$project$Main$ChangedUrl, t5: $author$project$Main$ClickedLink, uY: $author$project$Main$subscriptions, vj: $author$project$Main$update, vk: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main($elm$json$Json$Decode$string)(0)}});}(this));
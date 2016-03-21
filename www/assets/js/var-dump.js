/**
 * Does a PHP var_dump'ish behavior.  It only dumps one variable per call.  The
 * first parameter is the variable, and the second parameter is an optional
 * name.  This can be the variable name [makes it easier to distinguish between
 * numerious calls to this function], but any string value can be passed.
 * 
 * @param mixed var_value - the variable to be dumped
 * @param string var_name - ideally the name of the variable, which will be used 
 *       to label the dump.  If this argumment is omitted, then the dump will
 *       display without a label.
 * @param boolean - annonymous third parameter. 
 *       On TRUE publishes the result to the DOM document body.
 *       On FALSE a string is returned.
 *       Default is TRUE.
 * @returns string|inserts Dom Object in the BODY element.
 */
function my_dump (var_value, var_name)
{
    // Check for a third argument and if one exists, capture it's value, else
    // default to TRUE.  When the third argument is true, this function
    // publishes the result to the document body, else, it outputs a string.
    // The third argument is intend for use by recursive calls within this
    // function, but there is no reason why it couldn't be used in other ways.
    var is_publish_to_body = typeof arguments[2] === 'undefined' ? true:arguments[2];

    // Check for a fourth argument and if one exists, add three to it and
    // use it to indent the out block by that many characters.  This argument is
    // not intended to be used by any other than the recursive call.
    var indent_by = typeof arguments[3] === 'undefined' ? 0:arguments[3]+3;

    var do_boolean = function (v)
    {
        return 'Boolean(1) '+(v?'TRUE':'FALSE');
    };

    var do_number = function(v)
    {
        var num_digits = (''+v).length;
        return 'Number('+num_digits+') '+v;
    };

    var do_string = function(v)
    {
        var num_chars = v.length;
        return 'String('+num_chars+') "'+v+'"';
    };

    var do_object = function(v)
    {
        if (v === null)
        {
            return "NULL(0)";
        }

        var out = '';
        var num_elem = 0;
        var indent = '';

        if (v instanceof Array)
        {
            num_elem = v.length;
            for (var d=0; d<indent_by; ++d)
            {
                indent += ' ';
            }
            out = "Array("+num_elem+") \n"+(indent.length === 0?'':'|'+indent+'')+"(";
            for (var i=0; i<num_elem; ++i)
            {
                out += "\n"+(indent.length === 0?'':'|'+indent)+"|   ["+i+"] = "+my_dump(v[i],'',false,indent_by);
            }
            out += "\n"+(indent.length === 0?'':'|'+indent+'')+")";
            return out;
        }
        else if (v instanceof Object)
        {
            for (var d=0; d<indent_by; ++d)
            {
                indent += ' ';
            }
            out = "Object \n"+(indent.length === 0?'':'|'+indent+'')+"(";
            for (var p in v)
            {
                out += "\n"+(indent.length === 0?'':'|'+indent)+"|   ["+p+"] = "+my_dump(v[p],'',false,indent_by);
            }
            out += "\n"+(indent.length === 0?'':'|'+indent+'')+")";
            return out;
        }
        else
        {
            return 'Unknown Object Type!';
        }
    };

    // Makes it easier, later on, to switch behaviors based on existance or
    // absence of a var_name parameter.  By converting 'undefined' to 'empty 
    // string', the length greater than zero test can be applied in all cases.
    var_name = typeof var_name === 'undefined' ? '':var_name;
    var out = '';
    var v_name = '';
    switch (typeof var_value)
    {
        case "boolean":
            v_name = var_name.length > 0 ? var_name + ' = ':''; // Turns labeling on if var_name present, else no label
            out += v_name + do_boolean(var_value);
            break;
        case "number":
            v_name = var_name.length > 0 ? var_name + ' = ':'';
            out += v_name + do_number(var_value);
            break;
        case "string":
            v_name = var_name.length > 0 ? var_name + ' = ':'';
            out += v_name + do_string(var_value);
            break;
        case "object":
            v_name = var_name.length > 0 ? var_name + ' => ':'';
            out += v_name + do_object(var_value);
            break;
        case "function":
            v_name = var_name.length > 0 ? var_name + ' = ':'';
            out += v_name + "Function";
            break;
        case "undefined":
            v_name = var_name.length > 0 ? var_name + ' = ':'';
            out += v_name + "Undefined";
            break;
        default:
            out += v_name + ' is unknown type!';
    }

    // Using indent_by to filter out recursive calls, so this only happens on the 
    // primary call [i.e. at the end of the algorithm]
    if (is_publish_to_body  &&  indent_by === 0)
    {
        var div_dump = document.getElementById('div_dump');
        if (!div_dump)
        {
            div_dump = document.createElement('div');
            div_dump.id = 'div_dump';

            var style_dump = document.getElementsByTagName("style")[0];
            if (!style_dump)
            {
                var head = document.getElementsByTagName("head")[0];
                style_dump = document.createElement("style");
                head.appendChild(style_dump);
            }
            // Thank you Tim Down [http://stackoverflow.com/users/96100/tim-down] 
            // for the following addRule function
            var addRule;
            if (typeof document.styleSheets != "undefined" && document.styleSheets) {
                addRule = function(selector, rule) {
                    var styleSheets = document.styleSheets, styleSheet;
                    if (styleSheets && styleSheets.length) {
                        styleSheet = styleSheets[styleSheets.length - 1];
                        if (styleSheet.addRule) {
                            styleSheet.addRule(selector, rule)
                        } else if (typeof styleSheet.cssText == "string") {
                            styleSheet.cssText = selector + " {" + rule + "}";
                        } else if (styleSheet.insertRule && styleSheet.cssRules) {
                            styleSheet.insertRule(selector + " {" + rule + "}", styleSheet.cssRules.length);
                        }
                    }
                };
            } else {
                addRule = function(selector, rule, el, doc) {
                    el.appendChild(doc.createTextNode(selector + " {" + rule + "}"));
                };
            }

            // Ensure the dump text will be visible under all conditions [i.e. always
            // black text against a white background].
            addRule('#div_dump', 'background-color:white', style_dump, document);
            addRule('#div_dump', 'color:black', style_dump, document);
            addRule('#div_dump', 'padding:15px', style_dump, document);

            style_dump = null;
        }

        var pre_dump = document.getElementById('pre_dump');
        if (!pre_dump)
        {
            pre_dump = document.createElement('pre');
            pre_dump.id = 'pre_dump';
            pre_dump.innerHTML = out+"\n";
            div_dump.appendChild(pre_dump);
            document.body.appendChild(div_dump);
        }  
        else
        {
            pre_dump.innerHTML += '<br><b>var_dump</b><br>'+out+"\n";
        }
    }
    else
    {
        return out;
    }
}

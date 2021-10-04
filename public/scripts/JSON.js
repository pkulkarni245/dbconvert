// Downloaded from https://repo.progsbase.com - Code Developed Using progsbase.

function IsValidJSON(json, errorMessage) {
  var success;
  var elementReference;

  elementReference = {};

  success = ReadJSON(json, elementReference, errorMessage);

  if (success) {
    DeleteElement(elementReference.element);
  }

  return success;
}
function JSONTokenize(json, tokensReference, errorMessages) {
  var i;
  var c;
  var str;
  var stringReference, tokenReference;
  var stringLength;
  var success;
  var ll;

  ll = CreateLinkedListString();
  success = true;

  stringLength = {};
  tokenReference = {};

  for (i = 0; i < json.length && success;) {
    c = json[i];

    if (c == '{') {
      LinkedListAddString(ll, "{".split(''));
      i = i + 1;
    } else if (c == '}') {
      LinkedListAddString(ll, "}".split(''));
      i = i + 1;
    } else if (c == '[') {
      LinkedListAddString(ll, "[".split(''));
      i = i + 1;
    } else if (c == ']') {
      LinkedListAddString(ll, "]".split(''));
      i = i + 1;
    } else if (c == ':') {
      LinkedListAddString(ll, ":".split(''));
      i = i + 1;
    } else if (c == ',') {
      LinkedListAddString(ll, ",".split(''));
      i = i + 1;
    } else if (c == 'f') {
      success = GetJSONPrimitiveName(json, i, errorMessages, "false".split(''), tokenReference);
      if (success) {
        LinkedListAddString(ll, "false".split(''));
        i = i + "false".split('').length;
      }
    } else if (c == 't') {
      success = GetJSONPrimitiveName(json, i, errorMessages, "true".split(''), tokenReference);
      if (success) {
        LinkedListAddString(ll, "true".split(''));
        i = i + "true".split('').length;
      }
    } else if (c == 'n') {
      success = GetJSONPrimitiveName(json, i, errorMessages, "null".split(''), tokenReference);
      if (success) {
        LinkedListAddString(ll, "null".split(''));
        i = i + "null".split('').length;
      }
    } else if (c == ' ' || c == '\n' || c == '\t' || c == '\r') {
      /* Skip. */
      i = i + 1;
    } else if (c == '\"') {
      success = GetJSONString(json, i, tokenReference, stringLength, errorMessages);
      if (success) {
        LinkedListAddString(ll, tokenReference.string);
        i = i + stringLength.numberValue;
      }
    } else if (IsJSONNumberCharacter(c)) {
      success = GetJSONNumberToken(json, i, tokenReference, errorMessages);
      if (success) {
        LinkedListAddString(ll, tokenReference.string);
        i = i + tokenReference.string.length;
      }
    } else {
      str = strConcatenateCharacter("Invalid start of Token: ".split(''), c);
      stringReference = CreateStringReference(str);
      AddStringRef(errorMessages, stringReference);
      i = i + 1;
      success = false;
    }
  }

  if (success) {
    LinkedListAddString(ll, "<end>".split(''));
    tokensReference.stringArray = LinkedListStringsToArray(ll);
    FreeLinkedListString(ll);
  }

  return success;
}
function GetJSONNumberToken(json, start, tokenReference, errorMessages) {
  var c;
  var end, i;
  var done, success;
  var numberString;

  end = json.length;
  done = false;

  for (i = start; i < json.length && !done; i = i + 1) {
    c = json[i];
    if (!IsJSONNumberCharacter(c)) {
      done = true;
      end = i;
    }
  }

  numberString = strSubstring(json, start, end);

  success = IsValidJSONNumber(numberString, errorMessages);

  tokenReference.string = numberString;

  return success;
}
function IsValidJSONNumber(n, errorMessages) {
  var success;
  var i;

  i = 0;

  /* JSON allows an optional negative sign. */
  if (n[i] == '-') {
    i = i + 1;
  }

  if (i < n.length) {
    success = IsValidJSONNumberAfterSign(n, i, errorMessages);
  } else {
    success = false;
    AddStringRef(errorMessages, CreateStringReference("Number must contain at least one digit.".split('')));
  }

  return success;
}
function IsValidJSONNumberAfterSign(n, i, errorMessages) {
  var success;

  if (charIsNumber(n[i])) {
    /* 0 first means only 0. */
    if (n[i] == '0') {
      i = i + 1;
    } else {
      /* 1-9 first, read following digits. */
      i = IsValidJSONNumberAdvancePastDigits(n, i);
    }

    if (i < n.length) {
      success = IsValidJSONNumberFromDotOrExponent(n, i, errorMessages);
    } else {
      /* If integer, we are done now. */
      success = true;
    }
  } else {
    success = false;
    AddStringRef(errorMessages, CreateStringReference("A number must start with 0-9 (after the optional sign).".split('')));
  }

  return success;
}
function IsValidJSONNumberAdvancePastDigits(n, i) {
  var done;

  i = i + 1;
  done = false;
  for (; i < n.length && !done;) {
    if (charIsNumber(n[i])) {
      i = i + 1;
    } else {
      done = true;
    }
  }

  return i;
}
function IsValidJSONNumberFromDotOrExponent(n, i, errorMessages) {
  var wasDotAndOrE, success;

  wasDotAndOrE = false;
  success = true;

  if (n[i] == '.') {
    i = i + 1;
    wasDotAndOrE = true;

    if (i < n.length) {
      if (charIsNumber(n[i])) {
        /* Read digits following decimal point. */
        i = IsValidJSONNumberAdvancePastDigits(n, i);

        if (i == n.length) {
          /* If non-scientific decimal number, we are done. */
          success = true;
        }
      } else {
        success = false;
        AddStringRef(errorMessages, CreateStringReference("There must be numbers after the decimal point.".split('')));
      }
    } else {
      success = false;
      AddStringRef(errorMessages, CreateStringReference("There must be numbers after the decimal point.".split('')));
    }
  }

  if (i < n.length && success) {
    if (n[i] == 'e' || n[i] == 'E') {
      wasDotAndOrE = true;
      success = IsValidJSONNumberFromExponent(n, i, errorMessages);
    } else {
      success = false;
      AddStringRef(errorMessages, CreateStringReference("Expected e or E.".split('')));
    }
  } else if (i == n.length && success) {
    /* If number with decimal point. */
    success = true;
  } else {
    success = false;
    AddStringRef(errorMessages, CreateStringReference("There must be numbers after the decimal point.".split('')));
  }

  if (wasDotAndOrE) {
  } else {
    success = false;
    AddStringRef(errorMessages, CreateStringReference("Exprected decimal point or e or E.".split('')));
  }

  return success;
}
function IsValidJSONNumberFromExponent(n, i, errorMessages) {
  var success;

  i = i + 1;

  if (i < n.length) {
    /* The exponent sign can either + or -, */
    if (n[i] == '+' || n[i] == '-') {
      i = i + 1;
    }

    if (i < n.length) {
      if (charIsNumber(n[i])) {
        /* Read digits following decimal point. */
        i = IsValidJSONNumberAdvancePastDigits(n, i);

        if (i == n.length) {
          /* We found scientific number. */
          success = true;
        } else {
          success = false;
          AddStringRef(errorMessages, CreateStringReference("There was characters following the exponent.".split('')));
        }
      } else {
        success = false;
        AddStringRef(errorMessages, CreateStringReference("There must be a digit following the optional exponent sign.".split('')));
      }
    } else {
      success = false;
      AddStringRef(errorMessages, CreateStringReference("There must be a digit following optional the exponent sign.".split('')));
    }
  } else {
    success = false;
    AddStringRef(errorMessages, CreateStringReference("There must be a sign or a digit following e or E.".split('')));
  }

  return success;
}
function IsJSONNumberCharacter(c) {
  var numericCharacters;
  var found;
  var i;

  numericCharacters = "0123456789.-+eE".split('');

  found = false;

  for (i = 0; i < numericCharacters.length; i = i + 1) {
    if (numericCharacters[i] == c) {
      found = true;
    }
  }

  return found;
}
function GetJSONPrimitiveName(string, start, errorMessages, primitive, tokenReference) {
  var c, p;
  var done, success;
  var i;
  var str, token;

  done = false;
  success = true;

  token = "".split('');

  for (i = start; i < string.length && ((i - start) < primitive.length) && !done; i = i + 1) {
    c = string[i];
    p = primitive[i - start];
    if (c == p) {
      /* OK */
      if ((i + 1 - start) == primitive.length) {
        done = true;
      }
    } else {
      str = "".split('');
      str = strConcatenateString(str, "Primitive invalid: ".split(''));
      str = strAppendCharacter(str, c);
      str = strAppendString(str, " vs ".split(''));
      str = strAppendCharacter(str, p);

      AddStringRef(errorMessages, CreateStringReference(str));
      done = true;
      success = false;
    }
  }

  if (done) {
    if (StringsEqual(primitive, "false".split(''))) {
      token = "false".split('');
    }
    if (StringsEqual(primitive, "true".split(''))) {
      token = "true".split('');
    }
    if (StringsEqual(primitive, "null".split(''))) {
      token = "null".split('');
    }
  } else {
    AddStringRef(errorMessages, CreateStringReference("Primitive invalid".split('')));
    success = false;
  }

  tokenReference.string = token;

  return success;
}
function GetJSONString(json, start, tokenReference, stringLengthReference, errorMessages) {
  var success, done;
  var string, hex;
  var characterCount, hexReference;
  var i, l, c;
  var errorMessage;

  characterCount = CreateNumberReference(0);
  hex = CreateString(4, '0');
  hexReference = {};
  errorMessage = {};

  success = IsValidJSONStringInJSON(json, start, characterCount, stringLengthReference, errorMessages);

  if (success) {
    l = characterCount.numberValue;
    string = [];
    string.length = l;

    c = 0;
    string[c] = '\"';
    c = c + 1;

    done = false;
    for (i = start + 1; !done; i = i + 1) {
      if (json[i] == '\\') {
        i = i + 1;
        if (json[i] == '\"' || json[i] == '\\' || json[i] == '/') {
          string[c] = json[i];
          c = c + 1;
        } else if (json[i] == 'b') {
          string[c] = String.fromCharCode(8);
          c = c + 1;
        } else if (json[i] == 'f') {
          string[c] = String.fromCharCode(12);
          c = c + 1;
        } else if (json[i] == 'n') {
          string[c] = String.fromCharCode(10);
          c = c + 1;
        } else if (json[i] == 'r') {
          string[c] = String.fromCharCode(13);
          c = c + 1;
        } else if (json[i] == 't') {
          string[c] = String.fromCharCode(9);
          c = c + 1;
        } else if (json[i] == 'u') {
          i = i + 1;
          hex[0] = charToUpperCase(json[i + 0]);
          hex[1] = charToUpperCase(json[i + 1]);
          hex[2] = charToUpperCase(json[i + 2]);
          hex[3] = charToUpperCase(json[i + 3]);
          nCreateNumberFromStringWithCheck(hex, 16, hexReference, errorMessage);
          string[c] = String.fromCharCode(hexReference.numberValue);
          i = i + 3;
          c = c + 1;
        }
      } else if (json[i] == '\"') {
        string[c] = json[i];
        c = c + 1;
        done = true;
      } else {
        string[c] = json[i];
        c = c + 1;
      }
    }

    tokenReference.string = string;
    success = true;
  } else {
    AddStringRef(errorMessages, CreateStringReference("End of string was not found.".split('')));
    success = false;
  }

  return success;
}
function IsValidJSONString(jsonString, errorMessages) {
  var valid;
  var numberReference, stringLength;

  numberReference = {};
  stringLength = {};

  valid = IsValidJSONStringInJSON(jsonString, 0, numberReference, stringLength, errorMessages);

  return valid;
}
function IsValidJSONStringInJSON(json, start, characterCount, stringLengthReference, errorMessages) {
  var success, done;
  var i, j;
  var c;

  success = true;
  done = false;

  characterCount.numberValue = 1;

  for (i = start + 1; i < json.length && !done && success; i = i + 1) {
    if (!IsJSONIllegalControllCharacter(json[i])) {
      if (json[i] == '\\') {
        i = i + 1;
        if (i < json.length) {
          if (json[i] == '\"' || json[i] == '\\' || json[i] == '/' || json[i] == 'b' || json[i] == 'f' || json[i] == 'n' || json[i] == 'r' || json[i] == 't') {
            characterCount.numberValue = characterCount.numberValue + 1;
          } else if (json[i] == 'u') {
            if (i + 4 < json.length) {
              for (j = 0; j < 4 && success; j = j + 1) {
                c = json[i + j + 1];
                if (nCharacterIsNumberCharacterInBase(c, 16) || c == 'a' || c == 'b' || c == 'c' || c == 'd' || c == 'e' || c == 'f') {
                } else {
                  success = false;
                  AddStringRef(errorMessages, CreateStringReference("\\u must be followed by four hexadecimal digits.".split('')));
                }
              }
              characterCount.numberValue = characterCount.numberValue + 1;
              i = i + 4;
            } else {
              success = false;
              AddStringRef(errorMessages, CreateStringReference("\\u must be followed by four characters.".split('')));
            }
          } else {
            success = false;
            AddStringRef(errorMessages, CreateStringReference("Escaped character invalid.".split('')));
          }
        } else {
          success = false;
          AddStringRef(errorMessages, CreateStringReference("There must be at least two character after string escape.".split('')));
        }
      } else if (json[i] == '\"') {
        characterCount.numberValue = characterCount.numberValue + 1;
        done = true;
      } else {
        characterCount.numberValue = characterCount.numberValue + 1;
      }
    } else {
      success = false;
      AddStringRef(errorMessages, CreateStringReference("Unicode code points 0-31 not allowed in JSON string.".split('')));
    }
  }

  if (done) {
    stringLengthReference.numberValue = i - start;
  } else {
    success = false;
    AddStringRef(errorMessages, CreateStringReference("String must end with \".".split('')));
  }

  return success;
}
function IsJSONIllegalControllCharacter(c) {
  var cnr;
  var isControll;

  cnr = c.charCodeAt(0);

  if (cnr >= 0 && cnr < 32) {
    isControll = true;
  } else {
    isControll = false;
  }

  return isControll;
}
function AddElement(list, a) {
  var newlist;
  var i;

  newlist = [];
  newlist.length = list.length + 1;

  for (i = 0; i < list.length; i = i + 1) {
    newlist[i] = list[i];
  }
  newlist[list.length] = a;

  delete (list);

  return newlist;
}
function AddElementRef(list, i) {
  list.array = AddElement(list.array, i);
}
function RemoveElement(list, n) {
  var newlist;
  var i;

  newlist = [];
  newlist.length = list.length - 1;

  for (i = 0; i < list.length; i = i + 1) {
    if (i < n) {
      newlist[i] = list[i];
    }
    if (i > n) {
      newlist[i - 1] = list[i];
    }
  }

  delete (list);

  return newlist;
}
function GetElementRef(list, i) {
  return list.array[i];
}
function RemoveElementRef(list, i) {
  list.array = RemoveElement(list.array, i);
}
function CreateLinkedListElements() {
  var ll;

  ll = {};
  ll.first = {};
  ll.last = ll.first;
  ll.last.end = true;

  return ll;
}
function LinkedListAddElement(ll, value) {
  ll.last.end = false;
  ll.last.value = value;
  ll.last.next = {};
  ll.last.next.end = true;
  ll.last = ll.last.next;
}
function LinkedListElementsToArray(ll) {
  var array;
  var lengthx, i;
  var node;

  node = ll.first;

  lengthx = LinkedListElementsLength(ll);

  array = [];
  array.length = lengthx;

  for (i = 0; i < lengthx; i = i + 1) {
    array[i] = node.value;
    node = node.next;
  }

  return array;
}
function LinkedListElementsLength(ll) {
  var l;
  var node;

  l = 0;
  node = ll.first;
  for (; !node.end;) {
    node = node.next;
    l = l + 1;
  }

  return l;
}
function FreeLinkedListElements(ll) {
  var node, prev;

  node = ll.first;

  for (; !node.end;) {
    prev = node;
    node = node.next;
    delete (prev);
  }

  delete (node);
}
function ComputeJSONStringLength(element) {
  var result;

  result = 0;

  if (StringsEqual(element.type, "object".split(''))) {
    result = result + ComputeJSONObjectStringLength(element);
  } else if (StringsEqual(element.type, "string".split(''))) {
    result = JSONEscapedStringLength(element.string) + 2;
  } else if (StringsEqual(element.type, "array".split(''))) {
    result = result + ComputeJSONArrayStringLength(element);
  } else if (StringsEqual(element.type, "number".split(''))) {
    result = result + ComputeJSONNumberStringLength(element);
  } else if (StringsEqual(element.type, "null".split(''))) {
    result = result + "null".split('').length;
  } else if (StringsEqual(element.type, "boolean".split(''))) {
    result = result + ComputeJSONBooleanStringLength(element);
  }

  return result;
}
function ComputeJSONBooleanStringLength(element) {
  var result;

  if (element.booleanValue) {
    result = "true".split('').length;
  } else {
    result = "false".split('').length;
  }

  return result;
}
function ComputeJSONNumberStringLength(element) {
  var lengthx;
  var a;

  if (Math.abs(element.number) >= 10 ** 15 || Math.abs(element.number) <= 10 ** (-15)) {
    a = nCreateStringScientificNotationDecimalFromNumber(element.number);
    lengthx = a.length;
  } else {
    a = nCreateStringDecimalFromNumber(element.number);
    lengthx = a.length;
  }

  return lengthx;
}
function ComputeJSONArrayStringLength(element) {
  var arrayElement;
  var i;
  var lengthx;

  lengthx = 1;

  for (i = 0; i < element.array.length; i = i + 1) {
    arrayElement = element.array[i];

    lengthx = lengthx + ComputeJSONStringLength(arrayElement);

    if (i + 1 != element.array.length) {
      lengthx = lengthx + 1;
    }
  }

  lengthx = lengthx + 1;

  return lengthx;
}
function ComputeJSONObjectStringLength(element) {
  var key;
  var i;
  var keys;
  var objectElement;
  var lengthx;

  lengthx = 1;

  keys = GetStringElementMapKeySet(element.object);
  for (i = 0; i < keys.stringArray.length; i = i + 1) {
    key = keys.stringArray[i].string;
    objectElement = GetObjectValue(element.object, key);

    lengthx = lengthx + 1;
    lengthx = lengthx + JSONEscapedStringLength(key);
    lengthx = lengthx + 1;
    lengthx = lengthx + 1;

    lengthx = lengthx + ComputeJSONStringLength(objectElement);

    if (i + 1 != keys.stringArray.length) {
      lengthx = lengthx + 1;
    }
  }

  lengthx = lengthx + 1;

  return lengthx;
}
function CreateStringElement(string) {
  var element;
  element = {};
  element.type = "string".split('');
  element.string = string;
  return element;
}
function CreateBooleanElement(booleanValue) {
  var element;
  element = {};
  element.type = "boolean".split('');
  element.booleanValue = booleanValue;
  return element;
}
function CreateNullElement() {
  var element;
  element = {};
  element.type = "null".split('');
  return element;
}
function CreateNumberElement(number) {
  var element;
  element = {};
  element.type = "number".split('');
  element.number = number;
  return element;
}
function CreateArrayElement(lengthx) {
  var element;
  element = {};
  element.type = "array".split('');
  element.array = [];
  element.array.length = lengthx;
  return element;
}
function CreateObjectElement(lengthx) {
  var element;
  element = {};
  element.type = "object".split('');
  element.object = {};
  element.object.stringListRef = CreateStringArrayReferenceLengthValue(lengthx, "".split(''));
  element.object.elementListRef = {};
  element.object.elementListRef.array = [];
  element.object.elementListRef.array.length = lengthx;
  return element;
}
function DeleteElement(element) {
  if (StringsEqual(element.type, "object".split(''))) {
    DeleteObject(element);
  } else if (StringsEqual(element.type, "string".split(''))) {
    delete (element);
  } else if (StringsEqual(element.type, "array".split(''))) {
    DeleteArray(element);
  } else if (StringsEqual(element.type, "number".split(''))) {
    delete (element);
  } else if (StringsEqual(element.type, "null".split(''))) {
    delete (element);
  } else if (StringsEqual(element.type, "boolean".split(''))) {
    delete (element);
  } else {
  }
}
function DeleteObject(element) {
  var keys;
  var i;
  var key;
  var objectElement;

  keys = GetStringElementMapKeySet(element.object);
  for (i = 0; i < keys.stringArray.length; i = i + 1) {
    key = keys.stringArray[i].string;
    objectElement = GetObjectValue(element.object, key);
    DeleteElement(objectElement);
  }
}
function DeleteArray(element) {
  var i;
  var arrayElement;

  for (i = 0; i < element.array.length; i = i + 1) {
    arrayElement = element.array[i];
    DeleteElement(arrayElement);
  }
}
function WriteJSON(element) {
  var result;
  var lengthx;
  var index;

  lengthx = ComputeJSONStringLength(element);
  result = [];
  result.length = lengthx;
  index = CreateNumberReference(0);

  if (StringsEqual(element.type, "object".split(''))) {
    WriteObject(element, result, index);
  } else if (StringsEqual(element.type, "string".split(''))) {
    WriteString(element, result, index);
  } else if (StringsEqual(element.type, "array".split(''))) {
    WriteArray(element, result, index);
  } else if (StringsEqual(element.type, "number".split(''))) {
    WriteNumber(element, result, index);
  } else if (StringsEqual(element.type, "null".split(''))) {
    strWriteStringToStingStream(result, index, "null".split(''));
  } else if (StringsEqual(element.type, "boolean".split(''))) {
    WriteBooleanValue(element, result, index);
  }

  return result;
}
function WriteBooleanValue(element, result, index) {
  if (element.booleanValue) {
    strWriteStringToStingStream(result, index, "true".split(''));
  } else {
    strWriteStringToStingStream(result, index, "false".split(''));
  }
}
function WriteNumber(element, result, index) {
  var numberString;

  if (Math.abs(element.number) >= 10 ** 15 || Math.abs(element.number) <= 10 ** (-15)) {
    numberString = nCreateStringScientificNotationDecimalFromNumber(element.number);
  } else {
    numberString = nCreateStringDecimalFromNumber(element.number);
  }

  strWriteStringToStingStream(result, index, numberString);
}
function WriteArray(element, result, index) {
  var s;
  var arrayElement;
  var i;

  strWriteStringToStingStream(result, index, "[".split(''));

  for (i = 0; i < element.array.length; i = i + 1) {
    arrayElement = element.array[i];

    s = WriteJSON(arrayElement);
    strWriteStringToStingStream(result, index, s);

    if (i + 1 != element.array.length) {
      strWriteStringToStingStream(result, index, ",".split(''));
    }
  }

  strWriteStringToStingStream(result, index, "]".split(''));
}
function WriteString(element, result, index) {
  strWriteStringToStingStream(result, index, "\"".split(''));
  element.string = JSONEscapeString(element.string);
  strWriteStringToStingStream(result, index, element.string);
  strWriteStringToStingStream(result, index, "\"".split(''));
}
function JSONEscapeString(string) {
  var i, lengthx;
  var index, lettersReference;
  var ns, escaped;

  lengthx = JSONEscapedStringLength(string);

  ns = [];
  ns.length = lengthx;
  index = CreateNumberReference(0);
  lettersReference = CreateNumberReference(0);

  for (i = 0; i < string.length; i = i + 1) {
    if (JSONMustBeEscaped(string[i], lettersReference)) {
      escaped = JSONEscapeCharacter(string[i]);
      strWriteStringToStingStream(ns, index, escaped);
    } else {
      strWriteCharacterToStingStream(ns, index, string[i]);
    }
  }

  return ns;
}
function JSONEscapedStringLength(string) {
  var lettersReference;
  var i, lengthx;

  lettersReference = CreateNumberReference(0);
  lengthx = 0;

  for (i = 0; i < string.length; i = i + 1) {
    if (JSONMustBeEscaped(string[i], lettersReference)) {
      lengthx = lengthx + lettersReference.numberValue;
    } else {
      lengthx = lengthx + 1;
    }
  }
  return lengthx;
}
function JSONEscapeCharacter(c) {
  var code;
  var escaped;
  var hexNumber;
  var q, rs, s, b, f, n, r, t;

  code = c.charCodeAt(0);

  q = 34;
  rs = 92;
  s = 47;
  b = 8;
  f = 12;
  n = 10;
  r = 13;
  t = 9;

  hexNumber = {};

  if (code == q) {
    escaped = [];
    escaped.length = 2;
    escaped[0] = '\\';
    escaped[1] = '\"';
  } else if (code == rs) {
    escaped = [];
    escaped.length = 2;
    escaped[0] = '\\';
    escaped[1] = '\\';
  } else if (code == s) {
    escaped = [];
    escaped.length = 2;
    escaped[0] = '\\';
    escaped[1] = '/';
  } else if (code == b) {
    escaped = [];
    escaped.length = 2;
    escaped[0] = '\\';
    escaped[1] = 'b';
  } else if (code == f) {
    escaped = [];
    escaped.length = 2;
    escaped[0] = '\\';
    escaped[1] = 'f';
  } else if (code == n) {
    escaped = [];
    escaped.length = 2;
    escaped[0] = '\\';
    escaped[1] = 'n';
  } else if (code == r) {
    escaped = [];
    escaped.length = 2;
    escaped[0] = '\\';
    escaped[1] = 'r';
  } else if (code == t) {
    escaped = [];
    escaped.length = 2;
    escaped[0] = '\\';
    escaped[1] = 't';
  } else if (code >= 0 && code <= 31) {
    escaped = [];
    escaped.length = 6;
    escaped[0] = '\\';
    escaped[1] = 'u';
    escaped[2] = '0';
    escaped[3] = '0';

    nCreateStringFromNumberWithCheck(code, 16, hexNumber);

    if (hexNumber.string.length == 1) {
      escaped[4] = '0';
      escaped[5] = hexNumber.string[0];
    } else if (hexNumber.string.length == 2) {
      escaped[4] = hexNumber.string[0];
      escaped[5] = hexNumber.string[1];
    }
  } else {
    escaped = [];
    escaped.length = 1;
    escaped[0] = c;
  }

  return escaped;
}
function JSONMustBeEscaped(c, letters) {
  var code;
  var mustBeEscaped;
  var q, rs, s, b, f, n, r, t;

  code = c.charCodeAt(0);
  mustBeEscaped = false;

  q = 34;
  rs = 92;
  s = 47;
  b = 8;
  f = 12;
  n = 10;
  r = 13;
  t = 9;

  if (code == q || code == rs || code == s || code == b || code == f || code == n || code == r || code == t) {
    mustBeEscaped = true;
    letters.numberValue = 2;
  } else if (code >= 0 && code <= 31) {
    mustBeEscaped = true;
    letters.numberValue = 6;
  } else if (code >= 2 ** 16) {
    mustBeEscaped = true;
    letters.numberValue = 6;
  }

  return mustBeEscaped;
}
function WriteObject(element, result, index) {
  var s, key;
  var i;
  var keys;
  var objectElement;

  strWriteStringToStingStream(result, index, "{".split(''));

  keys = GetStringElementMapKeySet(element.object);
  for (i = 0; i < keys.stringArray.length; i = i + 1) {
    key = keys.stringArray[i].string;
    key = JSONEscapeString(key);
    objectElement = GetObjectValue(element.object, key);

    strWriteStringToStingStream(result, index, "\"".split(''));
    strWriteStringToStingStream(result, index, key);
    strWriteStringToStingStream(result, index, "\"".split(''));
    strWriteStringToStingStream(result, index, ":".split(''));

    s = WriteJSON(objectElement);
    strWriteStringToStingStream(result, index, s);

    if (i + 1 != keys.stringArray.length) {
      strWriteStringToStingStream(result, index, ",".split(''));
    }
  }

  strWriteStringToStingStream(result, index, "}".split(''));
}
function ReadJSON(string, elementReference, errorMessages) {
  var tokenArrayReference;
  var success;

  /* Tokenize. */
  tokenArrayReference = {};
  success = JSONTokenize(string, tokenArrayReference, errorMessages);

  if (success) {
    /* Parse. */
    success = GetJSONValue(tokenArrayReference.stringArray, elementReference, errorMessages);
  }

  return success;
}
function GetJSONValue(tokens, elementReference, errorMessages) {
  var i;
  var success;

  i = CreateNumberReference(0);
  success = GetJSONValueRecursive(tokens, i, 0, elementReference, errorMessages);

  return success;
}
function GetJSONValueRecursive(tokens, i, depth, elementReference, errorMessages) {
  var str, substr, token;
  var stringToDecimalResult;
  var success;

  success = true;
  token = tokens[i.numberValue].string;

  if (StringsEqual(token, "{".split(''))) {
    success = GetJSONObject(tokens, i, depth + 1, elementReference, errorMessages);
  } else if (StringsEqual(token, "[".split(''))) {
    success = GetJSONArray(tokens, i, depth + 1, elementReference, errorMessages);
  } else if (StringsEqual(token, "true".split(''))) {
    elementReference.element = CreateBooleanElement(true);
    i.numberValue = i.numberValue + 1;
  } else if (StringsEqual(token, "false".split(''))) {
    elementReference.element = CreateBooleanElement(false);
    i.numberValue = i.numberValue + 1;
  } else if (StringsEqual(token, "null".split(''))) {
    elementReference.element = CreateNullElement();
    i.numberValue = i.numberValue + 1;
  } else if (charIsNumber(token[0]) || token[0] == '-') {
    stringToDecimalResult = nCreateNumberFromDecimalString(token);
    elementReference.element = CreateNumberElement(stringToDecimalResult);
    i.numberValue = i.numberValue + 1;
  } else if (token[0] == '\"') {
    substr = strSubstring(token, 1, token.length - 1);
    elementReference.element = CreateStringElement(substr);
    i.numberValue = i.numberValue + 1;
  } else {
    str = "".split('');
    str = strConcatenateString(str, "Invalid token first in value: ".split(''));
    str = strAppendString(str, token);
    AddStringRef(errorMessages, CreateStringReference(str));
    success = false;
  }

  if (success && depth == 0) {
    if (StringsEqual(tokens[i.numberValue].string, "<end>".split(''))) {
    } else {
      AddStringRef(errorMessages, CreateStringReference("The outer value cannot have any tokens following it.".split('')));
      success = false;
    }
  }

  return success;
}
function GetJSONObject(tokens, i, depth, elementReference, errorMessages) {
  var element, value;
  var done, success;
  var key, colon, comma, closeCurly;
  var keystring, str;
  var valueReference;
  var values;
  var keys;

  keys = CreateLinkedListString();
  values = CreateLinkedListElements();
  element = CreateObjectElement(0);
  valueReference = {};
  success = true;
  i.numberValue = i.numberValue + 1;

  if (!StringsEqual(tokens[i.numberValue].string, "}".split(''))) {
    done = false;

    for (; !done && success;) {
      key = tokens[i.numberValue].string;

      if (key[0] == '\"') {
        i.numberValue = i.numberValue + 1;
        colon = tokens[i.numberValue].string;
        if (StringsEqual(colon, ":".split(''))) {
          i.numberValue = i.numberValue + 1;
          success = GetJSONValueRecursive(tokens, i, depth, valueReference, errorMessages);

          if (success) {
            keystring = strSubstring(key, 1, key.length - 1);
            value = valueReference.element;
            LinkedListAddString(keys, keystring);
            LinkedListAddElement(values, value);

            comma = tokens[i.numberValue].string;
            if (StringsEqual(comma, ",".split(''))) {
              /* OK */
              i.numberValue = i.numberValue + 1;
            } else {
              done = true;
            }
          }
        } else {
          str = "".split('');
          str = strConcatenateString(str, "Expected colon after key in object: ".split(''));
          str = strAppendString(str, colon);
          AddStringRef(errorMessages, CreateStringReference(str));

          success = false;
          done = true;
        }
      } else {
        AddStringRef(errorMessages, CreateStringReference("Expected string as key in object.".split('')));

        done = true;
        success = false;
      }
    }
  }

  if (success) {
    closeCurly = tokens[i.numberValue].string;

    if (StringsEqual(closeCurly, "}".split(''))) {
      /* OK */
      delete (element.object.stringListRef.stringArray);
      delete (element.object.elementListRef.array);
      element.object.stringListRef.stringArray = LinkedListStringsToArray(keys);
      element.object.elementListRef.array = LinkedListElementsToArray(values);
      elementReference.element = element;
      i.numberValue = i.numberValue + 1;
    } else {
      AddStringRef(errorMessages, CreateStringReference("Expected close curly brackets at end of object value.".split('')));
      success = false;
    }
  }

  FreeLinkedListString(keys);
  FreeLinkedListElements(values);
  delete (valueReference);

  return success;
}
function GetJSONArray(tokens, i, depth, elementReference, errorMessages) {
  var element, value;
  var nextToken, comma;
  var done, success;
  var valueReference;
  var elements;

  elements = CreateLinkedListElements();
  i.numberValue = i.numberValue + 1;

  valueReference = {};
  success = true;
  element = CreateArrayElement(0);

  nextToken = tokens[i.numberValue].string;

  if (!StringsEqual(nextToken, "]".split(''))) {
    done = false;
    for (; !done && success;) {
      success = GetJSONValueRecursive(tokens, i, depth, valueReference, errorMessages);

      if (success) {
        value = valueReference.element;
        LinkedListAddElement(elements, value);

        comma = tokens[i.numberValue].string;

        if (StringsEqual(comma, ",".split(''))) {
          /* OK */
          i.numberValue = i.numberValue + 1;
        } else {
          done = true;
        }
      }
    }
  }

  nextToken = tokens[i.numberValue].string;
  if (StringsEqual(nextToken, "]".split(''))) {
    /* OK */
    i.numberValue = i.numberValue + 1;
    delete (element.array);
    element.array = LinkedListElementsToArray(elements);
  } else {
    AddStringRef(errorMessages, CreateStringReference("Expected close square bracket at end of array.".split('')));
    success = false;
  }

  elementReference.element = element;
  FreeLinkedListElements(elements);
  delete (valueReference);

  return success;
}
function GetStringElementMapKeySet(stringElementMap) {
  return stringElementMap.stringListRef;
}
function GetObjectValue(stringElementMap, key) {
  var result;
  var i;

  result = {};

  for (i = 0; i < GetStringElementMapNumberOfKeys(stringElementMap); i = i + 1) {
    if (StringsEqual(stringElementMap.stringListRef.stringArray[i].string, key)) {
      result = stringElementMap.elementListRef.array[i];
    }
  }

  return result;
}
function GetObjectValueWithCheck(stringElementMap, key, foundReference) {
  var result;
  var i;

  result = {};

  foundReference.booleanValue = false;
  for (i = 0; i < GetStringElementMapNumberOfKeys(stringElementMap); i = i + 1) {
    if (StringsEqual(stringElementMap.stringListRef.stringArray[i].string, key)) {
      result = stringElementMap.elementListRef.array[i];
      foundReference.booleanValue = true;
    }
  }

  return result;
}
function PutStringElementMap(stringElementMap, keystring, value) {
  AddStringRef(stringElementMap.stringListRef, CreateStringReference(keystring));
  AddElementRef(stringElementMap.elementListRef, value);
}
function SetStringElementMap(stringElementMap, index, keystring, value) {
  stringElementMap.stringListRef.stringArray[index].string = keystring;
  stringElementMap.elementListRef.array[index] = value;
}
function GetStringElementMapNumberOfKeys(stringElementMap) {
  return stringElementMap.stringListRef.stringArray.length;
}
function JSONCompare(a, b, epsilon, equal, errorMessage) {
  var success;
  var eaRef, ebRef;
  var ea, eb;

  eaRef = {};
  ebRef = {};

  success = ReadJSON(a, eaRef, errorMessage);

  if (success) {
    ea = eaRef.element;

    success = ReadJSON(b, ebRef, errorMessage);

    if (success) {
      eb = ebRef.element;

      equal.booleanValue = JSONCompareElements(ea, eb, epsilon);

      DeleteElement(eb);
    }

    DeleteElement(ea);
  }

  return success;
}
function JSONCompareElements(ea, eb, epsilon) {
  var equal;
  var typeName;

  equal = StringsEqual(ea.type, eb.type);

  if (equal) {
    typeName = ea.type;
    if (StringsEqual(typeName, "object".split(''))) {
      equal = JSONCompareObjects(ea.object, eb.object, epsilon);
    } else if (StringsEqual(typeName, "string".split(''))) {
      equal = StringsEqual(ea.string, eb.string);
    } else if (StringsEqual(typeName, "array".split(''))) {
      equal = JSONCompareArrays(ea.array, eb.array, epsilon);
    } else if (StringsEqual(typeName, "number".split(''))) {
      equal = EpsilonCompare(ea.number, eb.number, epsilon);
    } else if (StringsEqual(typeName, "null".split(''))) {
      equal = true;
    } else if (StringsEqual(typeName, "boolean".split(''))) {
      equal = ea.booleanValue == eb.booleanValue;
    }
  }

  return equal;
}
function JSONCompareArrays(ea, eb, epsilon) {
  var equals;
  var i, lengthx;

  equals = ea.length == eb.length;

  if (equals) {
    lengthx = ea.length;
    for (i = 0; i < lengthx && equals; i = i + 1) {
      equals = JSONCompareElements(ea[i], eb[i], epsilon);
    }
  }

  return equals;
}
function JSONCompareObjects(ea, eb, epsilon) {
  var equals;
  var akeys, bkeys, i;
  var keys;
  var key;
  var aFoundReference, bFoundReference;
  var eaValue, ebValue;

  aFoundReference = {};
  bFoundReference = {};

  akeys = GetStringElementMapNumberOfKeys(ea);
  bkeys = GetStringElementMapNumberOfKeys(eb);

  equals = akeys == bkeys;

  if (equals) {
    keys = GetStringElementMapKeySet(ea);

    for (i = 0; i < keys.stringArray.length && equals; i = i + 1) {
      key = keys.stringArray[i].string;

      eaValue = GetObjectValueWithCheck(ea, key, aFoundReference);
      ebValue = GetObjectValueWithCheck(eb, key, bFoundReference);

      if (aFoundReference.booleanValue && bFoundReference.booleanValue) {
        equals = JSONCompareElements(eaValue, ebValue, epsilon);
      } else {
        equals = false;
      }
    }
  }

  return equals;
}
function testEscaper(failures) {
  var c;
  var letters;
  var mustBeEscaped;
  var escaped;

  letters = CreateNumberReference(0);

  c = String.fromCharCode(9);
  mustBeEscaped = JSONMustBeEscaped(c, letters);
  AssertTrue(mustBeEscaped, failures);
  AssertEquals(letters.numberValue, 2, failures);

  escaped = JSONEscapeCharacter(c);
  AssertStringEquals(escaped, "\\t".split(''), failures);

  c = String.fromCharCode(0);
  mustBeEscaped = JSONMustBeEscaped(c, letters);
  AssertTrue(mustBeEscaped, failures);
  AssertEquals(letters.numberValue, 6, failures);

  escaped = JSONEscapeCharacter(c);
  AssertStringEquals(escaped, "\\u0000".split(''), failures);
}
function mapTo(root) {
  var example;

  example = {};
  example.a = GetObjectValue(root.object, "a".split('')).string;
  example.b = mapbTo(GetObjectValue(root.object, "b".split('')).array);
  example.x = mapXTo(GetObjectValue(root.object, "x".split('')).object);

  return example;
}
function mapXTo(object) {
  var x;

  x = {};

  if (StringsEqual(GetObjectValue(object, "x1".split('')).type, "null".split(''))) {
    x.x1IsNull = true;
    x.x1 = "".split('');
  }

  x.x2 = GetObjectValue(object, "x2".split('')).booleanValue;
  x.x3 = GetObjectValue(object, "x3".split('')).booleanValue;

  return x;
}
function mapbTo(array) {
  var b;
  var i;

  b = [];
  b.length = array.length;

  for (i = 0; i < array.length; i = i + 1) {
    b[i] = array[i].number;
  }

  return b;
}
function testWriter(failures) {
  var string;
  var root;
  var example;

  root = createExampleJSON();

  string = WriteJSON(root);

  AssertEquals(string.length, 66, failures);

  /* Does not work with Java Maps.. */
  example = mapTo(root);

  AssertStringEquals("hei".split(''), example.a, failures);
  AssertTrue(example.x.x1IsNull, failures);
  AssertTrue(example.x.x2, failures);
  AssertFalse(example.x.x3, failures);
  AssertEquals(1.2, example.b[0], failures);
  AssertEquals(0.1, example.b[1], failures);
  AssertEquals(100, example.b[2], failures);

  DeleteElement(root);
}
function createExampleJSON() {
  var root, innerObject, array;

  root = CreateObjectElement(3);

  innerObject = CreateObjectElement(3);

  SetStringElementMap(innerObject.object, 0, "x1".split(''), CreateNullElement());
  SetStringElementMap(innerObject.object, 1, "x2".split(''), CreateBooleanElement(true));
  SetStringElementMap(innerObject.object, 2, "x3".split(''), CreateBooleanElement(false));

  array = CreateArrayElement(3);
  array.array[0] = CreateNumberElement(1.2);
  array.array[1] = CreateNumberElement(0.1);
  array.array[2] = CreateNumberElement(100);

  SetStringElementMap(root.object, 0, "a".split(''), CreateStringElement("hei".split('')));
  SetStringElementMap(root.object, 1, "b".split(''), array);
  SetStringElementMap(root.object, 2, "x".split(''), innerObject);

  return root;
}
function testWriterEscape(failures) {
  var string;
  var root;

  root = CreateStringElement("\t\n".split(''));

  string = WriteJSON(root);

  AssertEquals(string.length, 6, failures);

  AssertStringEquals("\"\\t\\n\"".split(''), string, failures);

  DeleteElement(root);
}
function testReader(failures) {
  var json;
  var string, string2;
  var errorMessages;
  var elementReference;
  var success;

  json = createExampleJSON();
  string = WriteJSON(json);
  elementReference = {};

  errorMessages = CreateStringArrayReferenceLengthValue(0, "".split(''));

  success = ReadJSON(string, elementReference, errorMessages);
  AssertTrue(success, failures);

  if (success) {
    json = elementReference.element;
    string2 = WriteJSON(json);

    AssertEquals(string.length, string2.length, failures);
  }
}
function test2(failures) {
  var string, string2;
  var errorMessages;
  var json;
  var elementReference;
  var success;

  string = strConcatenateString("{".split(''), "\"name\":\"base64\",".split(''));
  string = strAppendString(string, "\"version\":\"0.1.0\",".split(''));
  string = strAppendString(string, "\"business namespace\":\"no.inductive.idea10.programs\",".split(''));
  string = strAppendString(string, "\"scientific namespace\":\"computerscience.algorithms.base64\",".split(''));
  string = strAppendString(string, "\"imports\":[".split(''));
  string = strAppendString(string, "],".split(''));
  string = strAppendString(string, "\"imports2\":{".split(''));
  string = strAppendString(string, "},".split(''));
  string = strAppendString(string, "\"development imports\":[".split(''));
  string = strAppendString(string, "[\"\",\"no.inductive.idea10.programs\",\"arrays\",\"0.1.0\"]".split(''));
  string = strAppendString(string, "]".split(''));
  string = strAppendString(string, "}".split(''));

  errorMessages = CreateStringArrayReferenceLengthValue(0, "".split(''));
  elementReference = {};
  success = ReadJSON(string, elementReference, errorMessages);
  AssertTrue(success, failures);

  if (success) {
    json = elementReference.element;

    string2 = WriteJSON(json);

    AssertEquals(string.length, string2.length, failures);
  }
}
function testReaderExample(failures) {
  var json;
  var errorMessages;
  var elementReference;
  var outputJSON;

  errorMessages = CreateStringArrayReferenceLengthValue(0, "".split(''));
  elementReference = {};
  outputJSON = CreateStringReference("".split(''));

  json = "{\"a\":\"hi\",\"b\":[1.2, 0.1, 100],\"x\":{\"x1\":null,\"x2\":true,\"x3\":false}}".split('');

  JSONExample(json, errorMessages, elementReference, outputJSON);
}
function JSONExample(json, errorMessages, elementReference, outputJSON) {
  var success;
  var element, aElement;
  var string;
  var array;
  var x, y, z;

  /* The following JSON is in the string json:
           {
             "a": "hi",
             "b": [1.2, 0.1, 100],
             "x": {
               "x1": null,
               "x2": true,
               "x3": false
             }
           }
         */

  /* This functions reads the JSON */
  success = ReadJSON(json, elementReference, errorMessages);

  /* The return value 'success' is set to true of the parsing succeeds, */
  /* if not, errorMessages contains the reason. */
  if (success) {
    /* We can now extract the data structure: */
    element = elementReference.element;

    /* The following is gets the value "hi" for key "a": */
    aElement = GetObjectValue(element.object, "a".split(''));
    string = aElement.string;

    /* The following is gets the array [1.2, 0.1, 100] for key "b": */
    aElement = GetObjectValue(element.object, "b".split(''));
    array = aElement.array;
    x = array[0].number;
    y = array[1].number;
    z = array[2].number;

    /* This is how you write JSON: */
    outputJSON.string = WriteJSON(element);
  } else {
    /* There was a problem, so we cannot read our data structure. */
    /* Instead, we can check out the error message. */
    string = errorMessages.stringArray[0].string;
  }
}
function test() {
  var failures;

  failures = CreateNumberReference(0);

  testReader(failures);
  test2(failures);
  testWriter(failures);
  testWriterEscape(failures);
  testTokenizer1(failures);
  testReaderExample(failures);
  testEscaper(failures);
  testValidator(failures);
  testComparator(failures);

  return failures.numberValue;
}
function testValidator(failures) {
  var a, b;
  var errorMessages;

  errorMessages = CreateStringArrayReferenceLengthValue(0, "".split(''));

  a = "{\"a\":\"hi\",\"b\":[1.2, 0.1, 100],\"x\":{\"x1\":null,\"x2\":true,\"x3\":false}}".split('');
  b = "{{}}]".split('');

  AssertTrue(IsValidJSON(a, errorMessages), failures);
  AssertFalse(IsValidJSON(b, errorMessages), failures);
}
function testComparator(failures) {
  var a, b;
  var errorMessages;
  var equalsReference;
  var success;

  errorMessages = CreateStringArrayReferenceLengthValue(0, "".split(''));
  equalsReference = CreateBooleanReference(false);

  a = "{\"a\":\"hi\",\"b\":[1.2, 0.1, 100],\"x\":{\"x1\":null,\"x2\":true,\"x3\":false}}".split('');
  b = "{\"x\":{\"x1\":null,\"x2\":true,\"x3\":false},\"a\":\"hi\",\"b\":[1.2, 0.1, 100]}".split('');

  success = JSONCompare(a, b, 0.0001, equalsReference, errorMessages);

  AssertTrue(success, failures);
  AssertTrue(equalsReference.booleanValue, failures);

  a = "{\"a\":\"hi\",\"b\":[1.201, 0.1, 100],\"x\":{\"x1\":null,\"x2\":true,\"x3\":false}}".split('');
  b = "{\"x\":{\"x1\":null,\"x2\":true,\"x3\":false},\"a\":\"hi\",\"b\":[1.2, 0.1, 100]}".split('');

  success = JSONCompare(a, b, 0.0001, equalsReference, errorMessages);

  AssertTrue(success, failures);
  AssertFalse(equalsReference.booleanValue, failures);

  success = JSONCompare(a, b, 0.1, equalsReference, errorMessages);

  AssertTrue(success, failures);
  AssertTrue(equalsReference.booleanValue, failures);
}
function testTokenizer1(failures) {
  var countReference, stringLength;
  var errorMessages, tokenArrayReference;
  var success;
  var numbers;
  var i;

  countReference = CreateNumberReference(0);
  stringLength = CreateNumberReference(0);
  errorMessages = CreateStringArrayReferenceLengthValue(0, "".split(''));

  tokenArrayReference = {};

  success = JSONTokenize("false".split(''), tokenArrayReference, errorMessages);
  AssertTrue(success, failures);
  if (success) {
    AssertEquals(tokenArrayReference.stringArray.length, 2, failures);
    AssertStringEquals(tokenArrayReference.stringArray[0].string, "false".split(''), failures);
  }

  numbers = strSplitByString("11, -1e-1, -0.123456789e-99, 1E1, -0.1E23".split(''), ", ".split(''));

  for (i = 0; i < numbers.length; i = i + 1) {
    success = JSONTokenize(numbers[i].string, tokenArrayReference, errorMessages);
    AssertTrue(success, failures);
    if (success) {
      AssertEquals(tokenArrayReference.stringArray.length, 2, failures);
      AssertStringEquals(tokenArrayReference.stringArray[0].string, numbers[i].string, failures);
    }
  }

  success = IsValidJSONStringInJSON("\"\"".split(''), 0, countReference, stringLength, errorMessages);
  AssertTrue(success, failures);
  if (success) {
    AssertEquals(countReference.numberValue, 2, failures);
  }

  success = IsValidJSONString("\"\\u1234\\n\\r\\f\\b\\t\"".split(''), errorMessages);
  AssertTrue(success, failures);

  success = JSONTokenize("\"".split(''), tokenArrayReference, errorMessages);
  AssertFalse(success, failures);

  success = IsValidJSONNumber("1.1-e1".split(''), errorMessages);
  AssertFalse(success, failures);

  success = IsValidJSONNumber("1E+2".split(''), errorMessages);
  AssertTrue(success, failures);

  success = IsValidJSONString("\"\\uAAAG\"".split(''), errorMessages);
  AssertFalse(success, failures);
}
function CreateBooleanReference(value) {
  var ref;

  ref = {};
  ref.booleanValue = value;

  return ref;
}
function CreateBooleanArrayReference(value) {
  var ref;

  ref = {};
  ref.booleanArray = value;

  return ref;
}
function CreateBooleanArrayReferenceLengthValue(lengthx, value) {
  var ref;
  var i;

  ref = {};
  ref.booleanArray = [];
  ref.booleanArray.length = lengthx;

  for (i = 0; i < lengthx; i = i + 1) {
    ref.booleanArray[i] = value;
  }

  return ref;
}
function FreeBooleanArrayReference(booleanArrayReference) {
  delete (booleanArrayReference.booleanArray);
  delete (booleanArrayReference);
}
function CreateCharacterReference(value) {
  var ref;

  ref = {};
  ref.characterValue = value;

  return ref;
}
function CreateNumberReference(value) {
  var ref;

  ref = {};
  ref.numberValue = value;

  return ref;
}
function CreateNumberArrayReference(value) {
  var ref;

  ref = {};
  ref.numberArray = value;

  return ref;
}
function CreateNumberArrayReferenceLengthValue(lengthx, value) {
  var ref;
  var i;

  ref = {};
  ref.numberArray = [];
  ref.numberArray.length = lengthx;

  for (i = 0; i < lengthx; i = i + 1) {
    ref.numberArray[i] = value;
  }

  return ref;
}
function FreeNumberArrayReference(numberArrayReference) {
  delete (numberArrayReference.numberArray);
  delete (numberArrayReference);
}
function CreateStringReference(value) {
  var ref;

  ref = {};
  ref.string = value;

  return ref;
}
function CreateStringReferenceLengthValue(lengthx, value) {
  var ref;
  var i;

  ref = {};
  ref.string = [];
  ref.string.length = lengthx;

  for (i = 0; i < lengthx; i = i + 1) {
    ref.string[i] = value;
  }

  return ref;
}
function FreeStringReference(stringReference) {
  delete (stringReference.string);
  delete (stringReference);
}
function CreateStringArrayReference(strings) {
  var ref;

  ref = {};
  ref.stringArray = strings;

  return ref;
}
function CreateStringArrayReferenceLengthValue(lengthx, value) {
  var ref;
  var i;

  ref = {};
  ref.stringArray = [];
  ref.stringArray.length = lengthx;

  for (i = 0; i < lengthx; i = i + 1) {
    ref.stringArray[i] = CreateStringReference(value);
  }

  return ref;
}
function FreeStringArrayReference(stringArrayReference) {
  var i;

  for (i = 0; i < stringArrayReference.stringArray.length; i = i + 1) {
    delete (stringArrayReference.stringArray[i]);
  }
  delete (stringArrayReference.stringArray);
  delete (stringArrayReference);
}
function strWriteStringToStingStream(stream, index, src) {
  var i;

  for (i = 0; i < src.length; i = i + 1) {
    stream[index.numberValue + i] = src[i];
  }
  index.numberValue = index.numberValue + src.length;
}
function strWriteCharacterToStingStream(stream, index, src) {
  stream[index.numberValue] = src;
  index.numberValue = index.numberValue + 1;
}
function strWriteBooleanToStingStream(stream, index, src) {
  if (src) {
    strWriteStringToStingStream(stream, index, "true".split(''));
  } else {
    strWriteStringToStingStream(stream, index, "false".split(''));
  }
}
function strSubstringWithCheck(string, from, to, stringReference) {
  var success;

  if (from >= 0 && from <= string.length && to >= 0 && to <= string.length && from <= to) {
    stringReference.string = strSubstring(string, from, to);
    success = true;
  } else {
    success = false;
  }

  return success;
}
function strSubstring(string, from, to) {
  var n;
  var i, lengthx;

  lengthx = to - from;

  n = [];
  n.length = lengthx;

  for (i = from; i < to; i = i + 1) {
    n[i - from] = string[i];
  }

  return n;
}
function strAppendString(s1, s2) {
  var newString;

  newString = strConcatenateString(s1, s2);

  delete (s1);

  return newString;
}
function strConcatenateString(s1, s2) {
  var newString;
  var i;

  newString = [];
  newString.length = s1.length + s2.length;

  for (i = 0; i < s1.length; i = i + 1) {
    newString[i] = s1[i];
  }

  for (i = 0; i < s2.length; i = i + 1) {
    newString[s1.length + i] = s2[i];
  }

  return newString;
}
function strAppendCharacter(string, c) {
  var newString;

  newString = strConcatenateCharacter(string, c);

  delete (string);

  return newString;
}
function strConcatenateCharacter(string, c) {
  var newString;
  var i;
  newString = [];
  newString.length = string.length + 1;

  for (i = 0; i < string.length; i = i + 1) {
    newString[i] = string[i];
  }

  newString[string.length] = c;

  return newString;
}
function strSplitByCharacter(toSplit, splitBy) {
  var split;
  var stringToSplitBy;

  stringToSplitBy = [];
  stringToSplitBy.length = 1;
  stringToSplitBy[0] = splitBy;

  split = strSplitByString(toSplit, stringToSplitBy);

  delete (stringToSplitBy);

  return split;
}
function strIndexOfCharacter(string, character, indexReference) {
  var i;
  var found;

  found = false;
  for (i = 0; i < string.length && !found; i = i + 1) {
    if (string[i] == character) {
      found = true;
      indexReference.numberValue = i;
    }
  }

  return found;
}
function strSubstringEqualsWithCheck(string, from, substring, equalsReference) {
  var success;

  if (from < string.length) {
    success = true;
    equalsReference.booleanValue = strSubstringEquals(string, from, substring);
  } else {
    success = false;
  }

  return success;
}
function strSubstringEquals(string, from, substring) {
  var i;
  var equal;

  equal = true;
  for (i = 0; i < substring.length && equal; i = i + 1) {
    if (string[from + i] != substring[i]) {
      equal = false;
    }
  }

  return equal;
}
function strIndexOfString(string, substring, indexReference) {
  var i;
  var found;

  found = false;
  for (i = 0; i < string.length - substring.length + 1 && !found; i = i + 1) {
    if (strSubstringEquals(string, i, substring)) {
      found = true;
      indexReference.numberValue = i;
    }
  }

  return found;
}
function strContainsCharacter(string, character) {
  var i;
  var found;

  found = false;
  for (i = 0; i < string.length && !found; i = i + 1) {
    if (string[i] == character) {
      found = true;
    }
  }

  return found;
}
function strContainsString(string, substring) {
  return strIndexOfString(string, substring, {});
}
function strToUpperCase(string) {
  var i;

  for (i = 0; i < string.length; i = i + 1) {
    string[i] = charToUpperCase(string[i]);
  }
}
function strToLowerCase(string) {
  var i;

  for (i = 0; i < string.length; i = i + 1) {
    string[i] = charToLowerCase(string[i]);
  }
}
function strEqualsIgnoreCase(a, b) {
  var equal;
  var i;

  if (a.length == b.length) {
    equal = true;
    for (i = 0; i < a.length && equal; i = i + 1) {
      if (charToLowerCase(a[i]) != charToLowerCase(b[i])) {
        equal = false;
      }
    }
  } else {
    equal = false;
  }

  return equal;
}
function strReplaceString(string, toReplace, replaceWith) {
  var result;
  var i;
  var equalsReference;
  var success;

  equalsReference = {};
  result = [];
  result.length = 0;

  for (i = 0; i < string.length;) {
    success = strSubstringEqualsWithCheck(string, i, toReplace, equalsReference);
    if (success) {
      success = equalsReference.booleanValue;
    }

    if (success && toReplace.length > 0) {
      result = strConcatenateString(result, replaceWith);
      i = i + toReplace.length;
    } else {
      result = strConcatenateCharacter(result, string[i]);
      i = i + 1;
    }
  }

  return result;
}
function strReplaceCharacter(string, toReplace, replaceWith) {
  var result;
  var i;

  result = [];
  result.length = 0;

  for (i = 0; i < string.length; i = i + 1) {
    if (string[i] == toReplace) {
      result = strConcatenateCharacter(result, replaceWith);
    } else {
      result = strConcatenateCharacter(result, string[i]);
    }
  }

  return result;
}
function strTrim(string) {
  var result;
  var i, lastWhitespaceLocationStart, lastWhitespaceLocationEnd;
  var firstNonWhitespaceFound;

  /* Find whitepaces at the start. */
  lastWhitespaceLocationStart = -1;
  firstNonWhitespaceFound = false;
  for (i = 0; i < string.length && !firstNonWhitespaceFound; i = i + 1) {
    if (charIsWhiteSpace(string[i])) {
      lastWhitespaceLocationStart = i;
    } else {
      firstNonWhitespaceFound = true;
    }
  }

  /* Find whitepaces at the end. */
  lastWhitespaceLocationEnd = string.length;
  firstNonWhitespaceFound = false;
  for (i = string.length - 1; i >= 0 && !firstNonWhitespaceFound; i = i - 1) {
    if (charIsWhiteSpace(string[i])) {
      lastWhitespaceLocationEnd = i;
    } else {
      firstNonWhitespaceFound = true;
    }
  }

  if (lastWhitespaceLocationStart < lastWhitespaceLocationEnd) {
    result = strSubstring(string, lastWhitespaceLocationStart + 1, lastWhitespaceLocationEnd);
  } else {
    result = [];
    result.length = 0;
  }

  return result;
}
function strStartsWith(string, start) {
  var startsWithString;

  startsWithString = false;
  if (string.length >= start.length) {
    startsWithString = strSubstringEquals(string, 0, start);
  }

  return startsWithString;
}
function strEndsWith(string, end) {
  var endsWithString;

  endsWithString = false;
  if (string.length >= end.length) {
    endsWithString = strSubstringEquals(string, string.length - end.length, end);
  }

  return endsWithString;
}
function strSplitByString(toSplit, splitBy) {
  var split;
  var next;
  var i;
  var c;
  var n;

  split = [];
  split.length = 0;

  next = [];
  next.length = 0;
  for (i = 0; i < toSplit.length;) {
    c = toSplit[i];

    if (strSubstringEquals(toSplit, i, splitBy)) {
      if (split.length != 0 || i != 0) {
        n = {};
        n.string = next;
        split = AddString(split, n);
        next = [];
        next.length = 0;
        i = i + splitBy.length;
      }
    } else {
      next = strAppendCharacter(next, c);
      i = i + 1;
    }
  }

  if (next.length > 0) {
    n = {};
    n.string = next;
    split = AddString(split, n);
  }

  return split;
}
function strStringIsBefore(a, b) {
  var before, equal, done;
  var i;

  before = false;
  equal = true;
  done = false;

  if (a.length == 0 && b.length > 0) {
    before = true;
  } else {
    for (i = 0; i < a.length && i < b.length && !done; i = i + 1) {
      if (a[i] != b[i]) {
        equal = false;
      }
      if (charCharacterIsBefore(a[i], b[i])) {
        before = true;
      }
      if (charCharacterIsBefore(b[i], a[i])) {
        done = true;
      }
    }

    if (equal) {
      if (a.length < b.length) {
        before = true;
      }
    }
  }

  return before;
}
function nCreateStringScientificNotationDecimalFromNumber(decimal) {
  var mantissaReference, exponentReference;
  var multiplier, inc;
  var exponent;
  var done, isPositive;
  var result;

  mantissaReference = {};
  exponentReference = {};
  result = [];
  result.length = 0;
  done = false;
  exponent = 0;

  if (decimal < 0) {
    isPositive = false;
    decimal = -decimal;
  } else {
    isPositive = true;
  }

  if (decimal == 0) {
    done = true;
  }

  if (!done) {
    multiplier = 0;
    inc = 0;

    if (decimal < 1) {
      multiplier = 10;
      inc = -1;
    } else if (decimal >= 10) {
      multiplier = 0.1;
      inc = 1;
    } else {
      done = true;
    }

    if (!done) {
      for (; decimal >= 10 || decimal < 1;) {
        decimal = decimal * multiplier;
        exponent = exponent + inc;
      }
    }
  }

  nCreateStringFromNumberWithCheck(decimal, 10, mantissaReference);

  nCreateStringFromNumberWithCheck(exponent, 10, exponentReference);

  if (!isPositive) {
    result = strAppendString(result, "-".split(''));
  }

  result = strAppendString(result, mantissaReference.string);
  result = strAppendString(result, "e".split(''));
  result = strAppendString(result, exponentReference.string);

  return result;
}
function nCreateStringDecimalFromNumber(decimal) {
  var stringReference;

  stringReference = {};

  /* This will succeed because base = 10. */
  nCreateStringFromNumberWithCheck(decimal, 10, stringReference);

  return stringReference.string;
}
function nCreateStringFromNumberWithCheck(decimal, base, stringReference) {
  var string;
  var maximumDigits;
  var digitPosition;
  var hasPrintedPoint, isPositive;
  var i, d;
  var success;
  var characterReference;
  var c;

  isPositive = true;

  if (decimal < 0) {
    isPositive = false;
    decimal = -decimal;
  }

  if (decimal == 0) {
    stringReference.string = "0".split('');
    success = true;
  } else {
    characterReference = {};

    if (IsInteger(base)) {
      success = true;

      string = [];
      string.length = 0;

      maximumDigits = nGetMaximumDigitsForBase(base);

      digitPosition = nGetFirstDigitPosition(decimal, base);

      decimal = Math.round(decimal * base ** (maximumDigits - digitPosition - 1));

      hasPrintedPoint = false;

      if (!isPositive) {
        string = strAppendCharacter(string, '-');
      }

      /* Print leading zeros. */
      if (digitPosition < 0) {
        string = strAppendCharacter(string, '0');
        string = strAppendCharacter(string, '.');
        hasPrintedPoint = true;
        for (i = 0; i < -digitPosition - 1; i = i + 1) {
          string = strAppendCharacter(string, '0');
        }
      }

      /* Print number. */
      for (i = 0; i < maximumDigits && success; i = i + 1) {
        d = Math.floor(decimal / base ** (maximumDigits - i - 1));

        if (d >= base) {
          d = base - 1;
        }

        if (!hasPrintedPoint && digitPosition - i + 1 == 0) {
          if (decimal != 0) {
            string = strAppendCharacter(string, '.');
          }
          hasPrintedPoint = true;
        }

        if (decimal == 0 && hasPrintedPoint) {
        } else {
          success = nGetSingleDigitCharacterFromNumberWithCheck(d, base, characterReference);
          if (success) {
            c = characterReference.characterValue;
            string = strAppendCharacter(string, c);
          }
        }

        if (success) {
          decimal = decimal - d * base ** (maximumDigits - i - 1);
        }
      }

      if (success) {
        /* Print trailing zeros. */
        for (i = 0; i < digitPosition - maximumDigits + 1; i = i + 1) {
          string = strAppendCharacter(string, '0');
        }

        stringReference.string = string;
      }
    } else {
      success = false;
    }
  }

  /* Done */
  return success;
}
function nGetMaximumDigitsForBase(base) {
  var t;

  t = 10 ** 15;
  return Math.floor(Math.log10(t) / Math.log10(base));
}
function nGetFirstDigitPosition(decimal, base) {
  var power;
  var t;

  power = Math.ceil(Math.log10(decimal) / Math.log10(base));

  t = decimal * base ** (-power);
  if (t < base && t >= 1) {
  } else if (t >= base) {
    power = power + 1;
  } else if (t < 1) {
    power = power - 1;
  }

  return power;
}
function nGetSingleDigitCharacterFromNumberWithCheck(c, base, characterReference) {
  var numberTable;
  var success;

  numberTable = nGetDigitCharacterTable();

  if (c < base || c < numberTable.length) {
    success = true;
    characterReference.characterValue = numberTable[c];
  } else {
    success = false;
  }

  return success;
}
function nGetDigitCharacterTable() {
  var numberTable;

  numberTable = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

  return numberTable;
}
function nCreateNumberFromDecimalStringWithCheck(string, decimalReference, errorMessage) {
  return nCreateNumberFromStringWithCheck(string, 10, decimalReference, errorMessage);
}
function nCreateNumberFromDecimalString(string) {
  var doubleReference;
  var stringReference;
  var number;

  doubleReference = CreateNumberReference(0);
  stringReference = CreateStringReference("".split(''));
  nCreateNumberFromStringWithCheck(string, 10, doubleReference, stringReference);
  number = doubleReference.numberValue;

  delete (doubleReference);
  delete (stringReference);

  return number;
}
function nCreateNumberFromStringWithCheck(string, base, numberReference, errorMessage) {
  var success;
  var numberIsPositive, exponentIsPositive;
  var beforePoint, afterPoint, exponent;

  numberIsPositive = CreateBooleanReference(true);
  exponentIsPositive = CreateBooleanReference(true);
  beforePoint = {};
  afterPoint = {};
  exponent = {};

  if (base >= 2 && base <= 36) {
    success = nExtractPartsFromNumberString(string, base, numberIsPositive, beforePoint, afterPoint, exponentIsPositive, exponent, errorMessage);

    if (success) {
      numberReference.numberValue = nCreateNumberFromParts(base, numberIsPositive.booleanValue, beforePoint.numberArray, afterPoint.numberArray, exponentIsPositive.booleanValue, exponent.numberArray);
    }
  } else {
    success = false;
    errorMessage.string = "Base must be from 2 to 36.".split('');
  }

  return success;
}
function nCreateNumberFromParts(base, numberIsPositive, beforePoint, afterPoint, exponentIsPositive, exponent) {
  var n, i, p, e;

  n = 0;

  for (i = 0; i < beforePoint.length; i = i + 1) {
    p = beforePoint[beforePoint.length - i - 1];

    n = n + p * base ** i;
  }

  for (i = 0; i < afterPoint.length; i = i + 1) {
    p = afterPoint[i];

    n = n + p * base ** (-(i + 1));
  }

  if (exponent.length > 0) {
    e = 0;
    for (i = 0; i < exponent.length; i = i + 1) {
      p = exponent[exponent.length - i - 1];

      e = e + p * base ** i;
    }

    if (!exponentIsPositive) {
      e = -e;
    }

    n = n * base ** e;
  }

  if (!numberIsPositive) {
    n = -n;
  }

  return n;
}
function nExtractPartsFromNumberString(n, base, numberIsPositive, beforePoint, afterPoint, exponentIsPositive, exponent, errorMessages) {
  var i;
  var success;

  i = 0;

  if (i < n.length) {
    if (n[i] == '-') {
      numberIsPositive.booleanValue = false;
      i = i + 1;
    } else if (n[i] == '+') {
      numberIsPositive.booleanValue = true;
      i = i + 1;
    }

    success = nExtractPartsFromNumberStringFromSign(n, base, i, beforePoint, afterPoint, exponentIsPositive, exponent, errorMessages);
  } else {
    success = false;
    errorMessages.string = "Number cannot have length zero.".split('');
  }

  return success;
}
function nExtractPartsFromNumberStringFromSign(n, base, i, beforePoint, afterPoint, exponentIsPositive, exponent, errorMessages) {
  var success, done;
  var count, j;

  done = false;
  count = 0;
  for (; i + count < n.length && !done;) {
    if (nCharacterIsNumberCharacterInBase(n[i + count], base)) {
      count = count + 1;
    } else {
      done = true;
    }
  }

  if (count >= 1) {
    beforePoint.numberArray = [];
    beforePoint.numberArray.length = count;

    for (j = 0; j < count; j = j + 1) {
      beforePoint.numberArray[j] = nGetNumberFromNumberCharacterForBase(n[i + j], base);
    }

    i = i + count;

    if (i < n.length) {
      success = nExtractPartsFromNumberStringFromPointOrExponent(n, base, i, afterPoint, exponentIsPositive, exponent, errorMessages);
    } else {
      afterPoint.numberArray = [];
      afterPoint.numberArray.length = 0;
      exponent.numberArray = [];
      exponent.numberArray.length = 0;
      success = true;
    }
  } else {
    success = false;
    errorMessages.string = "Number must have at least one number after the optional sign.".split('');
  }

  return success;
}
function nExtractPartsFromNumberStringFromPointOrExponent(n, base, i, afterPoint, exponentIsPositive, exponent, errorMessages) {
  var success, done;
  var count, j;

  if (n[i] == '.') {
    i = i + 1;

    if (i < n.length) {
      done = false;
      count = 0;
      for (; i + count < n.length && !done;) {
        if (nCharacterIsNumberCharacterInBase(n[i + count], base)) {
          count = count + 1;
        } else {
          done = true;
        }
      }

      if (count >= 1) {
        afterPoint.numberArray = [];
        afterPoint.numberArray.length = count;

        for (j = 0; j < count; j = j + 1) {
          afterPoint.numberArray[j] = nGetNumberFromNumberCharacterForBase(n[i + j], base);
        }

        i = i + count;

        if (i < n.length) {
          success = nExtractPartsFromNumberStringFromExponent(n, base, i, exponentIsPositive, exponent, errorMessages);
        } else {
          exponent.numberArray = [];
          exponent.numberArray.length = 0;
          success = true;
        }
      } else {
        success = false;
        errorMessages.string = "There must be at least one digit after the decimal point.".split('');
      }
    } else {
      success = false;
      errorMessages.string = "There must be at least one digit after the decimal point.".split('');
    }
  } else if (base <= 14 && (n[i] == 'e' || n[i] == 'E')) {
    if (i < n.length) {
      success = nExtractPartsFromNumberStringFromExponent(n, base, i, exponentIsPositive, exponent, errorMessages);
      afterPoint.numberArray = [];
      afterPoint.numberArray.length = 0;
    } else {
      success = false;
      errorMessages.string = "There must be at least one digit after the exponent.".split('');
    }
  } else {
    success = false;
    errorMessages.string = "Expected decimal point or exponent symbol.".split('');
  }

  return success;
}
function nExtractPartsFromNumberStringFromExponent(n, base, i, exponentIsPositive, exponent, errorMessages) {
  var success, done;
  var count, j;

  if (base <= 14 && (n[i] == 'e' || n[i] == 'E')) {
    i = i + 1;

    if (i < n.length) {
      if (n[i] == '-') {
        exponentIsPositive.booleanValue = false;
        i = i + 1;
      } else if (n[i] == '+') {
        exponentIsPositive.booleanValue = true;
        i = i + 1;
      }

      if (i < n.length) {
        done = false;
        count = 0;
        for (; i + count < n.length && !done;) {
          if (nCharacterIsNumberCharacterInBase(n[i + count], base)) {
            count = count + 1;
          } else {
            done = true;
          }
        }

        if (count >= 1) {
          exponent.numberArray = [];
          exponent.numberArray.length = count;

          for (j = 0; j < count; j = j + 1) {
            exponent.numberArray[j] = nGetNumberFromNumberCharacterForBase(n[i + j], base);
          }

          i = i + count;

          if (i == n.length) {
            success = true;
          } else {
            success = false;
            errorMessages.string = "There cannot be any characters past the exponent of the number.".split('');
          }
        } else {
          success = false;
          errorMessages.string = "There must be at least one digit after the decimal point.".split('');
        }
      } else {
        success = false;
        errorMessages.string = "There must be at least one digit after the exponent symbol.".split('');
      }
    } else {
      success = false;
      errorMessages.string = "There must be at least one digit after the exponent symbol.".split('');
    }
  } else {
    success = false;
    errorMessages.string = "Expected exponent symbol.".split('');
  }

  return success;
}
function nGetNumberFromNumberCharacterForBase(c, base) {
  var numberTable;
  var i;
  var position;

  numberTable = nGetDigitCharacterTable();
  position = 0;

  for (i = 0; i < base; i = i + 1) {
    if (numberTable[i] == c) {
      position = i;
    }
  }

  return position;
}
function nCharacterIsNumberCharacterInBase(c, base) {
  var numberTable;
  var i;
  var found;

  numberTable = nGetDigitCharacterTable();
  found = false;

  for (i = 0; i < base; i = i + 1) {
    if (numberTable[i] == c) {
      found = true;
    }
  }

  return found;
}
function nStringToNumberArray(str) {
  var numberArrayReference;
  var stringReference;
  var numbers;

  numberArrayReference = {};
  stringReference = {};

  nStringToNumberArrayWithCheck(str, numberArrayReference, stringReference);

  numbers = numberArrayReference.numberArray;

  delete (numberArrayReference);
  delete (stringReference);

  return numbers;
}
function nStringToNumberArrayWithCheck(str, numberArrayReference, errorMessage) {
  var numberStrings;
  var numbers;
  var i;
  var numberString, trimmedNumberString;
  var success;
  var numberReference;

  numberStrings = strSplitByString(str, ",".split(''));

  numbers = [];
  numbers.length = numberStrings.length;
  success = true;
  numberReference = {};

  for (i = 0; i < numberStrings.length; i = i + 1) {
    numberString = numberStrings[i].string;
    trimmedNumberString = strTrim(numberString);
    success = nCreateNumberFromDecimalStringWithCheck(trimmedNumberString, numberReference, errorMessage);
    numbers[i] = numberReference.numberValue;

    FreeStringReference(numberStrings[i]);
    delete (trimmedNumberString);
  }

  delete (numberStrings);
  delete (numberReference);

  numberArrayReference.numberArray = numbers;

  return success;
}
function AddNumber(list, a) {
  var newlist;
  var i;

  newlist = [];
  newlist.length = list.length + 1;
  for (i = 0; i < list.length; i = i + 1) {
    newlist[i] = list[i];
  }
  newlist[list.length] = a;

  delete (list);

  return newlist;
}
function AddNumberRef(list, i) {
  list.numberArray = AddNumber(list.numberArray, i);
}
function RemoveNumber(list, n) {
  var newlist;
  var i;

  newlist = [];
  newlist.length = list.length - 1;

  if (n >= 0 && n < list.length) {
    for (i = 0; i < list.length; i = i + 1) {
      if (i < n) {
        newlist[i] = list[i];
      }
      if (i > n) {
        newlist[i - 1] = list[i];
      }
    }

    delete (list);
  } else {
    delete (newlist);
  }

  return newlist;
}
function GetNumberRef(list, i) {
  return list.numberArray[i];
}
function RemoveNumberRef(list, i) {
  list.numberArray = RemoveNumber(list.numberArray, i);
}
function AddString(list, a) {
  var newlist;
  var i;

  newlist = [];
  newlist.length = list.length + 1;

  for (i = 0; i < list.length; i = i + 1) {
    newlist[i] = list[i];
  }
  newlist[list.length] = a;

  delete (list);

  return newlist;
}
function AddStringRef(list, i) {
  list.stringArray = AddString(list.stringArray, i);
}
function RemoveString(list, n) {
  var newlist;
  var i;

  newlist = [];
  newlist.length = list.length - 1;

  if (n >= 0 && n < list.length) {
    for (i = 0; i < list.length; i = i + 1) {
      if (i < n) {
        newlist[i] = list[i];
      }
      if (i > n) {
        newlist[i - 1] = list[i];
      }
    }

    delete (list);
  } else {
    delete (newlist);
  }

  return newlist;
}
function GetStringRef(list, i) {
  return list.stringArray[i];
}
function RemoveStringRef(list, i) {
  list.stringArray = RemoveString(list.stringArray, i);
}
function AddBoolean(list, a) {
  var newlist;
  var i;

  newlist = [];
  newlist.length = list.length + 1;
  for (i = 0; i < list.length; i = i + 1) {
    newlist[i] = list[i];
  }
  newlist[list.length] = a;

  delete (list);

  return newlist;
}
function AddBooleanRef(list, i) {
  list.booleanArray = AddBoolean(list.booleanArray, i);
}
function RemoveBoolean(list, n) {
  var newlist;
  var i;

  newlist = [];
  newlist.length = list.length - 1;

  if (n >= 0 && n < list.length) {
    for (i = 0; i < list.length; i = i + 1) {
      if (i < n) {
        newlist[i] = list[i];
      }
      if (i > n) {
        newlist[i - 1] = list[i];
      }
    }

    delete (list);
  } else {
    delete (newlist);
  }

  return newlist;
}
function GetBooleanRef(list, i) {
  return list.booleanArray[i];
}
function RemoveDecimalRef(list, i) {
  list.booleanArray = RemoveBoolean(list.booleanArray, i);
}
function CreateLinkedListString() {
  var ll;

  ll = {};
  ll.first = {};
  ll.last = ll.first;
  ll.last.end = true;

  return ll;
}
function LinkedListAddString(ll, value) {
  ll.last.end = false;
  ll.last.value = value;
  ll.last.next = {};
  ll.last.next.end = true;
  ll.last = ll.last.next;
}
function LinkedListStringsToArray(ll) {
  var array;
  var lengthx, i;
  var node;

  node = ll.first;

  lengthx = LinkedListStringsLength(ll);

  array = [];
  array.length = lengthx;

  for (i = 0; i < lengthx; i = i + 1) {
    array[i] = {};
    array[i].string = node.value;
    node = node.next;
  }

  return array;
}
function LinkedListStringsLength(ll) {
  var l;
  var node;

  l = 0;
  node = ll.first;
  for (; !node.end;) {
    node = node.next;
    l = l + 1;
  }

  return l;
}
function FreeLinkedListString(ll) {
  var node, prev;

  node = ll.first;

  for (; !node.end;) {
    prev = node;
    node = node.next;
    delete (prev);
  }

  delete (node);
}
function CreateLinkedListNumbers() {
  var ll;

  ll = {};
  ll.first = {};
  ll.last = ll.first;
  ll.last.end = true;

  return ll;
}
function CreateLinkedListNumbersArray(lengthx) {
  var lls;
  var i;

  lls = [];
  lls.length = lengthx;
  for (i = 0; i < lls.length; i = i + 1) {
    lls[i] = CreateLinkedListNumbers();
  }

  return lls;
}
function LinkedListAddNumber(ll, value) {
  ll.last.end = false;
  ll.last.value = value;
  ll.last.next = {};
  ll.last.next.end = true;
  ll.last = ll.last.next;
}
function LinkedListNumbersLength(ll) {
  var l;
  var node;

  l = 0;
  node = ll.first;
  for (; !node.end;) {
    node = node.next;
    l = l + 1;
  }

  return l;
}
function LinkedListNumbersIndex(ll, index) {
  var i;
  var node;

  node = ll.first;
  for (i = 0; i < index; i = i + 1) {
    node = node.next;
  }

  return node.value;
}
function LinkedListInsertNumber(ll, index, value) {
  var i;
  var node, tmp;

  if (index == 0) {
    tmp = ll.first;
    ll.first = {};
    ll.first.next = tmp;
    ll.first.value = value;
    ll.first.end = false;
  } else {
    node = ll.first;
    for (i = 0; i < index - 1; i = i + 1) {
      node = node.next;
    }

    tmp = node.next;
    node.next = {};
    node.next.next = tmp;
    node.next.value = value;
    node.next.end = false;
  }
}
function LinkedListSet(ll, index, value) {
  var i;
  var node;

  node = ll.first;
  for (i = 0; i < index; i = i + 1) {
    node = node.next;
  }

  node.next.value = value;
}
function LinkedListRemoveNumber(ll, index) {
  var i;
  var node, prev;

  node = ll.first;
  prev = ll.first;

  for (i = 0; i < index; i = i + 1) {
    prev = node;
    node = node.next;
  }

  if (index == 0) {
    ll.first = prev.next;
  }
  if (!prev.next.end) {
    prev.next = prev.next.next;
  }
}
function FreeLinkedListNumbers(ll) {
  var node, prev;

  node = ll.first;

  for (; !node.end;) {
    prev = node;
    node = node.next;
    delete (prev);
  }

  delete (node);
}
function FreeLinkedListNumbersArray(lls) {
  var i;

  for (i = 0; i < lls.length; i = i + 1) {
    FreeLinkedListNumbers(lls[i]);
  }
  delete (lls);
}
function LinkedListNumbersToArray(ll) {
  var array;
  var lengthx, i;
  var node;

  node = ll.first;

  lengthx = LinkedListNumbersLength(ll);

  array = [];
  array.length = lengthx;

  for (i = 0; i < lengthx; i = i + 1) {
    array[i] = node.value;
    node = node.next;
  }

  return array;
}
function ArrayToLinkedListNumbers(array) {
  var ll;
  var i;

  ll = CreateLinkedListNumbers();

  for (i = 0; i < array.length; i = i + 1) {
    LinkedListAddNumber(ll, array[i]);
  }

  return ll;
}
function LinkedListNumbersEqual(a, b) {
  var equal, done;
  var an, bn;

  an = a.first;
  bn = b.first;

  equal = true;
  done = false;
  for (; equal && !done;) {
    if (an.end == bn.end) {
      if (an.end) {
        done = true;
      } else if (an.value == bn.value) {
        an = an.next;
        bn = bn.next;
      } else {
        equal = false;
      }
    } else {
      equal = false;
    }
  }

  return equal;
}
function CreateLinkedListCharacter() {
  var ll;

  ll = {};
  ll.first = {};
  ll.last = ll.first;
  ll.last.end = true;

  return ll;
}
function LinkedListAddCharacter(ll, value) {
  ll.last.end = false;
  ll.last.value = value;
  ll.last.next = {};
  ll.last.next.end = true;
  ll.last = ll.last.next;
}
function LinkedListCharactersToArray(ll) {
  var array;
  var lengthx, i;
  var node;

  node = ll.first;

  lengthx = LinkedListCharactersLength(ll);

  array = [];
  array.length = lengthx;

  for (i = 0; i < lengthx; i = i + 1) {
    array[i] = node.value;
    node = node.next;
  }

  return array;
}
function LinkedListCharactersLength(ll) {
  var l;
  var node;

  l = 0;
  node = ll.first;
  for (; !node.end;) {
    node = node.next;
    l = l + 1;
  }

  return l;
}
function FreeLinkedListCharacter(ll) {
  var node, prev;

  node = ll.first;

  for (; !node.end;) {
    prev = node;
    node = node.next;
    delete (prev);
  }

  delete (node);
}
function CreateDynamicArrayNumbers() {
  var da;

  da = {};
  da.array = [];
  da.array.length = 10;
  da.lengthx = 0;

  return da;
}
function CreateDynamicArrayNumbersWithInitialCapacity(capacity) {
  var da;

  da = {};
  da.array = [];
  da.array.length = capacity;
  da.lengthx = 0;

  return da;
}
function DynamicArrayAddNumber(da, value) {
  if (da.lengthx == da.array.length) {
    DynamicArrayNumbersIncreaseSize(da);
  }

  da.array[da.lengthx] = value;
  da.lengthx = da.lengthx + 1;
}
function DynamicArrayNumbersIncreaseSize(da) {
  var newLength, i;
  var newArray;

  newLength = Math.round(da.array.length * 3 / 2);
  newArray = [];
  newArray.length = newLength;

  for (i = 0; i < da.array.length; i = i + 1) {
    newArray[i] = da.array[i];
  }

  delete (da.array);

  da.array = newArray;
}
function DynamicArrayNumbersDecreaseSizeNecessary(da) {
  var needsDecrease;

  needsDecrease = false;

  if (da.lengthx > 10) {
    needsDecrease = da.lengthx <= Math.round(da.array.length * 2 / 3);
  }

  return needsDecrease;
}
function DynamicArrayNumbersDecreaseSize(da) {
  var newLength, i;
  var newArray;

  newLength = Math.round(da.array.length * 2 / 3);
  newArray = [];
  newArray.length = newLength;

  for (i = 0; i < da.array.length; i = i + 1) {
    newArray[i] = da.array[i];
  }

  delete (da.array);

  da.array = newArray;
}
function DynamicArrayNumbersIndex(da, index) {
  return da.array[index];
}
function DynamicArrayNumbersLength(da) {
  return da.lengthx;
}
function DynamicArrayInsertNumber(da, index, value) {
  var i;

  if (da.lengthx == da.array.length) {
    DynamicArrayNumbersIncreaseSize(da);
  }

  for (i = da.lengthx; i > index; i = i - 1) {
    da.array[i] = da.array[i - 1];
  }

  da.array[index] = value;

  da.lengthx = da.lengthx + 1;
}
function DynamicArraySet(da, index, value) {
  da.array[index] = value;
}
function DynamicArrayRemoveNumber(da, index) {
  var i;

  for (i = index; i < da.lengthx - 1; i = i + 1) {
    da.array[i] = da.array[i + 1];
  }

  da.lengthx = da.lengthx - 1;

  if (DynamicArrayNumbersDecreaseSizeNecessary(da)) {
    DynamicArrayNumbersDecreaseSize(da);
  }
}
function FreeDynamicArrayNumbers(da) {
  delete (da.array);
  delete (da);
}
function DynamicArrayNumbersToArray(da) {
  var array;
  var i;

  array = [];
  array.length = da.lengthx;

  for (i = 0; i < da.lengthx; i = i + 1) {
    array[i] = da.array[i];
  }

  return array;
}
function ArrayToDynamicArrayNumbersWithOptimalSize(array) {
  var da;
  var i;
  var c, n, newCapacity;

  /*
         c = 10*(3/2)^n
         log(c) = log(10*(3/2)^n)
         log(c) = log(10) + log((3/2)^n)
         log(c) = 1 + log((3/2)^n)
         log(c) - 1 = log((3/2)^n)
         log(c) - 1 = n*log(3/2)
         n = (log(c) - 1)/log(3/2)
         */
  c = array.length;
  n = (Math.log(c) - 1) / Math.log(3 / 2);
  newCapacity = Math.floor(n) + 1;

  da = CreateDynamicArrayNumbersWithInitialCapacity(newCapacity);

  for (i = 0; i < array.length; i = i + 1) {
    da.array[i] = array[i];
  }

  return da;
}
function ArrayToDynamicArrayNumbers(array) {
  var da;

  da = {};
  da.array = CopyNumberArray(array);
  da.lengthx = array.length;

  return da;
}
function DynamicArrayNumbersEqual(a, b) {
  var equal;
  var i;

  equal = true;
  if (a.lengthx == b.lengthx) {
    for (i = 0; i < a.lengthx && equal; i = i + 1) {
      if (a.array[i] != b.array[i]) {
        equal = false;
      }
    }
  } else {
    equal = false;
  }

  return equal;
}
function DynamicArrayNumbersToLinkedList(da) {
  var ll;
  var i;

  ll = CreateLinkedListNumbers();

  for (i = 0; i < da.lengthx; i = i + 1) {
    LinkedListAddNumber(ll, da.array[i]);
  }

  return ll;
}
function LinkedListToDynamicArrayNumbers(ll) {
  var da;
  var i;
  var node;

  node = ll.first;

  da = {};
  da.lengthx = LinkedListNumbersLength(ll);

  da.array = [];
  da.array.length = da.lengthx;

  for (i = 0; i < da.lengthx; i = i + 1) {
    da.array[i] = node.value;
    node = node.next;
  }

  return da;
}
function AddCharacter(list, a) {
  var newlist;
  var i;

  newlist = [];
  newlist.length = list.length + 1;
  for (i = 0; i < list.length; i = i + 1) {
    newlist[i] = list[i];
  }
  newlist[list.length] = a;

  delete (list);

  return newlist;
}
function AddCharacterRef(list, i) {
  list.string = AddCharacter(list.string, i);
}
function RemoveCharacter(list, n) {
  var newlist;
  var i;

  newlist = [];
  newlist.length = list.length - 1;

  if (n >= 0 && n < list.length) {
    for (i = 0; i < list.length; i = i + 1) {
      if (i < n) {
        newlist[i] = list[i];
      }
      if (i > n) {
        newlist[i - 1] = list[i];
      }
    }

    delete (list);
  } else {
    delete (newlist);
  }

  return newlist;
}
function GetCharacterRef(list, i) {
  return list.string[i];
}
function RemoveCharacterRef(list, i) {
  list.string = RemoveCharacter(list.string, i);
}
function Negate(x) {
  return -x;
}
function Positive(x) {
  return +x;
}
function Factorial(x) {
  var i, f;

  f = 1;

  for (i = 2; i <= x; i = i + 1) {
    f = f * i;
  }

  return f;
}
function Round(x) {
  return Math.floor(x + 0.5);
}
function BankersRound(x) {
  var r;

  if (Absolute(x - Truncate(x)) == 0.5) {
    if (!DivisibleBy(Round(x), 2)) {
      r = Round(x) - 1;
    } else {
      r = Round(x);
    }
  } else {
    r = Round(x);
  }

  return r;
}
function Ceil(x) {
  return Math.ceil(x);
}
function Floor(x) {
  return Math.floor(x);
}
function Truncate(x) {
  var t;

  if (x >= 0) {
    t = Math.floor(x);
  } else {
    t = Math.ceil(x);
  }

  return t;
}
function Absolute(x) {
  return Math.abs(x);
}
function Logarithm(x) {
  return Math.log10(x);
}
function NaturalLogarithm(x) {
  return Math.log(x);
}
function Sin(x) {
  return Math.sin(x);
}
function Cos(x) {
  return Math.cos(x);
}
function Tan(x) {
  return Math.tan(x);
}
function Asin(x) {
  return Math.asin(x);
}
function Acos(x) {
  return Math.acos(x);
}
function Atan(x) {
  return Math.atan(x);
}
function Atan2(y, x) {
  var a;

  /* Atan2 is an invalid operation when x = 0 and y = 0, but this method does not return errors. */
  a = 0;

  if (x > 0) {
    a = Atan(y / x);
  } else if (x < 0 && y >= 0) {
    a = Atan(y / x) + Math.PI;
  } else if (x < 0 && y < 0) {
    a = Atan(y / x) - Math.PI;
  } else if (x == 0 && y > 0) {
    a = Math.PI / 2;
  } else if (x == 0 && y < 0) {
    a = -Math.PI / 2;
  }

  return a;
}
function Squareroot(x) {
  return Math.sqrt(x);
}
function Exp(x) {
  return Math.exp(x);
}
function DivisibleBy(a, b) {
  return ((a % b) == 0);
}
function Combinations(n, k) {
  var i, j, c;

  c = 1;
  j = 1;
  i = n - k + 1;

  for (; i <= n;) {
    c = c * i;
    c = c / j;

    i = i + 1;
    j = j + 1;
  }

  return c;
}
function Permutations(n, k) {
  var i, c;

  c = 1;

  for (i = n - k + 1; i <= n; i = i + 1) {
    c = c * i;
  }

  return c;
}
function EpsilonCompare(a, b, epsilon) {
  return Math.abs(a - b) < epsilon;
}
function GreatestCommonDivisor(a, b) {
  var t;

  for (; b != 0;) {
    t = b;
    b = a % b;
    a = t;
  }

  return a;
}
function GCDWithSubtraction(a, b) {
  var g;

  if (a == 0) {
    g = b;
  } else {
    for (; b != 0;) {
      if (a > b) {
        a = a - b;
      } else {
        b = b - a;
      }
    }

    g = a;
  }

  return g;
}
function IsInteger(a) {
  return (a - Math.floor(a)) == 0;
}
function GreatestCommonDivisorWithCheck(a, b, gcdReference) {
  var success;
  var gcd;

  if (IsInteger(a) && IsInteger(b)) {
    gcd = GreatestCommonDivisor(a, b);
    gcdReference.numberValue = gcd;
    success = true;
  } else {
    success = false;
  }

  return success;
}
function LeastCommonMultiple(a, b) {
  var lcm;

  if (a > 0 && b > 0) {
    lcm = Math.abs(a * b) / GreatestCommonDivisor(a, b);
  } else {
    lcm = 0;
  }

  return lcm;
}
function Sign(a) {
  var s;

  if (a > 0) {
    s = 1;
  } else if (a < 0) {
    s = -1;
  } else {
    s = 0;
  }

  return s;
}
function Max(a, b) {
  return Math.max(a, b);
}
function Min(a, b) {
  return Math.min(a, b);
}
function Power(a, b) {
  return a ** b;
}
function Gamma(x) {
  return LanczosApproximation(x);
}
function LogGamma(x) {
  return Math.log(Gamma(x));
}
function LanczosApproximation(z) {
  var p;
  var i, y, t, x;

  p = [];
  p.length = 8;
  p[0] = 676.5203681218851;
  p[1] = -1259.1392167224028;
  p[2] = 771.32342877765313;
  p[3] = -176.61502916214059;
  p[4] = 12.507343278686905;
  p[5] = -0.13857109526572012;
  p[6] = 9.9843695780195716e-6;
  p[7] = 1.5056327351493116e-7;

  if (z < 0.5) {
    y = Math.PI / (Math.sin(Math.PI * z) * LanczosApproximation(1 - z));
  } else {
    z = z - 1;
    x = 0.99999999999980993;
    for (i = 0; i < p.length; i = i + 1) {
      x = x + p[i] / (z + i + 1);
    }
    t = z + p.length - 0.5;
    y = Math.sqrt(2 * Math.PI) * t ** (z + 0.5) * Math.exp(-t) * x;
  }

  return y;
}
function Beta(x, y) {
  return Gamma(x) * Gamma(y) / Gamma(x + y);
}
function Sinh(x) {
  return (Math.exp(x) - Math.exp(-x)) / 2;
}
function Cosh(x) {
  return (Math.exp(x) + Math.exp(-x)) / 2;
}
function Tanh(x) {
  return Sinh(x) / Cosh(x);
}
function Cot(x) {
  return 1 / Math.tan(x);
}
function Sec(x) {
  return 1 / Math.cos(x);
}
function Csc(x) {
  return 1 / Math.sin(x);
}
function Coth(x) {
  return Cosh(x) / Sinh(x);
}
function Sech(x) {
  return 1 / Cosh(x);
}
function Csch(x) {
  return 1 / Sinh(x);
}
function Error(x) {
  var y, t, tau, c1, c2, c3, c4, c5, c6, c7, c8, c9, c10;

  if (x == 0) {
    y = 0;
  } else if (x < 0) {
    y = -Error(-x);
  } else {
    c1 = -1.26551223;
    c2 = +1.00002368;
    c3 = +0.37409196;
    c4 = +0.09678418;
    c5 = -0.18628806;
    c6 = +0.27886807;
    c7 = -1.13520398;
    c8 = +1.48851587;
    c9 = -0.82215223;
    c10 = +0.17087277;

    t = 1 / (1 + 0.5 * Math.abs(x));

    tau = t * Math.exp(-(x ** 2) + c1 + t * (c2 + t * (c3 + t * (c4 + t * (c5 + t * (c6 + t * (c7 + t * (c8 + t * (c9 + t * c10)))))))));

    y = 1 - tau;
  }

  return y;
}
function ErrorInverse(x) {
  var y, a, t;

  a = (8 * (Math.PI - 3)) / (3 * Math.PI * (4 - Math.PI));

  t = 2 / (Math.PI * a) + Math.log(1 - x ** 2) / 2;
  y = Sign(x) * Math.sqrt(Math.sqrt(t ** 2 - Math.log(1 - x ** 2) / a) - t);

  return y;
}
function FallingFactorial(x, n) {
  var k, y;

  y = 1;

  for (k = 0; k <= n - 1; k = k + 1) {
    y = y * (x - k);
  }

  return y;
}
function RisingFactorial(x, n) {
  var k, y;

  y = 1;

  for (k = 0; k <= n - 1; k = k + 1) {
    y = y * (x + k);
  }

  return y;
}
function Hypergeometric(a, b, c, z, maxIterations, precision) {
  var y;

  if (Math.abs(z) >= 0.5) {
    y = (1 - z) ** (-a) * HypergeometricDirect(a, c - b, c, z / (z - 1), maxIterations, precision);
  } else {
    y = HypergeometricDirect(a, b, c, z, maxIterations, precision);
  }

  return y;
}
function HypergeometricDirect(a, b, c, z, maxIterations, precision) {
  var y, yp, n;
  var done;

  y = 0;
  done = false;

  for (n = 0; n < maxIterations && !done; n = n + 1) {
    yp = RisingFactorial(a, n) * RisingFactorial(b, n) / RisingFactorial(c, n) * z ** n / Factorial(n);
    if (Math.abs(yp) < precision) {
      done = true;
    }
    y = y + yp;
  }

  return y;
}
function BernouilliNumber(n) {
  return AkiyamaTanigawaAlgorithm(n);
}
function AkiyamaTanigawaAlgorithm(n) {
  var m, j, B;
  var A;

  A = [];
  A.length = n + 1;

  for (m = 0; m <= n; m = m + 1) {
    A[m] = 1 / (m + 1);
    for (j = m; j >= 1; j = j - 1) {
      A[j - 1] = j * (A[j - 1] - A[j]);
    }
  }

  B = A[0];

  delete (A);

  return B;
}
function StringToNumberArray(string) {
  var i;
  var array;

  array = [];
  array.length = string.length;

  for (i = 0; i < string.length; i = i + 1) {
    array[i] = string[i].charCodeAt(0);
  }
  return array;
}
function NumberArrayToString(array) {
  var i;
  var string;

  string = [];
  string.length = array.length;

  for (i = 0; i < array.length; i = i + 1) {
    string[i] = String.fromCharCode(array[i]);
  }
  return string;
}
function NumberArraysEqual(a, b) {
  var equal;
  var i;

  equal = true;
  if (a.length == b.length) {
    for (i = 0; i < a.length && equal; i = i + 1) {
      if (a[i] != b[i]) {
        equal = false;
      }
    }
  } else {
    equal = false;
  }

  return equal;
}
function BooleanArraysEqual(a, b) {
  var equal;
  var i;

  equal = true;
  if (a.length == b.length) {
    for (i = 0; i < a.length && equal; i = i + 1) {
      if (a[i] != b[i]) {
        equal = false;
      }
    }
  } else {
    equal = false;
  }

  return equal;
}
function StringsEqual(a, b) {
  var equal;
  var i;

  equal = true;
  if (a.length == b.length) {
    for (i = 0; i < a.length && equal; i = i + 1) {
      if (a[i] != b[i]) {
        equal = false;
      }
    }
  } else {
    equal = false;
  }

  return equal;
}
function FillNumberArray(a, value) {
  var i;

  for (i = 0; i < a.length; i = i + 1) {
    a[i] = value;
  }
}
function FillString(a, value) {
  var i;

  for (i = 0; i < a.length; i = i + 1) {
    a[i] = value;
  }
}
function FillBooleanArray(a, value) {
  var i;

  for (i = 0; i < a.length; i = i + 1) {
    a[i] = value;
  }
}
function FillNumberArrayRange(a, value, from, to) {
  var i, lengthx;
  var success;

  if (from >= 0 && from <= a.length && to >= 0 && to <= a.length && from <= to) {
    lengthx = to - from;
    for (i = 0; i < lengthx; i = i + 1) {
      a[from + i] = value;
    }

    success = true;
  } else {
    success = false;
  }

  return success;
}
function FillBooleanArrayRange(a, value, from, to) {
  var i, lengthx;
  var success;

  if (from >= 0 && from <= a.length && to >= 0 && to <= a.length && from <= to) {
    lengthx = to - from;
    for (i = 0; i < lengthx; i = i + 1) {
      a[from + i] = value;
    }

    success = true;
  } else {
    success = false;
  }

  return success;
}
function FillStringRange(a, value, from, to) {
  var i, lengthx;
  var success;

  if (from >= 0 && from <= a.length && to >= 0 && to <= a.length && from <= to) {
    lengthx = to - from;
    for (i = 0; i < lengthx; i = i + 1) {
      a[from + i] = value;
    }

    success = true;
  } else {
    success = false;
  }

  return success;
}
function CopyNumberArray(a) {
  var i;
  var n;

  n = [];
  n.length = a.length;

  for (i = 0; i < a.length; i = i + 1) {
    n[i] = a[i];
  }

  return n;
}
function CopyBooleanArray(a) {
  var i;
  var n;

  n = [];
  n.length = a.length;

  for (i = 0; i < a.length; i = i + 1) {
    n[i] = a[i];
  }

  return n;
}
function CopyString(a) {
  var i;
  var n;

  n = [];
  n.length = a.length;

  for (i = 0; i < a.length; i = i + 1) {
    n[i] = a[i];
  }

  return n;
}
function CopyNumberArrayRange(a, from, to, copyReference) {
  var i, lengthx;
  var n;
  var success;

  if (from >= 0 && from <= a.length && to >= 0 && to <= a.length && from <= to) {
    lengthx = to - from;
    n = [];
    n.length = lengthx;

    for (i = 0; i < lengthx; i = i + 1) {
      n[i] = a[from + i];
    }

    copyReference.numberArray = n;
    success = true;
  } else {
    success = false;
  }

  return success;
}
function CopyBooleanArrayRange(a, from, to, copyReference) {
  var i, lengthx;
  var n;
  var success;

  if (from >= 0 && from <= a.length && to >= 0 && to <= a.length && from <= to) {
    lengthx = to - from;
    n = [];
    n.length = lengthx;

    for (i = 0; i < lengthx; i = i + 1) {
      n[i] = a[from + i];
    }

    copyReference.booleanArray = n;
    success = true;
  } else {
    success = false;
  }

  return success;
}
function CopyStringRange(a, from, to, copyReference) {
  var i, lengthx;
  var n;
  var success;

  if (from >= 0 && from <= a.length && to >= 0 && to <= a.length && from <= to) {
    lengthx = to - from;
    n = [];
    n.length = lengthx;

    for (i = 0; i < lengthx; i = i + 1) {
      n[i] = a[from + i];
    }

    copyReference.string = n;
    success = true;
  } else {
    success = false;
  }

  return success;
}
function IsLastElement(lengthx, index) {
  return index + 1 == lengthx;
}
function CreateNumberArray(lengthx, value) {
  var array;

  array = [];
  array.length = lengthx;
  FillNumberArray(array, value);

  return array;
}
function CreateBooleanArray(lengthx, value) {
  var array;

  array = [];
  array.length = lengthx;
  FillBooleanArray(array, value);

  return array;
}
function CreateString(lengthx, value) {
  var array;

  array = [];
  array.length = lengthx;
  FillString(array, value);

  return array;
}
function SwapElementsOfNumberArray(A, ai, bi) {
  var tmp;

  tmp = A[ai];
  A[ai] = A[bi];
  A[bi] = tmp;
}
function SwapElementsOfStringArray(A, ai, bi) {
  var tmp;

  tmp = A.stringArray[ai];
  A.stringArray[ai] = A.stringArray[bi];
  A.stringArray[bi] = tmp;
}
function ReverseNumberArray(array) {
  var i;

  for (i = 0; i < array.length / 2; i = i + 1) {
    SwapElementsOfNumberArray(array, i, array.length - i - 1);
  }
}
function charToLowerCase(character) {
  var toReturn;

  toReturn = character;
  if (character == 'A') {
    toReturn = 'a';
  } else if (character == 'B') {
    toReturn = 'b';
  } else if (character == 'C') {
    toReturn = 'c';
  } else if (character == 'D') {
    toReturn = 'd';
  } else if (character == 'E') {
    toReturn = 'e';
  } else if (character == 'F') {
    toReturn = 'f';
  } else if (character == 'G') {
    toReturn = 'g';
  } else if (character == 'H') {
    toReturn = 'h';
  } else if (character == 'I') {
    toReturn = 'i';
  } else if (character == 'J') {
    toReturn = 'j';
  } else if (character == 'K') {
    toReturn = 'k';
  } else if (character == 'L') {
    toReturn = 'l';
  } else if (character == 'M') {
    toReturn = 'm';
  } else if (character == 'N') {
    toReturn = 'n';
  } else if (character == 'O') {
    toReturn = 'o';
  } else if (character == 'P') {
    toReturn = 'p';
  } else if (character == 'Q') {
    toReturn = 'q';
  } else if (character == 'R') {
    toReturn = 'r';
  } else if (character == 'S') {
    toReturn = 's';
  } else if (character == 'T') {
    toReturn = 't';
  } else if (character == 'U') {
    toReturn = 'u';
  } else if (character == 'V') {
    toReturn = 'v';
  } else if (character == 'W') {
    toReturn = 'w';
  } else if (character == 'X') {
    toReturn = 'x';
  } else if (character == 'Y') {
    toReturn = 'y';
  } else if (character == 'Z') {
    toReturn = 'z';
  }

  return toReturn;
}
function charToUpperCase(character) {
  var toReturn;

  toReturn = character;
  if (character == 'a') {
    toReturn = 'A';
  } else if (character == 'b') {
    toReturn = 'B';
  } else if (character == 'c') {
    toReturn = 'C';
  } else if (character == 'd') {
    toReturn = 'D';
  } else if (character == 'e') {
    toReturn = 'E';
  } else if (character == 'f') {
    toReturn = 'F';
  } else if (character == 'g') {
    toReturn = 'G';
  } else if (character == 'h') {
    toReturn = 'H';
  } else if (character == 'i') {
    toReturn = 'I';
  } else if (character == 'j') {
    toReturn = 'J';
  } else if (character == 'k') {
    toReturn = 'K';
  } else if (character == 'l') {
    toReturn = 'L';
  } else if (character == 'm') {
    toReturn = 'M';
  } else if (character == 'n') {
    toReturn = 'N';
  } else if (character == 'o') {
    toReturn = 'O';
  } else if (character == 'p') {
    toReturn = 'P';
  } else if (character == 'q') {
    toReturn = 'Q';
  } else if (character == 'r') {
    toReturn = 'R';
  } else if (character == 's') {
    toReturn = 'S';
  } else if (character == 't') {
    toReturn = 'T';
  } else if (character == 'u') {
    toReturn = 'U';
  } else if (character == 'v') {
    toReturn = 'V';
  } else if (character == 'w') {
    toReturn = 'W';
  } else if (character == 'x') {
    toReturn = 'X';
  } else if (character == 'y') {
    toReturn = 'Y';
  } else if (character == 'z') {
    toReturn = 'Z';
  }

  return toReturn;
}
function charIsUpperCase(character) {
  var isUpper;

  isUpper = false;
  if (character == 'A') {
    isUpper = true;
  } else if (character == 'B') {
    isUpper = true;
  } else if (character == 'C') {
    isUpper = true;
  } else if (character == 'D') {
    isUpper = true;
  } else if (character == 'E') {
    isUpper = true;
  } else if (character == 'F') {
    isUpper = true;
  } else if (character == 'G') {
    isUpper = true;
  } else if (character == 'H') {
    isUpper = true;
  } else if (character == 'I') {
    isUpper = true;
  } else if (character == 'J') {
    isUpper = true;
  } else if (character == 'K') {
    isUpper = true;
  } else if (character == 'L') {
    isUpper = true;
  } else if (character == 'M') {
    isUpper = true;
  } else if (character == 'N') {
    isUpper = true;
  } else if (character == 'O') {
    isUpper = true;
  } else if (character == 'P') {
    isUpper = true;
  } else if (character == 'Q') {
    isUpper = true;
  } else if (character == 'R') {
    isUpper = true;
  } else if (character == 'S') {
    isUpper = true;
  } else if (character == 'T') {
    isUpper = true;
  } else if (character == 'U') {
    isUpper = true;
  } else if (character == 'V') {
    isUpper = true;
  } else if (character == 'W') {
    isUpper = true;
  } else if (character == 'X') {
    isUpper = true;
  } else if (character == 'Y') {
    isUpper = true;
  } else if (character == 'Z') {
    isUpper = true;
  }

  return isUpper;
}
function charIsLowerCase(character) {
  var isLower;

  isLower = false;
  if (character == 'a') {
    isLower = true;
  } else if (character == 'b') {
    isLower = true;
  } else if (character == 'c') {
    isLower = true;
  } else if (character == 'd') {
    isLower = true;
  } else if (character == 'e') {
    isLower = true;
  } else if (character == 'f') {
    isLower = true;
  } else if (character == 'g') {
    isLower = true;
  } else if (character == 'h') {
    isLower = true;
  } else if (character == 'i') {
    isLower = true;
  } else if (character == 'j') {
    isLower = true;
  } else if (character == 'k') {
    isLower = true;
  } else if (character == 'l') {
    isLower = true;
  } else if (character == 'm') {
    isLower = true;
  } else if (character == 'n') {
    isLower = true;
  } else if (character == 'o') {
    isLower = true;
  } else if (character == 'p') {
    isLower = true;
  } else if (character == 'q') {
    isLower = true;
  } else if (character == 'r') {
    isLower = true;
  } else if (character == 's') {
    isLower = true;
  } else if (character == 't') {
    isLower = true;
  } else if (character == 'u') {
    isLower = true;
  } else if (character == 'v') {
    isLower = true;
  } else if (character == 'w') {
    isLower = true;
  } else if (character == 'x') {
    isLower = true;
  } else if (character == 'y') {
    isLower = true;
  } else if (character == 'z') {
    isLower = true;
  }

  return isLower;
}
function charIsLetter(character) {
  return charIsUpperCase(character) || charIsLowerCase(character);
}
function charIsNumber(character) {
  var isNumberx;

  isNumberx = false;
  if (character == '0') {
    isNumberx = true;
  } else if (character == '1') {
    isNumberx = true;
  } else if (character == '2') {
    isNumberx = true;
  } else if (character == '3') {
    isNumberx = true;
  } else if (character == '4') {
    isNumberx = true;
  } else if (character == '5') {
    isNumberx = true;
  } else if (character == '6') {
    isNumberx = true;
  } else if (character == '7') {
    isNumberx = true;
  } else if (character == '8') {
    isNumberx = true;
  } else if (character == '9') {
    isNumberx = true;
  }

  return isNumberx;
}
function charIsWhiteSpace(character) {
  var isWhiteSpacex;

  isWhiteSpacex = false;
  if (character == ' ') {
    isWhiteSpacex = true;
  } else if (character == '\t') {
    isWhiteSpacex = true;
  } else if (character == '\n') {
    isWhiteSpacex = true;
  } else if (character == '\r') {
    isWhiteSpacex = true;
  }

  return isWhiteSpacex;
}
function charIsSymbol(character) {
  var isSymbolx;

  isSymbolx = false;
  if (character == '!') {
    isSymbolx = true;
  } else if (character == '\"') {
    isSymbolx = true;
  } else if (character == '#') {
    isSymbolx = true;
  } else if (character == '$') {
    isSymbolx = true;
  } else if (character == '%') {
    isSymbolx = true;
  } else if (character == '&') {
    isSymbolx = true;
  } else if (character == '\'') {
    isSymbolx = true;
  } else if (character == '(') {
    isSymbolx = true;
  } else if (character == ')') {
    isSymbolx = true;
  } else if (character == '*') {
    isSymbolx = true;
  } else if (character == '+') {
    isSymbolx = true;
  } else if (character == ',') {
    isSymbolx = true;
  } else if (character == '-') {
    isSymbolx = true;
  } else if (character == '.') {
    isSymbolx = true;
  } else if (character == '/') {
    isSymbolx = true;
  } else if (character == ':') {
    isSymbolx = true;
  } else if (character == ';') {
    isSymbolx = true;
  } else if (character == '<') {
    isSymbolx = true;
  } else if (character == '=') {
    isSymbolx = true;
  } else if (character == '>') {
    isSymbolx = true;
  } else if (character == '?') {
    isSymbolx = true;
  } else if (character == '@') {
    isSymbolx = true;
  } else if (character == '[') {
    isSymbolx = true;
  } else if (character == '\\') {
    isSymbolx = true;
  } else if (character == ']') {
    isSymbolx = true;
  } else if (character == '^') {
    isSymbolx = true;
  } else if (character == '_') {
    isSymbolx = true;
  } else if (character == '`') {
    isSymbolx = true;
  } else if (character == '{') {
    isSymbolx = true;
  } else if (character == '|') {
    isSymbolx = true;
  } else if (character == '}') {
    isSymbolx = true;
  } else if (character == '~') {
    isSymbolx = true;
  }

  return isSymbolx;
}
function charCharacterIsBefore(a, b) {
  var ad, bd;

  ad = a.charCodeAt(0);
  bd = b.charCodeAt(0);

  return ad < bd;
}
function AssertFalse(b, failures) {
  if (b) {
    failures.numberValue = failures.numberValue + 1;
  }
}
function AssertTrue(b, failures) {
  if (!b) {
    failures.numberValue = failures.numberValue + 1;
  }
}
function AssertEquals(a, b, failures) {
  if (a != b) {
    failures.numberValue = failures.numberValue + 1;
  }
}
function AssertBooleansEqual(a, b, failures) {
  if (a != b) {
    failures.numberValue = failures.numberValue + 1;
  }
}
function AssertCharactersEqual(a, b, failures) {
  if (a != b) {
    failures.numberValue = failures.numberValue + 1;
  }
}
function AssertStringEquals(a, b, failures) {
  if (!StringsEqual(a, b)) {
    failures.numberValue = failures.numberValue + 1;
  }
}
function AssertNumberArraysEqual(a, b, failures) {
  var i;

  if (a.length == b.length) {
    for (i = 0; i < a.length; i = i + 1) {
      AssertEquals(a[i], b[i], failures);
    }
  } else {
    failures.numberValue = failures.numberValue + 1;
  }
}
function AssertBooleanArraysEqual(a, b, failures) {
  var i;

  if (a.length == b.length) {
    for (i = 0; i < a.length; i = i + 1) {
      AssertBooleansEqual(a[i], b[i], failures);
    }
  } else {
    failures.numberValue = failures.numberValue + 1;
  }
}
function AssertStringArraysEqual(a, b, failures) {
  var i;

  if (a.length == b.length) {
    for (i = 0; i < a.length; i = i + 1) {
      AssertStringEquals(a[i].string, b[i].string, failures);
    }
  } else {
    failures.numberValue = failures.numberValue + 1;
  }
}


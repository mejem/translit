"use strict";

onmessage = function onmessage(e) {
  var result = transliterate(e.data.lang, e.data.inputText);
  postMessage(result);
};

function transliterate(lang, inputText) {
  var input = Array.from(inputText);
  if (lang == 'ru') {
    return tr_russian(input);
  } else if (lang == 'uk') {
    return tr_ukrainian(input);
  } else {
    throw 'Error: Unsupported lang string: ' + lang;
  }
}

function Rules_ru() {
  var cyrilic = Array.from(
    "АаБбВвГгДдЕеЁёЖжЗзИиЙйКкЛлМмНнОоПпРрСсТтУуФфЦцЧчШшЪъЫыЬьЭэ" + "ХхЩщЮюЯя"
  );
  var czech = Array.from(
    "AaBbVvGgDdEeEeŽžZzIiJjKkLlMmNnOoPpRrSsTtUuFfCcČčŠš””Yy’’Èè"
  ).concat(['Ch', 'ch', 'Šč', 'šč', 'Ju', 'ju', 'Ja', 'ja']);
  var vocals = Array.from("АаЕеЁёИиОоУуЪъЫыЬьЭэЮюЯя");
  var rules = {};
  var len = cyrilic.length;
  for (var i = 0; i < len; i++) {
    rules[cyrilic[i]] = czech[i];
  }
  rules["vocals"] = vocals;
  return rules;
}

function Rules_uk() {
  var cyrilic = Array.from(
    "АаБбВвГгҐґДдЕеЖжЗзИиІіЙйКкЛлМмНнОоПпРрСсТтУуФфЦцЧчШшЬь" + "ЄєЇїХхЩщЮюЯя"
  );
  var czech = Array.from(
    "AaBbVvHhGgDdEeŽžZzYyÌìJjKkLlMmNnOoPpRrSsTtUuFfCcČčŠš’’"
  ).concat(['Je', 'je', 'Ji', 'ji', 'Ch', 'ch', 'Šč', 'šč', 'Ju', 'ju', 'Ja', 'ja']);
  var rules = {};
  var len = cyrilic.length;
  for (var i = 0; i < len; i++) {
    rules[cyrilic[i]] = czech[i];
  }
  return rules;
}

var rules_ru = Rules_ru();
var rules_uk = Rules_uk();

function tr_russian(input) {
  var len = input.length;
  var output = new Array(len);
  for (var i = 0; i < len; i++) {
    if (input[i] in rules_ru) {
      if ("ЕЁ".includes(input[i]) &&
        (atBeginAndAfterApos(input, i) || rules_ru.vocals.includes(input[i - 1]))
      ) {
        output[i] = 'J';
        if (isBetweenUpper(len, input, i)) {
          output[i] += 'E';
        } else {
          output[i] += 'e';
        }
      } else if ("её".includes(input[i]) &&
        (atBeginAndAfterApos(input, i) || rules_ru.vocals.includes(input[i - 1]))
      ) {
        output[i] = 'je';
      } else if (input[i] == 'И' && i > 0 && input[i - 1] == 'Ь') {
        output[i] = 'JI';
      } else if (input[i] == 'и' && i > 0 && input[i - 1] == 'Ь') {
        output[i] = 'Ji';
      } else if (input[i] == 'и' && i > 0 && input[i - 1] == 'ь') {
        output[i] = ('ji');
      } else if ("ХЩЮЯ".includes(input[i]) && isBetweenUpper(len, input, i)) {
        output[i] = rules_ru[input[i]].toUpperCase();
      } else {
        output[i] = rules_ru[input[i]];
      }
    } else {
      output[i] = input[i];
    }
  }
  return output.join('');
}

function atBeginAndAfterApos(input, i) {
  return (
    i == 0 ||
    /[\s\n\r\v\t.,'"+!?\-«»“”„`’‹›—–−]/.test(input[i - 1])
  );
}


function tr_ukrainian(input) {
  var len = input.length;
  var output = new Array(len);
  for (var i = 0; i < len; i++) {
    if (input[i] in rules_uk) {
      if ("ЄЇХЩЮЯ".includes(input[i]) && isBetweenUpper(len, input, i)) {
        output[i] = rules_uk[input[i]].toUpperCase();
      } else {
        output[i] = rules_uk[input[i]];
      }
    } else {
      output[i] = input[i];
    }
  }
  return output.join("");
}

function isBetweenUpper(len, input, i) {
  return (
    (i < len - 1 && isUpper(input[i + 1])) || (i > 0 && isUpper(input[i - 1]))
  );
}

function isUpper(str) {
  return str != str.toLowerCase();
}

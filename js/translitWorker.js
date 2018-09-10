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
  } else if (lang == 'be') {
    return tr_belarusian(input);
  }  else {
    throw 'Error: Unsupported lang string: ' + lang;
  }
}

function Rules_ru() {
  var cyrillic = Array.from(
    "АаБбВвГгДдЕеЁёЖжЗзИиЙйКкЛлМмНнОоПпРрСсТтУуФфЦцЧчШшЪъЫыЬьЭэ" + "ХхЩщЮюЯя"
  );
  var czech = Array.from(
    "AaBbVvGgDdEeEeŽžZzIiJjKkLlMmNnOoPpRrSsTtUuFfCcČčŠš““Yy‘‘Èè"
  ).concat(['Ch', 'ch', 'Šč', 'šč', 'Ju', 'ju', 'Ja', 'ja']);
  var vocals = Array.from("АаЕеЁёИиІіОоУуЎўЪъЫыЬьЭэЮюЯя");
  var rules = {};
  var len = cyrillic.length;
  for (var i = 0; i < len; i++) {
    rules[cyrillic[i]] = czech[i];
  }
  rules["vocals"] = vocals;
  return rules;
}

function Rules_be() {
  var cyrillic = Array.from(
    "АаБбВвГгДдЕеЁёЖжЗзІіЙйКкЛлМмНнОоПпРрСсТтУуЎўФфЦцЧчШшЫыЬьЭэ" + "ХхЩщЮюЯя"
  );
  var czech = Array.from(
    "AaBbVvHhDdEeEeŽžZzÌìJjKkLlMmNnOoPpRrSsTtUuŬŭFfCcČčŠšYy‘‘Èè"
  ).concat(['Ch', 'ch', 'Šč', 'šč', 'Ju', 'ju', 'Ja', 'ja']);
  var vocals = Array.from("АаЕеЁёИиІіОоУуЎўЪъЫыЬьЭэЮюЯя");
  var rules = {};
  var len = cyrillic.length;
  for (var i = 0; i < len; i++) {
    rules[cyrillic[i]] = czech[i];
  }
  rules["vocals"] = vocals;
  return rules;
}

function Rules_uk() {
  var cyrillic = Array.from(
    "АаБбВвГгҐґДдЕеЖжЗзИиІіЙйКкЛлМмНнОоПпРрСсТтУуФфЦцЧчШшЬьЫы" + "ЄєЇїХхЩщЮюЯя"
  );
  var czech = Array.from(
    "AaBbVvHhGgDdEeŽžZzYyÌìJjKkLlMmNnOoPpRrSsTtUuFfCcČčŠš‘‘Ỳỳ"
  ).concat(['Je', 'je', 'Ji', 'ji', 'Ch', 'ch', 'Šč', 'šč', 'Ju', 'ju', 'Ja', 'ja']);
  var rules = {};
  var len = cyrillic.length;
  for (var i = 0; i < len; i++) {
    rules[cyrillic[i]] = czech[i];
  }
  return rules;
}


var rules = {};
rules.ru = Rules_ru();
rules.be = Rules_be();
rules.uk = Rules_uk();

function tr_russian(input) {
  var len = input.length;
  var output = new Array(len);
  for (var i = 0; i < len; i++) {
    if (input[i] in rules.ru) {
      if (
        "ЕЁ".includes(input[i]) &&
        atBeginAndAfterVocals('ru', input, i)
      ) {
        output[i] = 'J';
        if (isBetweenUpper(len, input, i)) {
          output[i] += 'E';
        } else {
          output[i] += 'e';
        }
      } else if (
          "её".includes(input[i]) &&
          atBeginAndAfterVocals('ru', input, i)
        ) {
        output[i] = 'je';
      } else if (input[i] == 'И' && i > 0 && input[i - 1] == 'Ь') {
        output[i] = 'JI';
      } else if (input[i] == 'и' && i > 0 && input[i - 1] == 'Ь') {
        output[i] = 'Ji';
      } else if (input[i] == 'и' && i > 0 && input[i - 1] == 'ь') {
        output[i] = ('ji');
      } else if ("ХЩЮЯ".includes(input[i]) && isBetweenUpper(len, input, i)) {
        output[i] = rules.ru[input[i]].toUpperCase();
      } else {
        output[i] = rules.ru[input[i]];
      }
    } else {
      output[i] = input[i];
    }
  }
  return output.join('');
}

function tr_belarusian(input) {
  var len = input.length;
  var output = new Array(len);
  for (var i = 0; i < len; i++) {
    if (input[i] in rules.be) {
      if (
        "ЕЁ".includes(input[i]) &&
        atBeginAndAfterVocals('be', input, i)
      ) {
        output[i] = 'J';
        if (isBetweenUpper(len, input, i)) {
          output[i] += 'E';
        } else {
          output[i] += 'e';
        }
      } else if (
          "её".includes(input[i]) &&
          atBeginAndAfterVocals('be', input, i)
      ) {
        output[i] = 'je';
      } else if ("ХЩЮЯ".includes(input[i]) && isBetweenUpper(len, input, i)) {
        output[i] = rules.be[input[i]].toUpperCase();
      } else {
        output[i] = rules.be[input[i]];
      }
    } else {
      output[i] = input[i];
    }
  }
  return output.join('');
}

function atBeginAndAfterVocals(lang, input, i, waitForLess = false) {
  if (i < 1) {
    return true;
  }
  if (waitForLess) {
    if (input[i] != '<') {
      return atBeginAndAfterVocals(lang, input, i - 1, true);
    } else {
      return atBeginAndAfterVocals(lang, input, i);
    }
  }
  if (input[i - 1] == '>') {
    return atBeginAndAfterVocals(lang, input, i - 1, true);
  }
  return !(input[i - 1] in rules[lang]) || rules[lang].vocals.includes(input[i - 1]);
}


function tr_ukrainian(input) {
  var len = input.length;
  var output = new Array(len);
  for (var i = 0; i < len; i++) {
    if (input[i] in rules.uk) {
      if ("ЄЇХЩЮЯ".includes(input[i]) && isBetweenUpper(len, input, i)) {
        output[i] = rules.uk[input[i]].toUpperCase();
      } else {
        output[i] = rules.uk[input[i]];
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

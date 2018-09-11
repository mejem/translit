"use strict";

onmessage = function onmessage(e) {
  var result = transliterate(e.data.lang, e.data.inputText);
  postMessage(result);
};

function transliterate(lang, inputText) {
  var input = Array.from(inputText);
  if (lang == 'ru') {
    return tr_russian(lang, input);
  } else if (lang == 'be') {
    return tr_russian(lang, input);
  } else if (!(lang in rules)) {
    throw 'Error: Unsupported lang string: ' + lang;
  } else {
    return tr_generic(input, lang);
  }
}

//
// define transliteration rules
//
function Rules_ru() {
  var cyrillic = Array.from(
    "АаБбВвГгДдЕеЁёЖжЗзИиЙйКкЛлМмНнОоПпРрСсТтУуФфЦцЧчШшЪъЫыЬьЭэѴѵѲѳІіѢѣ" + "ХхЩщЮюЯя"
  );
  var czech = Array.from(
    "AaBbVvGgDdEeEeŽžZzIiJjKkLlMmNnOoPpRrSsTtUuFfCcČčŠš””Yy’’ÈèỲỳFfÌì"
  ).concat(['Ch', 'ch', 'Šč', 'šč', 'Ju', 'ju', 'Ja', 'ja']);
  return makeRules(cyrillic, czech);
}

function Rules_be() {
  var cyrillic = Array.from(
    "АаБбВвГгДдЕеЁёЖжЗзІіЙйКкЛлМмНнОоПпРрСсТтУуЎўФфЦцЧчШшЫыЬьЭэ" + "ХхЩщЮюЯя"
  );
  var czech = Array.from(
    "AaBbVvHhDdEeEeŽžZzÌìJjKkLlMmNnOoPpRrSsTtUuŬŭFfCcČčŠšYy’’Èè"
  ).concat(['Ch', 'ch', 'Šč', 'šč', 'Ju', 'ju', 'Ja', 'ja']);
  return makeRules(cyrillic, czech);
}

function Rules_uk() {
  var cyrillic = Array.from(
    "АаБбВвГгҐґДдЕеЖжЗзИиІіЙйКкЛлМмНнОоПпРрСсТтУуФфЦцЧчШшЬьЫы" + "ЄєЇїХхЩщЮюЯя"
  );
  var czech = Array.from(
    "AaBbVvHhGgDdEeŽžZzYyÌìJjKkLlMmNnOoPpRrSsTtUuFfCcČčŠš’’Ỳỳ"
  ).concat(['Je', 'je', 'Ji', 'ji', 'Ch', 'ch', 'Šč', 'šč', 'Ju', 'ju', 'Ja', 'ja']);
  return makeRules(cyrillic, czech);
}

function Rules_bg() {
  var cyrillic = Array.from(
    "АаБбВвГгДдЕеЖжЗзИиЙйКкЛлМмНнОоПпРрСсТтУуФфЦцЧчШшЪъЬь" + "ХхЩщЮюЯя"
  );
  var czech = Array.from(
    "AaBbVvGgDdEeŽžZzIiJjKkLlMmNnOoPpRrSsTtUuFfCcČčŠšĂă’’"
  ).concat(['Ch', 'ch', 'Št', 'št', 'Ju', 'ju', 'Ja', 'ja']);
  return makeRules(cyrillic, czech);
}

function Rules_mk() {
  var cyrillic = Array.from(
    "АаБбВвГгЃѓДдЕеЖжЗзИиЈјКкЌќЛлМмНнОоПпРрСсТтУуФфЦцЧчШш" + "ХхЅѕЉљЊњЏџ"
  );
  var czech = Array.from(
    "AaBbVvGgǴǵDdEeŽžZzIiJjKkḰḱLlMmNnOoPpRrSsTtUuFfCcČčŠš"
  ).concat(['Ch', 'ch', 'Dz', 'dz', 'Lj', 'lj', 'Nj', 'nj', 'Dž', 'dž']);
  return makeRules(cyrillic, czech);
}

function Rules_sr() {
  var cyrillic = Array.from(
    "АаБбВвГгДдЂђЕеЖжЗзИиЈјКкЛлМмНнОоПпРрСсТтЋћУуФфХхЦцЧчШш" + "ЉљЊњЏџ"
  );
  var czech = Array.from(
    "AaBbVvGgDdĐđEeŽžZzIiJjKkLlMmNnOoPpRrSsTtĆćUuFfHhCcČčŠš"
  ).concat(['Lj', 'lj', 'Nj', 'nj', 'Dž', 'dž']);
  return makeRules(cyrillic, czech);
}

function makeRules(cyrillic, czech) {
  var rulesDict = {};
  var len = cyrillic.length;
  for (var i = 0; i < len; i++) {
    rulesDict[cyrillic[i]] = czech[i];
  }
  return rulesDict;
}

//
// transform rules
//
var rules = {};
rules.vocals = Array.from("АаЕеЁёИиІіОоУуЎўЪъЫыЬьЭэЮюЯя");
for (let lang of ['ru', 'be', 'uk', 'bg', 'mk', 'sr']) {
  rules[lang] = eval("Rules_" + lang)();
}

//
// transliteration functions
//
function tr_russian(lang, input) {
  var len = input.length;
  var output = new Array(len);
  for (var i = 0; i < len; i++) {
    if (input[i] in rules[lang]) {
      if (
        "ЕЁ".includes(input[i]) &&
        atBeginAndAfterVocals(lang, input, i)
      ) {
        output[i] = 'J';
        if (isBetweenUpper(len, input, i)) {
          output[i] += 'E';
        } else {
          output[i] += 'e';
        }
      } else if (
          "её".includes(input[i]) &&
          atBeginAndAfterVocals(lang, input, i)
        ) {
        output[i] = 'je';
      } else if (lang == 'ru' && input[i] == 'И' && i > 0 && input[i - 1] == 'Ь') {
        output[i] = 'JI';
      } else if (lang == 'ru' && input[i] == 'и' && i > 0 && input[i - 1] == 'Ь') {
        output[i] = 'Ji';
      } else if (lang == 'ru' && input[i] == 'и' && i > 0 && input[i - 1] == 'ь') {
        output[i] = ('ji');
      } else if ("ХЩЮЯ".includes(input[i]) && isBetweenUpper(len, input, i)) {
        output[i] = rules[lang][input[i]].toUpperCase();
      } else {
        output[i] = rules[lang][input[i]];
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
  return !(input[i - 1] in rules[lang]) || rules.vocals.includes(input[i - 1]);
}

function tr_generic(input, lang) {
  var len = input.length;
  var output = new Array(len);
  for (var i = 0; i < len; i++) {
    if (input[i] in rules[lang]) {
      if ("ЄЇХЩЮЯЅЉЊЏ".includes(input[i]) && isBetweenUpper(len, input, i)) {
        output[i] = rules[lang][input[i]].toUpperCase();
      } else {
        output[i] = rules[lang][input[i]];
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

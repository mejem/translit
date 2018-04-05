"use strict";

// $("#loader").removeAttr("style");
// $("#loader").hide()

function translit() {
  // var loader = document.getElementById('loader');
  // loader.style.visibility = 'visible';
  var lang = $("input[name=lang]:checked").val();
  var input = Array.from($("#inputText").val());

  $("#output").val(tr_ukrainian(input));
  // loader.style.visibility = 'hidden';
}

function Rules_uk() {
  var cyrilic = Array.from("АаБбВвГгҐґДдЕеЖжЗзИиІіЇїЙйКкЛлМмНнОоПпРрСсТтУуФфЦцЧчШшЬь" + "ЄєХхЩщЮюЯя");
  var czech   = Array.from("AaBbVvHhGgDdEeŽžZzYyÌìÏïJjKkLlMmNnOoPpRrSsTtUuFfCcČčŠš’’").concat(
    ['Je', 'je', 'Ch', 'ch', 'Šč', 'šč', 'Ju', 'ju', 'Ja', 'ja']
  );
  var rules = {};
  var len = cyrilic.length;
  for (var i = 0; i < len; i++) {
    rules[cyrilic[i]] = czech[i];
  }
  return rules;
}

var rules_uk = Rules_uk();

function tr_russian(input) {
  return;
}

function tr_ukrainian(input) {
  var len = input.length;
  var output = new Array(len);
  for (var i = 0; i < len; i++) {
    if (input[i] in rules_uk) {
      if ("ЄХЩЮЯ".includes(input[i]) && (isBetweenUpper(len, input, i))) {
        output[i] = rules_uk[input[i]].toUpperCase();
      } else {
        output[i] = rules_uk[input[i]];
      }
    } else {
      output[i] = input[i];
    }
  }
  return output.join('');
}

function isBetweenUpper(len, input, i) {
  return (i < len - 1 && isUpper(input[i + 1])) || (i > 0 && isUpper(input[i - 1]));
}

function isUpper(str) {
  return str == str.toUpperCase();
}


$("input[name=lang]").change(translit);

$("#inputText").on('input', function() {
    clearTimeout($(this).data('timeout'));
    $(this).data('timeout', setTimeout(function(){
      var loader = document.getElementById('loader');
      loader.style.visibility = 'visible';
      translit();
      loader.style.visibility = 'hidden';
    }, 300));
});

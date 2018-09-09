"use strict";

// dismiss "enable JavaScript" warning
document.getElementById('output').innerHTML = '';

// focus on input
$(window).on("load", function() {
  $("#inputText").focus();
});

// webpage language
var translatedText = {};
translatedText.langEn = {
  transliteration: "Transliteration",
  cyrilic: "Input: Cyrillic script",
  latin: "Output: Latin script",
  ru: "Russian",
  uk: "Ukrainian",
  copy: "Copy",
  copyToClip: "Copy to clipboard",
  copied: "Copied!",
  empty: "Output empty",
}
translatedText.langRu = {
  transliteration: "Транслитерация",
  cyrilic: "Вход: кириллица",
  latin: "Выход: латиница",
  ru: "русский",
  uk: "украинский",
  copy: "Копировать",
  copyToClip: "Копировать в буфер",
  copied: "Скопировать!",
  empty: "Выход пустой",
}
translatedText.langCs = {
  transliteration: "Transliterace",
  cyrilic: "Vstup: Cyrilice",
  latin: "Výstup: Latinka",
  ru: "ruština",
  uk: "ukrajinština",
  copy: "Kopírovat",
  copyToClip: "Zkopírovat do schránky",
  copied: "Zkopírováno!",
  empty: "Výstup je prázdný",
}

// switch webpage language
var webpageLanguages = '';
for (var lang in translatedText) {
  webpageLanguages += '#' + lang + ', ';
}
webpageLanguages = webpageLanguages.slice(0,-2);

$(webpageLanguages).on('click', function() {
  $(webpageLanguages).removeClass("w3-white");
  $(this).addClass("w3-white");

  switchWebpageLang(this.id);
});

function switchWebpageLang(lang) {
  for (var key in translatedText.langEn) {
    $("#t_" + key).text(translatedText[lang][key]);
  }
}

// remember last checked translit language
$(window).on("load", function() {
  $('#' + localStorage["checked"]).prop('checked', true);
});

$('#ru').click(function () {
    localStorage["checked"] = "ru";
});
$('#uk').click(function () {
    localStorage["checked"] = "uk";
});

// traliterate
var translitWorker = new Worker('js/translitWorker.js');
var inputText = $("#inputText");
inputText.on('input', function() {
    clearTimeout($(this).data('timeout'));
    $(this).data('timeout', setTimeout(function(){
      translitWorker.postMessage({lang: $("input[name=lang]:checked").val(), inputText: inputText.html()});
    }, 100));
});
$("input[name=lang]").change(function(){
  translitWorker.postMessage({lang: $("input[name=lang]:checked").val(), inputText: inputText.html()});
});
translitWorker.onmessage = function(e) {
  $('#output').html(e.data);
}

// copy to clipboard (http://jsfiddle.net/jdhenckel/km7prgv4/3/)
function copyToClip(str) {
  var tooltip = document.getElementById("myTooltip");
  if (str) {
    function listener(e) {
      e.clipboardData.setData("text/html", str);
      e.clipboardData.setData("text/plain", str);
      e.preventDefault();
    }
    document.addEventListener("copy", listener);
    document.execCommand("copy");
    document.removeEventListener("copy", listener);
    tooltip.innerHTML = "Copied!";
  } else {
    tooltip.innerHTML = "Output empty";
  }
}
function outFunc() {
  var tooltip = document.getElementById("myTooltip");
  tooltip.innerHTML = "Copy to clipboard";
}

// uneditable editabe div (http://jsfiddle.net/wfae8hzv/20/)
$("#output").keydown(function (event) {
    if (event.ctrlKey && event.keyCode === 88)
    {
        return false;
    }
    if (event.ctrlKey) {
        // allow Ctrl-A, Ctrl-(any key) combinations
        return true;
    }
    if (event.keyCode === 116) { // allow F5
        return true;
    }

    // keycode: http://www.programming-magic.com/file/20080205232140/keycode_table.html
    if (33 <= event.keyCode && event.keyCode <= 40) {
        return true;
    }
    return false;
});

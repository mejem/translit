"use strict";

// dismiss "enable JavaScript" warning
document.getElementById('output').innerHTML = '';

// focus on input
$(window).on("load", function() {
  $("#inputText").focus();
});

// switch webpage language
var webpageLanguages = '';
for (var lang in translatedText) {
  webpageLanguages += '#' + lang + ', ';
}
webpageLanguages = webpageLanguages.slice(0,-2);

$(window).on("load", function() {
  var webPageLang = localStorage["lang"];
  if (webPageLang) {
    $('#' + webPageLang).addClass("w3-white");
    switchWebpageLang(webPageLang);
  } else if (navigator.language.startsWith("cs")) {
    $('#langCs').addClass("w3-white");
    switchWebpageLang('langCs');
  } else if (navigator.language.startsWith("ru")) {
    $('#langRu').addClass("w3-white");
    switchWebpageLang('langRu');
  } else {
    $('#langEn').addClass("w3-white");
    switchWebpageLang('langEn');
  }
});

$(webpageLanguages).on('click', function() {
  $(webpageLanguages).removeClass("w3-white");
  $(this).addClass("w3-white");

  switchWebpageLang(this.id);
  localStorage["lang"] = this.id;
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

$('#ru, #be, #uk, #bg, #mk, #sr').click(function () {
  localStorage["checked"] = this.id;
});

// traliterate
var translitWorker = new Worker('js/translitWorker.js');
var inputText = $("#inputText");
inputText.on('input', function() {
    clearTimeout($(this).data('timeout'));
    $(this).data('timeout', setTimeout(function(){
      postMessageToWorker();
    }, 100));
});
$("input[name=lang]").change(function(){
  postMessageToWorker();
});
translitWorker.onmessage = function(e) {
  $('#output').html(e.data);
}

function postMessageToWorker() {
  translitWorker.postMessage({
    lang: $("input[name=lang]:checked").val(),
    inputText: inputText.html()
  });
}

// copy to clipboard (http://jsfiddle.net/jdhenckel/km7prgv4/3/)
function copyToClip(str) {
  var tooltip = document.getElementById("t_copyToClip");
  var currentLang = $("button[id^='lang'][class~='w3-white']").prop('id');
  if (str) {
    function listener(e) {
      e.clipboardData.setData("text/html", str);
      e.clipboardData.setData("text/plain", str);
      e.preventDefault();
    }
    document.addEventListener("copy", listener);
    document.execCommand("copy");
    document.removeEventListener("copy", listener);
    tooltip.innerHTML = translatedText[currentLang].copied;
  } else {
    tooltip.innerHTML = translatedText[currentLang].empty;
  }
}
function outFunc() {
  var tooltip = document.getElementById("t_copyToClip");
  var currentLang = $("button[id^='lang'][class~='w3-white']").prop('id');
  tooltip.innerHTML = translatedText[currentLang].copyToClip;
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

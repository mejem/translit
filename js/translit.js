"use strict";

$(document).ready(function() {
  // focus on input
  $("#inputText").focus();
  // dismiss "enable JavaScript" warning
  $("#output").empty();
});

// fill template with mustache
$(document).ready(function() {
  var template = $("#template").html();
  Mustache.parse(template);
  var target = $("#target");
  for (let lang of ['ru', 'be', 'uk', 'bg', 'mk', 'sr']) {
    target.append(Mustache.render(template, {lang: lang}));
  }
});

// copy to clipboard
var clipboard = new ClipboardJS($('#copyButton')[0]);

clipboard.on('success', function(e) {
    copied(e.text != "");
});
clipboard.on('error', function(e) {
    console.log(e);
});

function copied(really) {
  var currentLang = $("button[id^='lang'][class~='w3-white']").prop('id');
  var button = $("#copyButton");
  var buttonText = $("#t_copy");
  button.removeClass("w3-white");
  button.addClass("w3-blue");
  if (!really) {
    buttonText.text(translatedText[currentLang].empty);
  } else {
    buttonText.text(translatedText[currentLang].copied);
  }
  window.setTimeout( function() {
    var currentLang = $("button[id^='lang'][class~='w3-white']").prop('id');
    button.removeClass("w3-blue");
    button.addClass("w3-white");
    buttonText.text(translatedText[currentLang].copy);
  }, 2000 );
}

// switch webpage language
var webpageLanguages = '';
for (var lang in translatedText) {
  webpageLanguages += '#' + lang + ', ';
}
webpageLanguages = webpageLanguages.slice(0,-2);

$(document).ready(function() {
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
  var button = $("#copyButton");
  button.removeClass("w3-blue");
  button.addClass("w3-white");
}

// remember last checked translit language
$(document).ready(function() {
  if (localStorage["checked"]) {
    $('#' + localStorage["checked"]).prop('checked', true);
  } else {
    $('#ru').prop('checked', true);
  }
  $('#ru, #be, #uk, #bg, #mk, #sr').click(function () {
    localStorage["checked"] = this.id;
  });
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

$(document).ready(function() {
  $("input[name=lang]").change(function(){
    postMessageToWorker();
  });
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

// uneditable editabe div (http://jsfiddle.net/wfae8hzv/20/)
// CAVEATS: cut mysi funguje, ctrl+v funguje
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

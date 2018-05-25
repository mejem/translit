"use strict";

// dismiss "enable JavaScript" warning
document.getElementById('output').innerHTML = '';

// focus on input
$(window).on("load", function() {
  $("#inputText").focus();
});

// webpage language
var text = {};
text.en = {
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

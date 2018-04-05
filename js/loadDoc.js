function loadDoc() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    var loader = document.getElementById('loader');
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("output").innerHTML = this.responseText;
      loader.style.visibility = 'hidden';
    } else if (this.readyState == 4) {
      document.getElementById("output").innerHTML = this.status + ": Chyba aplikace";
      loader.style.visibility = 'hidden';
    } else {
      loader.style.visibility = 'visible';
    }
  };
  var lang = document.querySelector("input[name=lang]:checked").value;
  xhttp.open("POST", "translit.cgi?" + lang, true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  var inp = document.getElementById("inputText").value;
  xhttp.send(inp);
}

$("input[name=lang]").change(function(){
    loadDoc();
});

$("#inputText").on('keyup paste', function() {
    clearTimeout($(this).data('timeout'));
    $(this).data('timeout', setTimeout(function(){
        loadDoc();
    }, 500));
});

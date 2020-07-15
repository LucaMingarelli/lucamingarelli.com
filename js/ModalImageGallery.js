// Modal Image Gallery
function onClick(element) {
  document.getElementById("img01").src = element.src
  document.getElementById("modal01").style.display = "block";
  var captionText = document.getElementById("caption");
  captionText.innerHTML = element.alt;
}
function onClick2(element) {
  document.getElementById("img01").src = element.href
  document.getElementById("modal01").style.display = "block";
  var captionText = document.getElementById("caption");
  captionText.innerHTML = element.name;
}


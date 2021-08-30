// <!-- Sidebar/menu -->\
// <!-- Top menu on small screens -->  from header
//  <!-- Overlay effect when opening sidebar on small screens -->  last div
// backup first line  <nav class="w3-sidebar w3-bar-block w3-white w3-animate-left w3-text-grey w3-collapse w3-top w3-center" style="z-index:3;width:300px;font-weight:bold" id="mySidebar"><br>\
document.write('\
 <nav class="w3-sidebar w3-bar-block w3-white w3-text-grey w3-collapse w3-top w3-center" style="z-index:3;width:300px;font-weight:bold" id="mySidebar"><br>\
 <h3 class="w3-padding-64 w3-center"><b>LUCA<br>MINGARELLI</b></h3>\
 <a href="javascript:void(0)" onclick="w3_close()" class="w3-bar-item w3-button w3-padding w3-hide-large">CLOSE</a>\
 <a href="../index.html" onclick="w3_close()" class="w3-bar-item w3-button">ABOUT ME</a>\
 <a href="../RESEARCH.html" class="w3-bar-item w3-button">RESEARCH</a>\
 <a href="../ResearchBlog.html"  class="w3-bar-item w3-button">Research Blog</a>\
 <a href="../Conferences.html"  class="w3-bar-item w3-button">Conferences</a>\
 <a href="../Software.html"  class="w3-bar-item w3-button">Software</a>\
 <a href="../Teaching.html"  class="w3-bar-item w3-button">Teaching</a>\
 <!--<a href="MISC.html" class="w3-bar-item w3-button">MISCELLANEOUS</a>-->\
 <a href="#contact" onclick="w3_close()" class="w3-bar-item w3-button">CONTACT</a>\
</nav>\
<header class="w3-container w3-top w3-hide-large w3-white w3-xlarge w3-padding-16">\
 <span class="w3-left w3-padding">LUCA MINGARELLI</span>\
 <a href="javascript:void(0)" class="w3-right w3-button w3-white" onclick="w3_open()">☰</a>\
</header>\
<div class="w3-overlay w3-hide-large w3-animate-opacity" onclick="w3_close()" style="cursor:pointer" title="close side menu" id="myOverlay"></div>\
')

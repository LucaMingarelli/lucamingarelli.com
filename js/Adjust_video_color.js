//document.write("You are using " + $.browser.name +
//             " v" + $.browser.versionNumber +
//             " on " + $.browser.platform);
var hasColorChanged = 0;
function setVideoColor(vid, nativeColor) {
                        if(!hasColorChanged){
                          console.log("Browser: ",$.browser.name)
                          console.log("Platform: ",$.browser.platform)//$.browser.versionNumber
                          var brightness;
                          if($.browser.name=="chrome"){brightness=220/226;console.log("Adapted to ",$.browser.name)}
                          else if($.browser.name=="safari" && $.browser.platform == "mac"){
                            brightness=220/226;console.log("Adapted to ",$.browser.name,$.browser.platform)
                          }
                          else if($.browser.name=="mozilla"){brightness=1;console.log("Adapted to ",$.browser.name)}
                          else if($.browser.iDevice){brightness=1;console.log("Adapted to ",$.browser.name,$.browser.platform)}
                          else {brightness=1; console.log("Could not adapt video brightness.")}
                          // if(navigator.userAgent.indexOf("Safari") != -1){brightness=220/226;console.log("Safari");}
                          // else if(navigator.userAgent.indexOf("Chrome") != -1){brightness=220/226;console.log("Chrome");}
                          // else if(navigator.userAgent.indexOf("Firefox") != -1){brightness=1;console.log("Firefox");}
                          // else{brightness=1}
                          var filters =  " brightness(" + brightness + ")";
                          $("#my-video").css('-webkit-filter', filters);
                          hasColorChanged = 1;
                        }
        }
function setVideoColorDelayed(vid, nativeColor) {
            setTimeout(setVideoColor, 100, vid, nativeColor);
        }

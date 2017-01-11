function ParseXML(val)
{
    if (window.DOMParser)
      {
        parser=new DOMParser();
        xmlDoc=parser.parseFromString(val,"text/xml");
      }
    else
      {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM"); xmlDoc.loadXML(val);
      }
return xmlDoc ;
}

//Get current date for log file path
var currentDate = new Date();
var dd = currentDate.getDate();
var mm = currentDate.getMonth()+1; //January is 0!
var yyyy = currentDate.getFullYear();

if(dd<10) {
    dd='0'+dd
}

if(mm<10) {
    mm='0'+mm
}

currentDate = yyyy+mm+dd;

//Split the log line by line into an array
var logArray = new Array;
    $.get('/data/CurrentCost[' + currentDate + '].log', function(data){
            logArray = data.split('\n');

            //Convert last line of array to string and check to make sure it is usable
            var i = 2;
            var usableLine = false;
            do{
              i++;
              var last_line = logArray[logArray.length - i];
              var xmlString = last_line.toString();
              usableLine = last_line.includes("id");
            }
            while(usableLine == false);

            //Parse string as xml
            var xml = ParseXML(xmlString);

            //Get and convert Time to string
            var time = xml.getElementsByTagName("time")[0];
            var timeString = (new XMLSerializer()).serializeToString(time);
              timeString = timeString.replace("<time>", "");
                timeString = timeString.replace("</time>", "");

            //Get and convert tmprF to string
            var tmprF = xml.getElementsByTagName("tmprF")[0];
            var tmprFString = (new XMLSerializer()).serializeToString(tmprF);
              tmprFString = tmprFString.replace("<tmprF>", "");
                tmprFString = tmprFString.replace("</tmprF>", "");

            //Get and convert Watts to string
            var watt1 = xml.getElementsByTagName("watts")[0];
            var wattString1 = (new XMLSerializer()).serializeToString(watt1);
              wattString1 = wattString1.replace(/[^0-9\.]+/g, "");

            var watt2 = xml.getElementsByTagName("watts")[1];
            var wattString2 = (new XMLSerializer()).serializeToString(watt2);
              wattString2 = wattString2.replace(/[^0-9\.]+/g, "");

            //Convert Watts to int and sum
            var totalWatts = Number(wattString1) + Number(wattString2);

            //Pass variables to display in html
            document.getElementById("Time").innerHTML = String(timeString);
            document.getElementById("Temp").innerHTML = String(tmprFString);
            document.getElementById("Power").innerHTML = String(totalWatts);



});

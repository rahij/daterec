Components.utils.import("resource:///modules/gloda/index_msg.js");
Components.utils.import("resource:///modules/gloda/mimemsg.js");
// This is Thunderbird 3.3 only!
Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("resource://gre/modules/NetUtil.jsm");

var months={
  "January" : 1, 
  "February" : 2,
  "March" : 3,
  "April": 4,
  "May": 5,
  "June": 6,
  "July": 7,
  "August":8,
  "September" : 9,
  "Sep": 9,
  "October": 10,
  "November": 11,
  "December": 12, 
  "Jan" : 1, 
  "Feb" : 2,
  "Mar" : 3,
  "Apr": 4,
  "June": 6,
  "Jul": 7,
  "Aug":8,
  "Sept" : 9,
  "Oct": 10,
  "Nov": 11,
  "Dec": 12, 
  "01": 1,
  "1": 1,
  "02": 2,
  "2": 2,
  "03": 3,
  "3": 3,
  "04": 4,
  "4": 4,
  "05": 5,
  "5": 5,
  "06": 6,
  "6": 6,
  "07" : 7,
  "7": 7,
  "08": 8,
  "8": 8,
  "09": 9,
  "9": 9,
  "10": 10,
  "11": 11,
  "12": 12
};

var DateRec = {
  do: function () {
    // First we get msgHdr, a nsIMsgDbHdr
    
    let msgHdr = gFolderDisplay.selectedMessage;
    let text = [];
    let add = function (s) text.push(s);
    let count = 3;
    let top = function () {
      if (--count == 0)
        document.getElementById("tabmail").openTab("contentTab", {
          contentPage: "about:blank",
          onLoad: function (aEvent, aBrowser) {
            let doc = aBrowser.contentDocument;
            let pre = doc.createElement("pre");
            pre.textContent = text.join("");
            doc.body.appendChild(pre);
          },
        });
    }

    MsgHdrToMimeMessage(msgHdr, null, function (aMsgHdr, aMimeMsg) {
      var message_body=(aMimeMsg.coerceBodyToPlaintext());
      
      var found = new Array();
      var regex=new Array(
        /(\d+)\/(\d+)\/(\d+)/g,  // 0. 3/5/1994 , 03/05/1994, 3/05/1994/ 03/5/1994   
        /(\d+)-(\S+)-(\d+)/g,    // 1. Same as above; but - instead of /
        /(\d+) (\S+) (\d+)/g,     // 2. 3 May 1994, 03 May 1994
        /(\d+)(\S+) (\S+) (\d+)/g,  // 3. 3rd May 1994
        /(\d+) (\S+), (\d+)/g,       // 4. 3 May, 1994
        /(\S+) (\d+)(\S+) (\d+)/g,   // 5. May 3rd 1994
        /(\S+) (\d+), (\d+)/g,           // 6. May 3, 1994
        /(\S+) (\d+) (\d+)/g           // 7. May 3 1994
        
      );

      var detectedDescription = "<div id = 'detectedDescription' style='margin-bottom: 15px;'>Dates Found</div>";
      $(document.getElementById("messagepane").contentDocument.body).append(detectedDescription);

      var num_dates=0,match;
      for(var i=0;i<regex.length;++i){
        
        while(match=regex[i].exec(message_body)){  
          
          if(found.indexOf(match[0]) != -1)
            continue;
          else
            found.push(match[0]);

          var day_index=1,month_index=2,year_index=3;
          
          if(i==3)
          {
            month_index=3;
            year_index = 4;
          }

          if(i==4)
          {
            year_index = 4;
          }

          if(i==5 || i==6)
          {
            month_index = 1;
            day_index = 2;
            year_index = 4;
          }

          if(i == 7)
          {
            day_index = 2;
            month_index = 1;
          }
          
          if((match==null) || !(match[month_index] in months))
            break;
          ++num_dates;
          
          var v = document.getElementById("messagepane").contentDocument.body;
        
          var bodyTextElement = document.createElement('span');
          bodyTextElement.setAttribute('day',match[day_index]);
          bodyTextElement.setAttribute('month',match[month_index]);
          bodyTextElement.setAttribute('year',match[year_index]);
          bodyTextElement.setAttribute('style','display:block;text-decoration: underline; color: blue;cursor:pointer;');
          var t=document.createTextNode(match[0]);
          bodyTextElement.appendChild(t);    

          bodyTextElement.addEventListener("click",function(){
            var day = this.getAttribute("day");
            var month = this.getAttribute("month");
            var year = this.getAttribute("year");
            new_event_with_dates(day,month,year);
          });

          $(v).append(bodyTextElement);
        }
      }
        
      top();
    });
  }
};

function new_event_with_dates(day,month,year){
  var newItem = createEvent();
  var aMsgHdr=gFolderDisplay.selectedMessage;
  var aItem=newItem;

  aItem.calendar = getSelectedCalendar();
  aItem.title = aMsgHdr.mime2DecodedSubject;
  cal.setDefaultStartEndHour(aItem);
  
  aItem.startDate.second=0;
  aItem.startDate.minute=0;
  aItem.startDate.hour=16;
  
  aItem.startDate.day=day;
  aItem.startDate.month=months[month]-1;
  aItem.startDate.year=year;

  aItem.endDate = aItem.startDate.clone();
  aItem.endDate.hour += 1;

  createEventWithDialog(null, null, null, null, aItem); 
}
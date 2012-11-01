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

  test: function(){
    alert("::");
  },
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
      
      var regex=new Array(
        /(\d+)\/(\d+)\/(\d+)/g,
        /(\d+)-(\S+)-(\d+)/g,
        /(\d+) (\S+) (\d+)/g,
        /(\d+)(\S+) (\S+) (\d+)/g
      );
      
      var num_dates=0,match;
      for(var i=0;i<regex.length;++i){
        
        while(match=regex[i].exec(message_body)){  
          
          var day_index,month_index=2,year_index;
          if(i==3)
          {
            month_index=3;
          }
          if((match==null) || !(match[month_index] in months))
            break;
          ++num_dates;
          
          var v = document.getElementById("messagepane").contentDocument.body;
        
          var bodyTextElement = document.createElement('span');
          bodyTextElement.setAttribute('day','3');
          bodyTextElement.setAttribute('style','display:block;text-decoration: underline; color: blue;cursor:pointer;');
          var t=document.createTextNode(match[0]);
          bodyTextElement.appendChild(t);    

          bodyTextElement.addEventListener("click",function(){
            var day = this.getAttribute("day");
            new_event_with_dates(day,9,2012);
          });
          
          v.appendChild(bodyTextElement);
          continue;
          
          
          if (confirm("Add event on " + match[0]+ "?")) { 
            if(i!=3)
              new_event(match);
            else
              new_event(match,1,3,4);  
          }
        }
      }
        
      top();

    });
  }
};

function new_event(match,day_index=1,month_index=2,year_index=3){
  var newItem = createEvent();
  var aMsgHdr=gFolderDisplay.selectedMessage;
  var aItem=newItem;

  aItem.calendar = getSelectedCalendar();
  aItem.title = aMsgHdr.mime2DecodedSubject;
  cal.setDefaultStartEndHour(aItem);
  
  aItem.startDate.second=0;
  aItem.startDate.minute=0;
  aItem.startDate.hour=16;
  aItem.startDate.day=match[day_index];

  aItem.startDate.month=months[match[month_index]]-1;
  
  aItem.startDate.year=match[year_index];

  aItem.endDate = aItem.startDate.clone();
  aItem.endDate.hour += 1;
  createEventWithDialog(null, null, null, null, aItem);
}

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
  aItem.startDate.month=month;
  aItem.startDate.year=year;

  aItem.endDate = aItem.startDate.clone();
  aItem.endDate.hour += 1;
  createEventWithDialog(null, null, null, null, aItem); 
}
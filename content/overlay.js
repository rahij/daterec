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
    // The first way of examining it is through the MimeMessage representation
    MsgHdrToMimeMessage(msgHdr, null, function (aMsgHdr, aMimeMsg) {
      var message_body=(aMimeMsg.coerceBodyToPlaintext());
      var regex=new Array(
        /(\d+)\/(\d+)\/(\d+)/,
        /(\d+)-(\S+)-(\d+)/,
        /(\d+) (\S+) (\d+)/
      );
      
      var num_dates=0;
      for(var i=0;i<regex.length;++i){
        var match=regex[i].exec(message_body);  
        if(match==null || !(match[2] in months))
          continue;
        ++num_dates
        if (confirm("Add event on " + match[0]+ "?")) { 
          test(match);  
        }
        else
          continue;
      }
      if(num_dates==0)
        alert("Sorry! No dates detected in this email");
      top();

    });
  }

}

function test(match){
  var newItem = createEvent();
  var aMsgHdr=gFolderDisplay.selectedMessage;
  var aItem=newItem;

  aItem.calendar = getSelectedCalendar();
  aItem.title = aMsgHdr.mime2DecodedSubject;
  cal.setDefaultStartEndHour(aItem);
  
  aItem.startDate.second=0;
  aItem.startDate.minute=0;
  aItem.startDate.hour=16;
  aItem.startDate.day=match[1];

  aItem.startDate.month=months[match[2]]-1;
  
  aItem.startDate.year=match[3];

  aItem.endDate = aItem.startDate.clone();
  aItem.endDate.hour += 1;
  createEventWithDialog(null, null, null, null, newItem);
}

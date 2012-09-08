Components.utils.import("resource:///modules/gloda/index_msg.js");
Components.utils.import("resource:///modules/gloda/mimemsg.js");
// This is Thunderbird 3.3 only!
Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("resource://gre/modules/NetUtil.jsm");

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
        var regex=/(\d+)\/(\d+)\/(\d+)/;
        var match=regex.exec(message_body);
        //alert(match[1]+"th" + match[2]+","+match[3]);
        alert(match[0]);
      top();

    });
  }
}


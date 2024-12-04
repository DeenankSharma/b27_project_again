let data=null;
let audioBlob=null;
let arrayBuffer=null;
chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
    if(message.type==="GFG_CONTENT_EXTRACTED"||message.type==="MDN_CONTENT_EXTRACTED"){
        data=message.data
        console.log("Message received in background script: ",message);

    }else if(message.type==='GET_DATA'){
        sendResponse({data:data});
    }
    return true;
})

chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
    if(message.type==="AUDIO"){
        arrayBuffer = new Uint8Array(message.data).buffer;
        audioBlob = new Blob([arrayBuffer], { type: message.mimeType });
        console.log("Audio blob: ",audioBlob)
        // const audio=new Audio(audioUrl);
        // console.log("Audio: ",audio);
    }else if(message.type==="GET_AUDIO"){
        sendResponse({data:audioBlob});
    }
})

chrome.runtime.onConnect.addListener((port)=>{
    if(port.name==="popup"){
        console.log("Popup opened");
        port.onDisconnect.addListener(()=>{
            chrome.tabs.query({
                active:true,currentWindow:true
            },(tabs)=>{
                if(tabs[0].id){
                    chrome.scripting.executeScript({
                        target:{tabId:tabs[0].id},
                        function:()=>{
                            document.body.style.opacity="1";
                        }
                    })
                }
            })
        })
    }
})
import { NextRequest, NextResponse } from "next/server";
import { URLSearchParams } from "url";
//import { getServerSideConfig } from "../../config/server";

//const serverConfig = getServerSideConfig();

export async function POST(req: NextRequest) {
  //var estringa = JSON.parse(e.postData.contents);

  //var string = await req.json.toString()
  //var estringa = JSON.parse(string)
  // req.text().then((text)=>{
  //   console.log(text)
  // })
  var estringa = await req.json();
  console.log(estringa);

  // var estringa = req.json;
  var p = identificar(estringa);

  var payload = JSON.parse(JSON.stringify(p));
  var url =
    "https://api.telegram.org/bot6161094203:AAEEYcmYROYUxZLBHNr1PeSRvZi8nwddHks/?" +
    Object.keys(payload)
      .map((key) => `${key}=${encodeURIComponent(payload[key])}`)
      .join("&");
  console.log(url);
  return fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  });
}
function identifier1(e: any) {
  return {
    param1: "1",
  };
}
function identificar(e: any) {
  if (e.message.text) {
    return {
      method: "sendMessage",
      chat_id: e.message.chat.id.toString(),
      text: e.message.text,
    };
  } else if (e.message.sticker) {
    return {
      method: "sendSticker",
      chat_id: e.message.chat.id.toString(),
      sticker: e.message.sticker.file_id,
    };
  } else if (e.message.photo) {
    var array = e.message.photo;
    var text = array[1];
    return {
      method: "sendPhoto",
      chat_id: e.message.chat.id.toString(),
      photo: text.file_id,
    };
  } else if (e.message.voice) {
    return {
      method: "sendVoice",
      chat_id: e.message.chat.id.toString(),
      voice: e.message.voice.file_id,
    };
  } else {
    return {
      method: "sendMessage",
      chat_id: e.message.chat.id.toString(),
      text: "Try other stuff",
    };
  }
}

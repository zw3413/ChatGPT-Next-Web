import { NextRequest, NextResponse } from "next/server";

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
  var payload = identificar(estringa);

  var data = {
    method: "post",
    payload: payload,
  };
  console.log(data);
  // var result =  await (await fetch("https://api.telegram.org/bot6161094203:AAEEYcmYROYUxZLBHNr1PeSRvZi8nwddHks/", data)).json();
  // console.log(result)
  // return NextResponse.json({
  //   "result":"ok"
  // })
  return fetch(
    "https://api.telegram.org/bot6161094203:AAEEYcmYROYUxZLBHNr1PeSRvZi8nwddHks/",
    data,
  );
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

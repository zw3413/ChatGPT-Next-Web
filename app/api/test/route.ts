import { NextRequest, NextResponse } from "next/server";
import { getServerSideConfig } from "../../config/server";
import { getFileUrlFromTelegramById } from "../tele-bot/telegramApi";
import { convertOgaToWav } from "../tele-bot/ffmpegApi";
const serverConfig = getServerSideConfig();
const telegram_url =
  "https://api.telegram.org/bot" + serverConfig.botToken + "/";

export async function POST(req: NextRequest) {
  const estringa = await req.json();
  console.log(estringa);
  const fileUrl = await getFileUrlFromTelegramById(
    estringa.message.voice.file_id,
  );
  const wavUrl = await convertOgaToWav(fileUrl);
  return NextResponse.json({
    fileUrl: fileUrl,
  });
  //   return new Promise<string>((resolve,reject)=>{
  //     resolve(fileUrl);
  //   })
  // return fetch(url, {
  //   method: "POST", // *GET, POST, PUT, DELETE, etc.
  //   mode: "cors", // no-cors, *cors, same-origin
  //   cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
  //   credentials: "same-origin", // include, *same-origin, omit
  //   headers: {
  //     "Content-Type": "application/json",
  //     // 'Content-Type': 'application/x-www-form-urlencoded',
  //   },
  //   redirect: "follow", // manual, *follow, error
  //   referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  // });
}

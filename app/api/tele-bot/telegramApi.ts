import { getServerSideConfig } from "../../config/server";
import HttpsProxyAgent from "https-proxy-agent";
import fetch from "node-fetch";

const serverConfig = getServerSideConfig();
const telegram_url =
  "https://api.telegram.org/bot" + serverConfig.botToken + "/";
const telegram_file_url =
  "https://api.telegram.org/file/bot" + serverConfig.botToken + "/";
const url_getFileById = telegram_url + "?method=getFile&file_id=";

export async function getFileUrlFromTelegramById(fileid: string) {
  const url = url_getFileById + fileid;
  console.log(url);
  try {
    const options: any = {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      //mode: "cors", // no-cors, *cors, same-origin
      //cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      //credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      //redirect: "follow", // manual, *follow, error
      //referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    };

    if (process.env.NODE_ENV == "development") {
      const proxyAgent = new HttpsProxyAgent("http://127.0.0.1:7890");
      options["agent"] = proxyAgent;
    }
    let response = await fetch(url, options);
    let data = (await response.json()) as any;
    console.log(data);
    if (data.ok) {
      const file_path = data.result.file_path;
      const url_getFile = telegram_file_url + file_path;
      return url_getFile;
    } else {
      return "error";
    }
  } catch (err) {
    console.log(err);
    return "exception: fetchOgaUrlFailed";
  }
}

import { getServerSideConfig } from "../../config/server";

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
    let response = await fetch(url, {
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
    });
    let data = await response.json();
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

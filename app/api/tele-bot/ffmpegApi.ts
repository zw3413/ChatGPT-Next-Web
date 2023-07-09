import * as fs from "fs";
import * as path from "path";
// import FormData from "form-data"
import { NextRequest, NextResponse } from "next/server";
import { URLSearchParams } from "url";
import { getServerSideConfig } from "../../config/server";

const convertOgaToWavUrl =
  "http://48xxagxl8lwe.ngrok.xiaomiqiu123.top/convert/audio/to/wav";

export async function convertOgaToWav(ogaUrl: string) {
  fetch(ogaUrl).then((response) => {
    debugger;
    console.log(response);
  });
}

import * as fs from "fs";
import * as path from "path";
// import FormData from "form-data"
import { NextRequest, NextResponse } from "next/server";
import { URLSearchParams } from "url";
import { getServerSideConfig } from "../../config/server";

const convertOgaToWavUrl =
  "http://48xxagxl8lwe.ngrok.xiaomiqiu123.top/convert/audio/to/wav";

export async function convertOgaToWav(ogaUrl: string) {
  try {
    console.log("start to fetch " + ogaUrl);
    const response = await fetch(ogaUrl);
    console.log(response);
  } catch (err) {
    console.log("exception:");
    console.log(err);
  }
  return "nothing";
}

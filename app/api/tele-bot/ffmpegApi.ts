import * as fs from "fs";
import * as path from "path";
import HttpsProxyAgent from "https-proxy-agent";
import fetch from "node-fetch";
import FormData from "form-data";
import { NextRequest, NextResponse } from "next/server";
import { URLSearchParams } from "url";
import { getServerSideConfig } from "../../config/server";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import filePushStream from "./filePushStream";
import { settings } from "./settings";
import Readable from "node:stream";

import { Configuration, OpenAIApi } from "openai";

const serverConfig = getServerSideConfig();

const convertOgaToWavUrl =
  "http://48xxagxl8lwe.ngrok.xiaomiqiu123.top/convert/audio/to/wav";

export async function convertOgaToWav(ogaUrl: string) {
  try {
    console.log("start to fetch " + ogaUrl);
    const options: any = {
      method: "GET",
      headers: {
        "Accept-Type": "audio/ogg",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    if (process.env.NODE_ENV == "development") {
      const proxyAgent = new HttpsProxyAgent("http://127.0.0.1:7890");
      options["agent"] = proxyAgent;
    }
    const response = await fetch(ogaUrl, options);
    const ogaBody = await response.body;
    console.log("the ogaBody");
    console.log(ogaBody);
    console.log("start to fetch " + convertOgaToWavUrl);

    //const newfile = new Blob([ogaBody], {type: "audio/ogg"});
    const formData = new FormData();
    formData.append("file", ogaBody, {
      filename: "file_1.oga",
      contentType: "audio/ogg",
    }); //{ filename :"file_1.oga", Content-Type: "audio/ogg" })

    const options1: any = {
      method: "POST",
      // headers: {
      //   "Accept-Type": "*",
      //   "Content-Type": "multipart/form-data; audio/oga"
      // },
      Headers: formData.getHeaders(),
      body: formData,
    };
    if (process.env.NODE_ENV == "development") {
      const proxyAgent = new HttpsProxyAgent("http://127.0.0.1:8888");
      options1["agent"] = proxyAgent;
    }
    const resp2 = await fetch(convertOgaToWavUrl, options1);
    console.log(resp2);
    const body2 = await resp2.body;
    // save the body2 into memory temp file

    //将wav送往 azure API 转成文字
    const fs = require("fs");
    var path = __dirname + "/uploadaudio.oga";
    const writeStream = fs.createWriteStream(path);
    if (!body2) {
      console.log("body2 is invalid!");
    }
    body2?.pipe(writeStream).on("finish", async () => {
      console.log("DONE");
      var audioStream = filePushStream.openPushStream(path);
      var audioConfig = sdk.AudioConfig.fromStreamInput(audioStream);
      var speechConfig = sdk.SpeechConfig.fromSubscription(
        settings.subscriptionKey as string,
        settings.serviceRegion as string,
      );
      speechConfig.speechRecognitionLanguage = settings.language;
      var reco = new sdk.SpeechRecognizer(speechConfig, audioConfig);
      // reco.recognizing = function (s, e) {
      //   var str = "(recognizing) Reason: " + sdk.ResultReason[e.result.reason] + " Text: " + e.result.text;
      //   console.log(str);
      // };
      reco.recognized = async function (s, e) {
        // Indicates that recognizable speech was not detected, and that recognition is done.
        if (e.result.reason === sdk.ResultReason.NoMatch) {
          var noMatchDetail = sdk.NoMatchDetails.fromResult(e.result);
          console.log(
            "\r\n(recognized)  Reason: " +
              sdk.ResultReason[e.result.reason] +
              " NoMatchReason: " +
              sdk.NoMatchReason[noMatchDetail.reason],
          );
        } else {
          console.log(
            "\r\n(recognized)  Reason: " +
              sdk.ResultReason[e.result.reason] +
              " Text: " +
              e.result.text,
          );

          //send the e.result.text to chatgpt api
          const openai = new OpenAIApi(
            new Configuration({
              apiKey: process.env.OPENAI_API_KEY,
            }),
          );
          const res = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: e.result.text }],
          });
          console.log(res?.data?.choices[0]?.message?.content);
        }
      };
      reco.canceled = function (s, e) {
        var str = "(cancel) Reason: " + sdk.CancellationReason[e.reason];
        if (e.reason === sdk.CancellationReason.Error) {
          str += ": " + e.errorDetails;
        }
        console.log(str);
      };

      // Signals that a new session has started with the speech service
      reco.sessionStarted = function (s, e) {
        var str = "(sessionStarted) SessionId: " + e.sessionId;
        console.log(str);
      };

      // Signals the end of a session with the speech service.
      reco.sessionStopped = function (s, e) {
        var str = "(sessionStopped) SessionId: " + e.sessionId;
        console.log(str);
      };

      // Signals that the speech service has started to detect speech.
      reco.speechStartDetected = function (s, e) {
        var str = "(speechStartDetected) SessionId: " + e.sessionId;
        console.log(str);
      };

      // Signals that the speech service has detected that speech has stopped.
      reco.speechEndDetected = function (s, e) {
        var str = "(speechEndDetected) SessionId: " + e.sessionId;
        console.log(str);
      };

      // start the recognizer and wait for a result.
      reco.recognizeOnceAsync(
        function (result) {
          reco.close();
          //reco = undefined;
        },
        function (err) {
          reco.close();
          //reco = undefined;
        },
      );
    });

    return "success";
  } catch (err) {
    console.log("exception:");
    console.log(err);
  }
  return "nothing";
}

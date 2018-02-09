import 'source-map-support/register';
import dalamb from 'dalamb';
import {Polly, S3} from 'aws-sdk';

import {AlexaSkillRequest, AlexaSkillResponse} from '../lib/types';
import {uirouIntro, uirou} from '../lib/uirou';
import {exampleSpeeches, languageCodeMap} from '../lib/languages';

const bucket = process.env['BUCKET']!;
const region = process.env['AWS_REGION']!;

export default dalamb<AlexaSkillRequest, AlexaSkillResponse>(async event => {
  const polly = new Polly();
  const s3    = new S3();

  const response: AlexaSkillResponse = {
    version: '1.0',

    response: {
      shouldEndSession: false,
      outputSpeech: {
        type: 'SSML',
        text: '',
      },
    },
  };

  switch (event.request.type) {
    case 'LaunchRequest': {
      response.response.outputSpeech.ssml! = '<speak>はい</speak>';
    } break;

    case 'IntentRequest': {
      switch (event.request.intent.name) {
        case 'ReadByYourself': {
          response.response.shouldEndSession = true;
          response.response.outputSpeech.ssml! = `<speak>${uirouIntro}</speak>`;
        } break;

        case 'ReadAllByYourself': {
          response.response.shouldEndSession = true;
          response.response.outputSpeech.ssml! = `<speak>${uirou}</speak>`;
        } break;

        case 'CallMizuki': {
          response.response.shouldEndSession = true;
          response.response.outputSpeech.ssml! = '<speak>ミズキさん、お願いします</speak>';

          const uploadedUrl = await uploadSpeach(polly, s3, `<speak><prosody volume="+2.1dB">${uirouIntro}</prosody></speak>`, 'Mizuki');

          response.response.directives = [{
            type:         'AudioPlayer.Play',
            playBehavior: 'REPLACE_ENQUEUED',

            audioItem: {
              stream: {
                url:                  uploadedUrl,
                token:                uploadedUrl,
                offsetInMilliseconds: 0,
              },
            },
          }];
        } break;

        case 'CallTakumi': {
          response.response.shouldEndSession = true;
          response.response.outputSpeech.ssml! = '<speak>タクミさん、お願いします</speak>';

          const uploadedUrl = await uploadSpeach(polly, s3, `<speak><prosody volume="+2.1dB">${uirouIntro}</prosody></speak>`, 'Takumi');

          response.response.directives = [{
            type:         'AudioPlayer.Play',
            playBehavior: 'REPLACE_ENQUEUED',

            audioItem: {
              stream: {
                url:                  uploadedUrl,
                token:                uploadedUrl,
                offsetInMilliseconds: 0,
              },
            },
          }];
        } break;

        case 'CallEveryone': {
          response.response.shouldEndSession = true;
          response.response.outputSpeech.ssml! = `<speak><prosody volume="x-loud" pitch="high">ポリー！　全員集合！</prosody></speak>`;

          const describeVoicesOutput = await polly.describeVoices().promise();

          const audioStreams = await Promise.all(describeVoicesOutput.Voices!.map(async (voice, index) => {
            await sleep(100 * index);

            const text = exampleSpeeches[languageCodeMap[voice.LanguageCode!]]!.replace('$NAME', voice.Name!);

            const synthesizeSpeechOutput = await polly.synthesizeSpeech({
              OutputFormat: 'mp3',
              TextType:     'ssml',
              Text:         `<speak><prosody volume="+2.1dB">${text}</prosody><break time="100ms"/></speak>`,
              VoiceId:      voice.Id!,
            }).promise();

            return synthesizeSpeechOutput.AudioStream!;
          }));

          const merged = Buffer.concat(audioStreams as Buffer[]);

          const objectName = `${Date.now()}.pollyFamily.mp3`;

          await s3.putObject({
            Bucket:      bucket,
            Key:         objectName,
            Body:        merged,
            ContentType: 'audio/mp3',
          }).promise();

          const uploadedUrl = `https://s3-${region}.amazonaws.com/${bucket}/${objectName}`;

          response.response.directives = [{
            type:         'AudioPlayer.Play',
            playBehavior: 'REPLACE_ENQUEUED',

            audioItem: {
              stream: {
                url:                  uploadedUrl,
                token:                uploadedUrl,
                offsetInMilliseconds: 0,
              },
            },
          }];
        } break;

        case 'AMAZON.StopIntent': {
          response.response.shouldEndSession = true;
          response.response.outputSpeech.ssml! = '<speak>バイバイ</speak>';

          response.response.directives = [{
            type: 'AudioPlayer.Stop',
          }];
        } break;
      }
    } break;
  }

  return response;
});

async function uploadSpeach(polly: Polly, s3: S3, ssmlText: string, voiceId: string): Promise<string> {
  const objectName = `${Date.now()}.${voiceId}.mp3`;

  const synthesizeSpeechOutput = await polly.synthesizeSpeech({
    OutputFormat: 'mp3',
    TextType:     'ssml',
    Text:         ssmlText,
    VoiceId:      voiceId,
  }).promise();

  await s3.putObject({
    Bucket:      bucket,
    Key:         objectName,
    Body:        synthesizeSpeechOutput.AudioStream,
    ContentType: synthesizeSpeechOutput.ContentType,
  }).promise();

  return `https://s3-${region}.amazonaws.com/${bucket}/${objectName}`;
}

async function sleep(duration: number): Promise<void> {
  await new Promise(r => setTimeout(r, duration));
}

'use strict';

const AWS = require('aws-sdk');

const polly = new AWS.Polly();

/**
 * Sends text to Polly and returns result
 * @param text
 * @returns {Promise<Polly.Types.SynthesizeSpeechOutput>}
 */
module.exports = (text) => {
  const params = {
    OutputFormat: 'mp3',
    Text: text,
    // VoiceId: 'Geraint | Gwyneth | Mads | Naja
    // | Hans | Marlene | Nicole | Russell | Amy
    // | Brian | Emma | Raveena | Ivy | Joanna | Joey
    // | Justin | Kendra | Kimberly | Salli | Conchita
    // | Enrique | Miguel | Penelope | Chantal | Celine
    // | Mathieu | Dora | Karl | Carla | Giorgio | Mizuki
    // | Liv | Lotte | Ruben | Ewa | Jacek | Jan | Maja
    // | Ricardo | Vitoria | Cristiano | Ines | Carmen
    // | Maxim | Tatyana | Astrid | Filiz'
    VoiceId: 'Brian',
    // LexiconNames: [
    //   'STRING_VALUE',
    //   /* more items */
    // ],
    // SampleRate: 'STRING_VALUE',
    TextType: 'text',
  };
  return polly.synthesizeSpeech(params).promise();
};

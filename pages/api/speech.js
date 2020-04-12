import nextConnect from 'next-connect';

const fs = require('fs');
const speech = require('@google-cloud/speech');
const linear16 = require('linear16');

const client = new speech.SpeechClient();
const handler = nextConnect();

const config = {
    encoding: 'LINEAR16',
    languageCode: 'en-US',
    sampleRateHertz: 16000,
};

async function getTranscript(audioFile) {
    const linear16Path = await linear16(audioFile, './output.wav');
    const audio = fs.readFileSync(linear16Path);
    const speechReq = {
        audio: {
            content: audio,
        },
        config,
    };

    console.log(speechReq);
    const [response] = await client.recognize(speechReq).catch(console.error);
    console.log(response)
    const transcription = response.results
          .map(result => result.alternatives[0].transcript)
          .join('\n');

    return transcription;
}

handler.post(async (req, res) => {
    const audioFile = '/Users/ivoreyes/Downloads/new-recording.ogg';
    try {
        const transcription = await getTranscript(audioFile);
        console.log(`Transcription: ${transcription}`);
        return res.status(201).json({text: transcription});
    } catch (e) {
        return res.status(500);
    }
});

export default handler;

import nextConnect from 'next-connect';

const fs = require('fs');
const speech = require('@google-cloud/speech');

const client = new speech.SpeechClient();
const handler = nextConnect();

const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 22257,
    languageCode: 'en-US',
};

async function getTranscript(audio) {
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
    const audioFile = '/Users/ivoreyes/Downloads/taunt.wav';
    const file = fs.readFileSync(audioFile).toString('base64');
    try {
        const transcription = await getTranscript(file);
        console.log(`Transcription: ${transcription}`);
        return res.status(201).json({text: transcription});
    } catch (e) {
        return res.status(500);
    }
});

export default handler;

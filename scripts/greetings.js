const {Polly} = require('aws-sdk');
const polly = new Polly();

polly.describeVoices().promise().then(describeVoicesOutput => {
  const languageCodes = Object.keys(describeVoicesOutput.Voices.reduce((acc, v) => {
    return {...acc, [v.LanguageCode]: true};
  }, {}));

  languageCodes.sort();

  console.log(languageCodes);
});

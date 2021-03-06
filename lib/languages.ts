export function getSpeechText(languageCode: string): string | undefined {
  const language: string | undefined = languageCodeMap[languageCode];
  return language ? speecheTexts[language] : undefined;
}

const languageCodeMap: Record<string, string> = {
  'cy-GB':     'Welsh',
  'da-DK':     'Danish',
  'de-DE':     'German',
  'en-AU':     'English',
  'en-GB':     'English',
  'en-GB-WLS': 'English',
  'en-IN':     'English',
  'en-US':     'English',
  'es-ES':     'Spanish',
  'es-US':     'Spanish',
  'fr-CA':     'French',
  'fr-FR':     'French',
  'is-IS':     'Icelandic',
  'it-IT':     'Italian',
  'ja-JP':     'Japanese',
  'ko-KR':     'Korean',
  'nb-NO':     'Norwegian',
  'nl-NL':     'Dutch',
  'pl-PL':     'Polish',
  'pt-BR':     'Portuguese',
  'pt-PT':     'Portuguese',
  'ro-RO':     'Romanian',
  'ru-RU':     'Russian',
  'sv-SE':     'Swedish',
  'tr-TR':     'Turkish',
};

const speecheTexts: Record<string, string> = {
  'Welsh':      'Helo, dwi\'n $NAME. Rwy\'n siarad Cymraeg.',
  'Danish':     'Hej, jeg er $NAME. Jeg taler dansk.',
  'German':     'Hallo, ich bin $NAME. Ich spreche Dänisch.',
  'English':    'Hello, I\'m $NAME. I speak English.',
  'Spanish':    'Hola, soy $NAME. Yo hablo español.',
  'French':     'Bonjour, je suis $NAME. Je parle français.',
  'Icelandic':  'Halló, ég er $NAME. Ég tala íslensku.',
  'Italian':    'Ciao, sono $NAME. Io parlo italiano.',
  'Japanese':   'こんにちは、私は$NAMEです。私は日本語を話します',
  'Korean':     '안녕하세요, 저는 $NAME입니다. 나는 한국어를한다.',
  'Norwegian':  'Hei, jeg er $NAME. Jeg snakker norsk.',
  'Dutch':      'Hallo, ik ben $NAME. Ik spreek Nederlands.',
  'Polish':     'Cześć, jestem $NAME. Ja mówie po polsku.',
  'Portuguese': 'Olá, eu sou $NAME. Eu falo português.',
  'Romanian':   'Bună, sunt $NAME. Vorbesc romaneste.',
  'Russian':    'Привет, я $NAME. Я говорю по-русски.',
  'Swedish':    'Hej jag är $NAME. Jag pratar svenska.',
  'Turkish':    'Merhaba, ben $NAME. Ben Türkçe konuşuyorum.',
};

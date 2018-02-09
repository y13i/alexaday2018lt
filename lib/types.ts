interface LaunchRequest {
  type: 'LaunchRequest';
  requestId: string;
  timestamp: string;
  locale: string;
}

interface IntentRequest {
  type: 'IntentRequest';
  requestId: string;
  timestamp: string;
  dialogState: string;
  locale: string;

  intent: {
    name: string;
    confirmationStatus: string;

    slots: {
      [slotName: string]: {
        name: string;
        value: string;
        confirmationStatus: string;

        resolutions: {
          resolutionsPerAuthority: {
            authority: string;

            status: {
              code: string;
            };

            values: {
              value: {
                name: string;
                id: string
              };
            }[];
          }[];
        };
      };
    };
  };
}

export interface AlexaSkillRequest {
  version: string;

  session: {
    new: boolean;
    sessionId: string;

    application: {
      applicationId: string;
    };

    attributes: Record<string, any>;

    user: {
      userId: string;

      permissions: {
        consentToken: string;
      };

      accessToken: string;
    }
  };

  context: {
    System: {
      application: {
        applicationId: string;
      };

      user: {
        userId: string;
        accessToken: string;

        permissions: {
          consentToken: string;
        };
      };

      device: {
        deviceId: string;

        supportedInterfaces: {
          AudioPlayer: Record<string, any>;
        };
      };

      apiEndpoint: string;
    };

    AudioPlayer: {
      token: string;
      offsetInMilliseconds: number;
      playerActivity: string;
    };
  };

  request: LaunchRequest | IntentRequest;
}

interface Speech {
  type: string;
  text?: string;
  ssml?: string;
}

export interface AlexaSkillResponse {
  version: '1.0';
  sessionAttributes?: Record<string, any>;

  response: {
    shouldEndSession: boolean;
    outputSpeech: Speech;

    reprompt?: {
      outputSpeech: Speech;
    };

    directives?: {
      type: string;
      playBehavior?: string;
      audioItem?: {
        stream: {
          token: string;
          url: string;
          offsetInMilliseconds: number;
        };
      };
    }[];
  };
}

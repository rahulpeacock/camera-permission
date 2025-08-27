export type PermissionQueryErrorType = 'INVALID_STATE_ERROR' | 'TYPE_ERROR' | 'UNKNOWN';

export type PermissionQueryError =
  | {
      isError: false;
    }
  | {
      isError: true;
      type: PermissionQueryErrorType;
    };

export type MediaStreamErrorType =
  | 'ABORT_ERROR'
  | 'INVALID_STATE_ERROR'
  | 'NOT_ALLOWED_ERROR'
  | 'NOT_FOUND_ERROR'
  | 'NOT_READABLE_ERROR'
  | 'OVER_CONSTRAINED_ERROR'
  | 'SECURITY_ERROR'
  | 'TYPE_ERROR'
  | 'UNKNOWN';
export type PermissionErrorType = 'INVALID_STATE_ERROR' | 'TYPE_ERROR' | 'UNKNOWN';
export type MediaRecorderErrorType = 'INVALID_MODIFICATION_ERROR' | 'SECURITY_ERROR' | 'UNKNOWN';
export type MediaTrackErrorType = 'NO_TRACKS_FOUND' | 'TRACK_DISABLED' | 'TRACK_ENDED' | 'TRACK_MUTED';

export type PermissionError =
  | {
      isError: false;
    }
  | {
      isError: true;
      type: PermissionErrorType;
    };

export type MediaStreamError =
  | {
      isError: false;
    }
  | {
      isError: true;
      type: MediaStreamErrorType;
    };

export type TMediaRecorderError =
  | {
      isError: false;
    }
  | {
      isError: true;
      type: MediaRecorderErrorType;
    };

export type MediaTrackError =
  | {
      isError: false;
    }
  | {
      isError: true;
      type: MediaTrackErrorType;
    };

export type AudioEnumerateDevicesErrorType = {
  type: 'FAILED_TO_GET_DEVICES';
};

export type FileWithUrl = File & { url: string };
export type RecordingStatus = 'TO-RECORD' | 'RECORDING' | 'RECORDED';

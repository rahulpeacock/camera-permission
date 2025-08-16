export type PermissionQueryErrorType = 'INVALID_STATE_ERROR' | 'TYPE_ERROR' | 'UNKNOWN';

export type PermissionQueryError =
  | {
      isError: false;
    }
  | {
      isError: true;
      type: PermissionQueryErrorType;
    };

export type PermissionErrorType =
  | 'ABORT_ERROR'
  | 'INVALID_STATE_ERROR'
  | 'NOT_ALLOWED_ERROR'
  | 'NOT_FOUND_ERROR'
  | 'NOT_READABLE_ERROR'
  | 'OVER_CONSTRAINED_ERROR'
  | 'SECURITY_ERROR'
  | 'TYPE_ERROR'
  | 'UNKNOWN';

export type PermissionError =
  | {
      isError: false;
    }
  | {
      isError: true;
      type: PermissionErrorType;
    };

export type AudioEnumerateDevicesErrorType = {
  type: 'FAILED_TO_GET_DEVICES';
};

export type FileWithUrl = File & { url: string };
export type RecordingStatus = 'TO-RECORD' | 'RECORDING' | 'RECORDED';

import { getBrowserName } from '@/lib/utils';

export const convertToWav = async (audioBlob: Blob) => {
  const audioContext = new AudioContext();
  const audioBuffer = await audioContext.decodeAudioData(await audioBlob.arrayBuffer());

  const numOfChannels = 1;
  const length = audioBuffer.length * numOfChannels * 2;
  const buffer = new ArrayBuffer(44 + length);
  const view = new DataView(buffer);
  const sampleRate = audioBuffer.sampleRate;
  let offset = 0;
  let pos = 0;

  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + length, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numOfChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2 * numOfChannels, true);
  view.setUint16(32, numOfChannels * 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, length, true);

  const monoData = new Float32Array(audioBuffer.length);
  for (let i = 0; i < audioBuffer.length; i++) {
    let sum = 0;
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      sum += audioBuffer.getChannelData(channel)[i];
    }
    monoData[i] = sum / audioBuffer.numberOfChannels;
  }

  offset = 44;
  while (pos < audioBuffer.length) {
    let sample = Math.max(-1, Math.min(1, monoData[pos]));
    sample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
    view.setInt16(offset, sample, true);
    offset += 2;
    pos++;
  }

  return new Blob([buffer], { type: 'audio/wav' });
};

export const downloadFile = (url: string, filename: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const getDuration = (totalSeconds: number) => {
  const seconds = Math.floor(totalSeconds % 60);
  const minutes = Math.floor((totalSeconds / 60) % 60);
  const hours = Math.floor(totalSeconds / 3600);

  if (hours > 0) {
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
  return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export const getChangeMicrophonePermissionLink = () => {
  const browserName = getBrowserName();

  if (browserName === 'Chrome') {
    return 'https://support.google.com/chrome/answer/114662';
  }
  if (browserName === 'Firefox') {
    return 'https://support.mozilla.org/en-US/kb/how-manage-your-camera-and-microphone-permissions';
  }
  if (browserName === 'Safari') {
    return 'https://support.apple.com/en-in/guide/safari/ibrwe2159f50/mac';
  }
  if (browserName === 'Edge') {
    return 'https://learn.microsoft.com/en-us/answers/questions/2374559/microsoft-edge-microphone';
  }
  return 'https://support.google.com/chrome/answer/3200662?hl=en';
};

export const convertToWav = (audioBuffer: AudioBuffer) => {
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

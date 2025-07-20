import React from 'react';

export function MicrophoneGranted() {
  const [streamLoading, setStreamLoading] = React.useState(true);

  React.useEffect(() => {
    async function getMicrophoneStream() {
      try {
        const _localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (err) {
        console.log('Error: ', err);
      } finally {
        setStreamLoading(false);
      }
    }
    getMicrophoneStream();
  }, []);

  return (
    <div>
      <p>Microphone granted</p>
    </div>
  );
}

export function MicrophoneDenied() {
  return (
    <div className='min-h-screen flex items-center justify-center text-center'>
      <div>
        <h2 className='text-xl font-semibold'>The application tried to access your microphone, but it was blocked</h2>
        <p className='text-sm max-w-[800px] mt-1.5'>
          This error occurs when the browser does not have permission to access the microphone, due to user denial. Don't worry, this is a common
          issue and can be easily fixed by granting the necessary permissions. To resolve this, please check your browser's settings to ensure
          microphone access is allowed for this site. You can also click the "Allow" button if prompted by your browser when attempting to use the
          microphone.
        </p>
      </div>
    </div>
  );
}

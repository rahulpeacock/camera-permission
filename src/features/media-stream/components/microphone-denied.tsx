export function MicrophoneDenied() {
  return (
    <div className='min-h-screen flex items-center justify-center text-center'>
      <div>
        <div className='p-8 rounded-3xl bg-neutral-100'>
          <h2 className='text-2xl/normal font-semibold'>
            Application attempted to access your microphone,
            <br />
            but the request was denied
          </h2>
          <p className='max-w-[800px] mt-1.5'>Please check your browser settings and try again.</p>
        </div>
      </div>
    </div>
  );
}

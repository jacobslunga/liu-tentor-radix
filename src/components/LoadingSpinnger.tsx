export default function LoadingSpinner() {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        className='w-12 h-12 stroke-foreground/30 dark:stroke-foreground/70 animate-spinEase'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <rect width='18' height='18' x='3' y='3' rx='2' />
        <path d='M7 7v10' />
        <path d='M11 7v10' />
        <path d='m15 7 2 10' />
      </svg>
    </div>
  );
}

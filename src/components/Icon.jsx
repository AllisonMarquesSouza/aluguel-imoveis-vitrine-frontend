const iconPaths = {
  pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  arrow: <><path d="M4 12h15" /><path d="m13 5 7 7-7 7" /></>,
  chevron: <path d="m7 10 5 5 5-5" />,
  bed: <><path d="M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7" /><path d="M3 14h18M5 9V6h5a3 3 0 0 1 3 3" /><path d="M3 18v2m18-2v2" /></>,
  bath: <><path d="M4 12h16v3a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-3Z" /><path d="M6 12V6a2 2 0 0 1 4 0" /><path d="M7 20v2m10-2v2" /></>,
  car: <><path d="m5 11 1.5-5h11L19 11" /><path d="M3 11h18v7H3z" /><circle cx="7" cy="18" r="1.5" /><circle cx="17" cy="18" r="1.5" /></>,
  area: <><path d="M4 4h6v6H4zM14 14h6v6h-6z" /><path d="M10 7h4v4m0-4-4 4m0 6h-4v-4m0 4 4-4" /></>,
  heart: <path d="M20.8 8.8c0 5.2-8.8 10.2-8.8 10.2S3.2 14 3.2 8.8a4.6 4.6 0 0 1 8.8-1.6 4.6 4.6 0 0 1 8.8 1.6Z" />,
  whatsapp: <><path d="M20.5 11.8a8.2 8.2 0 0 1-12.2 7.1l-4.1 1.1 1.1-4A8.2 8.2 0 1 1 20.5 11.8Z" /><path d="M8.5 8.4c.3-.7.6-.7 1-.7h.4c.2 0 .4.1.5.4l.7 1.7c.1.3.1.5-.1.7l-.5.6c-.2.2-.2.4 0 .7.3.5.9 1.2 1.6 1.6.3.2.5.2.7-.1l.6-.7c.2-.2.4-.3.7-.2l1.7.8c.3.1.4.3.4.5 0 .2 0 .9-.5 1.3-.4.4-1.1.6-1.8.5-.7-.1-1.6-.5-2.8-1.5-1.5-1.3-2.5-2.8-2.8-3.7-.3-.9 0-1.5.2-1.9Z" /></>,
  close: <><path d="m6 6 12 12M18 6 6 18" /></>,
  home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v12h14V9M9 21v-7h6v7" /></>,
  building: <><path d="M4 21V5l8-2v18M12 9h8v12M2 21h20" /><path d="M7 7h2m-2 4h2m-2 4h2m8-3h1m-1 4h1" /></>,
  phone: <><path d="M7 3h10v18H7z" /><path d="M10 6h4M11 18h2" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
  menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
}

export default function Icon({ name, size = 20, className = '' }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {iconPaths[name] || iconPaths.home}
    </svg>
  )
}

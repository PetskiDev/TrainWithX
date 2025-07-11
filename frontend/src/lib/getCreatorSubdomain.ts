const RESERVED = new Set(['www', 'api', 'static', 'admin']);

export function getCreatorSubdomain(): string | null {
  const host = window.location.host; // port is never included here
  console.log(host);

  // Example: host = "pet.trainwithx.com", BASE_DOMAIN = "trainwithx.com"
  const suffix = `.${import.meta.env.VITE_BASE_DOMAIN}`; // ".trainwithx.com"

  // Host must end with ".<base>" and have something in front of it
  if (!host.endsWith(suffix) || host.length <= suffix.length + 1) return null;

  // Everything before the suffix is the candidate slug
  const slug = host.slice(0, -suffix.length).toLowerCase(); // "pet"
  return RESERVED.has(slug) ? null : slug;
}

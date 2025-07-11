export function goToCreator({
  subdomain,
  path = '/',
}: {
  subdomain: string;
  path?: string;
}) {
  const { protocol } = window.location;
  const base = import.meta.env.VITE_BASE_DOMAIN!;

  const url = `${protocol}//${subdomain}.${base}${path}`;
  window.location.assign(url);
}

export const goPublic = (path: string = '/'): void => {
  const { protocol } = window.location;
  const base = import.meta.env.VITE_BASE_DOMAIN!;
  console.log(protocol);
  const url = `${protocol}//${base}${path}`;
  window.location.assign(url);
};

import { storeAvatar } from '@src/features/users/user.service.js';

interface Args {
  userId: number;
  url: string;
}

export async function downloadImageAsMulter({ url }: { url: string }) {
  const res = await fetch(url);

  if (!res.ok) throw new Error(`Failed to download image (${res.status})`);

  const contentType = res.headers.get('content-type') ?? '';
  const buffer = Buffer.from(await res.arrayBuffer());

  // Only the fields used inside uploadAvatar
  const fakeFile = {
    buffer,
    mimetype: contentType,
  } as unknown as Express.Multer.File;

  return fakeFile;
}


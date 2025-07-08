import { uploadAvatar } from '@src/features/users/user.service';

interface Args {
  userId: number;
  url: string;
}

export async function downloadAndStoreAvatar({ userId, url }: Args) {
  console.log('FETCHIN GOOGLE');
  const res = await fetch(url);
  console.log('ENDED GOOGLE');

  if (!res.ok) throw new Error(`Failed to download image (${res.status})`);

  const contentType = res.headers.get('content-type') ?? '';
  const buffer = Buffer.from(await res.arrayBuffer());

  // Only the fields used inside uploadAvatar
  const fakeFile = {
    buffer,
    mimetype: contentType,
  } as unknown as Express.Multer.File;

  return uploadAvatar(userId, fakeFile); // returns the relative path
}

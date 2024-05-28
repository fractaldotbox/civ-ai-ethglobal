import { execa } from 'execa';
import type { NextApiRequest, NextApiResponse } from 'next';
import { NextURL } from 'next/dist/server/web/next-url';
import path from 'path';

export const parseResult = (output: string) => {
  const regex = /cat \/tmp\/coophive\/data\/downloaded-files\/(.*?)\/stdout/g;
  const match = regex.exec(output);
  return match ? match[1] : null;
};

export async function GET(req: any) {
  const { nextUrl } = req;

  const n = nextUrl.searchParams.get('n') || 100;
  console.log('find prime n=', n);

  const hash = '20f361';
  const command = `/usr/local/bin/hive run github.com/debuggingfuture/primesieve:${hash} -i n=${n}`;

  // --pricing-instruction-price 1
  // const command = '/usr/local/bin/hive';
  const pathname = path.join(process.cwd(), '../../');
  console.log('pathname', pathname);
  const { stdout } = await execa({
    cwd: pathname,
    // required otherwise not found
    shell: true,
    extendEnv: true,
    preferLocal: false,
  })`${command}`;
  // Print command's output
  console.log(stdout);

  const resultId = parseResult(stdout);

  const { stdout: output } = await execa('cat', [
    '/tmp/coophive/data/downloaded-files/' + resultId + '/stdout',
  ]);

  console.log('result', {
    resultId,
    output,
  });

  return new Response(
    JSON.stringify({
      resultId,
      output: output.split('\n'),
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    },
  );
}

export async function POST(req: any) {
  return new Response('Method Not Allowed', { status: 405 });
}

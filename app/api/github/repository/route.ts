import { NextRequest, NextResponse } from 'next/server';
import { fetchGitHubRepo } from '@/lib/github/githubService';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json({ error: 'URL query parameter is required' }, { status: 400 });
    }

    const details = await fetchGitHubRepo(url);
    return NextResponse.json({ repository: details });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

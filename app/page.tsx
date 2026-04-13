import { redirect } from 'next/navigation';

// 루트(/) 접속 시 바로 대시보드로 이동
export default function RootPage() {
  redirect('/dashboard');
}

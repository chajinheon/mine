import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '학생 출석 통계 대시보드',
  description: '전체 학생의 출석 데이터를 시각화합니다.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

# 야옹아멍멍해바 프론트엔드

크리스마스에 공개되는 익명 선물 편지 냥트리의 React 프론트엔드입니다.

## 실행

1. `.env.example`을 참고해 프로젝트 루트에 `.env.local`을 만듭니다.

```env
VITE_API_BASE_URL=http://localhost:8080
```

2. 의존성을 설치하고 개발 서버를 실행합니다.

```bash
npm install
npm run dev
```

기본 주소는 `http://localhost:5173`입니다.

## 주요 경로

- `/`: 서비스 소개
- `/create`: 트리 생성
- `/tree/:slug`: 친구가 편지를 다는 공개 트리
- `/my-tree/:slug`: 관리 키를 가진 트리 주인 화면

관리 키는 트리 생성 직후 브라우저의 `localStorage`에 저장됩니다. 다른 기기에서는 발급된 관리 링크가 필요합니다.

## 검증 명령

```bash
npm run lint
npm run build
```

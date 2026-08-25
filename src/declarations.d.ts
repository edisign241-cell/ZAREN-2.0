declare module 'canvas-confetti';
declare module 'lucide-react';
declare module 'drizzle-orm/pg-core';
declare module 'drizzle-orm';

declare module 'next' {
  export interface Metadata {
    title?: string;
    description?: string;
    manifest?: string;
    openGraph?: Record<string, any>;
    [key: string]: any;
  }
  export interface Viewport {
    width?: string;
    initialScale?: number;
    maximumScale?: number;
    userScalable?: boolean;
    themeColor?: string;
    [key: string]: any;
  }
}

declare module 'next/link' {
  import React from 'react';
  const Link: React.FC<any>;
  export default Link;
}

declare module 'next/navigation' {
  export function useRouter(): {
    push: (href: string) => void;
    replace: (href: string) => void;
    back: () => void;
    forward: () => void;
    refresh: () => void;
    prefetch: (href: string) => void;
  };
  export function usePathname(): string;
  export function useParams(): Record<string, string | string[]>;
  export function useSearchParams(): URLSearchParams;
}

declare module 'next/server' {
  export class NextResponse extends Response {
    static json(data: any, init?: ResponseInit): NextResponse;
    static redirect(url: string | URL, status?: number): NextResponse;
    static next(): NextResponse;
  }
  export interface NextRequest extends Request {}
}

declare module 'next/font/google' {
  export function Inter(options?: any): { className: string; style: Record<string, any> };
}

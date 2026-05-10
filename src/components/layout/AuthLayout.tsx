interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-dvh max-w-[430px] mx-auto bg-white flex flex-col">
      {children}
    </div>
  );
}

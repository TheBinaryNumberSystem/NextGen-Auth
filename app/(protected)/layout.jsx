export const dynamic = "force-dynamic";

import { Navbar } from "./_components/navbar";

const ProtectedLayout = ({ children }) => {
  return (
    <div className="auth-gradient-bg min-h-screen w-full flex flex-col gap-y-8 items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10 flex flex-col items-center gap-y-8 w-full max-w-2xl">
        <Navbar />
        {children}
      </div>
    </div>
  );
};

export default ProtectedLayout;

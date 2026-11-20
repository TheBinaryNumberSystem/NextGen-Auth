const AuthLayout = ({ children }) => {
  return (
    <div className="auth-gradient-bg flex items-center justify-center p-4 min-h-screen relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;

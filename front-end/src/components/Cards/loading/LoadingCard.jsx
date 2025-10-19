export default function LoadingCard({ children }) {
  return (
    <div className="min-h-screen bg-[#0e1525] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl bg-[#1e2a47] shadow-2xl p-6 border border-[#2e3b5e]">
        {/* Loading Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span className="text-white text-lg font-semibold">
            Loading...
          </span>
        </div>

        {/* Children */}
        <div className="text-white/70">{children}</div>
      </div>
    </div>
  );
}

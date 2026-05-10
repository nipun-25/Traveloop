export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#050a19] relative overflow-hidden flex items-center justify-center p-6">
      {/* Cinematic Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center scale-110 blur-sm opacity-40"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1600&q=80)' }}
      />
      <div className="absolute inset-0 z-[1] bg-gradient-to-br from-[#050a19] via-[#050a19]/80 to-transparent" />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 bg-gradient-to-br from-[#f5a623] to-[#e8621a] rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 mb-4">
            <span className="text-2xl font-bold text-white">T</span>
          </div>
          <span className="text-2xl font-bold tracking-[0.3em] text-white font-display">TRAVELOOP</span>
        </div>
        {children}
      </div>
    </div>
  );
}

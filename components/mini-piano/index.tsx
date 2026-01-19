export function MiniPianoDecoration({
  className = "",
}: {
  className?: string;
}) {
  const keys = [
    { white: true },
    { white: false },
    { white: true },
    { white: false },
    { white: true },
    { white: true },
    { white: false },
    { white: true },
    { white: false },
    { white: true },
    { white: false },
    { white: true },
  ];

  return (
    <div className={`flex ${className}`}>
      {keys.map((key, i) => (
        <div
          key={i}
          className={`${
            key.white
              ? "w-4 h-8 bg-white border border-stone-200 rounded-b"
              : "w-2.5 h-5 bg-stone-700 rounded-b -mx-1.5 z-10"
          }`}
        />
      ))}
    </div>
  );
}

import Link from "next/link";

export default async function NotFound() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-5 xl:px-0">
      <h2
        className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-5xl md:leading-[5rem]"
        style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
      >
        Page Not Found
      </h2>
      <Link
        href={"/"}
        replace
        className="mt-2 rounded-md bg-black px-4 py-2 text-white"
      >
        {"Return Home"}
      </Link>
    </div>
  );
}

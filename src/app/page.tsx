import Image from "next/image";
import MaxWidthWrapper from "./components/MaxWidthWrapper";

export default function Home() {
  return (
    <MaxWidthWrapper>
      <div className='py-20 mx-auto text-center flex flex-col items-center max-w-3xl'>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-900">
          Make efficient piano practice easy.
        </h1>
        <p className="mt-6 text-lg max-w-prose text-muted-foreground">
          Keep your practice focused and become a better pianist faster using PianoPlanner.
        </p>
      </div>
    </MaxWidthWrapper>
  );
}

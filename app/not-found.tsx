import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 Not Found",
};

export default function NotFound() {
  return (
    <div className="py-16 w-full min-h-screen flex justify-center items-center">
      <div className="mx-auto max-w-xl lg:max-w-4xl flex flex-col lg:flex-row">
        <div className="relative px-5 lg:border-r-2 border-gray-100 dark:border-gray-600">
          <p className="absolute -top-2 left-10 md:left-20 text-base md:text-4xl text-indigo-600 font-bold uppercase">
            Error
          </p>
          <p className="text-7xl md:text-10xl text-gray-700 dark:text-gray-300 font-extrabold tracking-wider">
            404
          </p>
        </div>

        <div className="px-5">
          <p className="text-3xl md:text-5xl text-gray-700 dark:text-gray-300 font-bold tracking-wide">
            Page Not Found
          </p>
          <p className="mt-4 text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium">
            The content you’re looking for doesn’t exist. Either it was removed, or you mistyped the
            link. <br />
            <br />
            Sorry about that! Please visit our homepage to get where you need to go.
          </p>
          <Link
            href="/"
            className="mt-10 relative inline-flex items-center px-7 py-3.5 rounded border border-transparent bg-indigo-600 md:text-lg text-white font-medium hover:bg-indigo-700"
          >
            Go back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

import { authViewPaths } from "@daveyplate/better-auth-ui/server";
import { AuthView } from "./view";

export function generateStaticParams() {
  return Object.values(authViewPaths).map((pathname) => ({ pathname }));
}

export default async function AuthPage({
  params,
}: {
  params: Promise<{ pathname: string }>;
}) {
  const { pathname } = await params;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row">
        {/* Left Section: Branding/Marketing */}
        <div className="w-full lg:w-1/2 bg-slate-900 text-white p-8 lg:p-16 flex flex-col justify-center">
          <div className="mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Transform Your Knowledge Into Income
            </h1>

            <p className="text-xl mb-8 text-slate-300">
              Create, host, and sell engaging online workshops with Edushop.
              Your expertise deserves to be shared—and valued.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 text-slate-900"
                  >
                    <path
                      fillRule="evenodd"
                      d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-lg text-white">
                    Simple Workshop Setup
                  </h3>
                  <p className="text-slate-300">
                    Pick a date, time and price. We handle the rest.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 text-slate-900"
                  >
                    <path
                      fillRule="evenodd"
                      d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-lg text-white">
                    Instant Payment Processing
                  </h3>
                  <p className="text-slate-300">
                    Get paid securely through our integrated platform.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 text-slate-900"
                  >
                    <path
                      fillRule="evenodd"
                      d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-lg text-white">
                    Built-in Video Conferencing
                  </h3>
                  <p className="text-slate-300">
                    No external tools needed. Host directly in Edushop.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Auth Component */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white dark:bg-slate-800">
          <div className="w-full">
            <AuthView pathname={pathname} />
          </div>
        </div>
      </div>
    </div>
  );
}

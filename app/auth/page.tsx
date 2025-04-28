import SignIn from "@/components/sign-in";
import { CheckCircle } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full bg-gray-50 dark:bg-zinc-900 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-zinc-800">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="p-12 flex flex-col justify-center">
            <h1 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Sign in to Edushop
            </h1>
            <p className="text-lg text-gray-600 dark:text-zinc-300 mb-10">
              Edushop is a platform for creating and selling online workshops
              and live courses.
            </p>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-zinc-300 flex items-center">
                <CheckCircle className="mr-3 h-5 w-5 text-gray-900 dark:text-white" />{" "}
                Create engaging workshops
              </p>
              <p className="text-gray-600 dark:text-zinc-300 flex items-center">
                <CheckCircle className="mr-3 h-5 w-5 text-gray-900 dark:text-white" />{" "}
                Get paid through Stripe
              </p>
              <p className="text-gray-600 dark:text-zinc-300 flex items-center">
                <CheckCircle className="mr-3 h-5 w-5 text-gray-900 dark:text-white" />{" "}
                Earn from your expertise
              </p>
            </div>
          </div>
          <div className="bg-gray-100 dark:bg-zinc-950 p-12 rounded-r-xl border-l border-gray-200 dark:border-zinc-800 flex items-center justify-center">
            <div className="w-full max-w-md">
              <SignIn />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

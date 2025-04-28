import SignIn from "@/components/sign-in";
import { CheckCircle } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-slate-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full bg-slate-800/30 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-slate-700/50">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="text-white p-12 flex flex-col justify-center relative">
            <div className="absolute -z-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl top-1/2 -translate-y-1/2 -left-48"></div>
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-600">
              Sign in to Edushop
            </h1>
            <p className="text-xl text-slate-300 mb-10">
              Edushop is a platform for creating and selling online workshops
              and live courses.
            </p>
            <div className="space-y-4">
              <p className="text-slate-300 flex items-center">
                <CheckCircle className="mr-3 text-purple-400" /> Create engaging
                workshops
              </p>
              <p className="text-slate-300 flex items-center">
                <CheckCircle className="mr-3 text-purple-400" /> Get paid
                through Stripe
              </p>
              <p className="text-slate-300 flex items-center">
                <CheckCircle className="mr-3 text-purple-400" /> Earn from your
                expertise
              </p>
            </div>
          </div>
          <div className="bg-slate-900 p-12 rounded-r-xl border-l border-slate-700/50 flex items-center justify-center">
            <div className="w-full">
              <SignIn />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

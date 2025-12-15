import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: 'bg-emerald-500 hover:bg-emerald-600 text-black',
            card: 'bg-zinc-900 border border-white/10',
            headerTitle: 'text-white',
            headerSubtitle: 'text-zinc-400',
            formFieldLabel: 'text-zinc-300',
            formFieldInput: 'bg-black border-white/10 text-white',
          }
        }}
      />
    </div>
  );
}
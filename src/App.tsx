import { FaucetForm } from "./components/app/faucet-form";

function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <div></div>

      <div className="mx-auto md:w-[800px]">
        <FaucetForm />
      </div>

      <div></div>
    </main>
  );
}

export default App;

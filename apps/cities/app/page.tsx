import { ClientSetup } from "./components/ClientSetup";
import { CitiesSearch } from "./components/CitiesSearch";
export default async function Home() {

  return (
    <ClientSetup>
      <main className="flex min-h-screen h-full flex-col items-center justify-center bg-white px-4 py-24 dark:bg-gray-900 flex flex-col justify-center items-center p-6">
        <div className="w-full dark:text-white w-full max-w-xl p-8 mx-auto h-full gap-4">
          <CitiesSearch />
        </div>
      </main>
    </ClientSetup>
  );
}

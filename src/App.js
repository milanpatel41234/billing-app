import { Toaster } from "react-hot-toast";
import AllRoutes from "./components/pages/Routes";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

function App() {
  const queryClient = new QueryClient()
  
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <AllRoutes />
    </QueryClientProvider>
  );
}

export default App;

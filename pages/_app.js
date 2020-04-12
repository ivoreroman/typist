import "../styles.css";
import { SWRConfig } from "swr";
import fetcher from "../lib/fetcher";

export default function MyApp({ Component, pageProps }) {
  return (
    <SWRConfig value={{ refreshInterval: 1000, fetcher }}>
      <Component {...pageProps} />
    </SWRConfig>
  );
}

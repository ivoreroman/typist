import Link from "next/link";

const HomePage = () => (
  <>
    <h1>Typist</h1>
    <h2>Transcripts for your online meetings</h2>
    <div>
      <Link href="/document">
        <a>Create a Transcript Document</a>
      </Link>
    </div>
  </>
);

export default HomePage;

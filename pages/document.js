import useSWR from "swr";
const fetcher = (url) => fetch(url).then((r) => r.json());

const DocumentPage = () => {
  const { data: fetchedDoc, error } = useSWR("/api/documents");

  if (error) return <div>failed to load</div>;
  if (!fetchedDoc) return <div>loading...</div>;

  return (
    <>
      <heading>
        <h1>Transcript for meeting {fetchedDoc.id}</h1>
        <em className="pulled-right">{fetchedDoc.createdAt}</em>
      </heading>
      <div>
        <code>{fetchedDoc.doc}</code>
      </div>

      <form>
        <input type="submit" value="Upload Audio" />
      </form>
    </>
  );
};

export default DocumentPage;

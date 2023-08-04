import { useEffect, useState } from "react";

const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwZmI3MmQ3Mi0zYTFmLTQ5NDUtYTcyYy1lMTIxNzMwN2I1MWUiLCJlbWFpbCI6InJheXlhbmFudWdlcmFoMjAwMUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiNzY3OTdhNzdiNmUxZmRkNGQ3MmIiLCJzY29wZWRLZXlTZWNyZXQiOiI3MDg2NTgzMDczODY3YjVlMjdlZmQ4YzE2MTVjNzQxMzFiOThiZTU2OTc0N2I4MDdjZTEzMzBjNzExMTBiZTMxIiwiaWF0IjoxNjgwMzMyMjA3fQ.OxHQa7tiyMkTwlfDI2mj1sRLHhqLZ5P5A4ePe2lBzdY"

const useImage = ({ hashFile }) => {
  const [fileUrl, setfileUrl] = useState("");

  const fetchImages = async () => {
    try {
    
      console.log(hashFile);
      setfileUrl(`https://gateway.pinata.cloud/ipfs/${hashFile}`);
    } catch (error) {
      setfileUrl(
        "https://metro.co.uk/wp-content/uploads/2015/05/pokemon_crying.gif?quality=90&strip=all&zoom=1&resize=500%2C284"
      );
    }
  };

  useEffect(() => {
    if (hashFile) fetchImages();
  }, [hashFile]);

  return fileUrl;
};
export default useImage;

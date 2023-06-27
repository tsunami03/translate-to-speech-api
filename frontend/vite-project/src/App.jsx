import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";

function App() {
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [audioFileURL, setAudioFileURL] = useState(null); //for storing the audio file
  const [loading, setLoading] = useState(false);
  const [audioloading, setAudioLoading] = useState(false);

  const handleClick = async (e) => {
    setAudioFileURL(null);
    e.preventDefault();
    setLoading(true);
    console.log(text);
    // setTranslatedText(text);
    setText("");

    const encodedParams = new URLSearchParams();
    encodedParams.set("q", text);
    encodedParams.set("target", "hi");
    encodedParams.set("source", "en");

    const options = {
      method: "POST",
      url: "https://google-translate1.p.rapidapi.com/language/translate/v2",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": "b34e38341bmsha0b2d27f8858d4ap131655jsn0fec0c8cd42f",
        "X-RapidAPI-Host": "google-translate1.p.rapidapi.com",
      },
      data: encodedParams,
    };

    try {
      const response = await axios.request(options);
      const textdata = response.data.data.translations[0].translatedText;
      setTranslatedText(textdata);
      //now the file download
      await downloadFile(textdata);
      console.log("download finished");
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const downloadFile = async (textdata) => {
    let data = JSON.stringify({
      text: textdata,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:5000/api/audio",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
      responseType: "arraybuffer",
    };

    async function makeRequest() {
      try {
        const response = await axios.request(config);
        console.log(response);
        const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
        const url = URL.createObjectURL(audioBlob);
        setAudioFileURL(url);
      } catch (error) {
        console.log(error);
      }
    }

    makeRequest();
  };

  return (
    <>
      <h2> English to Hindi Translator </h2>
      <form>
        <input
          className="text-input"
          placeholder="Enter your text here"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="submit-button" onClick={handleClick}>
          Translate
        </button>
      </form>

      {!loading ? (
        <>
          <div className="translated-text"> {translatedText} </div>
        </>
      ) : (
        <div className="translated-text"> Loading... </div>
      )}
      {audioFileURL ? (
        <div className="action-buttons">
          <audio className="audio-box" src={audioFileURL} controls />
          <a href={audioFileURL} download="translated_audio.mp3">
            <button className="download-button"> Download MP3 </button>
          </a>
        </div>
      ) : (
        translatedText && (
          <div className="audio-loading"> Audio Loading... </div>
        )
      )}
    </>
  );
}

export default App;

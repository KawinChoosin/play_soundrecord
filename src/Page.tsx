import React, { useEffect, useRef, useState } from "react";
import {
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Box,
  FormControl,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import AudioWaveformCanvas from "./AudioWaveformCanvas";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";

const languageOptions = [
  { value: "af-ZA", label: "Afrikaans (South Africa)" },
  { value: "ar-AE", label: "Arabic (U.A.E.)" },
  { value: "ar-SA", label: "Arabic (Saudi Arabia)" },
  { value: "ar-EG", label: "Arabic (Egypt)" },
  { value: "ar-JO", label: "Arabic (Jordan)" },
  { value: "ar-KW", label: "Arabic (Kuwait)" },
  { value: "ar-MA", label: "Arabic (Morocco)" },
  { value: "ar-OM", label: "Arabic (Oman)" },
  { value: "ar-QA", label: "Arabic (Qatar)" },
  { value: "ar-TN", label: "Arabic (Tunisia)" },
  { value: "ar-BH", label: "Arabic (Bahrain)" },
  { value: "bg-BG", label: "Bulgarian (Bulgaria)" },
  { value: "bn-IN", label: "Bengali (India)" },
  { value: "da-DK", label: "Danish (Denmark)" },
  { value: "de-CH", label: "German (Switzerland)" },
  { value: "de-DE", label: "German (Germany)" },
  { value: "el-GR", label: "Greek (Greece)" },
  { value: "en-AB", label: "English (Aboriginal)" },
  { value: "en-AU", label: "English (Australia)" },
  { value: "en-GB", label: "English (United Kingdom)" },
  { value: "en-IE", label: "English (Ireland)" },
  { value: "en-IN", label: "English (India)" },
  { value: "en-NZ", label: "English (New Zealand)" },
  { value: "en-US", label: "English (United States)" },
  { value: "en-WL", label: "English (Welsh)" },
  { value: "es-ES", label: "Spanish (Spain)" },
  { value: "es-US", label: "Spanish (United States)" },
  { value: "es-MX", label: "Spanish (Mexico)" },
  { value: "es-AR", label: "Spanish (Argentina)" },
  { value: "es-CL", label: "Spanish (Chile)" },
  { value: "es-CO", label: "Spanish (Colombia)" },
  { value: "es-PE", label: "Spanish (Peru)" },
  { value: "fa-IR", label: "Farsi (Iran)" },
  { value: "fi-FI", label: "Finnish (Finland)" },
  { value: "fr-CA", label: "French (Canada)" },
  { value: "fr-FR", label: "French (France)" },
  { value: "gu-IN", label: "Gujarati (India)" },
  { value: "he-IL", label: "Hebrew (Israel)" },
  { value: "hi-IN", label: "Hindi (India)" },
  { value: "hu-HU", label: "Hungarian (Hungary)" },
  { value: "id-ID", label: "Indonesian (Indonesia)" },
  { value: "it-IT", label: "Italian (Italy)" },
  { value: "ja-JP", label: "Japanese (Japan)" },
  { value: "jv-ID", label: "Javanese (Indonesia)" },
  { value: "ko-KR", label: "Korean (South Korea)" },
  { value: "lv-LV", label: "Latvian (Latvia)" },
  { value: "ml-IN", label: "Malayalam (India)" },
  { value: "mr-IN", label: "Marathi (India)" },
  { value: "ms-MY", label: "Malay (Malaysia)" },
  { value: "nl-NL", label: "Dutch (Netherlands)" },
  { value: "pa-IN", label: "Punjabi (India)" },
  { value: "pl-PL", label: "Polish (Poland)" },
  { value: "pt-BR", label: "Portuguese (Brazil)" },
  { value: "pt-PT", label: "Portuguese (Portugal)" },
  { value: "ro-RO", label: "Romanian (Romania)" },
  { value: "ru-RU", label: "Russian (Russia)" },
  { value: "sv-SE", label: "Swedish (Sweden)" },
  { value: "ta-IN", label: "Tamil (India)" },
  { value: "ta-LK", label: "Tamil (Sri Lanka)" },
  { value: "ta-MY", label: "Tamil (Malaysia)" },
  { value: "ta-SG", label: "Tamil (Singapore)" },
  { value: "te-IN", label: "Telugu (India)" },
  { value: "th-TH", label: "Thai (Thailand)" },
  { value: "tr-TR", label: "Turkish (Turkey)" },
  { value: "uk-UA", label: "Ukrainian (Ukraine)" },
  { value: "ur-IN", label: "Urdu (India)" },
  { value: "ur-PK", label: "Urdu (Pakistan)" },
  { value: "vi-VN", label: "Vietnamese (Vietnam)" },
  { value: "zh-CN", label: "Chinese, Mandarin (Simplified)" },
  { value: "zh-TW", label: "Chinese, Mandarin (Traditional)" },
];

function Page() {
  const mockInput =
    "สวัสดี สวัสดี สวัสดี Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consectetur, temporibus? Ipsum iusto quia incidunt saepe perspiciatis officia provident eligendi dolore, beatae necessitatibus. Aperiam ducimus hic fugiat sapiente quisquam vel, voluptas possimus cum sit odio illum culpa architecto! Numquam cum asperiores optio amet temporibus doloribus dignissimos dolor, veritatis, eius mollitia commodi, itaque aut consectetur eum impedit doloremque id harum nulla veniam provident! Rerum explicabo laboriosam architecto tempore esse deserunt libero deleniti, odio quisquam vitae voluptas illo assumenda dignissimos numquam repellat quam est at, tenetur, impedit labore pariatur. Aliquam dolorem debitis tenetur pariatur expedita reprehenderit vero quis ad veritatis minus, repellat animi?";
  const mockOutput = "hello hello hello";
  const [leftLang, setLeftLang] = useState("th-TH");
  const [rightLang, setRightLang] = useState("en-US");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isMaincomponent, setisMaincomponent] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isTranslatingSuccess, setIsTranslatingSuccess] = useState(false);
  const [isListeningSuccess, setIsListeningSuccess] = useState(false);

  const inputLang = languageOptions.find((lang) => lang.value === leftLang);
  const outputLang = languageOptions.find((lang) => lang.value === rightLang);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [soundOutput, setSoundOutput] = useState<HTMLAudioElement | null>(null);

  const [textinputrecord, setTextinputrecord] = useState<string>(mockInput);
  const [textoutputrecord, setTextoutputrecord] = useState<string>(mockOutput);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      setIsListeningSuccess(false);
      const newStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      setStream(newStream);
      setIsRecording(true);
      setisMaincomponent(false);
      setIsTranslatingSuccess(false);
      setIsTranslating(false);
      const mediaRecorder = new MediaRecorder(newStream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });

        // Optional: keep in state if UI needs it
        setAudioBlob(blob);

        const formData = new FormData();
        formData.append("audio", blob, "recording.webm");
        formData.append("language", leftLang);

        try {
          const response = await axios.post(
            `${import.meta.env.VITE_voicetotext_url}/voice`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log("Audio response:", response.data);
          if (response.data.status === "COMPLETED") {
            const textinput = response.data.results.transcripts[0].transcript;
            console.log("test textinput ",textinput);
            setTextinputrecord(textinput);
            setIsListeningSuccess(true);
            const translateData = new FormData();
            translateData.append("context", "");
            translateData.append("targetLanguage", rightLang);
            translateData.append("text", textinput);
            try {
              const response = await axios.post(
                `${import.meta.env.VITE_voicetotext_url}/translate`,
                {
                  context: "",
                  targetLanguage: rightLang,
                  text: textinput,
                },
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );

              setIsTranslatingSuccess(true);
              const translatedText = response.data.contents[0]?.text || "";
              // const translatedText = "test test test";
              setTextoutputrecord(translatedText);
              try {
                const ttsUrl = `${
                  import.meta.env.VITE_voicetotext_url
                }/tts/${rightLang}/?text=${encodeURIComponent(translatedText)}`;

                const ttsResponse = await axios.get(ttsUrl, {
                  responseType: "blob",
                });

                const audioBlob = new Blob([ttsResponse.data], {
                  type: "audio/mpeg",
                });
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);

                // Save sound to state

                setIsTranslatingSuccess(true);
                setSoundOutput(audio);
              } catch (error) {
                console.error("Error get sound:", error);
              }
            } catch (error) {
              console.error("Error translating audio:", error);
            }
          }

          // setTextinputrecord(mockinput);
        } catch (error) {
          console.error("Error sending audio:", error);
        }
      };

      mediaRecorder.start();
      // setIsListeningSuccess(false);
      setIsTranslating(false);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop(); // This will trigger the upload in onstop
    }

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setIsListeningSuccess(false);
    setIsRecording(false);
    setIsTranslating(true);
  };

  useEffect(() => {
    console.log(
      "isRecording ",
      isRecording,
      " stream ",
      stream,
      " isMaincomponent ",
      isMaincomponent,
      " isTranslating ",
      isTranslating,
      " isTranslatingSuccess ",
      isTranslatingSuccess,
      " isListeningSuccess ",
      isListeningSuccess
    );
  }, [
    isRecording,
    stream,
    isMaincomponent,
    isTranslating,
    soundOutput,
    isListeningSuccess,
    isTranslatingSuccess,
  ]);

  useEffect(() => {
    if (soundOutput) {
      soundOutput.play().catch((err) => {
        console.error("Playback error:", err);
      });
    }
  }, [soundOutput]);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          bgcolor: "#1b1d36",
        }}
      >
        {!isMaincomponent && (
          <ArrowBackIcon
            fontSize="large"
            sx={{ padding: 4, color: "#ffffff" }}
            onClick={() => {
              setIsRecording(false);
              setisMaincomponent(true);
            }}
          />
        )}
        {stream && !isMaincomponent && !isTranslating ? (
          <Box sx={{ height: "35%" }}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <AudioWaveformCanvas stream={stream} />
            </Box>
          </Box>
        ) : isMaincomponent ? (
          <CardMedia
            component="img"
            image="/play_icon.jpg"
            title="logo"
            sx={{ height: "40%", objectFit: "contain", mt: 4 }}
          />
        ) : null}
        {stream && !isMaincomponent ? (
          <CardContent
            sx={{
              height: isRecording ? "30%" : "70%",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",

              px: 2,
              gap: 4,
            }}
          >
            <Typography color="#fff" sx={{ mb: 0.5, fontWeight: "bold" }}>
              Voice Input&nbsp;&nbsp;:&nbsp;&nbsp;
              {inputLang ? inputLang.label : ""}
            </Typography>
            <Box
              sx={{
                display: "flex",
                bgcolor: "#15172b",
                border: "1px solid #2c2f4a",
                borderRadius: "20px",
                margin: "0 auto",
                width: "340px",
                height: "170px",
                justifyContent: "center",

                alignItems: "center",
                overflow: "hidden", // prevent overflow outside border
              }}
            >
              <Box
                sx={{
                  height: "80%",
                  width: "80%",
                  overflowY: "auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  padding: 2,
                }}
              >
                {!isListeningSuccess ? (
                  <Typography sx={{ color: "#ffffff" }}>
                    Listening...
                  </Typography>
                ) : (
                  <Typography sx={{ color: "#ffffff" }}>
                    {textinputrecord}
                  </Typography>
                )}
              </Box>
            </Box>

            {isTranslating && (
              <>
                {" "}
                <Typography color="#fff" sx={{ mb: 0.5, fontWeight: "bold" }}>
                  Voice Output&nbsp;&nbsp;:&nbsp;&nbsp;
                  {outputLang ? outputLang.label : ""}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    bgcolor: "#15172b",
                    border: "1px solid #2c2f4a",
                    borderRadius: "20px",
                    margin: "0 auto",
                    width: "340px",
                    height: "170px",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden", // prevent overflow outside border
                  }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      width: "100%",
                      overflowY: "auto",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      padding: 2,
                    }}
                  >
                    {!isTranslatingSuccess ? (
                      <Typography sx={{ color: "#ffffff" }}>
                        Translating...
                      </Typography>
                    ) : (
                      <>
                        <Typography sx={{ color: "#ffffff" }}>
                          {textoutputrecord}
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>
              </>
            )}
          </CardContent>
        ) : (
          <CardContent
            sx={{
              mt: 4,
              height: "20%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              px: 2,
              gap: 4,
            }}
          >
            <FormControl
              fullWidth
              sx={{ mx: "5%", borderRadius: 4 }}
              size="medium"
            >
              <Typography
                color="#fff"
                sx={{ mb: 0.5, ml: 2.5, fontWeight: "bold" }}
              >
                Voice Input
              </Typography>
              <Select
                labelId="left-select-label"
                value={leftLang}
                label="From"
                onChange={(e) => setLeftLang(e.target.value)}
                sx={{ borderRadius: 10, bgcolor: "#ffffff" }}
                MenuProps={{
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left",
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "left",
                  },
                  PaperProps: {
                    style: {
                      borderRadius: 10,
                      maxHeight: 300, // Enable scrolling
                    },
                  },
                }}
              >
                {languageOptions.map((lang) => (
                  <MenuItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              sx={{ mx: "5%", borderRadius: 4 }}
              size="medium"
            >
              <Typography
                color="#fff"
                sx={{ mb: 0.5, ml: 2.5, fontWeight: "bold" }}
              >
                Voice Output
              </Typography>
              <Select
                labelId="right-select-label"
                value={rightLang}
                label="From"
                onChange={(e) => setRightLang(e.target.value)}
                sx={{ borderRadius: 10, bgcolor: "#ffffff" }}
                MenuProps={{
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left",
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "left",
                  },
                  PaperProps: {
                    style: {
                      borderRadius: 10,
                      maxHeight: 200, // Enable scrolling
                    },
                  },
                }}
              >
                {languageOptions.map((lang) => (
                  <MenuItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </CardContent>
        )}
        {/* CardActions 30% */}
        <CardActions
          sx={{
            height: isMaincomponent ? "30%" : "35%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            sx={{
              borderRadius: "50%",
              width: 150,
              height: 150,
              minWidth: 0, // prevents MUI from enforcing default button width
              p: 0, // remove padding so icon is centered
              bgcolor: "#fa374a",
            }}
            onClick={async () => {
              if (isRecording) {
                stopRecording();
              } else {
                startRecording();
              }
            }}
          >
            {isRecording ? (
              <StopIcon fontSize="large" sx={{ width: "50%", height: "50%" }} />
            ) : (
              <MicIcon fontSize="large" sx={{ width: "50%", height: "50%" }} />
            )}
          </Button>
        </CardActions>
      </Box>
    </Box>
  );
}

export default Page;

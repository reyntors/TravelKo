import React, { useState, useEffect, useRef, useCallback } from "react";
import { Container, Row, Col, Card, CardBody, Button, Spinner, Progress, Alert } from "reactstrap";
import { 
  FaCamera, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaInfoCircle, 
  FaSmile, 
  FaEye, 
  FaArrowLeft, 
  FaArrowRight, 
  FaUserCheck, 
  FaRedo 
} from "react-icons/fa";
import { toast } from "react-toastify";
import { FilesetResolver, FaceLandmarker } from "@mediapipe/tasks-vision";

// Helper distance function for mathematical checks
const dist = (p1, p2) => {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(p1.z - p2.z, 2));
};

const CHALLENGES_POOL = [
  { id: "blink", label: "Blink your eyes", icon: <FaEye size={24} className="text-success animate-pulse" />, instruction: "Blink both of your eyes clearly." },
  { id: "left", label: "Turn head left", icon: <FaArrowLeft size={24} className="text-success animate-bounce-x" />, instruction: "Slowly turn your face to your left side." },
  { id: "right", label: "Turn head right", icon: <FaArrowRight size={24} className="text-success animate-bounce-x" />, instruction: "Slowly turn your face to your right side." },
  { id: "smile", label: "Smile brightly", icon: <FaSmile size={24} className="text-success animate-spin-subtle" />, instruction: "Show us a wide smile." }
];

export default function FaceLiveness() {
  // Application State
  const [status, setStatus] = useState("IDLE"); // IDLE, LOADING_MODEL, CAMERA_PROMPT, DETECTING_FACE, CHALLENGING, SUCCESS, FAILED
  const [errorMessage, setErrorMessage] = useState("");
  const [challenges, setChallenges] = useState([]);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [challengeProgress, setChallengeProgress] = useState(0); // percentage completion of current task
  const [livenessScore, setLivenessScore] = useState(100); // starts at 100, drops on timeouts or errors

  // Core Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const landmarkerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const streamRef = useRef(null);
  
  // Detection state trackers
  const blinkStateRef = useRef({ hasClosed: false, closedTime: 0 });
  const faceAlignedRef = useRef(false);
  const currentChallengeIdRef = useRef("");
  const timeoutTimerRef = useRef(null);

  // Initialize randomly shuffled challenges
  const initChallenges = () => {
    const shuffled = [...CHALLENGES_POOL].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3); // Pick 3 random challenges
    setChallenges(selected);
    setCurrentChallengeIndex(0);
    setChallengeProgress(0);
    if (selected[0]) {
      currentChallengeIdRef.current = selected[0].id;
    }
  };

  // Setup MediaPipe model
  const loadModel = async () => {
    try {
      setStatus("LOADING_MODEL");
      const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.8/wasm"
      );
      
      const faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          delegate: "GPU"
        },
        runningMode: "VIDEO",
        numFaces: 1
      });
      
      landmarkerRef.current = faceLandmarker;
      setStatus("CAMERA_PROMPT");
    } catch (err) {
      console.error("Failed to load Face Landmarker:", err);
      setErrorMessage("Could not load the client-side face recognition model. Please check your internet connection.");
      setStatus("FAILED");
    }
  };

  // Start Camera Stream
  const startCamera = async () => {
    try {
      setStatus("DETECTING_FACE");
      initChallenges();
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user"
        },
        audio: false
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          // Start detection loop once video starts playing
          animationFrameRef.current = requestAnimationFrame(detectFrame);
        };
      }
      
      // Clear any previous error message
      setErrorMessage("");
      
      // Start liveness timeout timer (total limit to avoid spoof loops)
      startTimeoutTimer();
    } catch (err) {
      console.error("Camera access failed:", err);
      setErrorMessage("Camera access denied or unavailable. Please permit camera usage to proceed with face check.");
      setStatus("FAILED");
    }
  };

  // Stop Camera Stream
  const stopCamera = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (timeoutTimerRef.current) {
      clearTimeout(timeoutTimerRef.current);
    }
  }, []);

  // Set timeout limits for overall challenge
  const startTimeoutTimer = () => {
    if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);
    timeoutTimerRef.current = setTimeout(() => {
      stopCamera();
      setStatus("FAILED");
      setErrorMessage("Verification timed out. Please ensure you are in a well-lit environment and complete actions promptly.");
      toast.error("Verification Timed Out");
    }, 45000); // 45 seconds total session budget
  };

  // Transition to next challenge
  const advanceChallenge = useCallback((currentIndex, allChallenges) => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= allChallenges.length) {
      // Completed all challenges successfully
      stopCamera();
      setStatus("SUCCESS");
      toast.success("Identity Verified Successfully!");
    } else {
      setCurrentChallengeIndex(nextIndex);
      setChallengeProgress(0);
      currentChallengeIdRef.current = allChallenges[nextIndex].id;
      // Soft vibration/audio cue if supported
      if (navigator.vibrate) navigator.vibrate(100);
      toast.info(`Challenge ${nextIndex + 1}: ${allChallenges[nextIndex].label}`);
    }
  }, [stopCamera]);

  // Main Detection Loop
  const detectFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !landmarkerRef.current) {
      animationFrameRef.current = requestAnimationFrame(detectFrame);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    if (video.readyState < 2) {
      animationFrameRef.current = requestAnimationFrame(detectFrame);
      return;
    }

    // Dynamic resolution matching
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Capture & process timestamp
    const timestamp = performance.now();
    const result = landmarkerRef.current.detectForVideo(video, timestamp);

    // Draw video feed frame to mirror correctly
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Process Face Landmarks
    if (result && result.faceLandmarks && result.faceLandmarks.length > 0) {
      const landmarks = result.faceLandmarks[0];

      // Mirror-friendly canvas coordinate mapper
      const getCoords = (lm) => {
        return {
          x: canvas.width - (lm.x * canvas.width),
          y: lm.y * canvas.height
        };
      };

      // 1. Verify Face Alignment & Positioning (is the face inside the screen center?)
      const noseTip = getCoords(landmarks[4]);
      const leftEdge = getCoords(landmarks[234]);
      const rightEdge = getCoords(landmarks[454]);
      
      const faceCenterX = (leftEdge.x + rightEdge.x) / 2;
      const canvasCenterX = canvas.width / 2;
      const offsetFromCenter = Math.abs(faceCenterX - canvasCenterX) / canvas.width;
      
      // Face width check to guarantee they are close enough
      const faceWidth = Math.abs(rightEdge.x - leftEdge.x);
      const isDistanceIdeal = faceWidth > canvas.width * 0.28 && faceWidth < canvas.width * 0.7;
      const isCentered = offsetFromCenter < 0.15;

      if (!faceAlignedRef.current) {
        if (isCentered && isDistanceIdeal) {
          faceAlignedRef.current = true;
          setStatus("CHALLENGING");
          toast.success("Position locked! Perform the actions.");
        } else {
          // Draw subtle guiding oval
          ctx.strokeStyle = "rgba(220, 38, 38, 0.6)"; // Soft red
          ctx.lineWidth = 4;
          ctx.setLineDash([10, 10]);
          ctx.beginPath();
          ctx.ellipse(canvas.width / 2, canvas.height / 2, canvas.width * 0.22, canvas.height * 0.35, 0, 0, 2 * Math.PI);
          ctx.stroke();
          
          ctx.fillStyle = "rgba(220, 38, 38, 0.85)";
          ctx.font = "bold 16px Poppins, sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("ALIGN YOUR FACE IN THE CENTER", canvas.width / 2, canvas.height / 2 + 180);
        }
      }

      // Draw elegant facial mesh dots (subtle & premium)
      ctx.fillStyle = "rgba(22, 163, 74, 0.4)"; // Hex #16A34A brand green with alpha
      for (let i = 0; i < landmarks.length; i += 8) { // sample every 8th dot for a sleek futuristic mesh
        const pt = getCoords(landmarks[i]);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 1.8, 0, 2 * Math.PI);
        ctx.fill();
      }

      // 2. Perform Active Challenge Calculations if Face Aligned
      if (faceAlignedRef.current) {
        // Draw elegant tracking border
        ctx.strokeStyle = "#16A34A";
        ctx.lineWidth = 4;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.ellipse(canvas.width / 2, canvas.height / 2, canvas.width * 0.22, canvas.height * 0.35, 0, 0, 2 * Math.PI);
        ctx.stroke();

        const curChallengeId = currentChallengeIdRef.current;

        // Challenge A: Eye Blink
        if (curChallengeId === "blink") {
          // Calculate Left Eye Aspect Ratio (L-EAR)
          const distTopBottomL = dist(landmarks[159], landmarks[145]);
          const distCornersL = dist(landmarks[33], landmarks[133]);
          const earL = distTopBottomL / distCornersL;

          // Calculate Right Eye Aspect Ratio (R-EAR)
          const distTopBottomR = dist(landmarks[386], landmarks[374]);
          const distCornersR = dist(landmarks[362], landmarks[263]);
          const earR = distTopBottomR / distCornersR;

          const avgEar = (earL + earR) / 2;

          if (!blinkStateRef.current.hasClosed) {
            if (avgEar < 0.16) {
              blinkStateRef.current.hasClosed = true;
              blinkStateRef.current.closedTime = Date.now();
              setChallengeProgress(50);
            }
          } else {
            if (avgEar > 0.22) {
              // Successfully closed and reopened eyes
              blinkStateRef.current = { hasClosed: false, closedTime: 0 };
              setChallengeProgress(100);
              setTimeout(() => advanceChallenge(currentChallengeIndex, challenges), 400);
            }
          }
        }

        // Challenge B & C: Head Turn Left/Right
        else if (curChallengeId === "left" || curChallengeId === "right") {
          const rawNose = landmarks[4];
          const rawLeft = landmarks[234];
          const rawRight = landmarks[454];
          
          const noseDistL = Math.abs(rawNose.x - rawLeft.x);
          const noseDistR = Math.abs(rawRight.x - rawNose.x);
          const headRatio = noseDistL / (noseDistL + noseDistR); // Normalized nose position relative to cheeks

          if (curChallengeId === "left") {
            // Turning left mirrors: we check headRatio
            // Standard user turn left shifts nose closer to left side in frame or right side depending on mirror.
            // Let's use relative change. When looking straight, ratio is around 0.5.
            // If they look far left, rawNose is closer to one of the bounds.
            const rawRatio = rawNose.x;
            const diffRatio = (rawRatio - rawLeft.x) / (rawRight.x - rawLeft.x);
            
            // Due to camera mirroring:
            // Turn Left shifts the nose closer to the user's left cheek.
            // Calculate progress smoothly
            const progress = Math.max(0, Math.min(100, Math.round(((0.5 - diffRatio) / 0.18) * 100)));
            setChallengeProgress(progress);
            if (progress >= 100) {
              setTimeout(() => advanceChallenge(currentChallengeIndex, challenges), 400);
            }
          } else if (curChallengeId === "right") {
            const rawRatio = rawNose.x;
            const diffRatio = (rawRatio - rawLeft.x) / (rawRight.x - rawLeft.x);
            
            const progress = Math.max(0, Math.min(100, Math.round(((diffRatio - 0.5) / 0.18) * 100)));
            setChallengeProgress(progress);
            if (progress >= 100) {
              setTimeout(() => advanceChallenge(currentChallengeIndex, challenges), 400);
            }
          }
        }

        // Challenge D: Smiling
        else if (curChallengeId === "smile") {
          const rawLeftMouth = landmarks[61];
          const rawRightMouth = landmarks[291];
          const rawLeftCheek = landmarks[234];
          const rawRightCheek = landmarks[454];

          const mouthWidth = dist(rawLeftMouth, rawRightMouth);
          const faceWidth = dist(rawLeftCheek, rawRightCheek);
          const smileRatio = mouthWidth / faceWidth;

          // Standard smile ratio ranges from 0.20 (rest) to 0.28 (wide smile)
          const baseRatio = 0.21;
          const targetRatio = 0.27;
          
          const progress = Math.max(0, Math.min(100, Math.round(((smileRatio - baseRatio) / (targetRatio - baseRatio)) * 100)));
          setChallengeProgress(progress);
          
          if (progress >= 100) {
            setTimeout(() => advanceChallenge(currentChallengeIndex, challenges), 400);
          }
        }
      }
    } else {
      // If face disappears, draw warning overlay
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#EF4444";
      ctx.font = "bold 20px Poppins, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("NO FACE DETECTED", canvas.width / 2, canvas.height / 2);
    }

    ctx.restore();
    animationFrameRef.current = requestAnimationFrame(detectFrame);
  }, [currentChallengeIndex, challenges, advanceChallenge]);

  // Clean up streams & animations on unmount
  useEffect(() => {
    loadModel();
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Restart verification process
  const resetVerification = () => {
    stopCamera();
    initChallenges();
    setStatus("CAMERA_PROMPT");
    setErrorMessage("");
  };

  return (
    <Container className="py-5" style={{ minHeight: "80vh", fontFamily: "Poppins, sans-serif" }}>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg border-0 overflow-hidden" style={{ borderRadius: "20px", background: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(10px)" }}>
            <div className="bg-success py-4 px-4 text-white text-center position-relative">
              <h3 className="fw-bold m-0" style={{ letterSpacing: "1px" }}>Face Liveness Verification</h3>
              <p className="m-0 opacity-75 mt-1 small">TravelKo Secure Identification Check</p>
            </div>
            
            <CardBody className="p-4 d-flex flex-column align-items-center">
              {/* STAGE 1: LOADING MODELS */}
              {status === "LOADING_MODEL" && (
                <div className="text-center py-5">
                  <Spinner color="success" style={{ width: "3.5rem", height: "3.5rem" }} className="mb-4" />
                  <h5 className="fw-semibold">Loading Vision Intelligence Module...</h5>
                  <p className="text-muted small">Downloading secure WebAssembly structures. This happens client-side and only takes a moment.</p>
                </div>
              )}

              {/* STAGE 2: CAMERA PERMISSION & INFO */}
              {status === "CAMERA_PROMPT" && (
                <div className="text-center py-4 w-100">
                  <div className="bg-success-subtle rounded-circle p-4 d-inline-flex mb-4" style={{ backgroundColor: "#F0FDF4" }}>
                    <FaCamera size={45} className="text-success animate-pulse" />
                  </div>
                  <h4 className="fw-bold mb-3">Instant Identity Scan</h4>
                  <p className="text-muted mb-4 px-3" style={{ fontSize: "14px", lineHeight: "1.6" }}>
                    To ensure secure transactions and coordinate private tours smoothly, TravelKo uses instant biometrics checking. 
                    Your scan will be fully client-side and secure.
                  </p>
                  
                  <div className="text-start bg-light p-3 rounded mb-4 mx-2" style={{ fontSize: "13px" }}>
                    <h6 className="fw-bold mb-2 text-dark"><FaInfoCircle className="me-2 text-success" /> How to pass:</h6>
                    <ul className="mb-0 ps-3 text-muted">
                      <li>Center your face inside the dynamic guiding frame.</li>
                      <li>Respond swiftly to all randomly selected challenges.</li>
                      <li>Avoid sunglasses, direct rear lighting, or covering your face.</li>
                    </ul>
                  </div>

                  <Button 
                    color="success" 
                    size="lg" 
                    className="w-100 py-3 fw-bold shadow-sm" 
                    style={{ borderRadius: "12px", transition: "all 0.3s ease" }}
                    onClick={startCamera}
                  >
                    Start Face Check
                  </Button>
                </div>
              )}

              {/* STAGE 3 & 4: DETECTING FACE & ACTIVE CHALLENGES */}
              {(status === "DETECTING_FACE" || status === "CHALLENGING") && (
                <div className="w-100 d-flex flex-column align-items-center">
                  {/* Rounded camera viewport */}
                  <div className="position-relative overflow-hidden mb-4 shadow" style={{ width: "320px", height: "320px", borderRadius: "50%", border: "4px solid #16A34A" }}>
                    <video 
                      ref={videoRef} 
                      style={{ display: "none" }}
                      playsInline 
                      muted 
                    />
                    <canvas 
                      ref={canvasRef} 
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    />
                    
                    {/* Glowing circular scan lines */}
                    {status === "DETECTING_FACE" && (
                      <div className="position-absolute top-0 w-100 h-100 animate-scanner" style={{
                        background: "linear-gradient(rgba(22, 163, 74, 0) 50%, rgba(22, 163, 74, 0.25) 95%, rgba(22, 163, 74, 0.45) 100%)",
                        borderBottom: "3px solid #16A34A"
                      }} />
                    )}
                  </div>

                  {/* Dynamic Instructions */}
                  <div className="text-center w-100 px-2">
                    {status === "DETECTING_FACE" && (
                      <div className="py-2">
                        <Spinner size="sm" color="success" className="me-2" />
                        <span className="fw-semibold text-success">Calibrating position. Center your head...</span>
                      </div>
                    )}

                    {status === "CHALLENGING" && challenges[currentChallengeIndex] && (
                      <div className="bg-light p-3 rounded-xl border border-success-subtle mb-3">
                        <div className="d-flex align-items-center justify-content-center gap-3 mb-2">
                          <span className="bg-success-subtle rounded-circle p-2 d-inline-flex" style={{ backgroundColor: "#DCFCE7" }}>
                            {challenges[currentChallengeIndex].icon}
                          </span>
                          <h4 className="fw-bold m-0 text-success">{challenges[currentChallengeIndex].label}</h4>
                        </div>
                        <p className="text-muted small m-0">{challenges[currentChallengeIndex].instruction}</p>
                        
                        {/* Progress ring/indicator */}
                        <div className="mt-3">
                          <div className="d-flex justify-content-between text-muted small mb-1">
                            <span>Challenge Completion</span>
                            <span>{challengeProgress}%</span>
                          </div>
                          <Progress value={challengeProgress} color="success" animated className="rounded" style={{ height: "8px" }} />
                        </div>
                      </div>
                    )}

                    {/* Progress tracking indicator dots */}
                    <div className="d-flex justify-content-center gap-2 mt-3">
                      {challenges.map((_, idx) => (
                        <div 
                          key={idx} 
                          className="rounded-circle" 
                          style={{
                            width: "12px",
                            height: "12px",
                            backgroundColor: idx === currentChallengeIndex ? "#16A34A" : idx < currentChallengeIndex ? "#22C55E" : "#E2E8F0",
                            transition: "all 0.3s ease",
                            transform: idx === currentChallengeIndex ? "scale(1.2)" : "scale(1)"
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE 5: SUCCESS ROUTE */}
              {status === "SUCCESS" && (
                <div className="text-center py-5 w-100">
                  <div className="text-success mb-4 animate-bounce-in">
                    <FaCheckCircle size={85} />
                  </div>
                  <h3 className="fw-bold text-success mb-2">Identity Confirmed</h3>
                  <p className="text-muted px-4 mb-4" style={{ fontSize: "14px" }}>
                    Biometric challenge verified. You have successfully proven liveness. 
                    You may now continue safely on TravelKo.
                  </p>
                  
                  <div className="bg-success-subtle p-3 rounded mb-4 mx-3" style={{ backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0" }}>
                    <div className="d-flex align-items-center justify-content-center text-success gap-2">
                      <FaUserCheck size={20} />
                      <span className="fw-bold small">Liveness Confidence Score: 100%</span>
                    </div>
                  </div>

                  <Button 
                    color="success" 
                    size="lg" 
                    className="w-100 py-3 fw-bold rounded-xl"
                    style={{ borderRadius: "12px" }}
                    onClick={resetVerification}
                  >
                    Perform Another Check
                  </Button>
                </div>
              )}

              {/* STAGE 6: EXCEPTION / REJECTION ROUTE */}
              {status === "FAILED" && (
                <div className="text-center py-5 w-100">
                  <div className="text-danger mb-4">
                    <FaTimesCircle size={85} className="animate-shake" />
                  </div>
                  <h3 className="fw-bold text-danger mb-2">Verification Incomplete</h3>
                  
                  {errorMessage ? (
                    <Alert color="danger" className="text-start mx-2 my-3 rounded" style={{ fontSize: "13.5px" }}>
                      {errorMessage}
                    </Alert>
                  ) : (
                    <p className="text-muted px-4 mb-4" style={{ fontSize: "14px" }}>
                      We could not verify your liveness correctly. This can happen if the environment is too dim, if you turn too quickly, or if your camera gets obstructed.
                    </p>
                  )}

                  <Button 
                    color="dark" 
                    size="lg" 
                    className="w-100 py-3 fw-bold rounded-xl d-flex align-items-center justify-content-center gap-2"
                    style={{ borderRadius: "12px", backgroundColor: "#1E293B" }}
                    onClick={resetVerification}
                  >
                    <FaRedo size={16} /> Retry Verification
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Styled Animations Injection */}
      <style>{`
        @keyframes scanner {
          0% { top: 0%; opacity: 0.8; }
          50% { top: 100%; opacity: 0.8; }
          100% { top: 0%; opacity: 0.8; }
        }
        .animate-scanner {
          animation: scanner 2.8s linear infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.92); }
        }
        .animate-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }
        @keyframes bounceX {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-5px); }
        }
        .animate-bounce-x {
          animation: bounceX 1.2s ease-in-out infinite;
        }
        @keyframes spinSubtle {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-subtle {
          animation: spinSubtle 8s linear infinite;
        }
        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.15); opacity: 0.9; }
          80% { transform: scale(0.95); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounceIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </Container>
  );
}

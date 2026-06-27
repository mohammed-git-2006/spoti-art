import Ferrofluid from "../bits/Ferrofluid"
import { GridScan } from "../bits/GridScan"


export const Background = () => { 
  return <div style={{ width: '100%', height: '100%', position: 'absolute' }}
  className="opacity-75">
  {/* <LiquidEther
    colors={[ '#1DB954', '#9D4EDD', '#00FF9C' ]}
    mouseForce={20}
    cursorSize={100}
    isViscous
    viscous={30}
    iterationsViscous={3}
    iterationsPoisson={3}
    resolution={0.25}
    isBounce={false}
    autoDemo
    autoSpeed={0.5}
    autoIntensity={2.2}
    takeoverDuration={0.25}
    autoResumeDelay={3000}
    autoRampDuration={0.6}
  /> */}
  {/* <GridScan
    sensitivity={0.0}
    lineThickness={1}
    linesColor="#2F293A"
    gridScale={0.27}
    scanColor="#00FF9C"
    scanOpacity={0.4}
    enablePost={false}
    bloomIntensity={0.6}
    chromaticAberration={0.002}
    noiseIntensity={0.01}
    lineJitter={0.1}
    scanGlow={0.5}
    scanSoftness={2}
    enableWebcam={false}
    showPreview={false}
  /> */}
  <Ferrofluid
    colors={["#00FF9C","#00FF9C","#00FF9C"]}
    speed={0.5}
    scale={3.25}
    turbulence={0.7}
    fluidity={0.2}
    rimWidth={0.2}
    sharpness={3.5}
    shimmer={1.5}
    glow={2}
    flowDirection="down"
    opacity={1}
    // mouseInteraction
    mouseStrength={1}
    mouseRadius={0.35}
  />
</div>
}

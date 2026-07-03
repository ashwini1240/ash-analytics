import { Grid } from '@react-three/drei'
import { theme } from '../theme'

// The structural ground plane of the environment — a faint measurement
// grid that recedes into fog, establishing depth and scale.
export default function GridFloor() {
  return (
    <Grid
      position={[0, 0, -50]}
      infiniteGrid
      cellSize={1.4}
      cellThickness={0.5}
      cellColor={theme.line}
      sectionSize={7}
      sectionThickness={1}
      sectionColor={theme.lineBright}
      fadeDistance={78}
      fadeStrength={2.5}
    />
  )
}

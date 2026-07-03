import CameraRig from './CameraRig'
import GridFloor from './GridFloor'
import HeroStation from './HeroStation'
import ForecastSurface from './ForecastSurface'
import MetricPanels from './MetricPanels'
import TerritoryMap from './TerritoryMap'
import ProjectsField from './ProjectsField'
import ContactStation from './ContactStation'

// The full data environment. Each station is a self-contained piece;
// the camera rig flies through them on scroll.
export default function Scene({ scrollState, onOpenProject }) {
  return (
    <>
      <CameraRig scrollState={scrollState} />
      <GridFloor />
      <HeroStation />
      <ForecastSurface />
      <MetricPanels />
      <TerritoryMap />
      <ProjectsField onOpenProject={onOpenProject} />
      <ContactStation />
    </>
  )
}

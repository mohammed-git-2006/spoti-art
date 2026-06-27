import { gsap } from "gsap"


let createTl = () => {
  return gsap.timeline({
    defaults: {
      duration: 0.6,
      ease:'power3.out'
    }
  })
}

export { createTl }
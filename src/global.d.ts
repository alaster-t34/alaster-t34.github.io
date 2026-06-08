import type Swup from 'swup'

declare global {
  interface Window {
    // type from '@swup/astro' is incorrect
    swup: Swup
  }
}

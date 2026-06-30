import type { NavOperations, ShortcutOptions } from '@slidev/types'
import { defineShortcutsSetup } from '@slidev/types'

// Customise Slidev's keyboard shortcuts. We drop the built-in `goto` binding
// so pressing `g` no longer opens the "Go to slide" dialog
// (`#slidev-goto-dialog`) — it was popping up accidentally during the deck.
// Every other default shortcut (arrows, space, `o` overview, `d` dark, …) is
// preserved by passing the rest of `base` through untouched.
export default defineShortcutsSetup((_nav: NavOperations, base: ShortcutOptions[]) => {
  return base.filter(shortcut => shortcut.name !== 'goto')
})

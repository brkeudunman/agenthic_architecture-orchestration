import { questions } from '../data/questions'

// Slidev runs this once when the app is created. A <script setup> block in a
// markdown file is scoped to a single slide, so it can't feed data to the
// per-question quiz slides. Exposing the data as a global property makes it
// available as `$questions` in every slide template instead.
export default function setupApp({ app }: { app: any }) {
  app.config.globalProperties.$questions = questions
}

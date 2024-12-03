import { redirect } from 'next/navigation';

export default function LangRoot() {
  // Redirect /en to /en/dashboards/doctypelist
  redirect('/en/dashboards/doctypelist');
}

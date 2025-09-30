// assets/js/src/handleEvent.js
import $ from 'jquery';
import { pushArgToURL } from './pushArgToURL';
import { checkParams } from './checkParams';

function getUrlParams() {
  return Object.fromEntries(new URLSearchParams(window.location.search).entries());
}

function upsert(argObj, key, value) {
  const v = (value ?? '').toString().trim();
  if (v) argObj[key] = v;
  else delete argObj[key]; // leeren -> aus URL entfernen
}

/**
 * Zentraler Einstieg bei jeder Änderung (Inputs/Badges/Enter/etc.)
 * - nimmt bestehende URL-Params als Basis (so bleiben Extended-Filter erhalten)
 * - merged Input-Felder und Patch (Patch gewinnt)
 * - entfernt explizit leere Keys
 * - aktualisiert URL und triggert die Pipeline
 */
export function handleEvent(patch = {}) {
  $('.nfg').remove();

  // 1) Basis = aktuelle URL-Parameter (so verlieren wir Extended-Filter nicht)
  const argObj = { ...getUrlParams() };

  // 2) Inputs übernehmen (leere Werte -> Key löschen)
  upsert(argObj, 'jobtitle',   $('#jobtitle-header').val());
  upsert(argObj, 'city',       $('#city-header').val());
  upsert(argObj, 'country',   $('#country-header').val());
  upsert(argObj, 'department', $('#department-header').val());
  upsert(argObj, 'brand',      $('#brand-header').val());

  // 3) Patch (Badges) mergen (Patch gewinnt; leere / entfernte -> Key löschen)
  Object.keys(patch || {}).forEach((k) => upsert(argObj, k, patch[k]));

  // 4) URL setzen/aufräumen
  pushArgToURL(argObj);

  // 5) → ab hier übernimmt deine Pipeline
  checkParams();
}

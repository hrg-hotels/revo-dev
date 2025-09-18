// assets/js/src/handleEvent.js
import $ from 'jquery';
import { pushArgToURL } from './pushArgToURL';
import { checkParams } from './checkParams';

/**
 * Zentraler Einstieg bei jeder Änderung (Inputs/Badges/Enter/etc.)
 * - liest Input-Felder
 * - merged optionalen Patch (Badges)
 * - aktualisiert URL
 * - triggert checkParams() (→ Rest der Pipeline)
 */
export function handleEvent(patch = {}) {
  $('.nfg').remove();

  const jobtitle   = ($('#jobtitle-header').val()   || '').trim();
  const city       = ($('#city-header').val()       || '').trim();
  const department = ($('#department-header').val() || '').trim();
  const brand      = ($('#brand-header').val()      || '').trim();

  const argObj = {};
  if (jobtitle)   argObj.jobtitle   = jobtitle;
  if (brand)      argObj.brand      = brand;
  if (city)       argObj.city       = city;
  if (department) argObj.department = department;

  // Badge-Patch überschreibt Input-Keys (falls gleichnamig)
  Object.assign(argObj, patch);

  // URL setzen/aufräumen
  pushArgToURL(argObj);

  // → ab hier übernimmt deine Pipeline
  checkParams();
}
function gatherRecords(query) {
  let pkmn = PkmnData.filter(p => p.templateId === query.pokemon)[0],
      atk = pkmn.pokemonSettings.stats.baseAttack,
      def = pkmn.pokemonSettings.stats.baseDefense,
      sta = pkmn.pokemonSettings.stats.baseStamina,
      ivStart = query.prioritizeIvs ? 10 : 1,
      ivEnd = 15,
      results = [];

  CombatMultiplers.forEach(multiplier => {
    for (var ivAtk = ivStart; ivAtk <= ivEnd; ivAtk++) {
      for (var ivDef = ivStart; ivDef <= ivEnd; ivDef++) {
        for (var ivSta = ivStart; ivSta <= ivEnd; ivSta++) {
          results.push({
            cp : calculateCp(multiplier.level, atk, def, sta, ivAtk, ivDef, ivSta),
            lvl : multiplier.level,
            atk : ivAtk,
            def : ivDef,
            sta : ivSta
          });
        }
      }
    }
  });
  
  results.sort(sort_by.apply(null, query.prioritizePvp ? Sorters.pvp : Sorters.default));

  let targetCp = parseInt(query.cp, 10),
    minLevel = parseInt(query.level, 10);
  return results.filter(result => result.cp === targetCp && result.lvl >= minLevel);
}

function formatName(data) {
  var tokens = data.templateId.match(/^V(\d+)_POKEMON_(\w+)$/);
  var pattern = data.pokemonSettings.pokemonId;
  
  if (pattern.indexOf('_MALE') === pattern.length - 5) {
    pattern = pattern.replace(/_MALE$/, '');
  };
  if (pattern.indexOf('_FEMALE') === pattern.length - 7) {
    pattern = pattern.replace(/_FEMALE$/, '');
  };
  
  var id = formatNumber(parseInt(tokens[1], 10));
  var name = toTitleCase(data.pokemonSettings.pokemonId.replace('_', ' ')).replace(/\bMale\b/, '♂').replace(/\bFemale\b/, '♀');
  var form = toTitleCase(tokens[2].replace(pattern, '').replace('_', ' ').trim() || '');
  return `${id} ${name} ${form ? '(' + form + ')' : ''}`;
}

const defaultResultsMessage = 'No matching records found';

function formatResultsMessage() {
  let pkmn = PkmnData.filter(p => p.templateId === $('#field-pokemon').val())[0];

  if (pkmn == null) {
    return defaultResultsMessage //'<span style="background:red">' + 'Hello World!' + '</span>'
  }

  let atk = pkmn.pokemonSettings.stats.baseAttack,
    def = pkmn.pokemonSettings.stats.baseDefense,
    sta = pkmn.pokemonSettings.stats.baseStamina;

  return [
    '<p>' + defaultResultsMessage + '</p>',
    '<hr/>',
    '<div class="result-hint">',
      LevelHints.map(hint => {
        let cpMin = formatNumberWithCommas(calculateCp(hint.level, atk, def, sta, 10, 10, 10)),
          cpMax = formatNumberWithCommas(calculateCp(hint.level, atk, def, sta, 15, 15, 15));
        return [
          '<div class="result-hint-row">',
            '<div class="result-hint-info">~ ' + hint.info + ' ~</div>',
            '<label>Level ' + hint.level + '</label><span>' + cpMin + '&nbsp;&ndash;&nbsp;' + cpMax + '</span>',
          '</div>'
        ].join('');
      }).join(''),
    '</div>'
  ].join('');
}

function calculateCp(level, baseAttack, baseDefense, baseStamina, ivAttack, ivDefense, ivStamina) {
  let found = CombatMultiplers.filter(m => m.level === level),
    multipler = found.length === 1 ? found[0].multiplier : 1;
  return Math.floor(Math.max(10, ((baseAttack+ivAttack) * Math.sqrt(baseDefense+ivDefense) * Math.sqrt(baseStamina+ivStamina) * Math.pow(multipler,2)) /10));
}

function filterItem(item, model) {
  if ($.isPlainObject(item)) {
    Object.keys(item).forEach(key => {
      if (model !== true && !model[key]) {
        delete item[key];
      }
      filterItem(item[key], model[key]);
    });
  }
  return item;
}

function filterData(data, pattern, model) {
  return data.itemTemplates.filter(template => pattern.test(template.templateId)).map(template => filterItem(template, model));
}

function toTitleCase(str) {
  return str.toLowerCase().replace(/\b((m)(a?c))?(\w)/g, ($1, $2, $3, $4, $5) => $2 ? ($3.toUpperCase()+$4+$5.toUpperCase()) : $1.toUpperCase());
}

function formatNumber(value) {
  return '#' + pad(value, '000');
}

function pad(value, padding) {
  return (padding + value).substr(-padding.length);
}

function formatNumberWithCommas(value) {
  let s = value.toString(),
    d = s.indexOf('.'), // get stuff before the dot
    s2 = d === -1 ? s : s.slice(0, d);
  for (let i = s2.length - 3; i > 0; i -= 3) {
    s2 = s2.slice(0, i) + ',' + s2.slice(i); // insert commas every 3 digits from the right
  }
  if (d !== -1) {
    s2 += s.slice(d); // append fractional part
  }
  return s2;
}
